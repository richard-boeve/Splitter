// ~/DAPPS/faucet_barebone/app/faucet.js
if (typeof web3 !== 'undefined') {
    // Don't lose an existing provider, like Mist or Metamask
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
web3.eth.getCoinbase(function(err, coinbase) {
    if (err) {
        console.error(err);
    } else {
        console.log("Coinbase: " + coinbase);
    }
});

// Your deployed address changes every time you deploy.
const splitterAddress = "0xdf87C00e9c96B32B1531DCDA51b7777fb386f48F"; // <-- Put your own

// Query eth for balance
web3.eth.getBalance(splitterAddress, function(err, balance) {
    if (err) {
        console.error(err);
    } else {
        console.log("Contract balance: " + balance);
    }
});

function splitterBalance() {
    web3.eth.getBalance(splitterAddress, function(err, balance) {
        if (err) {
            console.error(err);
            } else {
                return balance;
            }
})}



// function topUp() {
//     web3.eth.getCoinbase(function(err, coinbase) {
//         if (err) {
//             console.error(err);
//         } else {
//             web3.eth.sendTransaction({ 
//                 from: coinbase, 
//                 to: faucetAddress,
//                 value: web3.toWei(1, "ether") 
//             }, function(err, txn) {
//                 if (err) {
//                     console.error(err);
//                 } else {
//                     console.log("topUp txn: " + txn);
//                 }
//             });
//         }
//     });
// }

// function sendWei() {
//     web3.eth.getCoinbase(function(err, coinbase) {
//         if (err) {
//             console.error(err);
//         } else {
//             web3.eth.getAccounts(function(err, accounts) {
//                 if (err) {
//                     console.error(err);
//                 } else {
//                     const targetAccount = accounts[1];      
//                     faucetInstance.sendWei(
//                         targetAccount,
//                         { from: coinbase },
//                         function(err, txn) {
//                             if (err) {
//                                 console.error(err);
//                             } else {
//                                 console.log("sendWei txn: " + txn);
//                             }
//                         });
//                 }
//             });
//         }
//     });
// }   