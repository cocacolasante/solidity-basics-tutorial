// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Crowdfund{
    address private admin;
    uint256 public campaignCount;
    
    mapping(uint=>Campaign) public campaigns;
    
    struct Campaign {
        address owner;
        string name;
        uint256 captialRaised;
        uint256 goal;
        uint256 enddate;
        CampaignStatus status;
    }

    enum CampaignStatus{live, cancelled, completed}

    constructor(){
        admin = msg.sender;
    }

    function createCampaign(string memory _name, uint256 goal, uint256 enddate) public {
        campaignCount++;
        uint256 campNum = campaignCount;

        campaigns[campNum] = Campaign(msg.sender, _name,0, goal, enddate, CampaignStatus.live);


    }

    function donateToCampaign(uint campNum) public payable {
        require(campaigns[campNum].status == CampaignStatus.live,"campaign ended");
        require(!checkIfCampaignTimeIsReached(campNum), "campaign time has ended");
        campaigns[campNum].captialRaised += msg.value;

    }
    
    function completeCampaign(uint campNum) public {
        require(campaigns[campNum].owner == msg.sender, "only owner of campaign");
        require(campaigns[campNum].captialRaised >= campaigns[campNum].goal, "goal was not hit");
        require(!checkIfCampaignTimeIsReached(campNum), "campaign still has time");
        require(campaigns[campNum].status == CampaignStatus.live,"campaign ended");

        campaigns[campNum].status = CampaignStatus.completed;
        uint campaignAmount = campaigns[campNum].captialRaised;

        campaigns[campNum].captialRaised = 0;

        (bool success, ) = campaigns[campNum].owner.call{value: campaignAmount}("");
        require(success, "transfer failed");
    }

    function cancelCampaign(uint campNum) public {
        require(!checkIfCampaignTimeIsReached(campNum), "campaign is already over");
        require(campaigns[campNum].owner == msg.sender, "only owner of campaign");
        require(campaigns[campNum].captialRaised < campaigns[campNum].goal, "goal was reached");

        require(campaigns[campNum].status == CampaignStatus.live,"campaign ended");

        campaigns[campNum].status = CampaignStatus.cancelled;

    }

    function checkIfCampaignTimeIsReached(uint campNum) internal view returns(bool){
        return campaigns[campNum].enddate >= block.timestamp;
    }


}