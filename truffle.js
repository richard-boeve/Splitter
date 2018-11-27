const Web3 = require("web3");
const net = require("net");

module.exports = {
  networks: {
    ropsten: {
      provider: new Web3.providers.IpcProvider(process.env['HOME'] + "/.ethereum/testnet/data/geth.ipc", net),
      network_id: 3,
      gas: 500000
    }
  }
};
