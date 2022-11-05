import {Injectable} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Subject, Subscription} from 'rxjs';

import Onboard, { EIP1193Provider, WalletState } from '@web3-onboard/core'
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets'
import Notify, { InitOptions } from "bnc-notify"
import Web3 from 'web3';
import { environment } from 'src/environments/environment';
import { TxService } from './transaction.service';
import contract from '@truffle/contract';

//declare let window: any;
declare let require: any;

/******* BLOCKNATIVE CONFIG ***********/

// Change these parameters depending on network being used and for continuous deployment
//const O_GOERLI_RPC_URL = 'https://optimism-goerli.infura.io/v3/' + process.env.INFURA_OGOERLI_KEY;
const O_GOERLI_RPC_URL = 'https://optimism-goerli.infura.io/v3/' + environment.INFURA_OGOERLI_KEY;
//Change ChainID as required: O-Goerli 0x1A4 / 420 - Ganache 0x539 / 35
const networkID: number = 420; 

const networkIdToUrl = {
    '1': 'https://etherscan.io/tx',
    '5': 'https://goerli.etherscan.io/tx',
    '35': 'localhost',
    '420': 'https://goerli-optimism.etherscan.io/tx'
}
const notifyOptions: InitOptions = {
    dappId: environment.BLOCK_NATIVE_KEY,
    //dappId: process.env.BLOCK_NATIVE_KEY,
    system: 'ethereum',
    networkId: networkID,
    darkMode: true,
}
const notify = Notify(notifyOptions);

const onboard = Onboard({
    wallets: [injectedModule({
        filter: {
          [ProviderLabel.Detected]: false
        }
      })],
    chains: [
      {
        id: '0x1A4',
        token: 'ogETH',
        label: 'Optimism Goerli Testnet',
        rpcUrl: O_GOERLI_RPC_URL
      }
    ],
    appMetadata: {
      name: 'Internet Freedom',
      icon: 'assets/images/logo.png',
      logo: 'assets/images/logo.png',
      description: 'Web3 - DAO - ENS - IPFS',
      gettingStartedGuide: 'https://github.com/fugueweb/internet-freedom',
      explore: 'https://github.com/fugueweb/internet-freedom',
      recommendedInjectedWallets: [ 
        { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
        { name: 'MetaMask', url: 'https://metamask.io' },
        { name: 'Opera', url: 'https://opera.com' },
        { name: 'Status', url: 'https://status.im' },
        { name: 'Brave', url: 'https://brave.com' }
      ]
    },
    accountCenter: {
        desktop: {
            position: 'topRight',
            enabled: true,
            minimal: true
        },
        mobile: {
            position: 'topRight',
            enabled: true,
            minimal: true
        }
    }
  })

/******* MAIN ***********/

@Injectable()
export class Web3Service {
  private web3: Web3;
  private web3Provider: any;
  private address: string;
  public success: boolean; //ChainID set, allows unsubscribe onDestroy
  public walletStateObservable$ = new Subject < WalletState[] > ();
  public providerObservable$ = new Subject < EIP1193Provider > ();
  public txDelegateObservable$ = new Subject < String > ();
  public txVoteObservable$ = new Subject < String > ();

  constructor(private matSnackBar: MatSnackBar, private txService: TxService) {
    window.addEventListener('load', (event) => {
      setInterval(()=> { this.refresh() }, 60 * 3000);
    });
  }

  ngOnDestroy(): void {
    if(this.success){
        const [primaryWallet] = onboard.state.get().wallets
        onboard.disconnectWallet({ label: primaryWallet.label })
    }
  }

  public async artifactsToContract(artifacts) {
    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3Provider);
    return contractAbstraction;
  }

  private refresh() {
    console.log('Refreshing state');
    const data: WalletState[] = this.getWalletState();
    this.walletStateObservable$.next([data[0]]);
    //this.providerObservable$.next(this.getWalletState()[0].provider);
    this.address = data[0].accounts[0].address;
  }

  /******* BLOCKNATIVE FUNCTIONS ***********/

  public async blockNativeOnboard() {
    this.web3 = new Web3();
    const previouslyConnectedWallets = JSON.parse(
        window.localStorage.getItem('connectedWallets')
      )

    let wallets;  
    if (previouslyConnectedWallets) {
        // Connect the most recently connected wallet (first in the array)
        wallets = await onboard.connectWallet({ autoSelect: { label: previouslyConnectedWallets[0], disableModals: true } });
    } else {
        wallets = await onboard.connectWallet();
        const connectedWallets = wallets.map(({ label }) => label);
        window.localStorage.setItem(
          'connectedWallets',
          JSON.stringify(connectedWallets)
        )
    }

    //Require specific chain
    this.success = await onboard.setChain({ chainId: 0x1A4 });
    this.web3Provider = this.getWalletState()[0].provider
    this.providerObservable$.next(this.getWalletState()[0].provider);
    this.refresh();
    return this.success;
  }

  private notifyBlockNative(self: this, hash) {
    const {emitter} = notify.hash(hash);
    console.log(emitter);
    //this.txService.txObservable.next(hash);
    emitter.on('all', function(tx) {
        setTimeout(() => {
            self.walletStateObservable$.next(self.getWalletState())},8000
        );
        setTimeout(() => {
            self.providerObservable$.next(self.getWalletState()[0].provider)},8000
        );
        return {
            onclick: () => window.open(`${networkIdToUrl[notifyOptions.networkId]}/${tx.hash}`)
        }
    });
  }

  public getWalletState() {
      return onboard.state.get().wallets;
  }

  /******* TOKEN FUNCTIONS ***********/

  public transfer(instance, _receiver, _amount) {
      let self = this;
      instance.transfer.sendTransaction( _receiver, _amount, {from:self.address}).on('transactionHash', function(hash){
        self.notifyBlockNative(self, hash);
      })
  }

  public delegate(instance, _delegate) {
      let self = this;
      instance.delegate.sendTransaction( _delegate, {from:self.address}).on('transactionHash', function(hash){
        //self.notifyBlockNative(self, hash);
        self.txDelegateObservable$.next(hash);
      }).catch(e => {
            console.log(e);
            this.setStatus('Delegate error, see log');
        });
  }

  /******* GOVERNANCE FUNCTIONS ***********/

  public vote(instance, _proposalNum, _choice, _reason) {
      let self = this;
        instance.castVoteWithReason.sendTransaction(_proposalNum, _choice, _reason, {from:self.address}).on('transactionHash', function(hash){
            //self.notifyBlockNative(self, hash);
            self.txVoteObservable$.next(hash);
        }).catch(e => {
            console.log(e);
            this.setStatus('Vote error, see log');
        });
  }

  /******* HELPER FUNCTIONS ***********/
  private setStatus(status) {
    this.matSnackBar.open(status, null, {
      duration: 4000
    });
  }

  public convertETHToWei(amount) {
      let value = this.web3.utils.toWei(amount, 'ether');
      return value;
    //return this.web3.utils.toWei(this.web3.utils.toBN(amount), 'ether');
  }

  public convertWeitoETH(amount) {
      let value = this.web3.utils.fromWei(this.web3.utils.toBN(amount), 'ether');
      return value;
    //return this.web3.utils.fromWei(this.web3.utils.toBN(amount), 'ether');
  }

  public getETHBalance(addr) {
    let web3Balance = new Web3(this.web3Provider);
    return web3Balance.eth.getBalance(addr);
  }
}
