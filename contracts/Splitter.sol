pragma solidity 0.4.24;

contract Splitter {
    
    address public owner;

    enum SplitterState {
        Operational,
        Paused,
        Deactivated
    }
    
    event LogDeposit(address sender, uint256 depositAmount, uint256 amountToBeDivided, uint256 returnAmount, address receiver1, address receiver2);
    event LogWithdrawFunds(address sender, uint amount);
    
    // mapping of address to balance
    mapping(address => uint256) public balanceReceiver;
    
    // Variable to store the current state of this contract
    SplitterState public state;

    constructor() public payable {
        owner = msg.sender;
        state = SplitterState.Operational;
    }
    
    // Function that allows owner to change the state of the contract
    function setState(SplitterState newState) public {
        //Verify that the sender is the owner
        require(msg.sender == owner, "Only owner can set the state of the contract");
        //Verify if the state is Deactivated, if so, don't allow update to the state;
        require(state != SplitterState.Deactivated, "The contract is deactivated and can't be made operational or paused");
        //Set the state of the Contract
        state = newState;
    }
    
    function deposit(address _receiver1, address _receiver2) public payable {
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
        balanceReceiver[_receiver1] += msg.value / 2;
        balanceReceiver[_receiver2] += msg.value / 2;
        emit LogDeposit(msg.sender, msg.value, msg.value / 2, msg.value % 2, _receiver1, _receiver2);
    }
    
    function withdrawFunds() public {
        // Verify that the contract isn't paused
        require(state != SplitterState.Paused, "Contract must be operational or deactivated to be able to withdraw");
        // Set the balance of the msg.sender to 0
        uint256 amountForWithdrawal = balanceReceiver[msg.sender];
        balanceReceiver[msg.sender] = 0;
        // Transfer the balance to the msg.sender
        address(msg.sender).transfer(amountForWithdrawal);
        // Create logs
        emit LogWithdrawFunds (msg.sender, amountForWithdrawal);
    }    

        function() external {
    }
}