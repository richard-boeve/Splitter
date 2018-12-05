pragma solidity 0.4.24;

contract Splitter {
    
    address public aliceOwner;
    address public bob;
    address public carol;
    uint256 balanceBob;
    uint256 balanceCarol;

    event LogDeposit(address sender, uint256 deposit, address receiver1, address receiver2, uint256 contractBalance);
    event LogWithdrawFunds(address sender, uint256 balanceBob, uint256 balanceCarol, uint256 contractBalance);
	
    constructor() public payable {
        aliceOwner = msg.sender;
    }
	
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }     

    function deposit(address receiver1, address receiver2) public payable returns (uint256, uint256, address, address, uint256) {
        require(msg.sender == aliceOwner, "Only Alice can deposit Ether");
        emit LogDeposit(msg.sender, msg.value, receiver1, receiver2, address(this).balance);
        bob = receiver1;
        carol = receiver2;
        balanceBob += msg.value /2;
        balanceCarol += msg.value /2;
        return (balanceBob, balanceCarol, bob, carol, address (this).balance);
    }
    
    function withdrawFunds() public returns (uint256) {
        if (msg.sender == bob) {
            address(bob).transfer(balanceBob);
            emit LogWithdrawFunds (msg.sender, balanceBob, balanceCarol, address(this).balance);
            return balanceBob = 0;
        } else if (msg.sender == carol) {
            address(carol).transfer(balanceCarol);
            emit LogWithdrawFunds (msg.sender, balanceBob, balanceCarol, address(this).balance);
            return balanceCarol = 0;
          } else {revert("You are not Bob or Carol");}
    }
    
    function() external payable {
    }
}           
