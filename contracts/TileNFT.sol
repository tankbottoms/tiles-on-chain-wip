// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import './IPriceResolver.sol';
import './ITileNFT.sol';
import './AbstractTileNFT.sol';
import './ERC721Enumerable.sol';

contract TileNFT is AbstractTileNFT, ERC721Enumerable, Ownable, ReentrancyGuard, ITileNFT {
    error INCORRECT_PRICE();
    error UNSUPPORTED_OPERATION();
    error PRIVILEDGED_OPERATION();
    error INVALID_ADDRESS();
    error INVALID_AMOUNT();

    IPriceResolver private priceResolver;
    mapping(address => bool) private minters;
    address payable private treasury;

    /**
      @notice 
     */
    constructor(string memory _name, string memory _symbol, IPriceResolver _priceResolver, address payable _treasury) ERC721Enumerable(_name, _symbol) {
        priceResolver = _priceResolver;
        treasury = _treasury;
    }

    /** public views **/

    function tokenURI(uint256 id) public view override returns (string memory uri) {
        uri = '';
    }

    /** public functions **/

    /**
      @notice Allows minting by anyone at the correct price.
     */
    function mint() external payable override nonReentrant returns (uint256) {
        if (address(priceResolver) == address(0)) { revert UNSUPPORTED_OPERATION(); }
        if (msg.value != priceResolver.getPrice()) { revert INCORRECT_PRICE(); }

        if (address(treasury) != address(0)) { treasury.transfer(msg.value); }

        _mint(msg.sender);
    }

    /**
      @notice Allows minting by anyone in the merkle root of the registered price resolver.
     */
    function merkleMint(uint256 tokenId, bytes[] calldata proof) external payable override nonReentrant returns (uint256) {
        if (address(priceResolver) == address(0)) { revert UNSUPPORTED_OPERATION(); }
        if (msg.value != priceResolver.getPriceWithParams(msg.sender, tokenId, proof)) { revert INCORRECT_PRICE(); }

        if (address(treasury) != address(0)) { treasury.transfer(msg.value); }

        _mint(msg.sender);
    }

    /** priviledged functions **/

    /**
      @notice Allows direct mint by priviledged accounts bypassing price checks.
     */
    function superMint(address _account) external payable override nonReentrant onlyMinter(msg.sender) returns (uint256) {
        if (msg.value > 0 && address(treasury) != address(0)) { treasury.transfer(msg.value); }

        _mint(_account);
    }

    /**
      @notice Adds a priviledged minter account.
     */
    function registerMinter(address _minter) external override onlyOwner {
        minters[_minter] = true;
    }

    /**
      @notice Removes a priviledged minter account.
     */
    function removeMinter(address _minter) external override onlyOwner {
        minters[_minter] = false;
    }

    /**
      @notice Changes the associated price resolver.
     */
    function setPriceResolver(IPriceResolver _priceResolver) external override onlyOwner {
        priceResolver = _priceResolver;
    }

    /**
      @notice Changes the treasury address.
     */
    function setTreasury(address payable _treasury) external override onlyOwner {
        if (_treasury == address(0)) { revert INVALID_ADDRESS(); }

        treasury = _treasury;
    }

    /**
      @notice Allows owner to tranfer ether balance.
     */
    function transferBalance(address payable account, uint256 amount) external override onlyOwner {
        if (account == address(0)) { revert INVALID_ADDRESS(); }
        if (amount == 0 || amount > (payable(address(this))).balance) { revert INVALID_AMOUNT(); }

        account.transfer(amount);
    }

    /** private functions **/

    /**
      @notice Mints the ERC721 token, returns minted token id.
     */
    function _mint(address account) private returns (uint256 tokenId) {
        tokenId = 0;

        emit Transfer(address(0), account, tokenId);
    }

    /**
      @notice Validate that the caller is in the minter list.
     */
    modifier onlyMinter(address _account) {
        if (!minters[_account]) { revert PRIVILEDGED_OPERATION(); }
        _;
    }
}
