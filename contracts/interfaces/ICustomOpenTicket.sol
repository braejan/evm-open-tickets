// SPDX-License-Identifier: GLP-3.0

pragma solidity ^0.8.14;

import "./IBasicOpenTicket.sol";

/**
 * @title ICustomOpenTicket
 * @author https://github.com/braejan
 * @dev Interface for implementation of a custom OpenTicket
 * _Since v1.0.0_
 */
interface ICustomOpenTicket is IBasicOpenTicket {

    /**
     * @dev Allows mint tickets
     * @param ID OpenTicket ID
     * @return exists Boolean indicating if OpenTicket ID exists
     */
    function exists(uint256 ID) external returns(bool);
}

