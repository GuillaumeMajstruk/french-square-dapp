const Migrations = artifacts.require("Migrations");
const FSToken = artifacts.require("FST");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(FSToken, 1000000000, 'FSToken', 4, 'FST');
};
