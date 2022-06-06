// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

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
    mapping(uint256 => mapping(uint256 => OpenTicketModel.OpenTicket))
        private allTickets;
    mapping(uint256 => OpenTicketModel.AdmissionEvent) public events;

    using Validations for OpenTicketModel.AdmissionEvent;
    using Validations for OpenTicketModel.OpenTicket;
    using Validations for address;

    function initialize(string calldata uri) external initializer {
        __ERC1155_init(uri);
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        view
        override
        onlyOwner
    {}

    function create(string calldata uri, uint256 expiresOn)
        external
        override
        onlyOwner
    {
        events[eventCounter] = OpenTicketModel.NewAdmissionEvent(
            uri,
            expiresOn
        );
        emit eventCreated(msg.sender, eventCounter);
        eventCounter++;
    }

    function supply(
        uint256 ID,
        uint256 total,
        uint256 price
    ) external override onlyOwner {
        events[ID].isValid();
        _mint(msg.sender, ticketCounter, total, "0x00");
        allTickets[ID][ticketCounter] = OpenTicketModel.NewOpenTicket(
            total,
            price
        );
        emit eventTicketSupplied(msg.sender, ID, ticketCounter, total, price);
        ticketCounter++;
    }

    function buy(
        uint256 eventID,
        uint256 ticketID,
        uint256 amount
    ) external payable override {
        events[eventID].isValid();
        OpenTicketModel.OpenTicket storage ticket = allTickets[eventID][
            ticketID
        ];
        ticket.canBuy(amount);
        _safeTransferFrom(
            address(owner()),
            msg.sender,
            ticketID,
            amount,
            "0x00"
        );
        ticket.supply = ticket.supply - amount;
        emit ticketBought(msg.sender, eventID, ticketID, amount);
    }

    function withdraw() external payable override onlyOwner {
        address(this).canWithdraw();
        uint256 total = address(this).balance;
        (bool sent, ) = payable(msg.sender).call{value: total}("");
        require(sent, "OT: withdraw error");
        emit withdrawSuccessful(msg.sender, total);
    }
}
