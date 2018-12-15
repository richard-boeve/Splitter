var Splitter = artifacts.require("./Splitter.sol");

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

// contract('Splitter', function (accounts) {
//   owner = accounts[0];
//   receiver1 = accounts[1];
//   receiver2 = accounts[2];
//   balanceReceiver1 = 1.5;
//   it("verifies that receiver can withdraw funds", function () {
//   var amount = 1.5;
//   return Splitter.deployed().then(function (instance) {
//     splitter = instance;
//     return splitter.withdrawFunds({from: accounts[1]});
//   }).then(function () {
//     return splitter.getContractBalance.call(splitter);
//   }).then(function (balanceC) {
//      assert.equal(balanceC.toString(10), "3", "0 is not the balance of the contract");
//   });
// });
// })