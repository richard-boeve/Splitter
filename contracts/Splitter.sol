pragma solidity 0.4.24;

contract Splitter {
    
    //Global Variables
    address public owner;
    SplitterState public state;
    
    //Constructor, setting initial properties
    constructor() public {
        owner = msg.sender;
        state = SplitterState.Operational;
    }

    //Modifiers
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    //Defining the possible states of the contract
    enum SplitterState {
        Operational,
        Paused,
        Deactivated
    }
    
    //All events that can be logged
    event LogDeposit(address indexed sender, uint256 depositAmount, address indexed receiver1, address indexed receiver2);
    event LogWithdrawFunds(address indexed sender, uint amount);
    event LogSetState(address indexed sender, SplitterState indexed newState);
    
    //Mapping of address to balance
    mapping(address => uint256) public balanceReceiver;

    //Function that allows owner to change the state of the contract
    function setState(SplitterState newState) public onlyOwner {
        //Verify if the state is Deactivated, if so, don't allow update to the state;
        require(state != SplitterState.Deactivated, "The contract is deactivated and can't be made operational or paused");
        //Set the state of the Contract
        state = newState;
        //Create logs
        emit LogSetState(msg.sender, newState);
    }

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
            balanceReceiver[msg.sender] += 1; 
        }
        // Remaining msg.value to be split between _receiver1 and _receiver2
        // If the msg.value is an uneven number, msg.value will be divided by two and the remainder will disappear
        half = msg.value / 2;
        balanceReceiver[_receiver1] += half;
        balanceReceiver[_receiver2] += half;
        emit LogDeposit(msg.sender, msg.value, _receiver1, _receiver2);
    }

    //Allow the message sender to retrieve his/her funds
    function withdrawFunds() public {
        // Verify that the contract isn't paused
        require(state != SplitterState.Paused, "Contract must be operational or deactivated to be able to withdraw");
        // Set the balance of the msg.sender to 0
        uint256 amountForWithdrawal = balanceReceiver[msg.sender];
        balanceReceiver[msg.sender] = 0;
        // Create logs
        emit LogWithdrawFunds (msg.sender, amountForWithdrawal);
        // Transfer the balance to the msg.sender
        address(msg.sender).transfer(amountForWithdrawal);
    }    
    
    //Fallback function which rejects funds sent to the contract address if sender is not the owner
    function() public { 
        revert("Fallback function triggered"); 
    }  
}