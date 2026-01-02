// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface ITipNFT {
    function mintReceipt(address to, uint256 amount, string calldata note) external;
}

contract TipStream {
    event Tip(address indexed from, address indexed to, uint256 amount, uint256 fee, string note);
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    address public owner;
    address public treasury;
    uint256 public fee; // flat fee in wei per tip (e.g., 100000000000000 wei = 0.0001 ETH)
    ITipNFT public tipNft;

    error NotOwner();
    error InvalidAmount();
    error TransferFailed();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address _treasury, uint256 _fee, address _tipNft) {
        owner = msg.sender;
        treasury = _treasury;
        fee = _fee;
        tipNft = ITipNFT(_tipNft);
    }

    function setFee(uint256 newFee) external onlyOwner {
        emit FeeUpdated(fee, newFee);
        fee = newFee;
    }

    function setTreasury(address newTreasury) external onlyOwner {
        emit TreasuryUpdated(treasury, newTreasury);
        treasury = newTreasury;
    }

    function setTipNft(address _tipNft) external onlyOwner {
        tipNft = ITipNFT(_tipNft);
    }

    function tip(address creator, string calldata note, bool mintReceipt) external payable {
        if (msg.value <= fee) revert InvalidAmount();

        uint256 feeAmount = fee;
        uint256 toCreator = msg.value - feeAmount;

        (bool ok1, ) = treasury.call{value: feeAmount}("");
        if (!ok1) revert TransferFailed();

        (bool ok2, ) = creator.call{value: toCreator}("");
        if (!ok2) revert TransferFailed();

        if (mintReceipt && address(tipNft) != address(0)) {
            tipNft.mintReceipt(msg.sender, toCreator, note);
        }

        emit Tip(msg.sender, creator, toCreator, feeAmount, note);
    }

    receive() external payable {}
}
