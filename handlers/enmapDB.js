const Enmap = require("enmap");

module.exports = async (client) => {
  client.giveaways = new Enmap({
    name: "giveaways",
    dataDir: "./databases/giveaways"
  });
  client.logger(`EnmapDB 已讀取`.brightGreen);
}

