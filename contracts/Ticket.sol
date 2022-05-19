// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ticket is
    ERC777,
    Ownable
{
    constructor(
        uint256 initialSupply,
        address[] memory defaultOperators,
        string memory eventName,
        string memory symbol,
        string memory userData,
        string memory operatorData
    ) ERC777(eventName, symbol, defaultOperators)
    {
        _mint(msg.sender, initialSupply, bytes(userData) , bytes(operatorData));
    }
}