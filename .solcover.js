// solidity-coverage configuration file.
//
// https://www.npmjs.com/package/solidity-coverage

module.exports = {
  skipFiles: [
    'components/AbstractTileNFTContent.sol',
    'components/Base64.sol',
    'components/ERC721Enumerable.sol',
    'components/Ring.sol',
    'components/StringHelpers.sol',
    'components/TileContentProvider.sol'
  ],
  configureYulOptimizer: true,
  measureStatementCoverage: false,
};
