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

contract('Splitter', function () {
  it("should deposit to contract", function () {
    return Splitter.deployed().then(function (instance) {
      return instance.deposit;
    }).then(function (balanceC) {
      console.log(balanceC.toString(10));
      assert.equal(balanceC.toString(10), "0", "0 is not the balance of the contract");
    });
  });
})