const{ expect } = require("chai");
const{ ethers } = require("hardhat");
const NORMAL_TICKET = 0;
const VIP_TICKET = 1;
const PREMIUM_TICKET = 2;
describe("Open Tickets tests: Buy and Transfer tickets", function() {
    let availableSigners;
    let deployer;
    let OpenTicket;
    let openTicketContract;
    let openTicketContractValue;
    const uri_ = "https://github.com/braejan/evm-open-tickets";
    before(async function() {
        availableSigners = await ethers.getSigners();
        deployer = availableSigners[0];
        OpenTicket = await ethers.getContractFactory("OpenTicket");
        openTicketContract = await OpenTicket.deploy(uri_);
        await openTicketContract.deployed();
        await Promise.all([
            openTicketContract.mintTickets(NORMAL_TICKET, 10, 25000000000000000n),
            openTicketContract.mintTickets(VIP_TICKET, 2, 40000000000000000n),
            openTicketContract.mintTickets(PREMIUM_TICKET, 1, 75000000000000000n) 
        ]);
        openTicketContractValue = await openTicketContract
            .provider
            .getBalance(openTicketContract.address);
    });

    it("Should throw 'not enough supply for sent ID'", async function() {
        const user = availableSigners[1];
        await expect(
            openTicketContract.connect(user).buyTicket(NORMAL_TICKET, 11)
        ).to.be.revertedWith('not enough supply for sent ID');
        await expect(
            openTicketContract.connect(user).buyTicket(VIP_TICKET, 11)
        ).to.be.revertedWith('not enough supply for sent ID');
        await expect(
            openTicketContract.connect(user).buyTicket(PREMIUM_TICKET, 11)
        ).to.be.revertedWith('not enough supply for sent ID');
    });

    it("Should throw 'not enough balance to buy this amount'", async function() {
        const user = availableSigners[1];
        await expect(
            openTicketContract.connect(user).buyTicket(NORMAL_TICKET, 2, {
                value: ethers.utils.parseEther("0.025")
            })
        ).to.be.revertedWith('not enough balance to buy this amount');
        await expect(
            openTicketContract.connect(user).buyTicket(VIP_TICKET, 2, {
                value: ethers.utils.parseEther("0.025")
            })
        ).to.be.revertedWith('not enough balance to buy this amount');
        await expect(
            openTicketContract.connect(user).buyTicket(PREMIUM_TICKET, 1, {
                value: ethers.utils.parseEther("0.025")
            })
        ).to.be.revertedWith('not enough balance to buy this amount');
    });

    it("Should buy 10 normal tickets", async function() {
        const user = availableSigners[1];
        expect(0).to.be.equal(openTicketContractValue);
        totalTickects = await openTicketContract.connect(user).balanceOf(user.address, NORMAL_TICKET);
        expect(0).to.be.equal(totalTickects);
        await openTicketContract.connect(user).buyTicket(NORMAL_TICKET, 10, {
            value: ethers.utils.parseEther("0.25")
        });
        totalTickects = await openTicketContract.connect(user).balanceOf(user.address, NORMAL_TICKET);
        expect(10).to.be.equal(totalTickects);
        const value = await openTicketContract.provider.getBalance(openTicketContract.address);
        expect(ethers.utils.parseEther("0.25")).to.be.equal(value);
        await expect(
            openTicketContract.connect(user).buyTicket(NORMAL_TICKET, 10, {
                value: ethers.utils.parseEther("0.25")
            })
        ).to.be.revertedWith("not enough supply for sent ID");
    });

    it("Should transfer tickets with ERC1155-safeTransferFrom", async function() {
        const user1 = availableSigners[1];
        const user2 = availableSigners[2];
        await openTicketContract.connect(user1).safeTransferFrom(
            user1.address,
            user2.address,
            NORMAL_TICKET,
            2,
            "0x00"
        );
        totalTickects = await openTicketContract.connect(user1).balanceOf(user1.address, NORMAL_TICKET);
        expect(8).to.be.equal(totalTickects);
        totalTickects = await openTicketContract.connect(user2).balanceOf(user2.address, NORMAL_TICKET);
        expect(2).to.be.equal(totalTickects);
        const value = await openTicketContract.provider.getBalance(openTicketContract.address);
        expect(ethers.utils.parseEther("0.25")).to.be.equal(value);
    })

    it("Should contract has all sells so far", async function() {
        const user = availableSigners[1];
        await openTicketContract.connect(user).buyTicket(PREMIUM_TICKET, 1, {
            value: ethers.utils.parseEther("0.075")
        });
        // all sells so far (0.25 + 0.075)
        const value = await openTicketContract.provider.getBalance(openTicketContract.address);
        expect(ethers.utils.parseEther("0.325")).to.be.equal(value);
    })

    it("Should owner can withdraw all so far", async function() {
        await openTicketContract.withdraw();
        let value = await openTicketContract.provider.getBalance(openTicketContract.address);
        expect(0).to.be.equal(value);
        value = await openTicketContract.provider.getBalance(deployer.address);
        expect(ethers.utils.parseEther("0.325")).to.be.equal(value); 
    })
});