import { deploy } from '@openzeppelin/hardhat-upgrades/dist/utils';
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

    it('Should mint to 3rd party address using deployer account', async function () {
        const { deployer, tileNFT, accounts } = await setup();

        let expectedTokenId = 1;
        let addressIndex = 0;
        await expect(tileNFT.connect(deployer).superMint(accounts[0].address, accounts[1].address))
            .to.emit(tileNFT, 'Transfer').withArgs(ethers.constants.AddressZero, accounts[addressIndex].address, expectedTokenId);

        expect(await tileNFT.ownerOf(expectedTokenId)).to.equal(accounts[addressIndex].address);

        fs.writeFileSync(`tile-${(accounts[1].address).toString()}.json`, await tileNFT.tokenURI(expectedTokenId));

        expect(await tileNFT.contractURI()).to.equal('ipfs://metadata');
    });

    it('Should not mint to 3rd party address with a non-deployer account', async function () {
        const { tileNFT, accounts } = await setup();

        await expect(tileNFT.connect(accounts[0]).superMint(accounts[0].address, accounts[1].address))
            .to.be.revertedWith('PRIVILEDGED_OPERATION()');
    });

    it('Should register minter with the deployer account', async function () {
        const { deployer, tileNFT, accounts } = await setup();

        await expect(tileNFT.connect(deployer).registerMinter(accounts[0].address))
    });

    it('Should not register minter with a non-deployer account', async function () {
        const { tileNFT, accounts } = await setup();

        await expect(tileNFT.connect(accounts[0]).registerMinter(accounts[0].address))
            .to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should remove minter with the deployer account', async function () {
        const { deployer, tileNFT, accounts } = await setup();

        await expect(tileNFT.connect(deployer).removeMinter(accounts[0].address));
    });

    it('Should not remove minter with a non-deployer account', async function () {
        const { tileNFT, accounts } = await setup();

        await expect(tileNFT.connect(accounts[0]).removeMinter(accounts[0].address))
            .to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should set treasury with the deployer account', async function () {
        const { deployer, tileNFT, accounts } = await setup();

        await expect(tileNFT.connect(deployer).setTreasury(accounts[0].address));
    });

    it('Should not set treasury with a non-deployer account', async function () {
        const { tileNFT, accounts } = await setup();

        await expect(tileNFT.connect(accounts[0]).setTreasury(accounts[0].address))
            .to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should transfer balance with the deployer account', async function () {
        const { deployer, tileNFT, accounts } = await setup();

        await expect(tileNFT.connect(deployer).transferBalance(deployer.address, ethers.utils.parseEther('128')))
            .to.be.revertedWith('INVALID_AMOUNT()');

        await tileNFT.connect(accounts[0]).mint({ value: ethers.utils.parseEther('0.0001') });
        await expect(tileNFT.connect(deployer).transferBalance(deployer.address, ethers.utils.parseEther('0.0001')));
    });

    it('Should not transfer balance with a non-deployer account', async function () {
        const { tileNFT, accounts } = await setup();

        await expect(tileNFT.connect(accounts[0]).transferBalance(accounts[0].address, ethers.utils.parseEther('128')))
            .to.be.revertedWith('Ownable: caller is not the owner');
    });
});
