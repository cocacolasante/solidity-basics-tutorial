const { expect } = require("chai");
const hre  = require( "hardhat")

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

describe("Vault", () =>{
    let Vault, deployer, user1, ERC1, ERC2, ERC3
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
    describe("Ether", () =>{
        beforeEach(async () =>{
            await deployer.sendTransaction({
                to: Vault.target,
                value: ethers.parseEther("1.0"), // Sends exactly 1.0 ether
              }); 
        })
        describe("Deposits", () =>{
            describe("Success", () =>{
                it("checks the balance of the contract is 1 ether", async () =>{
                    expect(await ethers.provider.getBalance(Vault.target)).to.equal(ethers.parseEther("1"))
                })
            })
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

            await ERC1.connect(deployer).mint(ethers.parseEther("1"))
        })
        it("checks the vault balance of ERC1 is 0", async () =>{
            expect(await ERC1.balanceOf(Vault.target)).to.equal(0)
            
        })
        describe("Deposits", () =>{
            beforeEach(async () =>{
                await ERC1.connect(deployer).approve(Vault.target, ethers.parseEther("1"))
                await Vault.connect(deployer).storeTokens(ERC1.target, ethers.parseEther("1"))
            })
            describe("Success", () =>{
                it("checks the tokens were stored", async () =>{
                    expect(await Vault.tokenBalances(ERC1.target)).to.equal(ethers.parseEther("1"))

                })
                it("checks the balance was transferred from deployer", async () =>{
                    expect(await ERC1.balanceOf(deployer.address)).to.equal(0)
                })
                it("checks the address was stored in the array", async () =>{
                    expect(await Vault.storedTokenAddress(0)).to.equal(ERC1.target)
                })
                it("checks the address is not duplicated in the array", async () =>{
                    await ERC1.connect(deployer).mint(ethers.parseEther("1"))
                    await ERC1.connect(deployer).approve(Vault.target, ethers.parseEther("1"))
                    await Vault.connect(deployer).storeTokens(ERC1.target, ethers.parseEther("1"))
                    expect(await Vault.tokenBalances(ERC1.target)).to.equal(ethers.parseEther("2"))
                    await expect( Vault.storedTokenAddress(1)).to.be.reverted
                })
            })
            describe("Failure", () =>{})
        })
        describe("Withdraws", () =>{
            describe("Success", () =>{
                beforeEach(async () =>{
                    await ERC1.connect(deployer).approve(Vault.target, ethers.parseEther("1"))
                    await Vault.connect(deployer).storeTokens(ERC1.target, ethers.parseEther("1"))
                    await Vault.connect(deployer).withdrawToken(ERC1.target)

                    ERC2 = await hre.ethers.deployContract("OZERC20")
                    await ERC2.waitForDeployment()
        
                    await ERC2.connect(deployer).mint(ethers.parseEther("1"))
                    ERC3 = await hre.ethers.deployContract("OZERC20")
                    await ERC3.waitForDeployment()
        
                    await ERC3.connect(deployer).mint(ethers.parseEther("1"))

                    await ERC2.connect(deployer).approve(Vault.target, ethers.parseEther("1"))
                    await Vault.connect(deployer).storeTokens(ERC2.target, ethers.parseEther("1"))

                    await ERC3.connect(deployer).approve(Vault.target, ethers.parseEther("1"))
                    await Vault.connect(deployer).storeTokens(ERC3.target, ethers.parseEther("1"))
                })
                it("checks the tokens were withdrawn", async () =>{
                    expect(await ERC1.balanceOf(deployer.address)).to.equal(ethers.parseEther("1"))
                })
                it("checks the stored token address was deleted", async () =>{
                    expect(await Vault.storedTokenAddress(0)).to.equal(ZERO_ADDRESS)
                })
                it("checks multi tokens stored and withdrawn", async () =>{
                    await Vault.connect(deployer).withdrawToken(ERC2.target)
                    await Vault.connect(deployer).withdrawToken(ERC3.target)

                    expect(await ERC2.balanceOf(Vault.target)).to.equal(0)
                    expect(await ERC3.balanceOf(Vault.target)).to.equal(0)
                })
            })
            describe("Failure", () =>{})
        })
    }) 
})