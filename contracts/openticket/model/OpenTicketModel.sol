// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

library OpenTicketModel {
    struct OpenTicket {
        uint256 supply;
        uint256 unitPrice;
        bool minted;
    }

    struct AdmissionEvent {
        string eventURI;
        uint256 expireOn;
        bool created;
    }

    function NewAdmissionEvent(string memory uri_, uint256 expireOn)
        internal
        pure
        returns (AdmissionEvent memory)
    {
        return AdmissionEvent(uri_, expireOn, true);
    }

    function NewOpenTicket(uint256 supply, uint256 unitPrice)
        internal
        pure
        returns (OpenTicket memory)
    {
        return OpenTicket(supply, unitPrice, true);
    }
}
