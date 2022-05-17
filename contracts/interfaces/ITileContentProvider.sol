// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

import './ITokenUriResolver.sol';

interface ITileContentProvider is ITokenUriResolver {
  function setParent(IERC721) external;

  function getSvgContent(address) external view returns (string memory);
}
