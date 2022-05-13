// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import './IPriceResolver.sol';

/**
  @notice A price resolver interface meant for NFT contracts to calculate price based on parameters.
 */
interface ITileNFT {
    function registerMinter(address) external;

    function removeMinter(address) external;

    function registerPriceResolver(IPriceResolver) external;
}
