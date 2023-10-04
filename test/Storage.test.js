const { expect } = require("chai");
const hre  = require( "hardhat")

const TESTINGSTRING = "Testing string"

describe("Storage Contract", () =>{
    let StorageContract, deployer, user1, user2, user3
    beforeEach(async () =>{
        [deployer, user1, user2, user3] = await ethers.getSigners()
        StorageContract = await ethers.deployContract("Storage", [TESTINGSTRING])
        // console.log(`Storage deployed to ${StorageContract.target}`)
    })
    it("checks the owner is the deployer", async () =>{
        expect(await StorageContract.owner()).to.equal(deployer.address)
    })
    it("checks the initial storage string", async () =>{
        expect(await StorageContract.getStorageString()).to.equal(TESTINGSTRING)
    })
    it("checks the status of the contract to be live", async () =>{
        expect(await StorageContract.status()).to.equal(0)
    })
    it("checks the num of updates to equal 1", async () =>{
        expect(await StorageContract.numOfUpdates()).to.equal(1)
    })
    describe("Pause and Unpause function and fail cases", ()=>{
        beforeEach(async()=>{
            await StorageContract.connect(deployer).pauseContractStatus()
        })
        it("checks the status of the contract is paused", async ()=>{
            expect(await StorageContract.status()).to.equal(1) // enum turns status in to numeric value, 0 being live 1 for paused
        })
        it("checks the pause modifier for all functions", async ()=>{
            await expect( StorageContract.connect(user1).updateString("TEST")).to.be.revertedWith("contract is paused")
            await expect( StorageContract.connect(user1).deleteString()).to.be.revertedWith("contract is paused")
            await expect( StorageContract.connect(user1).setUserVariable("TEST", 1)).to.be.revertedWith("contract is paused")
            await expect( StorageContract.connect(user1).deleteUserVariable()).to.be.revertedWith("contract is paused")
        })
    })
    describe("Main Storage String functions", () =>{

    })
    describe("Users Storage String Mapping function", () =>{

    })
})