const Web3 = require("web3");
const Promise = require("bluebird");
const $ = require("jquery");
const contract = require("truffle-contract");
const splitterJson = require("../build/contracts/Splitter.json");

require("file-loader?name=./index.html!./index.html");

// Use a web3 browser if availble
    if (typeof web3 !== 'undefined') {
        console.log('Web3 browser detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new Web3(web3.currentProvider);
    // Otherwise, use a own provider with port 8545  
    } else {
        console.log('Web3 browser not detected, setting own provider!')
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    

Promise.promisifyAll(web3.eth, { suffix: "Promise" });
Promise.promisifyAll(web3.version, { suffix: "Promise" });

const Splitter = contract(splitterJson);
Splitter.setProvider(web3.currentProvider);

// Upon loading of the site check the balance of the contract and return to populate 
window.addEventListener('load', function () {
    return Splitter.deployed()
        .then(_split => {
            split = _split;
            return web3.eth.getBalancePromise(split.address);
        }).then(balance => $("#balanceContract").html(web3.fromWei(balance.toString(10))
        ))
        .then(() => $("#send").click(deposit))
        .then(() => $("#withdraw").click(withdrawFunds))
        .catch(console.error);
});

//Function that allows a deposit (for two receivers) to be made to the contract
const deposit = function () {
    let split;
    window.account = $("input[name='sender']").val();
    return Splitter.deployed()
        //deposit the entered amount of Ether to the contract, where the contract will split this between the entered recipient1 and recipient2
        .then(_split => {
            split = _split;
            console.log("Splitter address: ", split.address);
            return split.deposit.sendTransaction($("input[name='recipient1']").val(), $("input[name='recipient2']").val(), { from: window.account, value: web3.toWei($("input[name='amount']").val(), "ether"), gas: '210000' });
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
                let logDeposit = split.LogDeposit().formatter(receipt.logs[0]);
                console.log("Sender's address: " + logDeposit.args.sender);
                console.log("Amount deposited: " + web3.fromWei(logDeposit.args.depositAmount));
                console.log("Receiver 1: " + logDeposit.args.receiver1);
                console.log("Receiver 2: " + logDeposit.args.receiver2);
                $("#status").html("Transfer executed");
            }
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
}

// function that allows the inputted address to withdraw its funds from the contract
const withdrawFunds = function () {
    let split;
    accountToWithdraw = $("input[name='withdrawalAddress']").val();
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
                let logWithdraw = split.LogWithdrawFunds().formatter(receipt.logs[0]);
                console.log("Sender's address: " + logWithdraw.args.sender);
                console.log("Amount withdrawn: " + web3.fromWei(logWithdraw.args.amount));    
                $("#status").html("Transfer executed");
            }
            return split.getContractBalance();
        })
        //show the updated balance of the contract
        .then(balance => {
        $("#balanceContract").html(web3.fromWei(balance.valueOf()));
        })
        .catch(e => {
        $("#status").html(e.toString());
        console.error(e);
        });;
};

