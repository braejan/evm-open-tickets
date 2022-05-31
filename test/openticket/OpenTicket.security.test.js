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

    it("Only owner can create, supply and withdraw", async function() {   
        expect(proxy.connect(notOwner).create(deployer.address)).to.be.revertedWith(ownableMessage);
        expect(proxy.connect(notOwner).supply(deployer.address)).to.be.revertedWith(ownableMessage);
        expect(proxy.connect(notOwner).withdraw(deployer.address)).to.be.revertedWith(ownableMessage);
    });
});