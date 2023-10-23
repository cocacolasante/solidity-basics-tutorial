// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
    address public owner;
    


    mapping(address=>uint) public tokenBalances;
    address[] public storedTokenAddress;

    receive() external payable{}

    fallback()external payable{
        revert();
    }
    constructor(){
        owner = msg.sender;
    }

    function approveStoreTokens(address tokenAddress, uint256 amount) public{
        IERC20(tokenAddress).approve(address(this), amount);
    }

    function storeTokens(address tokenAddress, uint256 amount) public {
        if(tokenBalances[tokenAddress] == 0){
            storedTokenAddress.push(tokenAddress);

        }

        tokenBalances[tokenAddress] += amount;
        
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
    }

    

    function getBalance() public view returns(uint){
        return address(this).balance;
    }
}