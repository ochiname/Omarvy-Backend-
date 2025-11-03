const path = require("path");
require("ts-node").register({
  transpileOnly: true,
});

const knexfilePath = path.resolve(__dirname, "src", "knexfile.ts");
module.exports = require(knexfilePath).default;