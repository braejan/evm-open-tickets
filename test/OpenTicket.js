const{ expect } = require("chai");
const{ ethers } = require("hardhat");
const TICKET = 0;

describe("Open Tickets Tests", function() {
    let availableSigners;
    let deployer;
    let OpenTicket;
    let openTicketContract;
    const initialSupply = 500;
    const uri_ = "https://gateway.pinata.cloud/ipfs/QmTN32qBKYqnyvatqfnU8ra6cYUGNxpYziSddCatEmopLR/metadata/api/item/{id}.json";
    before(async function () {
        availableSigners = await ethers.getSigners();
        deployer = availableSigners[0];
        OpenTicket = await ethers.getContractFactory("OpenTicket");
        openTicketContract = await OpenTicket.deploy(initialSupply, uri_);
        await openTicketContract.deployed();
    });

    it("Should mint tickets", async function() {
        const balance = await openTicketContract.balanceOf(deployer.address, TICKET);
        const contractUri = await openTicketContract.uri(TICKET);
        expect(initialSupply).to.be.equal(Number(balance.toString()));
        expect(uri_).to.be.equal(contractUri);
    })
});