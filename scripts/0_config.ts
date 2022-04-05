import { ethers } from 'hardhat';
import { BigNumber, Contract, ContractFactory, Transaction, utils } from 'ethers';
import { promises as fs } from 'fs';
import path from 'path';

const project_name = `Infinite Tiles`;
const project_symbol = `TILE`;
const project_description = `Humans are characterized by a desire to form communities around ideas, symbols, and artifacts that satisfy our overlapping interpretations of beauty. Tiles are a celebration of what gives meaning to those communities: the individual. \n There is one Tile generated for every possible ETH wallet address—each representing a unique identity in the decentralized ecosystem that makes projects like this possible. \n Mathematically, all Tiles are equally rare. They are all fashioned from the same assortment of simple shapes and colors, but each in a unique way. In that sense, Tiles are a bit like us. \n Owning a Tile is an invitation to participate in the TileDAO, which receives all revenue from the Tiles primary sale. Because the supply is virtually infinite, funding for the DAO may continue indefinitely—as long as Tiles are sold.`;
const project_image_gif = 'ipfs://QmR6F5AoJCPTtmwqvs6LRgg7pMwMj8sFNQGGCFrz36FaHS';
const project_base_uri = `ipfs://QmQ27q66UqqYp16b1yn5k72txtyy9m1CBGbw7a7shuLFBZ/`;
const provenance = ``;
const project_max_tokens = 0;
const project_start_sale = 0;
const project_external_url = `https://juicebox.money`;
const project_seller_fee_basis_points = 5000;
const project_fee_recipient = `0x6a67c678eFb4a61635fFBaEbcD38B3370009592f`;
const project_discord = `juicebox`;
const project_twitter = `juiceboxETH`;

export const project_config = {
    tokenName: project_name,
    tokenSymbol: project_symbol,
    baseURI: project_base_uri,
    maxTokens: project_max_tokens,
    startSale: project_start_sale,
};

export const opensea_storefront = {
    name: project_name,
    description: project_description,
    image: project_image_gif,
    external_link: project_external_url,
    seller_fee_basis_points: project_seller_fee_basis_points,
    fee_recipient: project_fee_recipient,
}

false && console.log(project_config);

(async () => {
    console.log('writing opensea.json...');
    await fs.writeFile(path.join(__dirname, './opensea.json'), JSON.stringify({
        name: project_name,
        description: project_description,
        image: project_image_gif,
        external_link: project_external_url,
        seller_fee_basis_points: project_seller_fee_basis_points,
        fee_recipient: project_fee_recipient,
        discord: `"https://discord.gg/juicebox${project_discord}"`,
        twitter: `"https://twitter.com/${project_twitter}"`
    }, null, '  '));
})();