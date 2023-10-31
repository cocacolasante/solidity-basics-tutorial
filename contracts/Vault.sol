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
        IERC20(tokenAddress).approve(address(this), amount);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
    }

    function withdrawEther() public returns(bool){
        require(msg.sender == owner, "Only owner check");
        require(address(this).balance > 0, "no funds");

        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "transfer failed");
        return success;
    }

    function withdrawToken(address tokenAddress) public {
        require(msg.sender == owner, "Only owner check");
        require(tokenBalances[tokenAddress] > 0, "No token funds");
        uint transferAmount = tokenBalances[tokenAddress];
        tokenBalances[tokenAddress] = 0;
        
        IERC20(tokenAddress).transfer(owner, transferAmount);
    }

    function withdrawAlltokens() public {
        require(msg.sender == owner, "Only Owner check");
        for(uint i =0; i < storedTokenAddress.length; i++){
            uint transferAmount = tokenBalances[storedTokenAddress[i]];
            tokenBalances[storedTokenAddress[i]] = 0;

            IERC20(storedTokenAddress[i]).transfer(owner, transferAmount);
        }

    }
    function returnTokenList() public view returns(address[] memory){
        return storedTokenAddress;
    }
    function getBalance() public view returns(uint){
        return address(this).balance;
    }
}