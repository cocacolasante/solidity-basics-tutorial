const { expect } = require("chai");
const hre  = require( "hardhat")

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
  }
const totalSupply = tokens('1000000')

describe("ERC20 From Scratch", () =>{
    let Scratch, deployer, user1, user2
    
    beforeEach(async () =>{
        [deployer, user1, user2] = await ethers.getSigners()
        Scratch = await ethers.deployContract("TokenFromScratch",["Dojo Coin", "DJC", 1000000])
        await Scratch.waitForDeployment()

        // console.log(`Token from scratch deployed to ${Scratch.target}`)
    })
    describe("Constructor and Deployment", () =>{
        it("checks the owner of scratch is the deployer", async () =>{
            expect(await Scratch.owner()).to.equal(deployer.address)
        })
        it("checks name, symbol, total supply as Dojo Coin, DJC, 1,000,000", async () =>{
            expect(await Scratch.name()).to.equal("Dojo Coin")
            expect(await Scratch.symbol()).to.equal("DJC")
            expect(await Scratch.totalSupply()).to.equal(totalSupply)
        })
        it('assigns total supply to deployer', async () => {
            expect(await Scratch.balanceOf(deployer.address)).to.equal(totalSupply)
        })
    })
    describe("Sending tokens", () =>{
        let tx, value, res
        beforeEach(async ()=>{
            value = tokens(100)
            tx = await Scratch.connect(deployer).transfer(user1.address, value)
            res = await tx.wait()
        })
        describe("Success", () =>{
            it("transfers 100 tokens to user1 from deployer", async () =>{
                expect(await Scratch.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await Scratch.balanceOf(user1.address)).to.equal(value)
            })
        })
    })
})