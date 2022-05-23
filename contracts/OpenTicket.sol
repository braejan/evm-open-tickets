// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OpenTicket is ERC1155, Ownable {
    uint256 public constant TICKET = 0;

    constructor(uint256 totalSupply, string memory uri_) ERC1155(uri_) 
    {
        mintTickets(totalSupply);
    }

    function mintTickets(uint256 supply) public notInit(TICKET) {
        _mint(msg.sender, TICKET, supply, "0x000");
    }

    modifier notInit(uint256 ID){
        require(balanceOf(msg.sender, ID) == 0, "you already minted tickets");
        _;
    }
}