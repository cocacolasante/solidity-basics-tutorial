
const { expect } = require("chai");
const hre  = require( "hardhat")

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
  }
const totalSupply = tokens('1000000')

describe("ERC20 From Open Zeppelin", () =>{
    let OZERC20, deployer, user1, user2, exchange
    
    beforeEach(async () =>{
        [deployer, user1, user2, exchange] = await ethers.getSigners()
        OZERC20 = await ethers.deployContract("OZERC20")
        await OZERC20.waitForDeployment()
        await OZERC20.connect(deployer).mint(tokens(1000000))

        // console.log(`Token from scratch deployed to ${Scratch.target}`)
    })
    describe("Constructor and Deployment", () =>{
        it("checks the owner of oz is the deployer", async () =>{
            expect(await OZERC20.owner()).to.equal(deployer.address)
        })
        it("checks name, symbol, total supply as Dojo Coin, DJC, 1,000,000", async () =>{
            expect(await OZERC20.name()).to.equal("Dojo Coin")
            expect(await OZERC20.symbol()).to.equal("DJC")
           
        })
        it('mints tokens for the deployer', async () => {
            // await OZERC20.connect(deployer).mint(tokens(1000000))
            expect(await OZERC20.balanceOf(deployer.address)).to.equal(totalSupply)
        })
    })
    describe("Sending tokens", () =>{
        let tx, res, value
        beforeEach(async ()=>{
            
            value = tokens(100)
            tx = await OZERC20.connect(deployer).transfer(user1.address, value)
            res = await tx.wait()
        })
        describe("Success", () =>{
            it("transfers 100 tokens to user1 from deployer", async () =>{
                expect(await OZERC20.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await OZERC20.balanceOf(user1.address)).to.equal(value)
            })
            it('emits a Transfer event', async () => {  
                expect( await OZERC20.connect(deployer).transfer(user1.address, value)).to.emit('Transfer')
                    .withArgs(deployer.address, user1.address, value) 
            })
        })
        describe("Failure", () =>{
            it('rejects insufficient balances', async () => {
                const invalidAmount = tokens(100000000)
                await expect(OZERC20.connect(deployer).transfer(user1.address, invalidAmount)).to.be.revertedWith("ERC20: transfer amount exceeds balance")
            })
            it('rejects invalid receiver', async () => {
                const amount = tokens(100)
                await expect(OZERC20.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.revertedWith("ERC20: transfer to the zero address")
            })
        })
    })
    describe("Approving Tokens", ()=>{
        let tx, res, value
        beforeEach(async () => {
            value = tokens(100)
            tx = await OZERC20.connect(deployer).approve(exchange.address, value) // approves the token transfer
            res = await tx.wait()
        })
        describe("Success", () =>{
            beforeEach(async () =>{
                tx = await OZERC20.connect(exchange).transferFrom(deployer.address, user1.address, value) // transfers tokens
                res = await tx.wait()
            })
            it("checks delegate transferFrom function", async () =>{
                expect(await OZERC20.balanceOf(deployer.address)).to.be.equal(ethers.parseUnits('999900', 'ether'))
                expect(await OZERC20.balanceOf(user1.address)).to.be.equal(value)
            })
            it('checks the allowance was resets', async () => {
                expect(await OZERC20.allowance(deployer.address, exchange.address)).to.be.equal(0)
            })
            it('emits a Transfer event', async () => {  
                expect( await OZERC20.connect(deployer).transfer(user1.address, value)).to.emit('Transfer')
                    .withArgs(deployer.address, user1.address, value) 
            })
        })
        describe("Failure", () =>{
            const invalidAmount = tokens(100000000) // 100 Million, greater than total supply
            it("should fail the transfer of an amount > total supply", async () =>{
                await expect(OZERC20.connect(exchange).transferFrom(deployer.address, user1.address, invalidAmount)).to.be.revertedWith("ERC20: insufficient allowance")
            })
        })
    })
})