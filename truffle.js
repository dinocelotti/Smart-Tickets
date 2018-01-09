module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "testrpc",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4306940
    }
  }
};
