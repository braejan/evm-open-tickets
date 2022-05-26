const{ expect } = require("chai");
const{ ethers } = require("hardhat");
describe("Generic Open Tickets tests: Deploy and Mint", function() {
let availableSigners;
    let deployer;
    let OpenTicket;
    let openTicketContract;
    let ID;
    const uri_ = "https://github.com/braejan/evm-open-tickets/{id}";
    before(async function () {
        availableSigners = await ethers.getSigners();
        deployer = availableSigners[0];
        OpenTicket = await ethers.getContractFactory("GenericOpenTicket");
        openTicketContract = await OpenTicket.deploy(uri_);
        await openTicketContract.deployed();
    });

    it("Should mint correctly", async function() {
        let supply = 100;
        let price = ethers.utils.parseEther("0.0005");
        let refundDiscount = ethers.utils.parseEther("0.00001");
        let refundAvailabe = true;
        //TODO: emit even to catch id in tests. 
        await openTicketContract.mintNewTicket(
            supply,
            price,
            refundDiscount,
            refundAvailabe
        );
        let [exists0, exists1, exists2] = await Promise.all([
            openTicketContract.exists(0),
            openTicketContract.exists(1),
            openTicketContract.exists(2)
        ]);
        
        expect(exists0).to.be.true;
        expect(exists1).to.be.false;
        expect(exists2).to.be.false;
        supply = 50;
        price = ethers.utils.parseEther("0.0006");
        refundDiscount = ethers.utils.parseEther("0.000009");
        await openTicketContract.mintNewTicket(
            supply,
            price,
            refundDiscount,
            refundAvailabe
        );

        [exists0, exists1, exists2] = await Promise.all([
            openTicketContract.exists(0),
            openTicketContract.exists(1),
            openTicketContract.exists(2)
        ]);
        
        expect(exists0).to.be.true;
        expect(exists1).to.be.true;
        expect(exists2).to.be.false;
        supply = 25;
        price = ethers.utils.parseEther("0.0007");
        refundDiscount = ethers.utils.parseEther("0.000005");
        await openTicketContract.mintNewTicket(
            supply,
            price,
            refundDiscount,
            refundAvailabe
        );
        
        [exists0, exists1, exists2] = await Promise.all([
            openTicketContract.exists(0),
            openTicketContract.exists(1),
            openTicketContract.exists(2)
        ]);
        
        expect(exists0).to.be.true;
        expect(exists1).to.be.true;
        expect(exists2).to.be.true;
    });

    it("Should throw onlyOwner error minting tickets", async function() {
        notOwner = availableSigners[1];
        let supply = 100;
        let price = ethers.utils.parseEther("0.0005");
        let refundDiscount = ethers.utils.parseEther("0.00001");
        let refundAvailabe = false;
        await expect(
           openTicketContract.connect(notOwner).mintNewTicket(
                supply,
                price,
                refundDiscount,
                refundAvailabe
            )
        ).revertedWith('Ownable: caller is not the owner');
    });

    it("Should throw discount value error minting tickets", async function() {
        let supply = 100;
        let price = ethers.utils.parseEther("0.0005");
        let refundDiscount = ethers.utils.parseEther("0.0006");
        let refundAvailabe = false;
        await expect(
           openTicketContract.mintNewTicket(
                supply,
                price,
                refundDiscount,
                refundAvailabe
            )
        ).revertedWith('Refund discount value too long.');
    });

    it("Validate minted values not altered", async function() {
        let [price0, price1, price2] = await Promise.all([
            openTicketContract.ticketPrice(0),
            openTicketContract.ticketPrice(1),
            openTicketContract.ticketPrice(2)
        ]);
        expect(ethers.utils.parseEther("0.0005"))
            .to.be.equal(price0);
        expect(ethers.utils.parseEther("0.0006"))
            .to.be.equal(price1);
        expect(ethers.utils.parseEther("0.0007"))
            .to.be.equal(price2);

        let [supply0, supply1, supply2] = await Promise.all([
            openTicketContract.ticketSupply(0),
            openTicketContract.ticketSupply(1),
            openTicketContract.ticketSupply(2)
        ]);
        expect(100)
            .to.be.equal(supply0);
        expect(50)
            .to.be.equal(supply1);
        expect(25)
            .to.be.equal(supply2);
    });
});