pragma solidity 0.4.24;

contract Splitter {
    
    address public alice;
    address public bob;
    address public carol;
    uint256 public deposit;
    
    event LogDepositEther(address sender, uint256 deposit);
    event LogSplitContractBalance(uint256 balance, uint256 amountTransfered, address bob, uint256 bobBalance, address carol, uint256 carolBalance);
	
    constructor() public payable {
        alice = 0x9553bAA8E83950876A1a0fe52093c031a4724C33;
        bob = 0xb3B140AA48800c455c013f5504E6532e2D36cfc6;
        carol = 0xd449e6a9de1027D9ac9Cb1A492468348741461Be;
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