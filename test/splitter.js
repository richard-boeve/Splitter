const Splitter = artifacts.require("./Splitter.sol");
const BigNumber = require('bignumber.js');

contract('Splitter', (accounts) => {

  let split;
  const owner = accounts[0];
  const receiver1 = accounts[1];
  const receiver2 = accounts[2];
  let depositAmount = web3.toWei(0.1);
  const GAS_PRICE = 1000;

  beforeEach("Create a new instance", async () => {
    split = await Splitter.new({from: owner, gasPrice: GAS_PRICE})
  });

  it("owner can deposit to contract - Async", async () => {
    //Check the current balance of the contract and owner
    const contractStartingBalance = await web3.eth.getBalance(split.address);
    const ownerStartingBalance = await web3.eth.getBalance(owner);
    //Deposit to contract
    const depositTxReceipt = await split.deposit(receiver1, receiver2, { from: owner, value: depositAmount, gasPrice: GAS_PRICE });
    //Obtain gas from receipts
    const gasUsed = depositTxReceipt.receipt.gasUsed;
    //Calculate transaction cost
    const transCost = gasUsed * GAS_PRICE;
    //Checking the transaction event logs
    assert.equal(depositTxReceipt.logs[0].args.sender, owner, "Owner is incorrect");
    assert.equal(depositTxReceipt.logs[0].args.depositAmount, depositAmount, "Deposit amount  is incorrect");
    assert.equal(depositTxReceipt.logs[0].args.receiver1, receiver1, "Receiver 1 is incorrect");
    assert.equal(depositTxReceipt.logs[0].args.receiver2, receiver2, "Receiver 2 is incorrect");
    //Checking the balances on the blockchain
    assert.strictEqual((contractStartingBalance.plus(depositAmount)).toString(10), (await web3.eth.getBalance(split.address)).toString(10), "Contract balance is incorrect");
    assert.strictEqual((ownerStartingBalance.minus(depositAmount).minus(transCost)).toString(10), (await web3.eth.getBalance(owner)).toString(10), "Owner balance is incorrect");
    assert.equal(depositAmount / 2, (await split.balance(receiver1)), "Receiver1 balance is incorrect");
    assert.equal(depositAmount / 2, (await split.balance(receiver1)), "Receiver2 balance is incorrect");
  })

  it("receivers can withdraw from contract - Async", async () => {
    //Submit Deposit transaction
    const depositTxReceipt = await split.deposit(receiver1, receiver2, { from: owner, value: depositAmount });
    //Check balances after Deposit
    const receiver1StartingBalance = await web3.eth.getBalance(receiver1);
    const receiver2StartingBalance = await web3.eth.getBalance(receiver2);
    const contractStartingBalance = await web3.eth.getBalance(split.address);
    //Submit Witdraw transactions
    const withdrawTxReceiptReceiver1 = await split.withdrawFunds({ from: receiver1, gasPrice: GAS_PRICE });
    const withdrawTxReceiptReceiver2 = await split.withdrawFunds({ from: receiver2, gasPrice: GAS_PRICE });
    //Obtain gas from receipts
    const gasUsedReceiver1 = withdrawTxReceiptReceiver1.receipt.gasUsed;
    const gasUsedReceiver2 = withdrawTxReceiptReceiver2.receipt.gasUsed;
    //Calculate transaction cost
    const transCostReceiver1 = gasUsedReceiver1 * GAS_PRICE;
    const transCostReceiver2 = gasUsedReceiver2 * GAS_PRICE;
    //Checking the transaction event logs
    assert.equal(withdrawTxReceiptReceiver1.logs[0].args.sender, receiver1, "Sender incorrect");
    assert.equal(withdrawTxReceiptReceiver1.logs[0].args.amount, depositAmount / 2, "Amount incorrect");
    assert.equal(withdrawTxReceiptReceiver2.logs[0].args.sender, receiver2, "Sender incorrect");
    assert.equal(withdrawTxReceiptReceiver2.logs[0].args.amount, depositAmount / 2, "Amount incorrect");
    //Checking the balances on the blockchain
    assert.strictEqual(receiver1StartingBalance.plus(depositAmount / 2).minus(transCostReceiver1).toString(10), (await web3.eth.getBalance(receiver1)).toString(10), "Balance of receiver1 is incorrect");
    assert.strictEqual(receiver2StartingBalance.plus(depositAmount / 2).minus(transCostReceiver2).toString(10), (await web3.eth.getBalance(receiver2)).toString(10), "Balance of receiver1 is incorrect");
    assert.strictEqual(contractStartingBalance.minus(depositAmount).toString(10), (await web3.eth.getBalance(split.address)).toString(10), "Contract balance is incorrect");
  })
})

    
    
    
