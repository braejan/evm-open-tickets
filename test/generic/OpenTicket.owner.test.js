const{ expect } = require("chai");
const{ ethers } = require("hardhat");
describe("Generic Open Tickets tests: Modifiers and Ownable", function() {
    let availableSigners;
    let deployer;
    let OpenTicket;
    let openTicketContract;
    let price = ethers.utils.parseEther("0.00035");
    let refundDiscount = ethers.utils.parseEther("0.00001");
    let refundAvailabe = false;
    let ID = 0;
    let notOwner;
    const uri_ = "https://github.com/braejan/evm-open-tickets/{id}";
    before(async function () {
        availableSigners = await ethers.getSigners();
        deployer = availableSigners[0];
        OpenTicket = await ethers.getContractFactory("GenericOpenTicket");
        openTicketContract = await OpenTicket.deploy(uri_);
        await openTicketContract.deployed();
        notOwner = availableSigners[1]
        let supply = 100;
        let price = ethers.utils.parseEther("0.0005");
        let refundDiscount = ethers.utils.parseEther("0.00001");
        let refundAvailabe = true;
        await openTicketContract.mintNewTicket(
            supply,
            price,
            refundDiscount,
            refundAvailabe
        );
        
        supply = 50;
        price = ethers.utils.parseEther("0.0006");
        refundDiscount = ethers.utils.parseEther("0.000009");
        await openTicketContract.mintNewTicket(
            supply,
            price,
            refundDiscount,
            refundAvailabe
        );

        supply = 25;
        price = ethers.utils.parseEther("0.0007");
        refundDiscount = ethers.utils.parseEther("0.000005");
        await openTicketContract.mintNewTicket(
            supply,
            price,
            refundDiscount,
            refundAvailabe
        );        
    });

        
        
    it("onlyOwner - modifyTicket()", async function() {
        await expect(
            openTicketContract.connect(notOwner).modifyTicket(
                ID,
                price,
                refundDiscount,
                refundAvailabe
            )
        ).revertedWith('Ownable: caller is not the owner');
    });

    it("validateTicketID - modifyTicket()", async function() {
        await expect(
            openTicketContract.modifyTicket(
                50,
                price,
                refundDiscount,
                refundAvailabe
            )
        ).revertedWith('There is not event for that Ticket.');
    });

    it("validateRefundDiscount - modifyTicket()", async function() {
        await expect(
            openTicketContract.modifyTicket(
                    ID,
                    price,
                    ethers.utils.parseEther("0.00036"),
                    refundAvailabe
                )
        ).revertedWith('Refund discount value too long.');
    });

    it("validateTicketID - ticketPrice()", async function() {
        await expect(
            openTicketContract.ticketPrice(50)
        ).revertedWith('There is not event for that Ticket.');
    });

    it("validateTicketID - ticketSupply()", async function() {
        await expect(
            openTicketContract.ticketSupply(50)
        ).revertedWith('There is not event for that Ticket.');
    });

    it("validateEnoughEthers insufficient balance - buyTicket()", async function() {
        await expect(
            openTicketContract.buyTicket(ID, 100, {
                value: ethers.utils.parseEther("0.049")
            })
        ).revertedWith('Not enough balance to buy this amount');
    });

    it("validateEnoughEthers value 0 - buyTicket()", async function() {
        await expect(
            openTicketContract.buyTicket(ID, 100, {
                value: ethers.utils.parseEther("0")
            })
        ).revertedWith('Zero value not allowed.');
    });

    it("validateEnoughEthers ID - buyTicket()", async function() {
        await expect(
            openTicketContract.buyTicket(50, 100, {
                value: ethers.utils.parseEther("0")
            })
        ).revertedWith('There is not event for that Ticket.');
    });

    it("validateEnoughSupply insufficient supply - buyTicket()", async function() {
        await expect(
            openTicketContract.buyTicket(ID, 101, {
                value: ethers.utils.parseEther("0.1")
            })
        ).revertedWith('Not enough supply for this Ticket.');
    });

    it("validateEnoughSupply zero amount - buyTicket()", async function() {
        await expect(
            openTicketContract.buyTicket(ID, 0, {
                value: ethers.utils.parseEther("0.1")
            })
        ).revertedWith('Zero amount not allowed.');
    });

    it("validateEnoughSupply ID - buyTicket()", async function() {
        await expect(
            openTicketContract.buyTicket(50, 100, {
                value: ethers.utils.parseEther("0.1")
            })
        ).revertedWith('There is not event for that Ticket.');
    });


    it("validateEnoughTicktes - requestRefund()", async function() {
        await expect(
            openTicketContract.connect(notOwner).requestRefund(
                ID,
                5
            )
        ).revertedWith('Address doesn\'t have enough ticktes.');
    });

    it("validateEnoughTicktes not tickets- requestRefund()", async function() {
        await expect(
            openTicketContract.connect(notOwner).requestRefund(
                ID,
                5
            )
        ).revertedWith('Address doesn\'t have enough ticktes.');
    });

    it("validateEnoughTicktes zero amount - requestRefund()", async function() {
        await expect(
            openTicketContract.connect(notOwner).requestRefund(
                ID,
                0
            )
        ).revertedWith('Zero amount not allowed.');
    });

    it("validateEnoughTicktes ID - requestRefund()", async function() {
        await expect(
            openTicketContract.connect(notOwner).requestRefund(
                50,
                0
            )
        ).revertedWith('There is not event for that Ticket.');
    });

    it("Ownable - withdraw()", async function() {
        await expect(
            openTicketContract.connect(notOwner).withdraw(ethers.utils.parseEther("1"))
        ).revertedWith('Ownable: caller is not the owner');
    });

    it("hasEnoughBalance - withdraw()", async function() {
        await expect(
            openTicketContract.withdraw(ethers.utils.parseEther("1"))
        ).revertedWith('Not enough balance to withdraw.');
    });

    it("Ownable - withdrawAll()", async function() {
        await expect(
            openTicketContract.connect(notOwner).withdrawAll()
        ).revertedWith('Ownable: caller is not the owner');
    });

    it("hasBalance - withdrawAll()", async function() {
        await expect(
            openTicketContract.withdrawAll()

        ).revertedWith('Not enough balance to withdraw. balance is 0.');
    });
});