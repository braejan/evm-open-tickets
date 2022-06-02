const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
describe("Upgradeable Open Ticket tests: Buy and withdraw", function () {
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
   });

   it("Create a new event", async function () {
      const eventUri = "https://myamazingevent/"
      const expiresOn = ethers.BigNumber.from(1656628436);
      await expect(proxy.create(eventUri, ethers.BigNumber.from(expiresOn))).not.to.be.reverted;
      const eventCreated = await proxy.events(0);
      expect(eventUri).to.be.equal(eventCreated[0]);
      expect(expiresOn).to.be.equal(eventCreated[1]);
      expect(eventCreated[2]).to.be.true;
   });

   it("Should supply first kind of tickets", async function () {
      const eventID = 0;
      const ticketID = 0;
      const totalSupply = ethers.BigNumber.from(10);
      const unitPrice = ethers.utils.parseEther("0.005");
      await expect(proxy.supply(eventID, totalSupply, unitPrice)).not.to.be.reverted;
      const totalOwner = await proxy.balanceOf(deployer.address, ticketID);
      expect(totalSupply).to.be.equal(totalOwner);
   })

   it("Should allow to a notOwner to buy", async function () {
      const eventID = 0;
      const ticketID = 0;
      const expectedBalance = ethers.BigNumber.from(5);
      const money = ethers.utils.parseEther("0.005").mul(expectedBalance);
      await proxy.connect(notOwner).buy(eventID, ticketID, 5, { value: money });
      const totalOwner = await proxy.balanceOf(deployer.address, ticketID);
      const totalNotOwner = await proxy.connect(notOwner).balanceOf(deployer.address, ticketID);
      expect(expectedBalance).to.be.equal(totalOwner);
      expect(expectedBalance).to.be.equal(totalNotOwner);
   })

   it("Should supply second kind of tickets", async function () {
      const eventID = 0;
      const ticketID = 1;
      const totalSupply = ethers.BigNumber.from(8);
      const unitPrice = ethers.utils.parseEther("0.0055");
      await expect(proxy.supply(eventID, totalSupply, unitPrice)).not.to.be.reverted;
      const totalOwner = await proxy.balanceOf(deployer.address, ticketID);
      expect(totalSupply).to.be.equal(totalOwner);
   })

   it("Should supply third kind of tickets", async function () {
      const eventID = 0;
      const ticketID = 2;
      const totalSupply = ethers.BigNumber.from(4);
      const unitPrice = ethers.utils.parseEther("0.006");
      await expect(proxy.supply(eventID, totalSupply, unitPrice)).not.to.be.reverted;
      const totalOwner = await proxy.balanceOf(deployer.address, ticketID);
      expect(totalSupply).to.be.equal(totalOwner);
   })

   it("Should own the unpurchased tickets", async function () {
      // (0,5)(1,8)(2,4) 
      let total = await proxy.balanceOf(deployer.address, 0);
      expect(5).to.be.equal(total);
      total = await proxy.balanceOf(deployer.address, 1);
      expect(8).to.be.equal(total);
      total = await proxy.balanceOf(deployer.address, 2);
      expect(4).to.be.equal(total);
   })

   it("Should can withdraw.", async function () {
      const balance = await proxy.provider.getBalance(deployer.address);
      await expect(proxy.withdraw()).not.to.be.reverted;
      await expect(proxy.withdraw()).to.be.reverted;
      const newBalance = await proxy.provider.getBalance(deployer.address);
      expect(newBalance.gt(balance)).to.be.true;
   })

   it("Buy all tickets.", async function() {
      const userExternal = availableSigners[2];
      await(expect(proxy.connect(userExternal).buy(0, 0, 5, {value: ethers.utils.parseEther("0.025")})))
         .not.to.be.reverted;
      await(expect(proxy.connect(userExternal).buy(0, 1, 8, {value: ethers.utils.parseEther("1")})))
         .not.to.be.reverted;  
      await(expect(proxy.connect(userExternal).buy(0, 2, 4, {value: ethers.utils.parseEther("1")})))
         .not.to.be.reverted;
      [total0, total1, total2] = await Promise.all([
         proxy.balanceOf(deployer.address, 0),
         proxy.balanceOf(deployer.address, 1),
         proxy.balanceOf(deployer.address, 2)
      ]);
      expect(0).to.be.equal(total0);
      expect(0).to.be.equal(total1);
      expect(0).to.be.equal(total2);

      await(expect(proxy.connect(userExternal).buy(0, 0, 5, {value: ethers.utils.parseEther("0.025")})))
         .to.be.reverted;
      await(expect(proxy.connect(userExternal).buy(0, 1, 8, {value: ethers.utils.parseEther("1")})))
         .to.be.reverted;  
      await(expect(proxy.connect(userExternal).buy(0, 2, 4, {value: ethers.utils.parseEther("1")})))
         .to.be.reverted;
   });
});