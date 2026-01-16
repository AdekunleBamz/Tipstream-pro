// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract DailyCheckIn {
    event CheckedIn(address indexed user, uint256 day, uint256 streak);

    mapping(address => uint256) public lastCheckIn; // day number
    mapping(address => uint256) public streak;

    function _day() internal view returns (uint256) {
        return block.timestamp / 1 days;
    }

    function checkIn() external {
        uint256 today = _day();
        uint256 last = lastCheckIn[msg.sender];

        if (last == today) {
            revert("Already checked in");
        }

        if (last + 1 == today) {
            streak[msg.sender] += 1;
        } else {
            streak[msg.sender] = 1;
        }

        lastCheckIn[msg.sender] = today;
        emit CheckedIn(msg.sender, today, streak[msg.sender]);
    }

    function getStreak(address user) external view returns (uint256) {
        return streak[user];
    }
}
