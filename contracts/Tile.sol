// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

contract Tile {    

    string[] svgs = [
        '<path d="M100 100L100 0H0C0 55.2285 44.7715 100 100 100Z" fill="#000"/>',
        '<path d="M0 100L0 0H100C100 55.2285 55.2285 100 0 100Z" fill="#000"/>',
        '<path d="M0 0L0 100H100C100 44.7715 55.2285 0 0 0Z" fill="#000"/>',
        '<path d="M100 0L100 100H0C0 44.7715 44.7715 0 100 0Z" fill="#000"/>',
        '<circle cx="50" cy="50" r="50" fill="#000" transform="matrix(1,0,0,1,0,0)" />',
        '<circle cx="20" cy="20" r="20" fill="#000" transform="matrix(1,0,0,1,30,30)" />',
        '<path d="M0 0C0 55.2285 44.7715 100 100 100C100 44.7715 55.2285 0 0 0Z" fill="#000"/>',
        '<path d="M0 100C0 44.7715 44.7715 0 100 0C100 55.2285 55.2285 100 0 100Z" fill="#000"/>',
        '<path d="M100 0H0L100 100V0Z" fill="#000"/>',
        '<path d="M0 0H100L0 100V0Z" fill="#000"/>',
        '<path d="M0 100H100L0 0V100Z" fill="#000"/>',
        '<path d="M100 100H0L100 0V100Z" fill="#000"/>',
        '<path d="M50 100C50 72.3858 27.6142 50 0 50V100H50Z" fill="#000"/>',
        '<path d="M50 100C50 72.3858 72.3858 50 100 50V100H50Z" fill="#000"/>',
        '<path d="M50 0C50 27.6142 72.3858 50 100 50V0H50Z" fill="#000"/>',
        '<path d="M50 0C50 27.6142 27.6142 50 0 50V0H50Z" fill="#000"/>'
    ];    
    
    string canvasColor = "#faf3e8";
    string head =
        string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" version="1.1" width="360" height="360" id="SvgjsSvg1000"><rect width="360" height="360" fill="',
                canvasColor,
                '" /><g transform="matrix(1,0,0,1,30,30)"><g>'
            )
        );
    string foot = "</g></g></svg>";
    uint16 sectorSize = 100;

}