// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract Token is ERC20{
    address public owner;

    constructor(string memory name, string memory symbol) ERC20(name, symbol){
        owner = msg.sender;
        // mint total supply to deployer
        _mint(msg.sender, 1000 *(10e18));
    }

    function burn(uint amount) public{
        require(msg.sender == owner, "only owner can call function");
        require(balanceOf(msg.sender) >= amount, "not enough funds");

        _burn(msg.sender, amount);

    }

    
}