// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Storage{
    // variables -- explain different variable types
    address public owner;
    string private storageString;
    uint256 public numOfUpdates; // tracks number of updates for storageString

    // stores enum status of contract
    ContractStatus public status;

    // create unique users key value pair table
    mapping(address=>UserStorage) private usersStorage;

    // STRUCT -a custom data type
    struct UserStorage{
        string storageString;
        uint amount;
    }

    // events that are emitted for others to listen to 
    // can be used for cheap storage
    event StorageUpdated(address indexed updater, string storageVar);

    // enum breaks down into a numeric response so ContractStatus.live == 0 and .paused == 1
    enum ContractStatus{live, paused}

    // function modifier - this one specifically determines if the contract is live or not
    modifier LiveContract{
        require(status == ContractStatus.live, "contract is paused");
        _;
    }

    // pause and unpause contract status
    function pauseContractStatus() public {
        require(msg.sender == owner, "only owner");
        status = ContractStatus.paused;
    }
    function unpauseContractStatus() public {
        require(msg.sender == owner, "only owner");
        status = ContractStatus.live;
    }

    // initially sets the storage string // creates variable
    constructor(string memory startingString) {
        numOfUpdates++;
        storageString = startingString;
        status = ContractStatus.live;
    }

    // update storage string
    function updateString(string memory newString) public {
        numOfUpdates++;
        storageString = newString;
        emit StorageUpdated(msg.sender, newString);
    }

    // delete storage string by setting to empty value
    function deleteString() public{
        storageString = "";
        emit StorageUpdated(msg.sender, "");
    }

    // read individual variable
    function getStorageString() public view returns(string memory){
        return storageString;
    }

    // STRUCT FUNCTIONS
    // sets unique user storage struct variable to address mapping creates and updates in one function
    function setUserVariable(string memory newString, uint _amount) public LiveContract{
        UserStorage memory newStorage = UserStorage(newString, _amount);
        usersStorage[msg.sender] = newStorage;
        emit StorageUpdated(msg.sender, newString);
        
    }

    // shows delete key word to delete users struct
    function deleteUserVariable() public LiveContract{
        delete usersStorage[msg.sender];
        emit StorageUpdated(msg.sender, "");
    }

    // read function
    function getUserStorage(address user) public view returns(UserStorage memory){
        return usersStorage[user];
    }

    
}