import fs from 'fs';
import path from 'path';
import { ethers } from 'hardhat';
import { BigNumber, Contract, ContractFactory } from 'ethers';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

dotenvConfig({ path: resolve(__dirname, '../.env') });

async function main(): Promise<void> {    
    const Factory: ContractFactory = await ethers.getContractFactory('TilesSvg');
    const Tiles: Contract = await Factory.deploy();            
    const deployed = await Tiles.deployed();
    
    console.log(`Contract address: ${deployed.address}`);    
    console.log("txnHash:", deployed.deployTransaction.hash);    
    console.log("waiting for confirmation...");
    
    await deployed.deployTransaction.wait();
    const attached = Factory.attach(deployed.address);

    const { deployTransaction } = deployed;
    const { hash, from, to, gasPrice, gasLimit, data, chainId, confirmations } = deployTransaction;    
    
    console.log(`transaction id:${hash}`);
    console.log(`from:${from}, to:${to} - (${confirmations} confirmations)`);
    console.log(gasPrice, gasLimit);
    
    console.log(`Verify using:` + `\n` +
        `npx hardhat verify --network rinkeby ` + `${Tiles.address} `
    );

    const startSale = await attached.startSale();
    if (attached.salesIsActive) console.log(`${startSale}`);

    const addresses = [
        "0x63a2368f4b509438ca90186cb1c15156713d5834",        
        "0xac104d56e4f8e0462f8c001ec7dde4c68deb596f",
        "0x823b92d6a4b2aed4b15675c7917c9f922ea8adad",
        "0x176d13b1e6ac0476e108c3ca60b15919dff0bcdf",
        "0x823b92d6a4b2aed4b15675c7917c9f922ea8adad",
        "0x6140f00e4ff3936702e68744f2b5978885464cbb",
        "0x6130b7313833f99956a364156b3329e50695bd65",
        "0x63a2368f4b509438ca90186cb1c15156713d5834",
        "0x823b92d6a4b2aed4b15675c7917c9f922ea8adad",
        "0x176d13b1e6ac0476e108c3ca60b15919dff0bcdf",
        "0x823b92d6a4b2aed4b15675c7917c9f922ea8adad",
        "0xb92b87a226cc740b3c5934047d3481fa87474de4",
        "0x823b92d6a4b2aed4b15675c7917c9f922ea8adad",        
  ];

    const subDir = 'tiles';

    if (!fs.existsSync(`${__dirname}/${subDir}`)) 
        await fs.mkdirSync(`${__dirname}/${subDir}`);

    for (const address of addresses) {      
      const svg = await attached._tokenUri(address);
        await fs.writeFileSync(
            path.resolve(__dirname, `./${subDir}/${address}-contract.svg`), svg
        );

        /*
        const tokenId = await attached.mintTile(address);
      const svg = await attached.tokenURI(tokenId);
        await fs.writeFileSync(
            path.resolve(__dirname, `./${subDir}/${address}-contract.svg`), svg
        );
        */
    }
};

/* We recommend this pattern to be able to use async/await everywhere
  and properly handle errors. */
main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });
