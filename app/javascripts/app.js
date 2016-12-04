// var ProviderEngine = require("../node_modules/web3-provider-engine");
// var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
// var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
// var Web3 = require("web3");


function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function flipACoin(web3Enabled){
  document.getElementById('coinAnimation').src='images/flip.gif'
  document.getElementById('outcome').innerHTML='Outcome: ...'
  // ToDo: setup the loading bar (exponential decay)
  // if(web3Enabled){
    web3.eth.getBlockNumber(function(e,referenceBlockNumber){
      setTimeout(function(){//wait 5 = extra magician protection
        document.getElementById('outcome').innerHTML='about 15 more seconds...'
        blockHashAfterBlock(referenceBlockNumber)
      }, 5000)
    })
  // }else{
  //   console.log("no web3 found")
  //   //To Do infura http requests!
  // }
}
function blockHashAfterBlock(referenceBlockNumber){
  web3.eth.getBlock(referenceBlockNumber+1, function(e,targetBlock){
    if(targetBlock){
      var outcome;
      console.log(targetBlock.hash)
      outcome = parseInt(targetBlock.hash.toString().slice(60), 16)%2==0 ? "HEADS":"TAILS"
      document.getElementById('coinAnimation').src='images/'+outcome+'.png'
      document.getElementById('outcome').innerHTML='Outcome: '+outcome
    }else{// targetBlock not mined yet. Check again in a second
      setTimeout(function(){blockHashAfterBlock(referenceBlockNumber)}, 1000)
    }
  })
}


window.onload = function() {
  console.log(web3.currentProvider)
  flipACoin()
}

function refreshGameData() {}
