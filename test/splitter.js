var Splitter = artifacts.require("./Splitter.sol");

//TEST USING PROMISES

contract('Splitter', function () {
  it("should return address of splitter contract deployed", function () {
    return Splitter.deployed().then(function (instance) {
      return instance.address
    }).then(function (splitterAdr) {
      console.log(splitterAdr);
    });
  });
})

contract('Splitter', function () {
  it("should return balance of contract deployed", function () {
    return Splitter.deployed().then(function (instance) {
      return instance.getContractBalance.call(instance);
    }).then(function (balanceC) {
      console.log(balanceC.toString(10));
      assert.equal(balanceC.toString(10), "0", "0 is not the balance of the contract");
    });
  });
})

contract('Splitter', function (accounts) {
  owner = accounts[0];
  receiver1 = accounts[1];
  receiver2 = accounts[2];
  it("owner can deposit to contract", function () {
    var amount = 3;
    return Splitter.deployed().then(function (instance) {
      splitter = instance;
      return splitter.deposit(receiver1, receiver2, { from: owner, value: amount });
    }).then(function () {
      return splitter.getContractBalance.call(splitter);
    }).then(function (balanceC) {
      assert.equal(balanceC.toString(10), "3", "The contract balance is incorrect");
    });
  });
})

//TESTS USING ASYNC

contract('Splitter', function () {
  it("should return address of splitter contract deployed - Async", async function () {
    let split = await Splitter.deployed();
    let address = await split.address;
    console.log(address);
  })
})

contract('Splitter', function () {
  it("should return balance of contract deployed - Async", async function () {
    let split = await Splitter.deployed();
    let balance = await split.getContractBalance.call(split);
    console.log(balance.toString(10));
    assert.equal(balance.toString(10), "0", "0 is not the balance of the contract");
  });
})

contract('Splitter', function (accounts) {
  owner = accounts[0];
  receiver1 = accounts[1];
  receiver2 = accounts[2];
  it("owner can deposit to contract - Async", async function () {
    var amount = 3;
    let split = await Splitter.deployed();
    split.deposit(receiver1, receiver2, { from: owner, value: amount });
    let balance = await split.getContractBalance.call(split);
    assert.equal(balance.toString(10), "3", "The contract balance is incorrect");
  });
})


contract('Splitter', async (accounts) => {
    let owner = accounts[0];
    let receiver1 = accounts[1];
    let receiver2 = accounts[2];
 
    
    it("verify everyting is set up correctly and set split - Async", async () => {
        // Retrieve the splitter contract instance
        let split = await Splitter.deployed();
        // Should verify the contract balance is Zero
        assert.equal(0, await split.getContractBalance().valueOf(), "The contract balance needs to be 0");
      })

    it("owner can deposit to contract - Async", async () => {
        // Amount of ether in wei to deposit
        var amountToDeposit = 2000000;
        let split = await Splitter.deployed();
        // Retrieve the current balance of the contract
        var oldBalance = await split.getContractBalance.call();
        // Execute the deposit and save the transaction receipt
        var receipt = await split.deposit(receiver1, receiver2, { from: owner, value: amountToDeposit, gas: 210000 });
        // Test the results returned in the transaction receipt (e.g. Event log files)
        assert.equal(receipt.logs[0].args.sender, owner, "Owner is incorrect");          
        assert.equal(receipt.logs[0].args.deposit.valueOf(), amountToDeposit, "Deposit amount event log file entry is incorrect");
        assert.equal(receipt.logs[0].args.receiver1, receiver1, "Receiver 1 event log file entry is incorrect");
        assert.equal(receipt.logs[0].args.receiver2, receiver2, "Receiver 2 event log file entry is incorrect");
        //Get the new balance of the splitter contract
        let newBalance = await split.getContractBalance();
        // Verify the new balance is correct (sum of old balance plus whatever has been added)
        assert.equal(newBalance.valueOf(), +amountToDeposit + +oldBalance.valueOf(), "The new contract balance is incorrect");
      });

    it("receiver1 can withdraw from contract - Async", async () => {
      //amount of ether to withdraw
      let split = await Splitter.deployed();
      let gasused = 21024;
      const oldContractBalance = await split.getContractBalance.call();
      console.log("Old contract balance:", oldContractBalance.valueOf());
      const receiver1_starting_balance = await web3.eth.getBalance(receiver1);
      console.log("Receiver 1 starting balance:", receiver1_starting_balance.valueOf());
      let withdraw = await split.withdrawFunds({from: receiver1});
      const receiver1_end_balance = await web3.eth.getBalance(receiver1);
      console.log("Receiver 1 end balance:", receiver1_end_balance.valueOf());
      const newContractBalance = await split.getContractBalance.call();
      console.log("New Contract Balance:", newContractBalance.valueOf());
      const amountWithdrawn = oldContractBalance - newContractBalance;
      console.log("Amount withdrawn:", amountWithdrawn.valueOf());
      const newReceiver1Balance = receiver1_starting_balance + amountWithdrawn - gasused;
      console.log("New balance Receiver1:", newReceiver1Balance.valueOf());
      // Verify that receiver1 has the correct balance after withdrawing
      assert.equal(receiver1_end_balance, receiver1_starting_balance + amountWithdrawn - gasused, "The balance of receiver1 after withdrawal is incorrect");
      // Verify that the contract has the correct balance after withdrawing
      assert.equal(newContractBalance, oldContractBalance - amountWithdrawn, "New contract balance is incorrect" );
       })
  })
