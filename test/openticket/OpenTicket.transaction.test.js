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
        const expiresOn = 1656628436;
        await expect(proxy.create(eventUri, ethers.BigNumber.from(expiresOn))).not.to.be.reverted;
        const eventCreated = await proxy.events(0);
        expect(eventUri).to.be.equal(eventCreated[0]);
        expect(expiresOn).to.be.equal(eventCreated[1]);
        expect(eventCreated[2]).to.be.true;
    });
});