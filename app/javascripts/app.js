var accounts;
var account;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshGameData() {
  refreshBalance()
  refreshGameState()
  refreshBuyIn()
  refreshContractAddress()
  refreshNetworkName()
}

function refreshNetworkName() {
  web3.version.getNetwork(function(e, response){
    if(!e){
      var network_element = document.getElementById("network");
      if(response == 1){
        network_element.innerHTML = "Ethereum (MainNet)";
      }else if(response == 2){
        network_element.innerHTML = "Morden";
      }else if(response == 3){
        network_element.innerHTML = "Ropsten";
      }else{
        network_element.innerHTML = "error"
      }
    }else{
      setStatus("Error getting network; see log.");
    }
  });
}

function refreshContractAddress() {
  var flipper = Flipper.deployed();
  var contract_address_element = document.getElementById("contractAddress");
  contract_address_element.innerHTML = flipper.address;
}

function refreshBalance() {
  web3.eth.getBalance(account, function(e, response){
    if(!e){
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = Math.round(response.valueOf()/1e15)/1000
    }else{
      setStatus("Error getting balance; see log.");
    }
  });
}

function refreshGameState() {
  var flipper = Flipper.deployed();
  var states = ["Open", "Offer Made", "Game On"];

  flipper.game.call().then(function(game) {
    var gameElement = document.getElementById("game");
    gameElement.innerHTML = states[game.valueOf()];
    // setWinChecker(game.valueOf() == 2)
    if(game.valueOf() == 2){ refreshWinnerStatus() }
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; see logs");
  });
};

function refreshBuyIn() {
  var flipper = Flipper.deployed();

  flipper.buyIn.call().then(function(buyIn) {
    var buyInElement = document.getElementById("buyIn");
    buyInElement.innerHTML = Math.round(buyIn.valueOf()/1e15)/1000;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; see logs");
  });
};

function refreshWinnerStatus(){
  web3.eth.getBlockNumber(function(e, response){
    if(!e){
      var currentBlockNumber = response.valueOf()
      var flipper = Flipper.deployed();

      flipper.seedBlock.call().then(function(seedBlockNumber) {

        var winnerElement = document.getElementById("winner");
        if(currentBlockNumber >= seedBlockNumber){
          winnerElement.innerHTML = "Winner has been drawn!";
          // setWinChecker(false);
        }else{
          winnerElement.innerHTML = "Waiting for winner";
        }
      }).catch(function(e) {
        console.log(e);
        setStatus("Error; see log.");
      });
    }else{
      setStatus("Error; see log.");
    }
  });
}

function flipACoin(web3Enabled){
  if(web3Enabled){
    web3.eth.getBlockNumber(function(e,referenceBlockNumber){
      //setup the coin animation and/or loading bar
      blockHashAfterBlock(referenceBlockNumber)
    })
  }else{
    //infura http requests!
  }
}


function blockHashAfterBlock(referenceBlockNumber){
  web3.eth.getBlock(referenceBlockNumber+1, function(e,currentBlock){
    if(currentBlock){
      if(parseInt(currentBlock.hash.toString().slice(60), 16)%2==0){
        document.getElementById('coinAnimation').src='images/heads.png'
        console.log("HEADS");
      }else{
        document.getElementById('coinAnimation').src='images/tails.png'
        console.log("TAILS");
      }
    }else{//next block not mined yet
      setTimeout(function(){blockHashAfterBlock(referenceBlockNumber)}, 1000)
    }
  })
}

function createGame() {
  var flipper = Flipper.deployed();

  var amount = parseInt(document.getElementById("amount").value * 1e18);

  setStatus("Initiating transaction... (please wait)");

  flipper.createGame({from: account, value: amount}).then(function() {
    setStatus("Transaction complete! Game has been Created");
    refreshGameData()
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; see log.");
  });
};


function joinGame() {
  var flipper = Flipper.deployed();

  var amount = parseInt(document.getElementById("buyIn").innerHTML * 1e18);

  setStatus("Initiating transaction... (please wait)");

  flipper.joinGame({from: account, value: amount}).then(function() {
    setStatus("Transaction complete! Game has been Joined");
    refreshGameData()
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; see log.");
  });
};

function settle() {
  var flipper = Flipper.deployed();

  setStatus("Initiating transaction... (please wait)");

  flipper.settle({from: account}).then(function() {
    setStatus("Transaction complete! Bet has been settled");
    refreshGameData()
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; see log.");
  });
};

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      flipACoin(false);
      alert("There was an error fetching your accounts.");
      return;
    }
    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }
    accounts = accs;
    account = accounts[0];
    flipACoin(true)
    // refreshGameData()
  });
}

