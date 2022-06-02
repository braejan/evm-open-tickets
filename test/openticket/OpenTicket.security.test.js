const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
describe("Upgradeable Open Ticket tests: Security", function () {
    let availableSigners;
    let deployer;
    let notOwner;
    let proxy;
    let OpenTicket;
    const ownableMessage = 'Ownable: caller is not the owner';
    const uri_ = "https://github.com/braejan/evm-open-tickets/{id}";

    before(async function () {
        availableSigners = await ethers.getSigners();
        deployer = availableSigners[0];
        notOwner = availableSigners[1];
        OpenTicket = await ethers.getContractFactory("OpenTicket");
        proxy = await upgrades.deployProxy(OpenTicket, [uri_], { kind: 'uups' });
        await proxy.deployed();
        const eventUri = "https://myamazingevent/"
        const expiresOn = ethers.BigNumber.from(1656628436);
        await proxy.create(eventUri, ethers.BigNumber.from(expiresOn));
        const eventID = 0;
        const totalSupply = ethers.BigNumber.from(10);
        const unitPrice = ethers.utils.parseEther("0.005");
        await proxy.supply(eventID, totalSupply, unitPrice);
    });

    it("Only owner can create, supply and withdraw", async function () {
        expect(proxy.connect(notOwner).create(deployer.address)).to.be.revertedWith(ownableMessage);
        expect(proxy.connect(notOwner).supply(deployer.address)).to.be.revertedWith(ownableMessage);
        expect(proxy.connect(notOwner).withdraw(deployer.address)).to.be.revertedWith(ownableMessage);
    });

    it("Validate no valid event ID", async function () {
        let eventID, ticketID, amount;
        eventID = ethers.BigNumber.from(999999);
        ticketID = ethers.BigNumber.from(0);
        amount = ethers.BigNumber.from(11);
        await expect(proxy.connect(notOwner).buy(
            eventID,
            ticketID,
            amount,
            { value: ethers.utils.parseEther("0") }
        )).to.be.revertedWith('OT: invalid event');
    });

    it("Validate no valid ticket ID", async function () {
        let eventID, ticketID, amount;
        eventID = ethers.BigNumber.from(0);
        ticketID = ethers.BigNumber.from(9999);
        amount = ethers.BigNumber.from(11);
        await expect(proxy.connect(notOwner).buy(
            eventID,
            ticketID,
            amount,
            { value: ethers.utils.parseEther("0") }
        )).to.be.revertedWith('OT: ticket not minted');
    });

    it("Validate not enough money", async function () {
        let eventID, ticketID, amount;
        eventID = ethers.BigNumber.from(0);
        ticketID = ethers.BigNumber.from(0);
        amount = ethers.BigNumber.from(11);
        await expect(proxy.connect(notOwner).buy(
            eventID,
            ticketID,
            amount,
            { value: ethers.utils.parseEther("0") }
        )).to.be.revertedWith('OT: not enough money');
    });

    it("Validate not enough supply", async function () {
        let eventID, ticketID, amount;
        eventID = ethers.BigNumber.from(0);
        ticketID = ethers.BigNumber.from(0);
        amount = ethers.BigNumber.from(11);
        await expect(proxy.connect(notOwner).buy(
            eventID,
            ticketID,
            amount,
            { value: ethers.utils.parseEther("1.0") }
        )).to.be.revertedWith('OT: not enough supply');
    });

    it("Validate not enough balance", async function () {
        let eventID, ticketID, amount;
        eventID = ethers.BigNumber.from(0);
        ticketID = ethers.BigNumber.from(0);
        amount = ethers.BigNumber.from(11);
        await expect(proxy.withdraw()).to.be.revertedWith('OT: account doesn\'t has balance');
    });
});