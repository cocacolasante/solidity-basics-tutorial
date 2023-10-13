const { expect } = require("chai");
const hre  = require( "hardhat")

describe("To Do Contract", () =>{
    let ToDo, deployer, user1
    beforeEach(async () =>{
        [deployer, user1] = await hre.ethers.getSigners()

        ToDo = await hre.ethers.deployContract("ToDo")
        await ToDo.waitForDeployment()

        // console.log(`Contract Deployed to ${ToDo.target}`)
    })
    describe("Deployment", () =>{
        it("checks deployer is owner", async () =>{
            expect(await ToDo.owner()).to.equal(deployer.address)
        })
        it("checks todo count is initialized at zero", async () =>{
            expect(await ToDo.todoCount()).to.equal(0)
        })
    })
    describe("CRUD Operations", () =>{
        let tx, res, todoItem, mapItem
        beforeEach(async ()=>{
            todoItem = "code"
            tx = await ToDo.connect(deployer).addTodo(todoItem)
            res = await tx.wait()
            mapItem = await ToDo.returnTodo(1)
        })
        describe("Add todo", () =>{
            describe("Success Add Todo", () =>{
                it("checks the todo count", async () =>{
                    expect(await ToDo.todoCount()).to.equal(1)
                })
                it("checks todo was stored in mapping", async () =>{
                    expect(mapItem.item).to.equal(todoItem)
                    expect(mapItem.completed).to.equal(false)
                })
                it("checks the add todo event was emitted")
            })
            describe("Failure Add Todo", ()=>{
                it("checks the fail case for add todo")
            })
        })
        describe("Update and Complete Todo", () =>{
            describe("Success update/complete Todo", () =>{
                it("checks the update/complete todo event was emitted")
            })
            describe("Failure update/complete Todo", ()=>{
                it("checks the fail case for update/complete todo")
            })
        })
        describe("Delete Todo", () =>{
            describe("Success delete Todo", () =>{
                it("checks the delete todo event was emitted")
            })
            describe("Failure delete Todo", ()=>{
                it("checks the fail case for delete todo")
            })
        })
    })
})