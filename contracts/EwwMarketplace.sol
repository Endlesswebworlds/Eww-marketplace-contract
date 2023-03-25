// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EwwMarketplace is ERC721, Ownable {
    struct Pack {
        string name;
        string description;
        string image;
        string owner;
        uint256 price;
        string assets;
        string codes;
    }

    Pack[] public packs;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(
        string memory _name,
        string memory _description,
        string memory _image,
        string memory _owner,
        uint256 _price,
        string memory _assets,
        string memory _codes
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_image).length > 0, "Image URL cannot be empty");
        require(bytes(_owner).length > 0, "Owner cannot be empty");
        require(_price > 0, "Price must be greater than zero");

        Pack memory newPack = Pack({
            name: _name,
            description: _description,
            image: _image,
            owner: _owner,
            price: _price,
            assets: _assets,
            codes: _codes
        });
        packs.push(newPack);
        uint256 tokenId = packs.length - 1;
        _mint(msg.sender, tokenId);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return packs[tokenId].image;
    }

    function deletePack(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Pack does not exist");
        _burn(tokenId);
    }

    function getAllPacks() public view returns (Pack[] memory) {
        return packs;
    }
}
