const { expect } = require("chai");
const hre  = require( "hardhat")

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}
const totalSupply = tokens('1000000')

describe("ERC20 From Scratch", () =>{
    let Scratch, deployer, user1, user2, exchange
    
    beforeEach(async () =>{
        [deployer, user1, user2, exchange] = await ethers.getSigners()
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
        let tx, res, value
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
            it('emits a Transfer event', async () => {  
                expect( await Scratch.connect(deployer).transfer(user1.address, value)).to.emit('Transfer')
                    .withArgs(deployer.address, user1.address, value) 
            })
        })
        describe("Failure", () =>{
            it('rejects insufficient balances', async () => {
                const invalidAmount = tokens(100000000)
                await expect(Scratch.connect(deployer).transfer(user1.address, invalidAmount)).to.be.revertedWith("Low balance")
            })
            it('rejects invalid receiver', async () => {
                const amount = tokens(100)
                await expect(Scratch.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.revertedWith("Cannot send to null address")
            })
        })
    })
    describe("Approving Tokens", ()=>{
        let tx, res, value
        beforeEach(async () => {
            value = tokens(100)
            tx = await Scratch.connect(deployer).approve(exchange.address, value) // approves the token transfer
            res = await tx.wait()
        })
        describe("Success", () =>{
            beforeEach(async () =>{
                tx = await Scratch.connect(exchange).transferFrom(deployer.address, user1.address, value) // transfers tokens
                res = await tx.wait()
            })
            it("checks delegate transferFrom function", async () =>{
                expect(await Scratch.balanceOf(deployer.address)).to.be.equal(ethers.parseUnits('999900', 'ether'))
                expect(await Scratch.balanceOf(user1.address)).to.be.equal(value)
            })
            it('checks the allowance was resets', async () => {
                expect(await Scratch.allowance(deployer.address, exchange.address)).to.be.equal(0)
            })
            it('emits a Transfer event', async () => {  
                tx = await Scratch.connect(deployer).approve(exchange.address, value) // approves the token transfer
                res = await tx.wait()
                
                expect( await Scratch.connect(exchange).transferFrom(deployer.address, user1.address, value)).to.emit('Transfer')
                    .withArgs(deployer.address, user1.address, value) 
            })
        })
        describe("Failure", () =>{
            const invalidAmount = tokens(100000000) // 100 Million, greater than total supply
            it("should fail the transfer of an amount > total supply", async () =>{
                await expect(Scratch.connect(exchange).transferFrom(deployer.address, user1.address, invalidAmount)).to.be.revertedWith("Low balance")
            })
        })
    })
})