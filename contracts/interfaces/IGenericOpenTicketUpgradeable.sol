// SPDX-License-Identifier: GLP-3.0

pragma solidity ^0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

/**
 * @title ICustomOpenTicket
 * @author https://github.com/braejan
 * @dev Interface for implementation of a custom OpenTicket
 * _Since v1.0.0_
 */
interface IGenericOpenTicketUpgradeable is IERC1155Upgradeable {

    struct eventInfo {
        uint256 price;
        uint256 supply;
        uint256 refundDiscount;
        bool refundAvailable;
        bool created;
    }

    /**
     * @dev Allows mint tickets
     * @param supply Amount of tickets to mint for a OpenTicket ID.
     * @param price Price of a individual OpenTicket ID.
     * @param refundDiscount Total to discount if allow refunds.
     * @return ID minted OpenTicket ID.
     */
    function mintNewTicket(
        uint256 supply,
        uint256 price,
        uint256 refundDiscount,
        bool refundAvailable
    ) external returns (uint256)
    ;

    /**
     * @dev Allows modify minted tickets
     * @param ID OpenTicket ID.
     * @param price Price to update for a OpenTicket ID.
     * @param refundDiscount Total to discount if allow refunds.
     */
    function modifyTicket(
        uint256 ID,
        uint256 price,
        uint256 refundDiscount,
        bool refundAvailable
    ) external
    ;

    /**
     * @dev allow check price for specific ID
     * @param ID OpenTicket ID
     * @return price Price for a OpenTicket ID.
     */
    function ticketPrice(uint256 ID)
        external
        view
        returns(uint256)
    ;
    /**
     * @dev ticketSupply allows to check current supply for a ID
     * @param ID OpenTicket ID
     * @return supply Total supply available for OpenTicket ID.
     */
    function ticketSupply(uint256 ID)
        external
        view
        returns(uint256)
    ;
    
    /**
     * @dev buyTicket allows to any buy a ticket with ticket ID
     * @param ID OpenTicket ID
     * @param amount Amount of tickets to buy
     */
    function buyTicket(uint256 ID, uint256 amount)
       external
       payable
    ;

    /**
     * @dev requestRefund allows to request a Refund if it's allowed
     * @param ID OpenTicket ID
     * @param amount Amount of tickets to refund
     */
    function requestRefund(
        uint256 ID,
        uint256 amount
    ) external;

    /**
     * withdraw allows transfer all OpenTicket contract balance.
     */
    function withdrawAll() external;

    /**
     * withdraw specific amount from OpenTicket contract
     */
    function withdraw(uint256 amount) external;

    /**
     * @dev Allows mint tickets
     * @param ID OpenTicket ID
     * @return exists Boolean indicating if OpenTicket ID exists
     */
    function exists(uint256 ID) external view returns(bool);
}

