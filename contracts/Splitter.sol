pragma solidity ^0.4.18;

contract Splitter {
    
    address public alice;
    address public bob;
    address public carol;
    uint256 public deposit;

	function Splitter() public payable {
		alice = msg.sender;
		bob =   0x0583031D1113Ad414F02576bd6AFAbfb30214022;
		carol = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
	}
	
	function getBalance() public view returns (uint256) {
         return address(this).balance;
    }
    
   function getBalanceAlice() public view returns (uint256) {
        return address(alice).balance;
    }
    
    function depositEther() public payable returns (uint256) {
        return deposit = msg.value;
    }
    
    function splitContractBalance() public {
        uint256 balance = address(this).balance;
        alice.transfer(balance / 2);
    }
    
     function() public payable {
    }
}           
        
        
    //     if(this.balance > 0) {
    //         if(!bob.send(this.balance /2) || !carol.send(this.balance /2))
    //             revert();
    //         return false;
    //         }
    //         else {
    //             send_amount((bob, this.balance /2) || (carol, this.balance /2));
    //         return true;    
    //         }
    // }

