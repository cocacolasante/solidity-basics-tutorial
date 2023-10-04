const { expect } = require("chai");
const hre  = require( "hardhat")

describe("Storage Contract", () =>{
    let StorageContract, deployer, user1, user2, user3
    beforeEach(async () =>{
        [deployer, user1, user2, user3] = await ethers.getSigners()
        StorageContract = await ethers.deployContract("Storage")
        console.log(`Storage deployed to ${StorageContract.target}`)
    })
    it("checks the owner is the deployer", async () =>{
        expect(await StorageContract.owner()).to.equal(deployer.address)
    })
})