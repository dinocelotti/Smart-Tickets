// truffle migrate --network [dev|prod]
module.exports = {
  migrations_directory: "./migrations",
  networks: {
    dev: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4306940
    },
    prod: {
      host: "138.68.60.49",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4306940
    }
  }
};
