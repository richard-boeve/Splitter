pragma solidity 0.4.24;

contract Splitter {
    
    address public aliceOwner;
    address public bob;
    address public carol;
    uint256 balanceBob;
    uint256 balanceCarol;
    

    event LogDeposit(address sender, uint256 deposit, address receiver1, address receiver2);
    event LogWithdrawFunds(address sender);
	
    constructor() public payable {
        aliceOwner = msg.sender;
    }
	
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }


    function deposit(address receiver1, address receiver2) public payable returns (bool){
        require(msg.sender == aliceOwner, "Only Alice can deposit Ether");
        require(receiver1 != address(0), "Must provide two addresses");
        require(receiver2 != address(0), "Must provide two addresses");
        emit LogDeposit(msg.sender, msg.value, receiver1, receiver2);
        bob = receiver1;
        carol = receiver2;
        balanceBob += msg.value /2;
        balanceCarol += msg.value /2;
        return true;
    }
    
    function withdrawFunds() public returns (uint256) {
        uint amountBob = balanceBob;
        uint amountCarol = balanceCarol;
        if (msg.sender == bob) {
            balanceBob = 0;    
            address(bob).transfer(amountBob);
            emit LogWithdrawFunds (msg.sender);
        } else if (msg.sender == carol) {
            balanceCarol = 0;
            address(carol).transfer(amountCarol);
            emit LogWithdrawFunds (msg.sender);
          } else { revert(); }
    }
    
    function() external {
    }
}    