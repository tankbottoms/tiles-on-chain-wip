import fs from 'fs';
import path from 'path';
import { ethers, network } from 'hardhat';
import { BigNumber, Contract, ContractFactory, Transaction } from 'ethers';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { TransactionReceipt, TransactionRequest, TransactionResponse } from '@ethersproject/providers';
const child_process = require('child_process');

dotenvConfig({ path: resolve(__dirname, '../.env') });

const gasLimit = BigNumber.from('20000000');

async function main(): Promise<void> {
    const Factory: ContractFactory = await ethers.getContractFactory('TilesSvg');
    const Tiles: Contract = await Factory.deploy({
        gasLimit,
    });
    const deployed = await Tiles.deployed();

    console.log(`Contract address: ${deployed.address}`);
    console.log('txnHash:', deployed.deployTransaction.hash);
    console.log('waiting for confirmation...');

    await deployed.deployTransaction.wait();
    const attached = Factory.attach(deployed.address);

    const { deployTransaction } = deployed;
    const { hash, from, to, gasPrice, gasLimit: gasLimitUsed, data, chainId, confirmations } = deployTransaction;

    fs.writeFileSync(
        path.resolve(__dirname, `../deployments/${network.name}/TilesSvg.sol.json`),
        JSON.stringify({
            address: deployed.address,
        })
    );

    console.log(`transaction id:${hash}`);
    console.log(`from:${from}, to:${to} - (${confirmations} confirmations)`);
    console.log(gasPrice, gasLimitUsed);

    console.log(`Verify using:` + `\n` + `npx hardhat verify --network rinkeby ` + `${Tiles.address} `);

    const startSale = await attached.startSale({
        gasLimit,
    });
    if (attached.salesIsActive) console.log(`${startSale}`);

    const addresses = [
        `0x90eda5165e5E1633E0Bdb6307cDecaE564b10ff7`, // sage
        `0x111040F27f05E2017e32B9ac6d1e9593E4E19A2a`, // burtula
        `0xe7879a2D05dBA966Fcca34EE9C3F99eEe7eDEFd1`, // mieos
        `0x823b92d6a4b2AED4b15675c7917c9f922ea8ADAD`, // jango
        `0x7cF2eBb5Ca55A8bd671A020F8BDbAF07f60F26C1`, // zom-boe.eth
        `0x6860f1A0cF179eD93ABd3739c7f6c8961A4EEa3c`, // dhyon.eth
        `0x30670D81E487c80b9EDc54370e6EaF943B6EAB39`, // mrgoldstein
        `0x28C173B8F20488eEF1b0f48Df8453A2f59C38337`, // xstvg.eth
        `0xca6Ed3Fdc8162304d7f1fCFC9cA3A81632d5E5B0`, // twodam
        `0x6212ce06Dcac01706e6Be5310C3228ede1A02ADf`, //
        `0xE16a238d207B9ac8B419C7A866b0De013c73357B`, //
        `0x754F37225CE0E30639093Af47C16ef057B544b4f`, // exekias.eth
        `0x63A2368F4B509438ca90186cb1C15156713D5834`, // peri.eth
        `0x5d95baEBB8412AD827287240A5c281E3bB30d27E`, // tankbottoms
        `0x1DD2091f250876Ba87B6fE17e6ca925e1B1c0CF0`, // natasha-pankina
        `0xB646B4cD68548D96804e844b7CfBEf4e74b80675`, // partypants.eth
        `0x4823e65C10DAa3eF320e5e262CfA8D0A059e02A6`, // evmcompatible
        `0xd551B861414B7a2836E4B4615B8155C4b1ECC067`,
        `0xf0FE43a75Ff248FD2E75D33fa1ebde71c6d1abAd`,
        `0xD209390A0b04F03507614FC07f9359E831911677`,
    ];

    const subDir = 'tiles';
    if (!fs.existsSync(`${__dirname}/${subDir}`)) await fs.mkdirSync(`${__dirname}/${subDir}`);

    attached.on('Transfer', async (from, to, tokenId) => {
        console.log(tokenId);
        const dataURI = await attached.tokenURI(tokenId);
        const json = JSON.parse(Buffer.from(dataURI.replace('data:application/json;base64,', ''), 'base64').toString());
        const svg = Buffer.from(json.image.replace('data:image/svg+xml;base64,', ''), 'base64');
        await fs.writeFileSync(path.resolve(__dirname, `./${subDir}/${tokenId}.svg`), svg);
        const totalSupply = await attached.totalSupply({
            gasLimit,
        });
        console.log(`total supply:${JSON.stringify(totalSupply)}`);
    });

    for (const address of addresses) {
        try {
            await attached.mintTile(address, {
                gasLimit,
            });
            console.log(`minting tile for ${address} ...`);
            console.log(`minted!`);
        } catch (err) {
            console.error(`${err}`);
            break;
        }
    }
}

/* We recommend this pattern to be able to use async/await everywhere
  and properly handle errors. */
main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });
