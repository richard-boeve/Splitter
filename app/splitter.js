const Web3 = require("web3");
const Promise = require("bluebird");
const $ = require("jquery");
const contract = require("truffle-contract");
const splitterJson = require("../build/contracts/Splitter.json");

require("file-loader?name=./index.html!./index.html");

if (typeof web3 !== 'undefined') {
    console.log('Web3 browser detected! ' + web3.currentProvider.constructor.name)
    web3 = new Web3(web3.currentProvider);
} else {
    console.log('Web3 browser not detected, setting own provider!')
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

Promise.promisifyAll(web3.eth, { suffix: "Promise" });
Promise.promisifyAll(web3.version, { suffix: "Promise" });

const Splitter = contract(splitterJson);
Splitter.setProvider(web3.currentProvider);

window.addEventListener('load', function () {
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            console.log(accounts);
            if (accounts.length == 0) {
                $("#balanceAlice").html("N/A");
                throw new Error("No account with which to transact");
            }
            window.account = accounts[0];
            console.log("Account:", window.account);
            return web3.eth.getBalancePromise(window.account);
        })
        .then(balance => $("#balanceAlice").html(web3.fromWei(balance.valueOf())))
        .then(() => $("#send").click(deposit))
        .then(() => $("#withdrawBob").click(withdrawFundsBob))
        .then(() => $("#withdrawCarol").click(withdrawFundsCarol))
        .catch(console.error);
});

window.addEventListener('load', function () {
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            if (accounts.length == 0) {
                $("#balanceBob").html("N/A");
                throw new Error("No account with which to transact");
            }
            window.account = accounts[1];
            console.log("Account:", window.account);
            return web3.eth.getBalancePromise(window.account);
        })
        .then(balance => $("#balanceBob").html(web3.fromWei(balance.toString(10))
        ))
        .catch(console.error);
});

window.addEventListener('load', function () {
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            if (accounts.length == 0) {
                $("#balanceCarol").html("N/A");
                throw new Error("No account with which to transact");
            }
            window.account = accounts[2];
            console.log("Account:", window.account);
            return web3.eth.getBalancePromise(window.account);
        })
        .then(balance => $("#balanceCarol").html(web3.fromWei(balance.toString(10))
        ))
        .catch(console.error);
});

window.addEventListener('load', function () {
    return Splitter.deployed()
        .then(function (split) {
            return split.getContractBalance.call();
        }).then(balance => $("#balanceContract").html(web3.fromWei(balance.toString(10))
        ))
        .catch(console.error);
});

const deposit = function () {
    let split;
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            if (accounts.length == 0) {
                $("#balanceAlice").html("N/A");
                throw new Error("No account with which to transact");
            }
            window.account = accounts[0];
            console.log("Account to withdraw from:", window.account);
            return Splitter.deployed()
                .then(_split => {
                    split = _split;
                    return split.deposit.sendTransaction($("input[name='recipient1']").val(), $("input[name='recipient2']").val(), { from: window.account, value: web3.toWei($("input[name='amount']").val(), "ether") });
                })
                .then(txHash => {
                    $("#status").html("Transaction on the way " + txHash);
                    const tryAgain = () => web3.eth.getTransactionReceiptPromise(txHash)
                        .then(receipt => receipt !== null ?
                            receipt :
                            Promise.delay(1000).then(tryAgain));
                    return tryAgain();
                })
                .then(receipt => {
                    if (parseInt(receipt.status) != 1) {
                        console.error("Wrong status");
                        console.error(receipt);
                        $("#status").html("There was an error in the tx execution, status not 1");
                    } else if (receipt.logs.length == 0) {
                        console.error("Empty logs");
                        console.error(receipt);
                        $("#status").html("There was an error in the tx execution");
                    } else {
                        var help = split.LogDeposit().formatter(receipt.logs[0]);
                        console.log("Sender's address: " + help.args.sender);
                        console.log("Deposit amount: " + web3.fromWei(help.args.deposit));
                        console.log("Receiver 1: " + help.args.receiver1);
                        console.log("Receiver 2: " + help.args.receiver2);
                        //console.log(help.args.deposit);
                        $("#status").html("Transfer executed");
                    }
                    return web3.eth.getBalancePromise(window.account);
                })
                .then(balance => {
                    $("#balanceAlice").html(web3.fromWei(balance.valueOf()));
                    //set the new contract balance
                    return split.getContractBalance();
                })
                .then(balance => {
                    $("#balanceContract").html(web3.fromWei(balance.valueOf()));
                })
                .catch(e => {
                    $("#status").html(e.toString());
                    console.error(e);
                });
        })
};

const withdrawFundsBob = function () {
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            withdrawFunds(accounts[1]);
        })    
}

const withdrawFundsCarol = function () {
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            withdrawFunds(accounts[2]);
        })    
}

const withdrawFunds = function (accountToWithdraw) {
    let split;
    console.log(accountToWithdraw);
    return Splitter.deployed()
        .then(_split => {
            split = _split;
            return split.withdrawFunds.sendTransaction({ from: accountToWithdraw });
        })
        .then(txHash => {
            $("#status").html("Transaction on the way " + txHash);
            const tryAgain = () => web3.eth.getTransactionReceiptPromise(txHash)
                .then(receipt => receipt !== null ?
                    receipt :
                    Promise.delay(1000).then(tryAgain));
            return tryAgain();
        })
        .then(receipt => {
            if (parseInt(receipt.status) != 1) {
                console.error("Wrong status");
                console.error(receipt);
                $("#status").html("There was an error in the tx execution, status not 1");
            } else if (receipt.logs.length == 0) {
                console.error("Empty logs");
                console.error(receipt);
                $("#status").html("There was an error in the tx execution");
            } else {
                console.log(split.LogWithdrawFunds().formatter(receipt.logs[0]).args);
                $("#status").html("Transfer executed");
            }
        });
};

