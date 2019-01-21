pragma solidity 0.4.24;

contract Owned {
    
    //Global variables
    address public owner;
    
    //Constructor, setting the owner upon contract creation
    constructor() public {
        owner = msg.sender;
    }
    
    //Modifiers
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    //Fallback function which rejects funds sent to the contract address if sender is not the owner
    function() public { 
        revert("Fallback function triggered"); 
    }  
}