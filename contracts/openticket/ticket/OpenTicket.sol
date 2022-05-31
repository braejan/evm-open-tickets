// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

import "../interfaces/IOT001Standar.sol";
import "../model/OpenTicketModel.sol";
import "../util/validation/Validations.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract OpenTicket is 
    ERC1155Upgradeable,
    IOT001Standar,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    uint256 private eventCounter;
    uint256 private ticketCounter;
    mapping(uint256 => mapping(uint256 => OpenTicketModel.OpenTicket)) private allTickets;
    mapping(uint256 => OpenTicketModel.AdmissionEvent) public events;

    using Validations for OpenTicketModel.AdmissionEvent;
    using Validations for OpenTicketModel.OpenTicket;
    using Validations for address;

    function initialize(string memory uri_) external initializer {
        __ERC1155_init(uri_);
        __Ownable_init();
        __UUPSUpgradeable_init();
    }
    function _authorizeUpgrade(address newImplementation) override internal view onlyOwner {}

    function create(string memory uri_, uint256 expiresOn) override external onlyOwner {
        events[eventCounter] = OpenTicketModel.NewAdmissionEvent(uri_, expiresOn);
        //TODO: emit event created
        eventCounter++;
    }

    function supply(uint256 ID, uint256 total, uint256 price)
        override external onlyOwner 
    {
        events[ID].isValid();
        _mint(msg.sender, ticketCounter, total, "0x00");
        allTickets[ID][ticketCounter] = OpenTicketModel.NewOpenTicket(total, price);
        //TODO: emit supply ticket created
        ticketCounter++; 
    }

    function buy(uint256 eventID, uint256 ticketID, uint256 amount) override external payable {
        events[eventID].isValid();
        allTickets[eventID][ticketID].canBuy(amount);
        _safeTransferFrom(address(owner()), msg.sender, ticketID, amount, "0x00");
        allTickets[eventID][ticketID].supply = allTickets[eventID][ticketID].supply - amount;
    }

    function withdraw() override external payable onlyOwner{
        address(this).canWithdraw();
    }
}
