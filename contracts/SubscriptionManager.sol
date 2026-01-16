// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract SubscriptionManager {
    event Subscribed(address indexed user, address indexed creator, uint256 planId, uint256 amount, uint256 expiresAt);
    event Renewed(address indexed user, address indexed creator, uint256 planId, uint256 amount, uint256 expiresAt);
    event Cancelled(address indexed user, address indexed creator, uint256 planId);

    struct Plan {
        uint256 price;       // wei per period
        uint256 period;      // seconds per period (e.g., 30 days)
        bool active;
    }

    struct Sub {
        uint256 expiresAt;
    }

    address public owner;
    mapping(address => mapping(uint256 => Plan)) public plans;             // creator => planId => Plan
    mapping(address => mapping(address => mapping(uint256 => Sub))) public subs; // user => creator => planId => Sub

    error NotOwner();
    error InactivePlan();
    error InvalidPayment();
    error TransferFailed();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setPlan(address creator, uint256 planId, uint256 price, uint256 period, bool active) external {
        // creators manage their own plans; owner can also manage
        if (msg.sender != creator && msg.sender != owner) revert NotOwner();
        plans[creator][planId] = Plan(price, period, active);
    }

    function subscribe(address creator, uint256 planId) external payable {
        Plan memory p = plans[creator][planId];
        if (!p.active) revert InactivePlan();
        if (msg.value != p.price) revert InvalidPayment();

        uint256 newExpiry = block.timestamp + p.period;
        subs[msg.sender][creator][planId].expiresAt = newExpiry;

        (bool ok, ) = creator.call{value: msg.value}("");
        if (!ok) revert TransferFailed();

        emit Subscribed(msg.sender, creator, planId, msg.value, newExpiry);
    }

    function renew(address creator, uint256 planId) external payable {
        Plan memory p = plans[creator][planId];
        if (!p.active) revert InactivePlan();
        if (msg.value != p.price) revert InvalidPayment();

        uint256 current = subs[msg.sender][creator][planId].expiresAt;
        uint256 baseTime = block.timestamp > current ? block.timestamp : current;
        uint256 newExpiry = baseTime + p.period;
        subs[msg.sender][creator][planId].expiresAt = newExpiry;

        (bool ok, ) = creator.call{value: msg.value}("");
        if (!ok) revert TransferFailed();

        emit Renewed(msg.sender, creator, planId, msg.value, newExpiry);
    }

    function cancel(address creator, uint256 planId) external {
        delete subs[msg.sender][creator][planId];
        emit Cancelled(msg.sender, creator, planId);
    }

    function isActive(address user, address creator, uint256 planId) external view returns (bool) {
        return subs[user][creator][planId].expiresAt >= block.timestamp;
    }
}
