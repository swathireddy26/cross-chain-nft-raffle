import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPrivateKey, getProviderRpcUrl, getRouterConfig } from "./utils";
import { Wallet, providers } from "ethers";
import { NFTRaffle, NFTRaffle__factory } from "../typechain-types";
import { Spinner } from "../utils/spinner";
import { ethers } from "ethers";


task(`deploy-nft-raffle`, `Deploys NFTRaffle.sol smart contract`)
    .addParam(`entryCost`, `The entry cost to enter the raffle`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const entry_cost = taskArguments.entryCost ? taskArguments.entryCost : ethers.utils.parseUnits("0.001", 18)

        const privateKey = getPrivateKey();
        const rpcProviderUrl = getProviderRpcUrl(hre.network.name);

        const provider = new providers.JsonRpcProvider(rpcProviderUrl);
        const wallet = new Wallet(privateKey);
        const deployer = wallet.connect(provider);

        const spinner: Spinner = new Spinner();

        console.log(`ℹ️  Attempting to deploy NFTRaffle smart contract on the ${hre.network.name} blockchain using ${deployer.address} address`);
        spinner.start();

        const NFTRaffleFactory: NFTRaffle__factory = await hre.ethers.getContractFactory('NFTRaffle') as NFTRaffle__factory;
        const NFTRaffle: NFTRaffle = await NFTRaffleFactory.deploy(entry_cost);
        await NFTRaffle.deployed();

        spinner.stop();
        console.log(`✅ NFTRaffle contract deployed at address ${NFTRaffle.address} on the ${hre.network.name} blockchain`);
    })
