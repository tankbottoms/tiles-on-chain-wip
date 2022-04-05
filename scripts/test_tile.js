const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();

    const factory = await ethers.getContractFactory('TilesSVG');

    const deployed = await factory.deploy();
    console.log('txnHash:', deployed.deployTransaction.hash);
    console.log('waiting for confirmation...');
    await deployed.deployTransaction.wait();
    console.log(`Contract address: ${deployed.address}`);

    const attached = factory.attach(deployed.address);
    const addresses = [
        '0x458e5eBAe41DaEEd84A19893e71892F491515f83',
        '0x00000000219ab540356cbb839cbe05303d7705fa',
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        '0xda9dfa130df4de4673b89022ee50ff26f6ea73cf',
        '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
        '0x73bceb1cd57c711feac4224d062b0f6ff338501e',
        '0x9bf4001d307dfd62b26a2f1307ee0c0307632d59',
        '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
        '0x61edcdf5bb737adffe5043706e7c5bb1f1a56eea',
        '0xdc24316b9ae028f1497c275eb9192a3ea0f67022',
        '0x011b6e24ffb0b5f5fcc564cf4183c5bbbc96d515',
        '0x1b3cb81e51011b549d78bf720b0d924ac763a7c2',
    ];

    const fs = require('fs');
    const child_process = require('child_process');
    const path = require('path');

    for (const address of addresses) {
        console.log(`fecthing ${address} ...`);
        const svg = await attached.tokenUri(address);
        fs.writeFileSync(path.resolve(__dirname, `./out/${address}-contract.svg`), svg);
        child_process.execSync(
            `curl http://localhost:9600/tile/${address} -o ${path.resolve(__dirname, `./out/${address}.svg`)}`
        );
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
