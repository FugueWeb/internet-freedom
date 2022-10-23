## About

Welcome to a new kind of internet. This site combines the following capabilities to create a censorship resistant experience for information sharing, human organization, token-based economics, and artistic expression. It leverages the following technologies:

* Decentralize Autonomous Organizations (DAO)
* Ethereum Name Service (ENS)
* Inter-planetary File System (IPFS)
* Non-fungible Tokens (NFT)

Each one of these tools merits its own discussion, but they all in their own way strive to decentralize control, promote internet resilience, support open source code or protocols, and empower the user with digital sovereignty. 

## Quick Start

To interface with the DAO, the following conditions must be true, all of which can be checked or implemented within this decentralized application (dapp).

1. You must have a `balance` of DAO tokens
2. You must be on the `Optimism Goerli` testnet with a balance of `ether` to pay transaction fees 
3. You must `delegate` your tokens to yourself (or appropriate delegate) for voting power
4. There must be an active proposal with an open voting window

## DAO Instructions

**Install a Web3 Wallet** - For desktop, please install the Metamask browser extension. For mobile devices, please install either the Metamask or Status app. Some other Web3 wallets are compatible, but have not yet been tested.

**Connect to the Optimism Goerli testnet** - The DAO is not deployed on the Ethereum mainnet, which would require use real ETH (which has market value). Rather, it utilizes a layer two test network (Optimism's Goerli testnet), affording massive transaction efficiency benefits and greatly reduces transaction fees. See section below on *Network Connections*.

**Get DAO Tokens** - These will be provided by the DAO administration upon requesting to join the DAO. DAO governance tokens are used for weighted voting, but also carry other economic properties.

**Get Optimism Goerli Test ETH** - This is required to make state changing transactions (i.e., you have to pay transaction fees) with the DAO, such as casting a vote. If this is not provided to you by the DAO administrator, see section below on *Faucets* to acquire some yourself.

**Delegate Your Tokens** - If you have followed the steps above, you are now ready to interact with the DAO. First, you need to delegate your voting power (your tokens) to an address that will cast votes. This will likely be to yourself, so copy your wallet `address` into the field for the `delegate` function and initiate the transaction.

**Learn More About Proposals** - Before voting, you might want to research the proposal. The `Get Proposal Details` function gives several different pieces of information (see *About Proposals* section below), but perhaps of most interst are the two links. One is to a block explorer that provides more details about when the proposal transaction was submitted to the blockchain. The other is to [Tally](https://www.tally.xyz/), a platform that provides a clean application frontend about the DAO and its proposals.

**Vote** - Assuming there is an active `proposal`, you can cast your vote by copying the `proposalID` (you can get the ID from the drop down menu under `Get Proposal Details`) into the correct field within the `vote` function. Next make your choice (For, Against, Abstain) and provide a reason/comment.

## Smart Contracts

The DAO consists of three smart contracts, all based on the Open Zeppelin standard. 

* [ERC20 Token](https://goerli-optimism.etherscan.io/address/0x5c9747dc38569DFC9bE46d27Cb9F3489dc779CAD): An ERC20 token contract keeps track of fungible tokens: any one token is exactly equal to any other token; no tokens have special rights or behavior associated with them. This makes ERC20 tokens useful for things like a medium of exchange currency, voting rights, staking, and more.
* [Governor](https://goerli-optimism.etherscan.io/address/0xcdbee6389c1215e659354465d8413438c8c94ae1#code): The protocol is governed and upgraded by DAO token-holders, using three distinct components; the token, governance module, and Timelock. Together, these contracts allow the community to propose, vote, and implement changes through various administrative functions. Proposals can modify system parameters, support new markets, or add entirely new functionality to the protocol.
* [Timelock](https://goerli-optimism.etherscan.io/address/0xac4ab72cca73fa44ad44ff05b5f21f3a0d56c16d): Each protocol contract is controlled by the Timelock contract, which can modify system parameters, logic, and contracts in a 'time-delayed, opt-out' upgrade pattern. The Timelock has a hard-coded minimum delay, which is the least amount of notice possible for a governance action. The Timelock contract queues and executes proposals that have passed a Governance vote.

Additionally, the DAO controls an [NFT smart contract](https://goerli-optimism.etherscan.io/address/0x3915De57566b296b0C2a2a545Bd451DF89208A91) entitled `In Memorium`, and is focused on commemorating historical events or individuals that further core human rights principles.

## IPFS and ENS Integration

The entire site is deployed to IPFS and accessible using the name resolution provided through ENS. What does that mean? The tl;dr is the name `internetfreedom.eth` was reserved on the Ethereum blockchain and can be used to resolve complex content identifiers (hashes) of files deployed to a global peer-to-peer network (IPFS) into human readable form for ease of access. Let's unpack that.

For a lot of people using traditional browsers, they may be using a privacy preserving IPFS gateway such as [eth.limo](https://eth.limo/) to access this site over `HTTPS` and `DNS`, rather than pure IPFS. These gateways are useful because core internet infrastructure is becoming increasingly centralized and as such, several existential threats have emerged that undermine the principles of a decentralized, open, and free internet, to include single points of failure (e.g., CDNs), lack of commercial infrastructure, censorship, and the broader nacency of Web3 technology.

To access the site using IPFS, one way to do this would be to launch a local `ipfs daemon`, peer with other nodes, and thereby enable a gateway on `localhost` at a given port. Then, pulling the [IPNS record](https://docs.ipfs.tech/concepts/ipns/#how-ipns-works) stored in the [ENS registry](https://app.ens.domains/name/internetfreedom.eth/details) for `internetfreedom.eth` you open the site in a web browser. So putting this all together, the link may look like `http://127.0.0.1:8080/ipns/k51qzi5uqu5dgpuuyts3j2hfdksqy4lsj1gwn4stfrcypjv2up65knq0sgolrd`. There are certain browsers such as Brave, Opera, and Firefox that, depending on their settings and configuration or added extensions, [may allow](https://blog.ipfs.tech/2019-10-08-ipfs-browsers-update/) for a more native IPFS experience without running a local `daemon`. 

## DAO Proposals

A proposal submitted to the DAO is subject to various parameters (as defined by/within the DAO) and ultimately, if successful, will execute some state change on the blockchain. This could be minting an NFT, changing monetary policy of the DAO token, or altering the governance policies of the DAO itself. The two main questions here are:  

1. What are the parameters that define or constrain a proposal, its voting period, and its execution?
2. How do I verify that a given proposal is actually what it claims to be before I vote on it?

There are [several parameters](https://goerli-optimism.etherscan.io/address/0xcdbee6389c1215e659354465d8413438c8c94ae1#readContract) for a proposal and the ability to cast votes for/against it. Some of the more important ones include:

* `proposalDeadline` is the block number at which votes close. 
* `proposalSnapshot` is the block number used to retrieve a user’s votes and the quorum. This prevents the ability for users to transfer tokens after voting to vote again.
* `quorum` is represented as a fraction of the total token supply. Presently, the quorum for the DAO is set at 1%, or 21,000 DAO tokens pledged during a vote.
* `votingPeriod` is the delay (in number of blocks) since the proposal starts until voting ends. 45,000 blocks is roughly a day and a half.

Provided that these criteria are met, a vote can then `queue` and `execute`. Proposals are actually executed by the external `Timelock` contract, thus it is the timelock that has to hold the assets that are being governed. You can think of the `Timelock` as a check/balance or separation of power within the DAO, and it also has additional capabilities and permissions that ensure the decentralization and autonomy of the DAO.

Verification is grounded in cryptography. Anyone voting on a proposal should be able to independently audit, with mathematical certainty, that a proposal will indeed do what it claims to do prior to voting for or against it. Ultimately this is done by confirming that what is stored on the immutable blockchain (such as a `proposalID`) is identical to the output of someone inputting the parameters of the proposal into a [readable function](https://goerli-optimism.etherscan.io/address/0xcdbee6389c1215e659354465d8413438c8c94ae1#readContract#F7).

Using a block explorer, you see that the [`hashProposal`](https://docs.openzeppelin.com/contracts/4.x/api/governance#Governor-hashProposal-address---uint256---bytes---bytes32-) function has the following inputs.

1. `target` - This is the smart contract address (or in the case of ETH value transfer, the recipient address) where the `calldata` parameter will execute. So for example, if the proposal is to `mint` and NFT, this would be the address for the NFT smart contract address.
2. `value` - This is the amount of ETH (as provided by the `Timelock` contract) that can be transfered to a `target` recipient. This will often be zero, unless for example the proposal were intended to provide funding. It is worth noting that transfer of ETH (a utility token with market value on mainnet) should not be confused with transfer of DAO tokens (a governance or security token), which is a function of the `ERC20 Token` contract owned by the DAO.
3. `calldata` - This parameter is where DAOs draw their power, because it is what will actually execute a state change on a given `target` smart contract address if the proposal passes. If you look at the transaction details of a proposal, you can see the `calldata` that the DAO expects. And if you wanted to check that it is what it claims to be, you would attempt to initiate the proposed transaction (e.g., mint an NFT, transfer DAO tokens, change the quorum, etc.). This transaction will not succeed because only the DAO is authorized to do these tasks, but it will provide you the `calldata`, which you can then compare with what is stored on chain.
4. `descriptionHash` - This is the `keccak256` hash of the description string of the proposal. The easiest way to pull this information is to use [Remix](https://remix.ethereum.org/), and from the command line put in `ethers.utils.id('Proposal Description')`.

All of this together is hashed to produce the `proposalID`. If it matches what was provided, you have cryptographically verified the proposal.

## Network Connections

[Optimism Goerli Testnet](https://chainlist.org/chain/420)

* ChainID: 420
* Currency: ETH
* RPC address: https://goerli.optimism.io
* Block explorer: https://goerli-optimism.etherscan.io/

[Goerli Testnet](https://chainlist.org/chain/5)

* ChainID: 5
* Currency: ETH
* RPC address: https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
* Block explorer: https://goerli.etherscan.io/

## Faucets

Faucets provide free `ether` on test networks. However, in order to prevent spamming and for other security reasons, faucets usually require some type of authentication or login. Additionally, since the DAO is using Optimism (layer 2 scaling), you may need to first get ETH on the Goerli testnet (layer 1), and then "bridge" it to the Optimism Goerli testnet (layer 2). Here are several resources to choose from:

* [Paradigm Faucet](https://faucet.paradigm.xyz/) - Requires a Twitter account with at least 1 Tweet, 15 followers, and be older than 1 month.
* [Alchemy Faucet](https://goerlifaucet.com/) - To request funds, simply create a free account and sign in with Alchemy, then enter your wallet address.
* [Optimism Faucet](https://optimismfaucet.xyz/) - To pass the anti-bot checks your GitHub account must be older than one month and you have to follow five people/projects on GitHub.
* [Optimism Bridge](https://app.optimism.io/bridge/deposit) - Once you have that Goerli ETH, use this app to get it on the Optimism Goerli network.

## Resources

* [Fleek](https://app.fleek.co/)
* [ENS Docs](https://docs.ens.domains/)
* [IPFS](https://ipfs.tech/)
* [Open Zeppelin](https://docs.openzeppelin.com/contracts/4.x/)
* [Optimism](https://www.optimism.io/)
* [Angular](https://angular.io/)