// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import './IPriceResolver.sol';

/**
  @notice A Merkle tree-based price resolver with optional default price.
 */
contract MerkleRootPriceResolver is IPriceResolver {
    constructor() {
        //
    }
    function getPrice() public virtual override returns (uint256 price) {
        price = 0;
    }
    function getPriceFor(address) public virtual override returns (uint256 price) {
        price = getPrice();
    }

    function getPriceOf(uint256) public virtual override returns (uint256 price) {
        price = getPrice();
    }

    function getPriceWithParams(address, uint256, bytes[] calldata params) public virtual override returns (uint256 price) {
        price = 0;
    }
}