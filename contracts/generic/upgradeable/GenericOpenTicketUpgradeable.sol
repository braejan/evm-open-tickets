// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../../interfaces/IGenericOpenTicketUpgradeable.sol";

/**
 * @title GenericOpenTicketUpgradeable
 * @author https://github.com/braejan
 * @dev Contract implementation of a custom OpenTicket upgradeable
 * _Since v1.0.0_
 */
contract GenericOpenTicketUpgradeable is
    IGenericOpenTicketUpgradeable,
    OwnableUpgradeable,
    ERC1155Upgradeable,
    UUPSUpgradeable
{
    uint256 index = 0;
    mapping(uint256 => IGenericOpenTicketUpgradeable.eventInfo) public events;

    function initialize(string memory uri_) external initializer {
        __ERC1155_init(uri_);
        __Ownable_init_unchained();
        __UUPSUpgradeable_init();
    }

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
        validateEnoughTicktes(ID, amount)
    {
        require(events[ID].refundAvailable, "Not refunds available for this Ticket");
        uint256 valueToSend = (events[ID].price - events[ID].refundDiscount) * amount;
        bool sent = payable(msg.sender).send(valueToSend);
        require(sent, "Refund transaction finish with error.");
    }

    //UUPS override implementation
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function withdrawAll() external override onlyOwner hasBalance {
        bool sent = payable(owner()).send(address(this).balance);
        require(sent, "withdraw transaction finish with error");
    }

    function withdraw(uint256 amount)
        external
        override
        onlyOwner
        hasEnoughBalance(amount)
    {
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
        require(existsID(ID), "There is not event for that Ticket.");
        require(msg.value > 0, "Zero value not allowed.");
        require(msg.value >= amount * events[ID].price, "Not enough balance to buy this amount");
        _;
    }

    modifier validateEnoughSupply(uint256 ID, uint256 amount) {
        require(existsID(ID), "There is not event for that Ticket.");
        require(amount > 0, "Zero amount not allowed.");
        require(events[ID].supply >= amount, "Not enough supply for this Ticket.");
        _;
    }

    modifier validateEnoughTicktes(uint256 ID, uint256 amount) {
        require(existsID(ID), "There is not event for that Ticket.");
        require(amount > 0, "Zero amount not allowed.");
        require(balanceOf(msg.sender, ID) >= amount, "Address doesn't have enough ticktes.");
        _;
    }

    modifier validateRefundDiscount(uint256 price, uint256 refundDiscount) {
        require(refundDiscount <= price, "Refund discount value too long.");
        _;
    }

    modifier hasBalance {
        require(address(this).balance > 0, "Not enough balance to withdraw. balance is 0.");
        _;
    }

    modifier hasEnoughBalance(uint256 amount) {
        require(address(this).balance > amount, "Not enough balance to withdraw.");
        _;
    }

    function existsID(uint256 ID) private view returns(bool){
        return events[ID].created;
    }    
}