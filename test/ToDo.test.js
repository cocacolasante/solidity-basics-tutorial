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
                it("checks the add todo event was emitted", async () =>{
                    expect(await ToDo.connect(deployer).addTodo(todoItem)).to.emit("AddedTodo")
                })
            })
            describe("Failure Add Todo", ()=>{
                it("checks other users cant add todo", async () =>{
                    await expect(ToDo.connect(user1).addTodo(todoItem)).to.be.revertedWith("only owner")
                })
            })
        })
        describe("Update and Complete Todo", () =>{
            describe("Success update/complete Todo", () =>{
                beforeEach(async () =>{
                    await ToDo.connect(deployer).updateTodo(1, "NewTest")
                    await ToDo.connect(deployer).completeTodo(1)
                    mapItem = await ToDo.returnTodo(1)
                })
                it("updates the todo to completed", async () =>{
                    expect(mapItem.completed).to.equal(true)
                })
                it("checks the item was updated", async ()=>{
                    expect(mapItem.item).to.equal("NewTest")

                })
                it("checks the update/complete todo event was emitted", async () =>{
                    await ToDo.connect(deployer).addTodo(todoItem)
                    expect(await ToDo.connect(deployer).completeTodo(2)).to.emit("CompletedTodo")

                })
            })
            describe("Failure update/complete Todo", ()=>{
                it("checks the fail case for update/complete todo", async () =>{
                    await expect(ToDo.connect(user1).updateTodo(1, "NewTest")).to.be.revertedWith("only owner")
                    await expect(ToDo.connect(user1).completeTodo(1)).to.be.revertedWith("only owner")
                })
            })
        })
        describe("Delete Todo", () =>{
            describe("Success delete Todo", () =>{
                it("checks the mapping struct was deleted", async () =>{
                    await ToDo.connect(deployer).deleteTodo(1)
                    mapItem = await ToDo.returnTodo(1)
                    expect(mapItem.item).to.equal("")
                })
                it("checks the delete todo event was emitted", async () =>{
                    expect(await ToDo.connect(deployer).deleteTodo(1)).to.emit("DeletedTodo")
                })
            })
            describe("Failure delete Todo", ()=>{
                it("checks the fail case for delete todo", async () =>{
                    await expect(ToDo.connect(user1).deleteTodo(1)).to.be.revertedWith("only owner")
                })
            })
        })
    })
})