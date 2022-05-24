const{ expect } = require("chai");
const{ ethers } = require("hardhat");
const NORMAL_TICKET = 0;
const VIP_TICKET = 1;
const PREMIUM_TICKET = 2;
describe("Open Tickets tests: Deploy and Mint", function() {
    let availableSigners;
    let deployer;
    let OpenTicket;
    let openTicketContract;
    const uri_ = "https://github.com/braejan/evm-open-tickets";
    before(async function () {
        availableSigners = await ethers.getSigners();
        deployer = availableSigners[0];
        OpenTicket = await ethers.getContractFactory("OpenTicket");
        openTicketContract = await OpenTicket.deploy(uri_);
        await openTicketContract.deployed();
    });

    it("Should be in zero values for all ID", async function() {
        //Given: a OpenTicket contract that is just deployed
        //When: check allowed tickets
        //Then: expect allowed tickets zero values
        const [price1, price2, price3] = await Promise.all([
                openTicketContract.ticketPrice(ethers.BigNumber.from(NORMAL_TICKET)),
                openTicketContract.ticketPrice(ethers.BigNumber.from(VIP_TICKET)),
                openTicketContract.ticketPrice(ethers.BigNumber.from(PREMIUM_TICKET))
            ]);
        expect(0).to.be.equal(price1);
        expect(0).to.be.equal(price2);
        expect(0).to.be.equal(price3);
    });

    it("Should mint correctly", async function() {
        await Promise.all([
                openTicketContract.mintTickets(NORMAL_TICKET, 1500, 25000000000000000n),
                openTicketContract.mintTickets(VIP_TICKET, 500, 40000000000000000n),
                openTicketContract.mintTickets(PREMIUM_TICKET, 50, 75000000000000000n)
        ]);
        const [price1, price2, price3] = await Promise.all([
                openTicketContract.ticketPrice(ethers.BigNumber.from(NORMAL_TICKET)),
                openTicketContract.ticketPrice(ethers.BigNumber.from(VIP_TICKET)),
                openTicketContract.ticketPrice(ethers.BigNumber.from(PREMIUM_TICKET))
            ]);
        expect(25000000000000000n).to.be.equal(price1);
        expect(40000000000000000n).to.be.equal(price2);
        expect(75000000000000000n).to.be.equal(price3);
    });

    it("Should throw 'you already minted tickets for this ID'", async function() {
        //Given: a OpenTicket ID initialized
        //When: try to minted again
        //Then: should throw new error
        await expect(
           openTicketContract.mintTickets(NORMAL_TICKET, 1500, 25000000000000000n)
        ).to.be.revertedWith('you already minted tickets for this ID');
        await expect(
            openTicketContract.mintTickets(VIP_TICKET, 1500, 25000000000000000n)
        ).to.be.revertedWith('you already minted tickets for this ID');
        await expect(
            openTicketContract.mintTickets(PREMIUM_TICKET, 1500, 25000000000000000n)
        ).to.be.revertedWith('you already minted tickets for this ID');
    });

    it("Should return sent uri", async function() {
        const uri = await openTicketContract.uri(NORMAL_TICKET);
        expect(uri_).to.be.equal(uri);
    });

    it("Should deployer contract owner", async function() {
        const owner = await openTicketContract.owner();
        expect(deployer.address).to.be.equal(owner);
    });

    it("Should owner got all tickets", async function() {
        const [amount1, amount2, amount3] = await Promise.all([
            openTicketContract.balanceOf(deployer.address, NORMAL_TICKET),
            openTicketContract.balanceOf(deployer.address, VIP_TICKET),
            openTicketContract.balanceOf(deployer.address, PREMIUM_TICKET)
        ]);
        expect(1500).to.be.equal(amount1);
        expect(500).to.be.equal(amount2);
        expect(50).to.be.equal(amount3);
    });

    it("Should throw 'Ownable: caller is not the owner'", async function() {
        customer1 = availableSigners[1];
        await expect(openTicketContract.connect(customer1).withdraw())
            .to.be.revertedWith('Ownable: caller is not the owner');
    });

    it("Should throw 'not enough balance. balance is 0'", async function() {
        await expect(openTicketContract.withdraw())
            .to.be.revertedWith('not enough balance. balance is 0');
    }); 
});