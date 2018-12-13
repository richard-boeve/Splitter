var Splitter = artifacts.require("./contracts/Splitter.sol");

if (typeof web3 !== 'undefined') {
    console.log('Web3 browser detected! ' + web3.currentProvider.constructor.name)
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    console.log('Web3 browser not detected, setting own provider!')
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.eth.getCoinbase(function (err, coinbase) {
    if (err) {
        console.error(err);
    } else {
        console.log("Coinbase: " + coinbase);
    }
});

//const Splitter = "0xb7edd77ab6a502aac1200ebc8005885a6ca7852f";
const coinbase = "0xe3eb6f6bf2a45bf27a2b86e6ae466b4ac46dbcd5"

// Query blockchain directly
web3.eth.getBalance(Splitter, function (err, balance) {
    if (err) {
        console.error(err);
    } else {
        console.log("Contract balance: " + balance);
    }
});

function splitterBalance() {
    web3.eth.getBalance(Splitter, function (err, balance) {
        if (err) {
            console.error(err);
        } else {
            document.getElementById("splitterBalance").innerHTML = balance;
        }
    })
}

function aliceBalance() {
    web3.eth.getBalance(coinbase, function (err, balance) {
        if (err) {
            console.error(err);
        } else {
            let balanceEther = web3.fromWei(balance, 'ether');
            document.getElementById("aliceBalance").innerHTML = balanceEther;
        }
    })
}

// Query via Splitter contract

function getContractBalance() {
    Splitter.deployed().then(function (instance) {
        console.log(instance.address);
    })}    

//         const split;
//         split = instance;
//         return split.getContractBalance();
//     }).then(function (result) {
//         // If this callback is called, the transaction was successfully processed.
//         alert("Transaction successful!");
//         document.getElementById("contractBalance").innerHTML = result;
//     }).catch(function (e) {
//         // There was an error! Handle it.
//     })
// }