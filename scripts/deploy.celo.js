// scripts/deploy_upgradeable_box.js
const { ethers, upgrades } = require('hardhat');

async function main () {
    const uri = "https://github.com/braejan/evm-open-tickets";
    console.log("Deploying OpenTicket celo");
    OpenTicket = await ethers.getContractFactory("OpenTicket");
    proxy = await upgrades.deployProxy(OpenTicket, [uri], { kind: 'uups' });
    await proxy.deployed();
    console.log('proxy deployed to:', proxy.address);
}

main();