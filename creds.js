const env = require("env2")("./.env");

module.exports = {
  username: process.env.GITHUB_USERNAME,
  password: process.env.GITHUB_PASSWORD
};

// console.log(process.env.GITHUB_USERNAME);
