
## Open Ticket for Ethereum Virtual Machine

**A Smart contract based on Ethereum Virtual Machine** for easy create custom events and sell tickets totally configurable.
 * Deploy one time, create events and its tickets as you can pay.
 * Mint tickets supply with custom unit price.
 * You can create you own custom Smart Contract with tickets for admission to any event easy and faster making use OpenTicket or making your own implementation of Open Ticket standar interfaces.
 * OpenTicket is a [UUPS](https://eips.ethereum.org/EIPS/eip-1822) smart contract.
 * All tickets created has compliant with OpenZeppelin [ERC1155](https://docs.openzeppelin.com/contracts/3.x/erc1155) token implementation.
 * Ownable OpenZeppelin implementation [ownership and ownable](https://docs.openzeppelin.com/contracts/4.x/access-control#ownership-and-ownable) scheme.

 ## Overview

### Running tests
 * Be sure you have [npm](https://www.npmjs.com/package/npm) installed.

#### Run tests
```console
$ npm install --save-dev
$ npx hardhat test
```
#### Run tests with coverage
```console
$ npm install --save-dev
$ npx hardhat coverage --testfiles "tests/*.test.js"
```

## License

OpenTickets for ethereum virtual machine is released under the [GLP-3.0](LICENSE) License.