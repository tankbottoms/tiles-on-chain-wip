// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@jbx-protocol/contracts-v2/contracts/interfaces/IJBProjectPayer.sol';

import './IPriceResolver.sol';

/**
  @notice A price resolver interface meant for NFT contracts to calculate price based on parameters.
 */
interface ITileNFT {
  function idForAddress(address) external view returns (uint256);

  function addressForId(uint256) external view returns (address);

  function contractURI() external view returns (string memory);

  function mint() external payable returns (uint256);

  function grab(address) external payable returns (uint256);

  function merkleMint(uint256, bytes calldata) external payable returns (uint256);

  function seize() external payable returns (uint256);

  function superMint(address, address) external payable returns (uint256);

  function registerMinter(address) external;

  function removeMinter(address) external;

  function setPriceResolver(IPriceResolver) external;

  function setTreasury(IJBProjectPayer) external;

  function transferBalance(address payable, uint256) external;
}
