
**A Smart contract based on Ethereum Virtual Machine** for easy create custom events and sell tickets for 3 differents categories.

 * 3 kinds of tickets: Normal, VIP and Premium with the OpenZeppelin [ERC1155](https://docs.openzeppelin.com/contracts/3.x/erc1155) token implementation.
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