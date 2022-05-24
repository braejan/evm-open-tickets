const{ expect } = require("chai");
const{ ethers } = require("hardhat");
const TICKET = 0;
const NORMAL_TICKET = 0;
const VIP_TICKET = 1;
const PREMIUM_TICKET = 2;
describe("Open Tickets Tests", function() {
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
        //Then: 
        //  expect allowed tickets zero values
        const [price1, price2, price3] = await Promise.all(
            [
                openTicketContract.ticketPrice(ethers.BigNumber.from(NORMAL_TICKET)),
                openTicketContract.ticketPrice(ethers.BigNumber.from(VIP_TICKET)),
                openTicketContract.ticketPrice(ethers.BigNumber.from(PREMIUM_TICKET))
            ]
        );
        expect(0).to.be.equal(price1);
        expect(0).to.be.equal(price2);
        expect(0).to.be.equal(price3);
    });

    it("Should mint correctly", async function() {
        await Promise.all(
            [
                openTicketContract.mintTickets(NORMAL_TICKET, 1500, 25000000000000000n),
                openTicketContract.mintTickets(VIP_TICKET, 500, 40000000000000000n),
                openTicketContract.mintTickets(PREMIUM_TICKET, 50, 75000000000000000n)
            ]
        );
        const [price1, price2, price3] = await Promise.all(
            [
                openTicketContract.ticketPrice(ethers.BigNumber.from(NORMAL_TICKET)),
                openTicketContract.ticketPrice(ethers.BigNumber.from(VIP_TICKET)),
                openTicketContract.ticketPrice(ethers.BigNumber.from(PREMIUM_TICKET))
            ]
        );
        expect(25000000000000000n).to.be.equal(price1);
        expect(40000000000000000n).to.be.equal(price2);
        expect(75000000000000000n).to.be.equal(price3);
    });
});