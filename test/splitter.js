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
    it("should deposit to contract", function () {
    var amount = 3;
    return Splitter.deployed().then(function (instance) {
      return instance.deposit(receiver1, receiver2, { from: owner, value: amount });
    }).then(function (instance) {
      return instance.getContractBalance.call(instance);
    }).then(function (balance) {
       assert.equal(balanceC.toString(10), "3", "0 is not the balance of the contract");
    });
  });
})