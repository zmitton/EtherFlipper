module.exports = function(deployer, network) {
  console.log(network)
  deployer.deploy(Migrations);
};
