// var bip39 = require("bip39");
// var hdkey = require('ethereumjs-wallet/hdkey');
var ProviderEngine = require("web3-provider-engine");
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
var Web3 = require("web3");

var providerUrl = "https://mainnet.infura.io/98gw0nPhWipDi8Q5bwvt";
var engine = new ProviderEngine();
// engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
engine.start(); // Required by the provider engine.

module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js",
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  networks: {
    "default": {
      provider: engine, // Use our custom provider
      from: 0x0// Use the address we derived
    }
  }
}
