const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
describe("Upgradeable Open Ticket tests: Deploy and Mint", function () {
    let availableSigners;
    let deployer;
    let proxy;
    let OpenTicket;
    const uri_ = "https://github.com/braejan/evm-open-tickets/{id}";

    before(async function () {
        availableSigners = await ethers.getSigners();
        deployer = availableSigners[0];
        OpenTicket = await ethers.getContractFactory("OpenTicket");
        proxy = await upgrades.deployProxy(OpenTicket, [uri_], { kind: 'uups' });
        await proxy.deployed();
    });

    it("Owner should equal to deployer", async function () {
        const proxyOwner = await proxy.owner();
        expect(deployer.address).to.be.equal(proxyOwner);
    });

    it("Uri should equal to " + uri_, async function () {
        const uriProxy = await proxy.uri(0);
        expect(uri_).to.be.equal(uriProxy);
    })
});