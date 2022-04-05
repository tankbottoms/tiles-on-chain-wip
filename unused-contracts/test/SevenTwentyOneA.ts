import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { Signers } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { SevenTwentyOneA } from "../typechain/SevenTwentyOneA"
import { shouldBehaveLikeSevenTwentyOneA } from "./SevenTwentyOneA.behavior";

const { deployContract } = hre.waffle;

describe("Setup Admin and Unnamed Accounts", function () {
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
        this.unnamedAccounts = [] as Signers[];
        for (let i = 1; i <= (signers.length - 1); i++) {
            const unnamedAccount: SignerWithAddress = signers[i];
            this.unnamedAccounts.push(unnamedAccount);
        }
    });

    describe("Creating SevenTwentyOneA Artifacts", function () {
        before(async function () {
            const SevenTwentyOneAArtifact: Artifact = await hre.artifacts.readArtifact("SevenTwentyOneA");
            const maxBatchSize = 100;
            const collectionSize =  1250;
            const amountForAuctionDev = 1249;
            const amountForDevs = 25;
            this.SevenTwentyOneA = <SevenTwentyOneA> await deployContract(this.signers.admin, SevenTwentyOneAArtifact, [ maxBatchSize, collectionSize, amountForAuctionDev, amountForDevs]);
        });

        shouldBehaveLikeSevenTwentyOneA();
    });
});
