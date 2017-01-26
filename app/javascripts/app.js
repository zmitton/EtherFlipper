var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"))

window.onload = function() {
  if (web3.isConnected()){ setTimeout(flipACoin, 2000) }//waiting prevents attacks
  else{ document.getElementById('outcome').innerHTML='COULD NOT CONNECT TO ETHEREUM' }
}
function flipACoin(web3Enabled){
  web3.eth.getBlockNumber(function(e,referenceBlockNumber){
    document.getElementById('outcome').innerHTML='about 15 more seconds...'
    getFutureBlockHash(referenceBlockNumber + 1, showCoinSolution)
  })
}

function getFutureBlockHash(targetBlockNumber, callback){
  web3.eth.getBlock(targetBlockNumber, function(e,targetBlock){
    if(targetBlock){
      callback(targetBlock.hash)
    }else{// targetBlock not mined yet. Check again in 2 seconds
      setTimeout(function(){getFutureBlockHash(targetBlockNumber, callback)}, 2000)
    }
  })
}
var showCoinSolution = function(sha3){
  console.log("blockhash:", sha3)
  var outcome = parseInt(sha3.toString().slice(60), 16)%2==0 ? "HEADS":"TAILS"
  document.getElementById('coinAnimation').src='images/'+outcome+'.png'
  document.getElementById('outcome').innerHTML='Outcome: '+outcome
}
