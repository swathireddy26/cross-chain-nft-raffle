import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPrivateKey, getProviderRpcUrl } from "./utils";
import { Wallet, providers } from "ethers";
import { NFTRaffle, NFTRaffle__factory } from "../typechain-types";
import { Spinner } from "../utils/spinner";

task(`start-raffle`, `Starts the raffle`)
    .addParam(`raffleContract`, `The address of the NFTRaffle.sol smart contract`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const { raffleContract } = taskArguments;

        const privateKey = getPrivateKey();
        const sourceRpcProviderUrl = getProviderRpcUrl(hre.network.name);

        const sourceProvider = new providers.JsonRpcProvider(sourceRpcProviderUrl);
        const wallet = new Wallet(privateKey);
        const signer = wallet.connect(sourceProvider);

        const spinner: Spinner = new Spinner();

        const NFTRaffleContract: NFTRaffle = NFTRaffle__factory.connect(raffleContract, signer)

        console.log(`ℹ️  Attempting to call the startRaffle function of the NFTRaffle.sol smart contract on the ${hre.network.name} from ${signer.address} account`);
        spinner.start();

        const tx = await NFTRaffleContract.startRaffle();

        spinner.stop();
        console.log(`✅ startRaffle request sent, transaction hash: ${tx.hash}`);
    })
