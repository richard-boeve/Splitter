pragma solidity 0.4.24;

import "./Stoppable.sol";
import "./SafeMath.sol";

contract Splitter is Stoppable {

    //Using the SafeMath library
    using SafeMath for uint;

    //All events that can be logged
    event LogDeposit(address indexed sender, uint256 depositAmount, address indexed receiver1, address indexed receiver2);
    event LogWithdrawFunds(address indexed sender, uint amount);

    //Mapping of address to balance
    mapping(address => uint256) public balance;

    //Function that allows UI to query the balance of the contract
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }   
    
    //Allows the message sender to send Ether to the contract and have it assigned to the balance of two receiver addresses
    function deposit(address _receiver1, address _receiver2) public payable {
        uint256 half;
        // Verify that the contract is operational before continueing
        require(state == SplitterState.Operational, "Contract is not operational");
        // Verify non empty addresses have been provided
        require(_receiver1 != address(0), "Must provide two addresses");
        require(_receiver2 != address(0), "Must provide two addresses");
        // Verify receiver 1 address is not equal to receiver2 address  
        require(_receiver1 != _receiver2, "Must provide 2 different addresses");
        // If the msg.value is an uneven number
        if (msg.value % 2 != 0) {
            // Credit 1 wei to the address of the sender
            balance[msg.sender] += 1; 
        }
        // Remaining msg.value to be split between _receiver1 and _receiver2
        // If the msg.value is an uneven number, msg.value will be divided by two and the remainder will disappear
        half = msg.value / 2;
        balance[_receiver1] += half;
        balance[_receiver2] += half;
        emit LogDeposit(msg.sender, msg.value, _receiver1, _receiver2);
    }

    //Allow the message sender to retrieve his/her funds
    function withdrawFunds() public {
        // Verify that the contract isn't paused
        require(state != SplitterState.Paused, "Contract must be operational or deactivated to be able to withdraw");
        // Set the balance of the msg.sender to 0
        uint256 amountForWithdrawal = balance[msg.sender];
        balance[msg.sender] = 0;
        // Transfer the balance to the msg.sender
        address(msg.sender).transfer(amountForWithdrawal);
        // Create logs
        emit LogWithdrawFunds (msg.sender, amountForWithdrawal);
    }    
    
    //Fallback function which rejects funds sent to the contract address if sender is not the owner
    function() public { 
        revert("Fallback function triggered"); 
    }  
}