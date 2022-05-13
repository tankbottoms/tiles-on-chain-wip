// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import './IPriceResolver.sol';

/**
  @notice A price resolver interface meant for NFT contracts to calculate price based on parameters.
 */
interface ITileNFT {
    function mint() external payable returns (uint256);

    function merkleMint(uint256, bytes[] calldata) external payable returns (uint256);

    function superMint(address) external payable returns (uint256);

    function registerMinter(address) external;

    function removeMinter(address) external;

    function setPriceResolver(IPriceResolver) external;

    function setTreasury(address payable) external;

    function transferBalance(address payable, uint256) external;
}
