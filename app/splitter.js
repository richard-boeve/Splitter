const Web3 = require("web3");
const Promise = require("bluebird");
const $ = require("jquery");
const contract = require("truffle-contract");
const splitterJson = require("../build/contracts/Splitter.json");


if (typeof web3 !== 'undefined') {
    console.log('Web3 browser detected! ' + web3.currentProvider.constructor.name)
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
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
        .then(balance => $("#balanceAlice").html(web3.fromWei(balance.toString(10))))
        .catch(console.error);
});

window.addEventListener('load', function () {
    return web3.eth.getAccountsPromise()
        .then(accounts => {
            console.log(accounts);
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
            console.log(accounts);
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

require("file-loader?name=./index.html!./index.html");