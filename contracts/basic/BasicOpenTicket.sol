// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IBasicOpenTicket.sol";

/**
 * @title OpenTicket
 * @author https://github.com/braejan
 * @dev Contract implementation of a basic OpenTicket
 * _Since v1.0.0_
 */
contract BasicOpenTicket is IBasicOpenTicket, ERC1155, Ownable {
    uint256[] public ALLOWED_TICKETS= [NORMAL_TICKET, VIP_TICKET, PREMIUM_TICKET];
    uint256 NORMAL_TICKET = 0;
    uint256 VIP_TICKET = 1;
    uint256 PREMIUM_TICKET = 2;
    uint256[] TICKETS_PRICE = [0 wei, 0 wei, 0 wei];
    uint256[] TICKETS_SUPPLY = [0, 0, 0];
    constructor(string memory uri_) ERC1155(uri_) {}

    function mintTickets(
        uint256 ID,
        uint256 supply,
        uint256 price
    ) external override onlyOwner notInit(ID) {
        TICKETS_SUPPLY[ID] = supply;
        TICKETS_PRICE[ID] = price;
        _mint(msg.sender, ID, supply, "0x000");
    }

    function ticketPrice(uint256 ID)
        external
        view
        override
        notAllowedID(ID)
        returns(uint256)
    {
     return TICKETS_PRICE[ID];   
    }

    function ticketSupply(uint256 ID)
        external
        view
        override
        notAllowedID(ID)
        returns(uint256)
    {
        return TICKETS_SUPPLY[ID];   
    }

    function buyTicket(uint256 ID, uint256 amount) 
       external
       payable
       override
       notEnoughSupply(ID, amount)
       notEnoughEthers(ID, amount)
    {
        _safeTransferFrom(address(owner()), msg.sender, ID, amount, "0x00");
        TICKETS_SUPPLY[ID] =  TICKETS_SUPPLY[ID] - amount;
    }

    function withdraw() external override onlyOwner hasBalance {
        payable(owner()).transfer(address(this).balance);
    }

    modifier notInit(uint256 ID) {
        require(isAllowedID(ID), "ID not allowed");
        require(TICKETS_SUPPLY[ID] == 0, "you already minted tickets for this ID");
        _;
    }

    modifier notAllowedID(uint256 ID) {
        require(isAllowedID(ID), "ID not allowed");
        _;
    }

    modifier notEnoughEthers(uint256 ID, uint256 amount) {
        require(isAllowedID(ID), "ID not allowed");
        require(msg.value >= amount * TICKETS_PRICE[ID], "not enough balance to buy this amount");
        _;
    }

    modifier notEnoughSupply(uint256 ID, uint256 amount) {
        require(isAllowedID(ID), "ID not allowed");
        require(TICKETS_SUPPLY[ID] >= amount, "not enough supply for sent ID");
        _;
    }

    modifier hasBalance {
        require(address(this).balance > 0, "not enough balance. balance is 0");
        _;
    }

    function isAllowedID(uint256 ID) private view returns(bool){
        return ID >= 0 && ID <= ALLOWED_TICKETS.length;
    }
}