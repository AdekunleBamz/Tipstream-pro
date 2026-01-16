// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TipNFT is ERC721, Ownable {
    event ReceiptMinted(address indexed to, uint256 indexed tokenId, uint256 amount, string note);
    event BaseURIUpdated(string oldBase, string newBase);
    event MinterUpdated(address indexed oldMinter, address indexed newMinter);

    uint256 public nextId = 1;
    string private baseTokenURI;
    address public minter; // TipStream contract address

    error NotMinter();

    modifier onlyMinter() {
        if (msg.sender != minter && msg.sender != owner()) revert NotMinter();
        _;
    }

    constructor(string memory baseURI_, address initialOwner, address _minter)
        ERC721("TipStream Receipt", "TIPR")
        Ownable(initialOwner)
    {
        baseTokenURI = baseURI_;
        minter = _minter;
    }

    function setMinter(address newMinter) external onlyOwner {
        emit MinterUpdated(minter, newMinter);
        minter = newMinter;
    }

    function setBaseURI(string calldata newBase) external onlyOwner {
        emit BaseURIUpdated(baseTokenURI, newBase);
        baseTokenURI = newBase;
    }

    function mintReceipt(address to, uint256 amount, string calldata note) external onlyMinter returns (uint256) {
        uint256 tokenId = nextId++;
        _safeMint(to, tokenId);
        emit ReceiptMinted(to, tokenId, amount, note);
        return tokenId;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
}
