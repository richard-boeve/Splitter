pragma solidity ^0.5.0;

contract Splitter {
    
    address public alice;
    address payable public bob;
    address payable public carol;
    uint256 public deposit;
    
    event LogDepositEther(address sender, uint256 deposit);
    event LogSplitContractBalance(uint256 balance, uint256 amountTransfered, address bob, uint256 bobBalance, address carol, uint256 carolBalance);
	
	constructor() public payable {
		alice = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;
		bob = 0x583031D1113aD414F02576BD6afaBfb302140225;
		carol = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
	}
	
	function getBalance() public view returns (uint256) {
         return address(this).balance;
    }
    
   function getBalanceAlice() public view returns (uint256) {
        return address(alice).balance;
    }
    
    function getBalanceBob() public view returns (uint256) {
        return address(bob).balance;
    }
    
    function getBalanceCarol() public view returns (uint256) {
        return address(carol).balance;
    }
    
    function depositEther() public payable returns (uint256) {
        require(msg.sender == alice, "Only Alice can deposit Ether");
        emit LogDepositEther(msg.sender, msg.value);
        return deposit = msg.value;
    }
    
    function splitContractBalance() public payable {
        require(msg.sender == alice, "Only Alice can split the balance");
        uint256 halfBalance = address(this).balance / 2;
        address(bob).transfer(halfBalance);
        address(carol).transfer(halfBalance);
        emit LogSplitContractBalance(address(this).balance, halfBalance, bob, bob.balance, carol, carol.balance);
    }
    
     function() external payable {
    }
}           
       


