// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@openzeppelin/contracts/access/Ownable.sol';

import './IPriceResolver.sol';
import './AbstractTileNFT.sol';
import './ERC721Enumerable.sol';

contract TileNFT is AbstractTileNFT, ERC721Enumerable, Ownable {
    // private storage

    constructor(string _name, string _symbol, IPriceResolver _priceResolver) ERC721Enumerable(_name, _symbol) {
        //
    }
    
    // public views
    // public functions

    function mint() external override onlyMinter returns (uint256){
        // emit
    }

    // priviledged functions

    function registerMinter(address _minter) external override onlyOwner {
        //
    }

    function removeMinter(address _minter) external override onlyOwner {
        //
    }

    function registerPriceResolver(IPriceResolver _priceResolver) external override onlyOwner {
        //
    }

    // private functions

    modifier onlyMinter(address _account) {
        //blah
        _;
}
}