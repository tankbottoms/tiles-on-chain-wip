// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@jbox/sol/contracts/abstract/JuiceboxProject.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

import "./StringHelpers.sol";
import "./TilePart.sol";
import "./Tile.sol";

pragma solidity ^0.8.6;

/*
    contract TilesSvg is Tile, TilePart, StringHelpers, JuiceboxProject, ERC721Enumerable  {
*/

contract TilesSvg is Tile, TilePart, StringHelpers, ERC721Enumerable, Ownable  {
    using SafeMath for uint256;

    event Mint(address to, address tileAddress);
    
    bool public saleIsActive = false;    
    uint256 public mintedReservesLimit = 1000;
    uint256 public mintedReservesCount = 0;    

    mapping(address => uint256) public idOfAddress;
    mapping(uint256 => address) public tileAddressOf;

    struct Ring {
        uint8 positionIndex;
        uint8 size;
        uint8 layer;
        bool positionKind;
        bool solid;
    }

    string private red = "#FE4465";
    string private black = "#222";
    string private blue = "#1A49EF";
    string private yellow = "#F8D938";

    string[][] private sectorColorVariants = [
        [red, yellow, black],
        [red, black, blue],
        [red, yellow, blue],
        [red, blue, yellow],
        [blue, yellow, red],
        [blue, red, yellow],
        [blue, yellow, yellow],
        [blue, black, red],
        [black, red, yellow],
        [black, red, blue],
        [black, blue, red],
        [black, yellow, blue],
        [yellow, red, black],
        [yellow, blue, red],
        [yellow, black, blue],
        [yellow, black, red]
    ];

    constructor() ERC721("Tiles", "TILES") {  }

    /*
    constructor(
        uint256 _projectID,
        ITerminalDirectory _terminalDirectory,
        string memory _baseURI
    ) JuiceboxProject(_projectID, _terminalDirectory) ERC721("Tiles", "TILES") {
        baseURI = _baseURI;
    }

    */

    function bytesToChars(address _address)
        private
        pure
        returns (uint16[] memory)
    {
        uint16[] memory chars = new uint16[](40);
        uint160 temp = uint160(_address);
        uint32 i = 0;
        while (temp > 0) {
            uint16 right_most_digit = uint16(temp % 16);
            temp -= right_most_digit;
            temp /= 16;
            chars[39 - i] = right_most_digit;
            i++;
        }
        return chars;
    }

    function sectorColorsFromInt16(uint16 char, uint8 r)
        private
        view
        returns (string memory)
    {
        string[] memory colors = sectorColorVariants[char];
        return colors[r];
    }

    function generateTileSectors(
        uint16[4][10] memory chars,
        uint8 i,
        uint8 r
    ) private view returns (string memory, string memory) {
        string memory color = sectorColorsFromInt16(chars[i + 1][0], r);
        return (svgs[chars[i + 1][r + 1]], color);
    }
    
    function calculatePrice() public view returns (uint256) {
        require(saleIsActive == true, "Sale hasn't started");
        /*
        uint256 currentSupply = totalSupply();
    
        if (currentSupply >= 102400) {
            return 10240000000000000000; // 102,401 - ∞ : 10.24 ETH
        } else if (currentSupply >= 51200) {
            return 5120000000000000000; // 51,201 - 102,400 : 5.12 ETH
        } else if (currentSupply >= 25600) {
            return 2560000000000000000; // 25,601 - 51,200 : 2.56 ETH
        } else if (currentSupply >= 12800) {
            return 1280000000000000000; // 12,801 - 25,600 : 1.28 ETH
        } else if (currentSupply >= 6400) {
            return 640000000000000000; // 6,401 - 12,800 : 0.64 ETH
        } else if (currentSupply >= 3200) {
            return 320000000000000000; // 3,201 - 6,400 : 0.32 ETH
        } else if (currentSupply >= 1600) {
            return 160000000000000000; // 1,601 - 3,200 : 0.16 ETH
        } else if (currentSupply >= 800) {
            return 80000000000000000; // 801 - 1600 : 0.08 ETH
        } else if (currentSupply >= 400) {
            return 40000000000000000; // 401 - 800 : 0.04 ETH
        } else if (currentSupply >= 200) {
            return 20000000000000000; // 201 - 400 : 0.02 ETH
        } else {
            return 10000000000000000; // 1 - 200 : 0.01 ETH
        }
        */

        return 10000000000000000; // 1 - 200 : 0.01 ETH
    }

    function mintTile(address _tileAddress) external payable returns (uint256) {
        /*
        require(
            msg.value >= calculatePrice(),
            "Ether value sent is below the price"
        );
        */

        // Take fee into TileDAO Juicebox treasury
        /*
        _takeFee(
            msg.value,
            msg.sender,
            string(
                abi.encodePacked(
                    "Minted Tile with address ",
                    toAsciiString(_tileAddress)
                )
            ),
            false
        );
        */
        return _mintTile(msg.sender, _tileAddress);
    }

    /*
        Minting a Tile just means to store the owner's address, tokenId, and a mapping of the _tileAddress
    */
    function _mintTile(address to, address _tileAddress)
        private
        returns (uint256)
    {
        require(
            idOfAddress[_tileAddress] == 0,
            "Tile already minted for address"
        );
        
        uint256 tokenId = totalSupply() + 1;
        _safeMint(to, tokenId);        
        idOfAddress[_tileAddress] = tokenId;
        tileAddressOf[tokenId] = _tileAddress;
        emit Mint(to, _tileAddress);
        return tokenId;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return _tokenUri(address(tileAddressOf[tokenId]));            
    }

    // convert to private after testing
    function _tokenUri(address addr) public view returns (string memory) {
        string memory str = head;
        uint16[4][10] memory addressSegments;
        uint16[] memory chars = bytesToChars(addr);
        
        for (uint16 i = 0; i < 10; i++) {
            addressSegments[i][0] = chars[i * 4 + 0];
            addressSegments[i][1] = chars[i * 4 + 1];
            addressSegments[i][2] = chars[i * 4 + 2];
            addressSegments[i][3] = chars[i * 4 + 3];
        }        
        
        Ring[] memory rings = new Ring[](2);

        uint160[2] memory indexes = [
            (uint160(addr) / (16**38)) % 16**2,
            (uint160(addr) / (16**36)) % 16**2
        ];
        
        uint8 ringsCount = 0;
        
        for (uint256 i = 0; i < 2; i++) {
            if (indexes[i] == 0) continue;
            uint160 ringIndex = indexes[i] > 0 ? indexes[i] - 1 : indexes[i];
            rings[ringsCount].positionIndex = positionIndex[ringIndex];
            rings[ringsCount].size = size[ringIndex];
            rings[ringsCount].layer = layer[ringIndex];
            rings[ringsCount].positionKind = positionKind[ringIndex];
            rings[ringsCount].solid = solid[ringIndex];
            ringsCount += 1;
        }
        
        for (uint8 r = 0; r < 3; r++) {
            for (uint8 i = 0; i < 9; i++) {
                (string memory svg, string memory color) = generateTileSectors(
                    addressSegments,
                    i,
                    r
                );
                if (stringStartsWith(svg, "<path")) {
                    str = string(
                        abi.encodePacked(
                            str,
                            '<g transform="matrix(1,0,0,1,',
                            Strings.toString((i % 3) * 100),
                            ",",
                            Strings.toString(((i % 9) / 3) * 100),
                            ')">',
                            replace(
                                replace(svg, "#000", color),
                                "/>",
                                ' style="opacity: 0.88;" />'
                            ),
                            "</g>"
                        )
                    );
                } else if (stringStartsWith(svg, "<circle")) {
                    str = string(
                        abi.encodePacked(
                            str,
                            '<g transform="matrix(1,0,0,1,',
                            Strings.toString((i % 3) * 100),
                            ",",
                            Strings.toString(((i % 9) / 3) * 100),
                            ')">',
                            replace(
                                replace(svg, "#000", color),
                                "/>",
                                ' style="opacity: 0.88;" />'
                            ),
                            "</g>"
                        )
                    );
                }
            }

            for (uint8 i = 0; i < ringsCount; i++) {
                Ring memory ring = rings[i];
                if (ring.layer != r) {
                    continue;
                }
                
                uint32 i;
                uint32 posX;
                uint32 posY;
                uint32 diameter10x;

                if (ring.size == 0) {
                    diameter10x = 100;
                } else if (ring.size == 1) {
                    diameter10x = 488;
                } else if (ring.size == 2) {
                    diameter10x = 900;
                } else if (ring.size == 3) {
                    diameter10x = 1900;
                }
                if (2 == ring.layer) {
                    diameter10x += 5;
                }
                uint32 posI = uint32(ring.positionIndex);
                if (!ring.positionKind) {
                    posX = (posI % 4) * 100;
                    posY = posI > 11 ? 300 : posI > 7 ? 200 : posI > 3
                        ? 100
                        : 0;
                } else if (ring.positionKind) {
                    posX = 100 * (posI % 3) + 50;
                    posY = (posI > 5 ? 2 * 100 : posI > 2 ? 100 : 0) + 50;
                }
                str = string(
                    abi.encodePacked(
                        str,
                        '<g transform="matrix(1,0,0,1,',
                        Strings.toString(posX),
                        ",",
                        Strings.toString(posY),
                        ')"><circle r="',
                        divide(diameter10x, 20, 5),
                        '" fill="',
                        ring.solid ? canvasColor : "none",
                        '" stroke-width="10" stroke="',
                        canvasColor,
                        '" /></g>'
                    )
                );
            }
        }

        return string(abi.encodePacked(str, foot));
    }

    function startSale() external onlyOwner {
        require(saleIsActive == false, "Sale is already active");
        saleIsActive = true;
    }

    function pauseSale() external onlyOwner {
        require(saleIsActive == true, "Sale is already inactive");
        saleIsActive = false;
    }
    
    function mintReserveTile(address to, address _tileAddress)
        external
        onlyOwner
        returns (uint256)
    {
        require(
            mintedReservesCount < mintedReservesLimit,
            "Reserves limit exceeded"
        );

        mintedReservesCount = mintedReservesCount + 1;
        return _mintTile(to, _tileAddress);
    }

}
