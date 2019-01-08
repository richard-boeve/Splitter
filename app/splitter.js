const Web3 = require("web3");
const Promise = require("bluebird");
const $ = require("jquery");
const contract = require("truffle-contract");
const splitterJson = require("../build/contracts/Splitter.json");

require("file-loader?name=./index.html!./index.html");

// Use a web3 browser if availble
if (typeof web3 !== 'undefined') {
    console.log('Web3 browser detected! ' + web3.currentProvider.constructor.name)
    web3 = new Web3(web3.currentProvider);
// Otherwise, use a own provider with port 8545  
} else {
    console.log('Web3 browser not detected, setting own provider!')
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

Promise.promisifyAll(web3.eth, { suffix: "Promise" });
Promise.promisifyAll(web3.version, { suffix: "Promise" });

const Splitter = contract(splitterJson);
Splitter.setProvider(web3.currentProvider);

// Upon loading of the site 
window.addEventListener('load', function () {
    //check if accounts are available
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            console.log(accounts);
            //when no accounts available, return error
            if (accounts.length == 0) {
                $("#balanceAlice").html("N/A");
                throw new Error("No account with which to transact");
            }
            //if accounts available, set the first one to window account
            window.account = accounts[0];
            console.log("Account:", window.account);
            return web3.eth.getBalancePromise(window.account);
        })
        // window account to populate Alice's balance
        .then(balance => $("#balanceAlice").html(web3.fromWei(balance.valueOf())))
        .then(() => $("#send").click(deposit))
        .then(() => $("#withdrawBob").click(withdrawFundsBob))
        .then(() => $("#withdrawCarol").click(withdrawFundsCarol))
        .catch(console.error);
});

// Upon loading of the site 
window.addEventListener('load', function () {
    //check if accounts are available
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            //when no accounts available, return error
            if (accounts.length == 0) {
                $("#balanceBob").html("N/A");
                throw new Error("No account with which to transact");
            }
            //if accounts available, set the second one to window account
            window.account = accounts[1];
            console.log("Account:", window.account);
            return web3.eth.getBalancePromise(window.account);
        })
        // window account to populate Bob's balance
        .then(balance => $("#balanceBob").html(web3.fromWei(balance.toString(10))
        ))
        .catch(console.error);
});

// Upon loading of the site 
window.addEventListener('load', function () {
    //check if accounts are available
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            //when no accounts available, return error
            if (accounts.length == 0) {
                $("#balanceCarol").html("N/A");
                throw new Error("No account with which to transact");
            }
            //if accounts available, set the third one to window account
            window.account = accounts[2];
            console.log("Account:", window.account);
            return web3.eth.getBalancePromise(window.account);
        })
        // window account to populate Carol's balance
        .then(balance => $("#balanceCarol").html(web3.fromWei(balance.toString(10))
        ))
        .catch(console.error);
});

// Upon loading of the site check the balance of the contract and return to populate 
window.addEventListener('load', function () {
    return Splitter.deployed()
        .then(function (split) {
            return split.getContractBalance.call();
        }).then(balance => $("#balanceContract").html(web3.fromWei(balance.toString(10))
        ))
        .catch(console.error);
});

// function that allows Alice to deposit from her account to the Splitter contract
const deposit = function () {
    let split;
    //return all accounts
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            //if no accounts returned, show error message
            if (accounts.length == 0) {
                $("#balanceAlice").html("N/A");
                throw new Error("No account with which to transact");
            }
            //set Alice's account as the window account
            window.account = accounts[0];
            console.log("Account to withdraw from:", window.account);
            return Splitter.deployed()
            //deposit the entered amount of Ether to the contract, where the contract will split this between the entered recipient1 and recipient2
                .then(_split => {
                    split = _split;
                    console.log("Splitter address: ", split.address);
                    console.log(split)
                    return split.deposit.sendTransaction($("input[name='recipient1']").val(), $("input[name='recipient2']").val(), { from: window.account, value: web3.toWei($("input[name='amount']").val(), "ether"), gas:'210000' });
                })
                //return the transaction hash
                .then(txHash => {
                    $("#status").html("Transaction on the way " + txHash);
                    const tryAgain = () => web3.eth.getTransactionReceiptPromise(txHash)
                        .then(receipt => receipt !== null ?
                            receipt :
                            Promise.delay(1000).then(tryAgain));
                    return tryAgain();
                })
                //return a success or failure of the transaction
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
                // show the updated balance of Alice 
                .then(balance => {
                    $("#balanceAlice").html(web3.fromWei(balance.valueOf()));
                    //set the new contract balance
                    return split.getContractBalance();
                })
                //show the updated balance of the contract
                .then(balance => {
                    $("#balanceContract").html(web3.fromWei(balance.valueOf()));
                })
                .catch(e => {
                    $("#status").html(e.toString());
                    console.error(e);
                });
        })
};

//Bob withdraws, creating an input for the 'withdrawFunds' function
const withdrawFundsBob = function () {
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            withdrawFunds(accounts[1]);
        })    
}

//Carol withdraws, creating an input for the 'withdrawFunds' function
const withdrawFundsCarol = function () {
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            withdrawFunds(accounts[2]);
        })    
}

// function to withdrawfunds by either Carol or Bob (their accounts are an input for this function)
const withdrawFunds = function (accountToWithdraw) {
    let split;
    console.log(accountToWithdraw);
    return Splitter.deployed()
    //Run the withdrawFunds function in the contract for one of the recipients
        .then(_split => {
            split = _split;
            return split.withdrawFunds.sendTransaction({ from: accountToWithdraw });
        })
        //return the transaction hash
        .then(txHash => {
            $("#status").html("Transaction on the way " + txHash);
            const tryAgain = () => web3.eth.getTransactionReceiptPromise(txHash)
                .then(receipt => receipt !== null ?
                    receipt :
                    Promise.delay(1000).then(tryAgain));
            return tryAgain();
        })
        //return a success of failure message
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

