import { Component, OnDestroy, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Web3Service } from '../services/web3.service';
import { TxService } from '../services/transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../utils/dialog.component';
import { Proposal } from '../models/proposal';
import { Vote } from '../models/vote';
import { WalletState } from '../models/walletState';

declare let require: any;
const token_artifacts = require('../../../build/contracts/DiploCoin.json');
const governance_artifacts = require('../../../build/contracts/StateGovernor.json');
const proposals = require('../utils/proposals.json');
const dialog_data = require('../utils/info.json');

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css'],
  providers: [Web3Service, TxService]
})
export class VoteComponent implements OnInit, OnDestroy {

    TokenERC20: any;
    Governance: any;
    public walletState: WalletState[];
    public walletDisabled: boolean = true;
    selectedProposal: {id: string, tx: string, title: string};
    selectedChoice: string;
    voteModel: Vote = new Vote();
    proposalModel: Proposal = new Proposal();

    getProposalForm: FormGroup;
    voteForm: FormGroup;
    delegateForm: FormGroup;

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar, private dialog: MatDialog,
    private txService: TxService, private fb: FormBuilder, private clipboard: Clipboard) { }

  ngOnInit(): void {
    this.watchContract();
    this.createFormGroups();
    this.proposalModel.proposals = proposals;
    console.log(this.proposalModel.proposals);
  }

  ngOnDestroy(): void {
    //this.web3Service.walletStateObservable$.unsubscribe();
    //this.web3Service.providerObservable$.unsubscribe();
  }

  watchContract() {
    this.web3Service.walletStateObservable$.subscribe((walletState) => {
        console.log(walletState);
        this.voteModel.account = walletState[0].accounts[0].address;
    });

    this.web3Service.providerObservable$.subscribe(() => {
        this.web3Service.artifactsToContract(governance_artifacts)
            .then((GovernanceAbstraction) => {
            this.Governance = GovernanceAbstraction;
            //this.getGovernanceData();
        });
        this.web3Service.artifactsToContract(token_artifacts)
            .then((TokenAbstraction) => {
            this.TokenERC20 = TokenAbstraction;
            this.getVoteData(this.voteModel.account);
        });        
    });
  }

  connectWallet(change: boolean): void {
    const result = this.web3Service.blockNativeOnboard();

    if (result){
        this.walletDisabled = false;
    } else {
        this.walletDisabled = true;
        console.log('could not connect wallet');
    }
  }

  async getVoteData(account) {
    try {
      const deployedTokenERC20 = await this.TokenERC20.deployed();
      this.voteModel.balance = this.web3Service.convertWeitoETH(await deployedTokenERC20.balanceOf.call(account));

    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  /************* FORM FUNCTIONS *************/

  createFormGroups() {
    this.getProposalForm = this.fb.group({
      required: ['', Validators.required]
    });

    this.voteForm = this.fb.group({
      required1: ['', Validators.required],
      required2: ['', Validators.required],
      proposalID: ['', [Validators.required, Validators.minLength(77), Validators.maxLength(78)]],
    });

    this.delegateForm = this.fb.group({
      addr: ['', [Validators.required, Validators.minLength(42), Validators.maxLength(42)]],
    });
  }

  getProposalErrorMsg(value) {
    return this.getProposalForm.hasError('required', [value]) ? 'Required' : '';
  }

  voteErrorMsg(value) {
    return this.voteForm.hasError('required2', [value]) ? 'Required' :
      this.voteForm.hasError('minlength', [value]) ? 'Invalid proposal ID' :
      this.voteForm.hasError('maxlength', [value]) ? 'Invalid proposal ID' : '';
  }

  delegateErrorMsg(value) {
    return this.voteForm.hasError('required', [value]) ? 'Required' :
      this.voteForm.hasError('minlength', [value]) ? 'Invalid address' :
      this.voteForm.hasError('maxlength', [value]) ? 'Invalid address' : '';
  }

  /************* SETTER FUNCTIONS *************/

  setProposalID(e) {
    console.log('Setting Proposal ID: ' + e.target.value);
    this.voteModel.proposalID = e.target.value;
  }

  setReason(e) {
    console.log('Setting reason: ' + e.target.value);
    this.voteModel.reason = e.target.value;
  }

  setDelegate(e) {
    console.log('Setting delegate: ' + e.target.value);
    this.voteModel.delegate = e.target.value;
  }

  /************* CONTRACT FUNCTIONS *************/

  async getProposalDetails(proposalObject: {id: string, tx: string, title: string}) {
    console.log(proposalObject)
    if (!this.TokenERC20) {
      this.setStatus('TokenERC20 is not loaded, unable to send transaction');
      return;
    }

    console.log('Checking Proposals');

    this.setStatus('Checking Proposals... (please wait)');
    try {
      const deployedGovernance = await this.Governance.deployed();
      const deadline = await deployedGovernance.proposalDeadline.call(proposalObject.id);
      const eta = await deployedGovernance.proposalEta.call(proposalObject.id);
      const snapshot = await deployedGovernance.proposalSnapshot.call(proposalObject.id);

      this.proposalModel.deadline = deadline.words[0];
      this.proposalModel.eta = eta.words[0];
      this.proposalModel.snapshot = snapshot.words[0];
      this.proposalModel.tx = proposalObject.tx;
      this.proposalModel.id = proposalObject.id;
      this.proposalModel.title = proposalObject.title;
      
      this.setStatus('Get Proposal complete!');
    } catch (e) {
      console.log(e);
      this.setStatus('Error with Proposal Details; see log.');
    }
  }

  async delegate() {
    if (!this.TokenERC20) {
      this.setStatus('TokenERC20 is not loaded, unable to send transaction');
      return;
    }

    const delegate = this.voteModel.delegate;

    console.log('Delegate to ' + delegate);
    this.setStatus('Initiating transaction... (please wait)');
    try {
        const deployedTokenERC20 = await this.TokenERC20.deployed();
        this.web3Service.delegate(deployedTokenERC20, delegate);
      } catch (e) {
        console.log(e);
        this.setStatus('Error delegating; see log.');
      }
  }

  async vote(choice) {
    if (!this.Governance) {
      this.setStatus('Governance is not loaded, unable to send transaction');
      return;
    }

    this.voteModel.choice = choice;
    const proposalNum = this.voteModel.proposalID;
    const reason = this.voteModel.reason;

    let c;
    switch (this.voteModel.choice) {
        case 'for': c = 1
            break;
        case 'against': c = 0
            break;
        case 'abstain': c = 2
            break;
    }

    console.log('Vote "' + this.voteModel.choice + '" on proposal ' + proposalNum + ' because ' + reason);
    this.setStatus('Initiating transaction... (please wait)');
    try {
        const deployedGovernance = await this.Governance.deployed();
        this.web3Service.vote(deployedGovernance, proposalNum, c, reason);
      } catch (e) {
        console.log(e);
        this.setStatus('Error voting; see log.');
      }
  }

  /************* HELPER FUNCTIONS *************/

  setStatus(status) {
    this.matSnackBar.open(status, null, {
      duration: 3000
    });
  }

  copyText(textToCopy) {
    this.clipboard.copy(textToCopy);
    this.setStatus('Copied to clipboard')
  }

  openDialog(index): void {
    let choice;
    for (let i = 0; i < dialog_data.length; i++) {
      if (dialog_data[i].id === index) {
        choice = dialog_data[i];
      }
    }
    this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        id: choice.id,
        desc: choice.desc,
        link: choice.link
      },
      panelClass: 'if-dialog'
    });
  }

}
