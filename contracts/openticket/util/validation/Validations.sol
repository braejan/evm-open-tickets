//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.14;

import "../../model/OpenTicketModel.sol";

library Validations {
    function isValid(OpenTicketModel.AdmissionEvent memory admissionEvent)
        internal
        pure
        validEvent(admissionEvent)
    {}

    function canBuy(OpenTicketModel.OpenTicket memory ticket, uint256 amount)
        internal
        validTicket(ticket)
        hasEnoughMoney(ticket, amount)
        hasEnoughSupply(ticket, amount)
    {}

    function canWithdraw(address account) internal view hasBalance(account) {}

    modifier validTicket(OpenTicketModel.OpenTicket memory ticket) {
        require(ticket.minted, "OT: ticket not minted");
        _;
    }

    modifier hasEnoughMoney(
        OpenTicketModel.OpenTicket memory ticket,
        uint256 amount
    ) {
        require(
            msg.value >= (ticket.unitPrice * amount),
            "OT: not enough money"
        );
        _;
    }

    modifier validEvent(OpenTicketModel.AdmissionEvent memory admissionEvent) {
        require(admissionEvent.created, "OT: invalid event");
        _;
    }

    modifier hasEnoughSupply(
        OpenTicketModel.OpenTicket memory ticket,
        uint256 amount
    ) {
        require(amount <= ticket.supply, "OT: not enough supply");
        _;
    }

    modifier hasBalance(address account) {
        require(account.balance > 0, "OT: account doesn't has balance");
        _;
    }
}
