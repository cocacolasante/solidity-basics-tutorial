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
        it("checks the status was unpaused", async ()=>{
            await StorageContract.connect(deployer).unpauseContractStatus()
            expect(await StorageContract.status()).to.equal(0)
        })
    })
    describe("Global Storage String functions", () =>{
        it("checks the storageString is updated to 'TEST'", async () =>{
            await StorageContract.connect(user2).updateString("TEST")
            expect(await StorageContract.getStorageString()).to.equal("TEST")
            expect(await StorageContract.numOfUpdates()).to.equal(2)
        })
        it("checks the storage string is deleted set to ''", async ()=>{
            await StorageContract.connect(user3).deleteString()
            expect(await StorageContract.getStorageString()).to.equal("")
        })
    })
    describe("Users Storage String Mapping function", () =>{
        it("checks the users struct was created by user1, username1, value of 10", async () =>{
            await StorageContract.connect(user1).setUserVariable("test string", 10 )
            const user1Struct = await StorageContract.getUserStorage(user1.address)
            expect(user1Struct._storageString).to.equal("test string")
            expect(user1Struct.amount).to.equal(10)

        })
        it("checks the users struct was deleted by user1", async () =>{
            await StorageContract.connect(user1).deleteUserVariable()
            const user1Struct = await StorageContract.getUserStorage(user1.address)
            expect(user1Struct._storageString).to.equal("")
            expect(user1Struct.amount).to.equal(0)

        })
        it("checks the update storage event was emitted", async () =>{
            expect(await StorageContract.connect(user2).setUserVariable("test2", 10)).to.emit("StorageUpdated").withArgs(user2.address, "test2")
        })
        it("checks the delete storage event was emitted", async () =>{
            await StorageContract.connect(user2).setUserVariable("test2", 10)
            expect(await StorageContract.connect(user2).deleteUserVariable()).to.emit("StorageUpdated").withArgs(user2.address, "")
        })

    })
})