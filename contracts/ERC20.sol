// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract OZERC20 is ERC20, ERC20Burnable, Ownable, AccessControl{
    using SafeERC20 for ERC20;

    uint256 _totalSupply;
    bytes32 public constant MANAGER_ROLE =keccak256("MANAGE_ROLE");

    mapping(address=>uint256) private _balances;

    constructor()ERC20("Dojo Coin", "DJC"){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MANAGER_ROLE, msg.sender);
    }

    function mint(uint256 amount) external{
        require(hasRole(MANAGER_ROLE, msg.sender), "not allowed");
        _totalSupply += amount;
        _balances[msg.sender] += amount;

        _mint(msg.sender, amount);
        
    }

}