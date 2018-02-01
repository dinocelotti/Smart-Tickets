// truffle migrate --network [dev|prod]
module.exports = {
  migrations_directory: "./migrations",
  networks: {
<<<<<<< HEAD
    dev: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4306940
    },
    prod: {
      host: "138.68.60.49",
=======
    development: {
      host: "localhost",
>>>>>>> origin/master
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4306940
    }
  }
};
