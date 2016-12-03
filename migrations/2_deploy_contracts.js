module.exports = function(deployer, network) {
  console.log(network)
  if(network != "default"){
    deployer.deploy(Flipper);
  }
};
