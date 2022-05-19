import { expect } from 'chai';
import { ethers } from 'hardhat';

import * as MerkleHelper from '../MerkleHelper';

describe('TileNFT Merkle-tree mint tests', function () {
    const listedPrice = ethers.utils.parseEther('0.0001');
    const unlistedPrice = ethers.utils.parseEther('0.001');
    const listedAccountOffset = 3;

    async function setup() {
        const [deployer, ...accounts] = await ethers.getSigners();

        const stringHelpersFactory = await ethers.getContractFactory('StringHelpers', deployer);
        const stringHelpersLibrary = await stringHelpersFactory.connect(deployer).deploy();

        const snapshot = MerkleHelper.makeSampleSnapshot(accounts.filter((a, i) => i >= listedAccountOffset).map(a => a.address));
        const merkleData = MerkleHelper.buildMerkleTree(snapshot);

        const merkleRootPriceResolverFactory = await ethers.getContractFactory('MerkleRootPriceResolver', deployer);
        const merkleRootPriceResolverResolver = await merkleRootPriceResolverFactory
            .connect(deployer)
            .deploy(merkleData.merkleRoot, listedPrice, unlistedPrice);

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
                merkleRootPriceResolverResolver.address,
                tileContentProvider.address,
                accounts[0].address,
                'ipfs://metadata');

        return {
            deployer,
            accounts,
            tileNFT,
            merkleRootPriceResolverResolver,
            merkleData
        };
    }

    it('Get listed price from Merkle-root resolver', async function () {
        const { accounts, merkleRootPriceResolverResolver, merkleData } = await setup();

        let addressIndex = listedAccountOffset;
        let merkleItem = merkleData.claims[accounts[addressIndex].address];
        let proof = '0x' + accounts[addressIndex].address.slice(2) + merkleItem.proof.map(i => i.slice(2)).join('');
        expect(await merkleRootPriceResolverResolver.getPriceWithParams(merkleItem.data, merkleItem.index, proof))
            .to.equal(listedPrice);
    });

    it('Fail proof validation', async function () {
        const { accounts, merkleRootPriceResolverResolver, merkleData } = await setup();

        let addressIndex = 0;
        let merkleItem = merkleData.claims[accounts[listedAccountOffset].address]; // proof not owned
        let proof = '0x' + accounts[addressIndex].address.slice(2) + merkleItem.proof.map(i => i.slice(2)).join('');
        await expect(merkleRootPriceResolverResolver.getPriceWithParams(merkleItem.data, merkleItem.index, proof))
            .to.be.revertedWith('INVALID_PROOF()');
    });

    it('Mint with listed price', async function () {
        const { accounts, merkleData, tileNFT } = await setup();

        let expectedTokenId = 1;
        let addressIndex = listedAccountOffset;
        let merkleItem = merkleData.claims[accounts[addressIndex].address];
        let proof = '0x' + accounts[addressIndex].address.slice(2) + merkleItem.proof.map(i => i.slice(2)).join('');
        await expect(
            tileNFT.connect(accounts[addressIndex]).merkleMint(merkleItem.index, merkleItem.data, proof, { value: listedPrice }))
            .to.emit(tileNFT, 'Transfer').withArgs(ethers.constants.AddressZero, accounts[addressIndex].address, expectedTokenId);

        expect(await tileNFT.ownerOf(expectedTokenId)).to.equal(accounts[addressIndex].address);
    });

    it('Fail to mint with incorrect price', async function () {
        const { accounts, merkleData, tileNFT } = await setup();

        let expectedTokenId = 1;
        let addressIndex = listedAccountOffset;
        let merkleItem = merkleData.claims[accounts[addressIndex].address];
        let proof = '0x' + accounts[addressIndex].address.slice(2) + merkleItem.proof.map(i => i.slice(2)).join('');
        await expect(
            tileNFT.connect(accounts[addressIndex]).merkleMint(merkleItem.index, merkleItem.data, proof, { value: unlistedPrice }))
            .to.be.revertedWith('INCORRECT_PRICE()');
    });

    it('Fail to mint with un-owned proof', async function () {
        const { accounts, merkleData, tileNFT } = await setup();

        let addressIndex = 0;
        let merkleItem = merkleData.claims[accounts[listedAccountOffset].address]; // proof not owned
        let proof = '0x' + accounts[addressIndex].address.slice(2) + merkleItem.proof.map(i => i.slice(2)).join('');
        await expect(
            tileNFT.connect(accounts[addressIndex]).merkleMint(merkleItem.index, merkleItem.data, proof, { value: listedPrice }))
            .to.be.revertedWith('INVALID_PROOF()');
    });
});
