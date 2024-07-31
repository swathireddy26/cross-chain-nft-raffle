import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPrivateKey, getProviderRpcUrl } from "./utils";
import { Wallet, providers } from "ethers";
import { NFTRaffle, NFTRaffle__factory } from "../typechain-types";
import { Spinner } from "../utils/spinner";
import { ethers } from "ethers";

task(`participate-in-raffle`, `Participate in the raffle`)
    .addParam(`raffleContract`, `The address of the NFTRaffle.sol smart contract`)
    .addParam(`noOfEntries`, `No.of entries to buy in the raffle`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const { raffleContract, noOfEntries } = taskArguments;

        const privateKey = getPrivateKey();
        const sourceRpcProviderUrl = getProviderRpcUrl(hre.network.name);

        const sourceProvider = new providers.JsonRpcProvider(sourceRpcProviderUrl);
        const wallet = new Wallet(privateKey);
        const signer = wallet.connect(sourceProvider);

        const spinner: Spinner = new Spinner();

        const NFTRaffleContract: NFTRaffle = NFTRaffle__factory.connect(raffleContract, signer)

        console.log(`ℹ️  Attempting to call the buyEntry function of the NFTRaffle.sol smart contract on the ${hre.network.name} from ${signer.address} account`);
        spinner.start();

        const tx = await NFTRaffleContract.buyEntry(noOfEntries, {value: ethers.utils.parseUnits("0.003", 18)});

        spinner.stop();
        console.log(`✅ buyEntry request sent, transaction hash: ${tx.hash}`);
    })
