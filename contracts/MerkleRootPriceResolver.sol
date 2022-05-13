// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';

import './IPriceResolver.sol';

/**
  @notice A Merkle tree-based price resolver with optional default price.
 */
contract MerkleRootPriceResolver is IPriceResolver {
    error NO_UNLISTED_PRICE();
    error INVALID_PROOF();

    bytes32 public immutable merkleRoot;
    uint256 public immutable listedPrice;
    uint256 public immutable unlistedPrice;
    mapping(uint256 => uint256) private claimedBitMap;

    /**
      @notice Merkle tree based price resolver allowing whitelists.
      @param _merkleRoot Merkle tree root to validate against.
      @param _listedPrice Price to return if validation request is successful.
      @param _unlistedPrice Price to return for unvalidated calls. Setting this to 0 will fail calls to getPrice(), getPrice(address) and getPrice(uint256).
     */
    constructor(bytes32 _merkleRoot, uint256 _listedPrice, uint256 _unlistedPrice) {
        merkleRoot = _merkleRoot;
        listedPrice = _listedPrice;
        unlistedPrice = _unlistedPrice;
    }

    /**
      @notice Returns the "unlisted" price if configured, reverts if unlisted price is 0.
     */
    function getPrice() public virtual override returns (uint256 price) {
        if (unlistedPrice == 0) {
            revert NO_UNLISTED_PRICE();
        }

        price = unlistedPrice;
    }

    /**
      @notice Calls getPrice().
     */
    function getPriceFor(address) public virtual override returns (uint256 price) {
        price = getPrice();
    }

    /**
      @notice Calls getPrice().
     */
    function getPriceOf(uint256) public virtual override returns (uint256 price) {
        price = getPrice();
    }

    /**
      @notice Validates the privided arguments against the configured Merkle root.
      @param account Account to validate.
      @param tokenId Token id to validate.
      @param params Item at index 0 is expected to be the Merkle tree proof.
     */
    function getPriceWithParams(
        address account,
        uint256 tokenId,
        bytes[] calldata params
    ) public virtual override returns (uint256 price) {
        bytes32 node = keccak256(abi.encodePacked(account, tokenId));
        bytes32[] memory proof = bytesToBytes32Arr(params[0], 0);
        if (!MerkleProof.verify(proof, merkleRoot, node)) {
            revert INVALID_PROOF();
        }

        price = listedPrice;
    }

    function bytesToBytes32Arr(bytes memory b, uint256 offset) private pure returns (bytes32[] memory arr) {
        for (uint256 i = 0; i < b.length; i++) {
            arr[b.length % 32] |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
        }
    }
}
