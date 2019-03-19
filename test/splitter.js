const Splitter = artifacts.require("./Splitter.sol");
const truffleAssert = require('truffle-assertions');
const BN = require('bn.js');

contract('Splitter', (accounts) => {

  let split;
  const owner = accounts[0];
  const receiver1 = accounts[1];
  const receiver2 = accounts[2];
  let depositAmount = web3.utils.toBN(web3.utils.toWei('0.1', 'ether'));
  const GAS_PRICE = new BN(1000);
  let numberOfReceivers = new BN(2);

  beforeEach("Create a new instance", async () => {
    split = await Splitter.new({from: owner, gasPrice: GAS_PRICE})
  });

  it("owner can deposit to contract", async () => {
    //Check the current balance of the contract and owner
    const contractStartingBalance = new BN(await web3.eth.getBalance(split.address));
    const ownerStartingBalance = new BN(await web3.eth.getBalance(owner));
    //Deposit to contract
    const depositTxObject = await split.deposit(receiver1, receiver2, { from: owner, value: depositAmount, gasPrice: GAS_PRICE });
    console.log(depositAmount.toString(10));
    //Obtain gas from receipts
    const gasUsed = new BN(depositTxObject.receipt.gasUsed);
    //Calculate transaction cost
    const transCost = new BN(gasUsed.mul(GAS_PRICE));
    //Checking the transaction event logs
    assert.equal(depositTxObject.logs[0].args.sender, owner, "Sender is incorrect");
    assert.equal(depositTxObject.logs[0].args.depositAmount, depositAmount.toString(10), "Deposit amount is incorrect");
    assert.equal(depositTxObject.logs[0].args.receiver1, receiver1, "Receiver 1 is incorrect");
    assert.equal(depositTxObject.logs[0].args.receiver2, receiver2, "Receiver 2 is incorrect");
    //Checking the balances on the blockchain
    assert.strictEqual(contractStartingBalance.add(depositAmount).toString(10), 
    (await web3.eth.getBalance(split.address)).toString(10), "Contract balance is incorrect");
    assert.strictEqual(ownerStartingBalance.sub(depositAmount).sub(transCost).toString(10), 
    (await web3.eth.getBalance(owner)).toString(10), "Owner balance is incorrect");
    assert.strictEqual((depositAmount / 2).toString(10), (await split.balance(receiver1)).toString(10), "Receiver1 balance is incorrect");
    assert.strictEqual((depositAmount / 2).toString(10), (await split.balance(receiver1)).toString(10), "Receiver2 balance is incorrect");
  })

  it("receivers can withdraw from contract", async () => {
    //Submit Deposit transaction
    await split.deposit(receiver1, receiver2, { from: owner, value: depositAmount });
    //Check balances after Deposit
    const receiver1StartingBalance = new BN(await web3.eth.getBalance(receiver1));
    const receiver2StartingBalance = new BN(await web3.eth.getBalance(receiver2));
    const contractStartingBalance = new BN(await web3.eth.getBalance(split.address));
    //Submit Witdraw transactions
    const withdrawTxReceiptReceiver1 = await split.withdrawFunds({ from: receiver1, gasPrice: GAS_PRICE });
    const withdrawTxReceiptReceiver2 = await split.withdrawFunds({ from: receiver2, gasPrice: GAS_PRICE });
    //Obtain gas from receipts
    const gasUsedReceiver1 = new BN(withdrawTxReceiptReceiver1.receipt.gasUsed);
    const gasUsedReceiver2 = new BN(withdrawTxReceiptReceiver2.receipt.gasUsed);
    //Calculate transaction cost
    const transCostReceiver1 = new BN(gasUsedReceiver1.mul(GAS_PRICE));
    const transCostReceiver2 = new BN(gasUsedReceiver2.mul(GAS_PRICE));
    //Checking the transaction event logs
    assert.equal(withdrawTxReceiptReceiver1.logs[0].args.sender, receiver1, "Sender incorrect");
    assert.equal(withdrawTxReceiptReceiver1.logs[0].args.amount, depositAmount / 2, "Amount incorrect");
    assert.equal(withdrawTxReceiptReceiver2.logs[0].args.sender, receiver2, "Sender incorrect");
    assert.equal(withdrawTxReceiptReceiver2.logs[0].args.amount, depositAmount / 2, "Amount incorrect");
    //Checking the balances on the blockchain
    assert.strictEqual(receiver1StartingBalance.add(depositAmount.div(numberOfReceivers)).sub(transCostReceiver1).toString(10), 
    (await web3.eth.getBalance(receiver1)).toString(10), "Balance of receiver1 is incorrect");
    assert.strictEqual(receiver2StartingBalance.add(depositAmount.div(numberOfReceivers)).sub(transCostReceiver2).toString(10), 
    (await web3.eth.getBalance(receiver2)).toString(10), "Balance of receiver2 is incorrect");
    assert.strictEqual(contractStartingBalance.sub(depositAmount).toString(10), 
    (await web3.eth.getBalance(split.address)).toString(10), "Contract balance is incorrect");
  })

  it("can't withdraw if no balance", async () => {
    await truffleAssert.reverts(
      split.withdrawFunds({ from: receiver1, gasPrice: GAS_PRICE }),
      "There is no balance to withdraw"
    )
  })

  it("must have two receiver addresses when depositing", async () => {
    await truffleAssert.reverts(
      split.deposit(receiver1, receiver1, { from: owner, value: depositAmount }),
      "Must provide 2 different addresses"
    )
  })

})