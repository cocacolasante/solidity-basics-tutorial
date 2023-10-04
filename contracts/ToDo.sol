// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ToDo{
    // set the owner variable
    address public owner;
    // to do count variable
    uint256 public todoCount;

    // to do struct
    struct ToDo{
        string item;
        bool completed;
    }

    // events for added and completed todos
    event AddedTodo(uint256 indexed _todonum, uint256 timestamp);
    event CompletedTodo(uint256 indexed _todonum, uint256 timestamp);

    // modifier
    modifier onlyOwner{
        require(msg.sender == owner, "only owner");
        _;
    }
    // mapping of todocount to struct
    mapping(uint=>ToDo) private todos;

    constructor(){
        owner = msg.sender;
    }
    // CREATE
    function addTodo(string memory item) public onlyOwner{
        todoCount++;
        todos[todoCount] = ToDo(item, false);
        emit AddedTodo(todoCount, block.timestamp);
    }
    // UPDATE
    function completeTodo(uint256 todoNum) public onlyOwner{
        todos[todoNum].completed = true;
    }
    // DELETE
    function deleteTodo(uint256 todoNum) public onlyOwner{
        todos[todoNum].completed = false;
        todos[todoNum].item = "";
    }

    // UPDATE
    function updateTodo(string memory updateItem, uint256 todoNum) public onlyOwner{
        todos[todoNum].item = updateItem;
    }

    // READ
    function returnTodo(uint256 todoNum) public view returns(ToDo memory){
        return todos[todoNum];
    }
}
