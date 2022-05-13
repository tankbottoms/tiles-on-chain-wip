// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import './IPriceResolver.sol';

/**
  @notice A price resolver that derives the price of the token being minted based on total number of tokens already minted.
 */
contract SupplyPriceRosolver is IPriceResolver {
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
        // interpret bytes[0] as uint256 which is expected to be current supply
        price = 0;
    }
}