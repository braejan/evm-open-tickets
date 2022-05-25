// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";


/**
 * @title IBasicOpenTicket
 * @author https://github.com/braejan
 * @dev Interface for implementation of a basic OpenTicket
 * _Since v1.0.0_
 */
interface IBasicOpenTicket is IERC1155 {
    /**
     * @dev Allows mint tickets
     * @param ID OpenTicket ID
     * @param supply Amount of tickets to mint for a OpenTicket ID.
     * @param price Wei price of a individual OpenTicket ID.
     */
    function mintTickets(
        uint256 ID,
        uint256 supply,
        uint256 price
    ) external
    ;

    /**
     * @dev allow check price in wei for specific ID
     * @param ID OpenTicket ID
     * @return price Wei price for a OpenTicket ID.
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
     * withdraw allows transfer OpenTicket contract balance.
     */
    function withdraw() external;
}