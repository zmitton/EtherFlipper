contract('Flipper', function(accounts) {
  it("should play a fair game", function() {
    var flipper = Flipper.deployed();
    var ping = Ping.deployed();
    console.log("ACCOUNT_0:", Math.round(web3.eth.getBalance(accounts[0]).toNumber()/1e18))
    console.log("ACCOUNT_1:", Math.round(web3.eth.getBalance(accounts[1]).toNumber()/1e18), "\n")
    return flipper.game.call().then((game) => {
      assert.equal(game.toNumber(), 0, "init state should be 0 meaning 'open'")
      return flipper.createGame({from: accounts[0], value: 5*1e18})
    }).then((balance) => {
      return flipper.game.call()
    }).then((game) => {
      assert.equal(game.toNumber(), 1, "state should be 1 meaning 'offerMade'")
      return flipper.joinGame({from: accounts[1], value: 5*1e18})
    }).then(() => {
      return flipper.game.call()
    }).then((game) => {
      assert.equal(game.toNumber(), 2, "state should be 2 meaning 'gameOn'")
      return ping.increment({from: accounts[2]})//(testRPC hack) causes a block to be mined
    }).then(() => {
      return ping.increment({from: accounts[2]})//(testRPC hack) causes a block to be mined
    }).then(() => {
      return flipper.game.call()
    }).then((game) => {
      assert.equal(game.toNumber(), 2, "state should still be 2 meaning 'gameOn'")
      return flipper.settle({from: accounts[2]})
    }).then(() => {
      return flipper.game.call()
    }).then((game) => {
      assert.equal(game.toNumber(), 0, "state should reset to 0 meaning 'open'")
      console.log("ACCOUNT_0:", Math.round(web3.eth.getBalance(accounts[0]).toNumber()/1e18))
      console.log("ACCOUNT_1:", Math.round(web3.eth.getBalance(accounts[1]).toNumber()/1e18))
      return 0
    })
  });
});
