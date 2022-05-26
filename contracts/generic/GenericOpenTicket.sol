// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

import "../interfaces/IGenericOpenTicket.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 * @title CustomOpenTicket
 * @author https://github.com/braejan
 * @dev Contract implementation of a custom OpenTicket
 * _Since v1.0.0_
 */
contract GenericOpenTicket is IGenericOpenTicket, Ownable, ERC1155 {
    uint256 index = 0;
    mapping(uint256 => IGenericOpenTicket.eventInfo) public events;

    constructor(string memory uri_) ERC1155(uri_) {}

    function mintNewTicket(
        uint256 supply,
        uint256 price,
        uint256 refundDiscount,
        bool refundAvailable
    )
        external
        override
        onlyOwner
        validateRefundDiscount(price,refundDiscount)
        returns (uint256)
    {
        
        _mint(msg.sender, index, supply, "0x00");
        //If mint correctly create event info
        events[index] = eventInfo(price, supply, refundDiscount, refundAvailable, true);
        index++;
        return (index - 1);
    }

    function modifyTicket(
        uint256 ID,
        uint256 price,
        uint256 refundDiscount,
        bool refundAvailable
    )
        external
        override
        onlyOwner
        validateID(ID)
        validateRefundDiscount(price,refundDiscount)
    {
        events[ID].price = price;
        events[ID].refundDiscount = refundDiscount;
        events[ID].refundAvailable = refundAvailable;
    }

    function ticketPrice(uint256 ID)
        external
        view
        override
        validateID(ID)
        returns(uint256)
    {
        return events[ID].price;
    }

    function ticketSupply(uint256 ID)
        external
        view
        override
        validateID(ID)
        returns(uint256)
    {
        return events[ID].supply;
    }

    function buyTicket(uint256 ID, uint256 amount)
       external
       payable
       override
       validateEnoughEthers(ID,amount)
       validateEnoughSupply(ID,amount)
    {
        _safeTransferFrom(address(owner()), msg.sender, ID, amount, "0x00");
        events[ID].supply =  events[ID].supply - amount;
    }

    function requestRefund(
        uint256 ID,
        uint256 amount
    )
        external
        override
        onlyOwner
        validateEnoughTicktes(ID, amount)
    {
        require(events[ID].refundAvailable, "Not refunds available for this Ticket");
        uint256 valueToSend = (events[ID].price - events[ID].refundDiscount) * amount;
        bool sent = payable(msg.sender).send(valueToSend);
        require(sent, "Refund transaction finish with error.");
    }

    function withdrawAll() external override onlyOwner hasBalance {
        bool sent = payable(owner()).send(address(this).balance);
        require(sent, "withdraw transaction finish with error");
    }

    function withdraw(uint256 amount)
        external
        override
        onlyOwner
        hasEnoughBalance(amount) {
        bool sent = payable(owner()).send(address(this).balance);
        require(sent, "withdraw transaction finish with error");
    }

    function exists(uint256 ID) external override view returns(bool) {
       return existsID(ID); 
    }

    modifier validateID(uint256 ID) {
        require(existsID(ID), "There is not event for that Ticket.");
        _;
    }

    modifier validateEnoughEthers(uint256 ID, uint256 amount) {
        require(existsID(ID), "ID not allowed");
        require(amount > 0, "Zero amount not allowed.");
        require(msg.value >= amount * events[ID].price, "Not enough balance to buy this amount");
        _;
    }

    modifier validateEnoughSupply(uint256 ID, uint256 amount) {
        require(existsID(ID), "ID not allowed");
        require(amount > 0, "Zero amount not allowed.");
        require(events[ID].supply >= amount, "Not enough supply for sent Ticket");
        _;
    }

    modifier validateEnoughTicktes(uint256 ID, uint256 amount) {
        require(existsID(ID), "ID not allowed");
        require(amount > 0, "Zero amount not allowed.");
        require(balanceOf(msg.sender, ID) >= amount, "Address doesn't have enough ticktes");
        _;
    }

    modifier validateRefundDiscount(uint256 price, uint256 refundDiscount) {
        require(refundDiscount <= price, "Refund discount value too long.");
        _;
    }

    modifier hasBalance {
        require(address(this).balance > 0, "not enough balance. balance is 0");
        _;
    }

    modifier hasEnoughBalance(uint256 amount) {
        require(address(this).balance > amount, "not enough balance.");
        _;
    }

    function existsID(uint256 ID) private view returns(bool){
        return events[ID].created;
    }    
}