pragma solidity 0.4.24;

import  "./Owned.sol";

contract Stoppable is Owned {
     
    //Global variables 
    SplitterState public state; 
    
    //Defining the possible states of the contract
    enum SplitterState {
        Operational,
        Paused,
        Deactivated
    }
    
    //Constructor, setting initial state upon contract creation
    constructor() public {
        state = SplitterState.Operational;
    }  
    
    //Event logs for when a state changes
    event LogSetState(address indexed sender, SplitterState indexed newState);
    
    //Function that allows owner to change the state of the contract
    function setState(SplitterState newState) public onlyOwner {
        //Verify if the state is Deactivated, if so, don't allow update to the state;
        require(state != SplitterState.Deactivated, "The contract is deactivated and can't be made operational or paused");
        //Set the state of the Contract
        state = newState;
        //Create logs
        emit LogSetState(msg.sender, newState);
    }
    
    //Fallback function which rejects funds sent to the contract address if sender is not the owner
    function() public { 
        revert("Fallback function triggered"); 
    }  
}