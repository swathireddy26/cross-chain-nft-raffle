
<!-- ABOUT THE PROJECT
## About The Project -->

## What is Cross Chain NFT Raffle?
Crosschain NFT raffle allows people to participate in the raffle by staking their tokens and selected winner can mint the NFT on desired destination chain. 

## How does it work?
To demonstrate the cross chain communication, we selected AvalancheFuji as source blockchain and PolygonAmoy as the destination blockchain. NFTRaffle, SourceMinter contracts are deployed on AvalancheFuji and NFT, DestinationMinter contracts are deployed on PolygonAmoy. Raffle operator starts the raffle by specifying the entry cost to buy an entry in the raffle. People can get entries in the Raffle by just staking their AVAX. Once the raffle is ended, raffle operator will mint the NFT to the winner which was selected randomly. We used chainlink's CCIP (Cross Chain Interoperability Protocol) to acheive cross chain communication.

![alt text](https://github.com/swathireddy26/cross-chain-nft-raffle/blob/master/Images/0.%20cross_chain_nft_raffle_flow.png)

### Built With

Project is made using open-source projects that you know and trust

* [Hardhat](https://hardhat.org/)
* [Chainlink CCIP](https://docs.chain.link/ccip)
* [EthersJS](https://docs.ethers.org/v6/)


<p align="right">(<a href="#top">back to top</a>)</p>

