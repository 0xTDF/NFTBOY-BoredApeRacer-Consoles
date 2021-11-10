const Migrations = artifacts.require("Migrations");
const C = artifacts.require("./BARConsoles")

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(C);
};
