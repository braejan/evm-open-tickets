// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import "../model/OpenTicketModel.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

/**
 * @title IOT001Standar
 * @author https://github.com/braejan
 * @dev IOT001 (Iterface Open Ticket v1) definition
 * _Since v1.0.0_
 */
interface IOT001Standar is IERC1155Upgradeable {
    /**
     * @dev create Allows to create a new empty admission event with
     *      specific event uri and a unix epoch until this event will be valid.
     * @param uri_ Event url or uri.
     * @param expiresOn Unix date on wich the admission event expires.
     */
    function create(string memory uri_, uint256 expiresOn) external;

    /**
     * @dev Emmited when owner create a new admission event.
     */
    event eventCreated(address creator, uint256 eventID);

    /**
     * @dev supply Allows to create a tickets supply specific event
     *      already created.
     * @param ID Admission Event Identifier.
     * @param total Total tickets supply of kind of ticket.
     * @param price Unit ticket price.
     */
    function supply(
        uint256 ID,
        uint256 total,
        uint256 price
    ) external;

    /**
     * @dev Emmited when owner supply new tickets for an admission event ID.
     */
    event eventTicketSupplied(
        address creator,
        uint256 eventID,
        uint256 ticketID,
        uint256 supply,
        uint256 price
    );

    /**
     * @dev buy Allows to buy for specific admission event tickets.
     * @param eventID Admission Event Identifier.
     * @param ticketID OpenTicket ID identifier.
     * @param amount Unit amount to buy.
     */
    function buy(
        uint256 eventID,
        uint256 ticketID,
        uint256 amount
    ) external payable;

    /**
     * @dev Emmited when a ticket is bought
     */
    event ticketBought(
        address user,
        uint256 eventID,
        uint256 ticketID,
        uint256 amount
    );

    /**
     * @dev withdraw Allows withdraw all balance.
     */
    function withdraw() external payable;

    /**
     * @dev Emmited when owner withdraw from contract.
     */
    event withdrawSuccessful(address destination, uint256 value);
}
