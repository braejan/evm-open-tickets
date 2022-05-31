const{ expect } = require("chai");
const{ ethers, upgrades} = require("hardhat");
describe("Upgradeable Open Ticket tests: Security", function() {
    let availableSigners;
    let deployer;
    let notOwner;
    let proxy;
    let OpenTicket;
    const ownableMessage = 'Ownable: caller is not the owner';
    const uri_ = "https://github.com/braejan/evm-open-tickets/{id}";

    before( async function() {
        availableSigners = await ethers.getSigners();
        deployer = availableSigners[0];
        notOwner = availableSigners[1]; 
        OpenTicket = await ethers.getContractFactory("OpenTicket");
        proxy = await upgrades.deployProxy(OpenTicket, [uri_], { kind: 'uups' });
        await proxy.deployed();
    });

    it("Create a new event", async function() {
        const eventUri = "https://myamazingevent/"
        const expiresOn = ethers.BigNumber.from(1656628436);
        await expect(proxy.create(eventUri, ethers.BigNumber.from(expiresOn))).not.to.be.reverted;
        const eventCreated = await proxy.events(0);
        expect(eventUri).to.be.equal(eventCreated[0]);
        expect(expiresOn).to.be.equal(eventCreated[1]);
        expect(eventCreated[2]).to.be.true;
    });

    it("Should supply 1 kind of tickets", async function() {
       const eventID = 0;
       const ticketID = 0;
       const totalSupply = ethers.BigNumber.from(10);
       const unitPrice = ethers.utils.parseEther("0.005");
       await expect(proxy.supply(eventID, totalSupply, unitPrice)).not.to.be.reverted;
       const totalOwner = await proxy.balanceOf(deployer.address, ticketID);
       expect(totalSupply).to.be.equal(totalOwner);
    })

    it("Should allow to a notOwner to buy", async function() {
        const eventID = 0;
        const ticketID = 0;
        const expectedBalance = ethers.BigNumber.from(5);
        const money = ethers.utils.parseEther("0.005").mul(expectedBalance);
        await proxy.connect(notOwner).buy(eventID, ticketID, 5, {value: money});
        const totalOwner = await proxy.balanceOf(deployer.address, ticketID);
        const totalNotOwner = await proxy.connect(notOwner).balanceOf(deployer.address, ticketID);
        expect(expectedBalance).to.be.equal(totalOwner);
        expect(expectedBalance).to.be.equal(totalNotOwner);
     })
});