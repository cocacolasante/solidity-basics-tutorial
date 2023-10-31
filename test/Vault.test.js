const { expect } = require("chai");
const hre  = require( "hardhat")

describe("Vault", () =>{
    let Vault, deployer, user1, ERC1
    beforeEach(async () =>{
        [deployer, user1] = await hre.ethers.getSigners()

        Vault = await hre.ethers.deployContract("Vault")
        await Vault.waitForDeployment()

    })
    describe("Deployment", () =>{
        it("checks the owner is the deployer", async () =>{
            expect(await Vault.owner()).to.equal(deployer.address)
        })
        it("checks the balance of the vault is 0", async () =>{
            expect(await Vault.getBalance()).to.equal(0)
        })
    })
    describe("Ether Deposits", () =>{
        // beforeEach(async () =>{
        //     await 
        // })
        describe("Deposits", () =>{
            describe("Success", () =>{})
            describe("Failure", () =>{})
        })
        describe("Withdraws", () =>{
            describe("Success", () =>{})
            describe("Failure", () =>{})
        })
    }) 
    describe("ERC20", () =>{
        beforeEach(async () =>{
            ERC1 = await hre.ethers.deployContract("OZERC20")
            await ERC1.waitForDeployment()
        })
        describe("Deposits", () =>{
            describe("Success", () =>{})
            describe("Failure", () =>{})
        })
        describe("Withdraws", () =>{
            describe("Success", () =>{})
            describe("Failure", () =>{})
        })
    }) 
})