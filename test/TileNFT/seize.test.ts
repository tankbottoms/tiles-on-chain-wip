import { expect } from 'chai';
import fs from 'fs';
import { ethers } from 'hardhat';

enum PriceFunction {
    LINEAR,
    EXP
}

describe('SupplyPriceResolver Tests', function () {
    const basePrice = ethers.utils.parseEther('0.0001');
    const priceCap = ethers.utils.parseEther('128');
    const multiplier = 2;
    const tierSize = 128;

    async function setup() {
        const [deployer, ...accounts] = await ethers.getSigners();

        const stringHelpersFactory = await ethers.getContractFactory('StringHelpers', deployer);
        const stringHelpersLibrary = await stringHelpersFactory.connect(deployer).deploy();

        const supplyPriceResolverFactory = await ethers.getContractFactory('SupplyPriceResolver', deployer);
        const linearSupplyPriceResolver = await supplyPriceResolverFactory
            .connect(deployer)
            .deploy(
                basePrice,
                multiplier,
                tierSize,
                priceCap,
                PriceFunction.LINEAR);

        const tileContentProviderFactory = await ethers.getContractFactory('TileContentProvider', {
            libraries: { StringHelpers: stringHelpersLibrary.address },
            signer: deployer
        });

        const tileContentProvider = await tileContentProviderFactory
            .connect(deployer)
            .deploy();

        const tileNFTFactory = await ethers.getContractFactory('TileNFT', deployer);
        const tileNFT = await tileNFTFactory
            .connect(deployer)
            .deploy(
                'On-chain Tile',
                'OT',
                '',
                linearSupplyPriceResolver.address,
                tileContentProvider.address,
                ethers.constants.AddressZero,
                'ipfs://metadata');

        return {
            deployer,
            accounts,
            tileNFT
        };
    }

    it('Should grab NFT of a non-minter address', async function () {
        const { tileNFT, accounts } = await setup();

        let expectedTokenId = 1;
        let addressIndex = 0;
        await expect(tileNFT.connect(accounts[addressIndex]).grab(accounts[addressIndex + 1].address, { value: ethers.utils.parseEther('0.0001') }))
            .to.emit(tileNFT, 'Transfer').withArgs(ethers.constants.AddressZero, accounts[addressIndex].address, expectedTokenId);

        expect(await tileNFT.ownerOf(expectedTokenId)).to.equal(accounts[addressIndex].address);
    });

    it('Should seize NFT from a non-minter address', async function () {
        const { tileNFT, accounts } = await setup();

        let expectedTokenId = 1;
        let addressIndex = 0;
        await expect(tileNFT.connect(accounts[addressIndex]).grab(accounts[addressIndex + 1].address, { value: ethers.utils.parseEther('0.0001') }))
            .to.emit(tileNFT, 'Transfer').withArgs(ethers.constants.AddressZero, accounts[addressIndex].address, expectedTokenId);

        expect(await tileNFT.ownerOf(expectedTokenId)).to.equal(accounts[addressIndex].address);

        expect(await tileNFT.addressForId(expectedTokenId)).to.equal(accounts[addressIndex + 1].address);
        expect(await tileNFT.idForAddress(accounts[addressIndex + 1].address)).to.equal(expectedTokenId);

        await expect(tileNFT.connect(accounts[addressIndex + 1]).seize({ value: ethers.utils.parseEther('0.0001') }))
            .to.emit(tileNFT, 'Transfer').withArgs(accounts[addressIndex].address, accounts[addressIndex + 1].address, expectedTokenId);

        expect(await tileNFT.ownerOf(expectedTokenId)).to.equal(accounts[addressIndex + 1].address);
    });

    //fail grab
    //fail seize
    // wrong price
});
