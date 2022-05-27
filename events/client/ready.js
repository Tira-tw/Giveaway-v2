const config = require(`../../botconfig/config.json`);
const Discord = require("discord.js");

module.exports = async (client) => {
  try {
    try {
      client.logger(`已偵測上線`.bold.brightGreen);

      client.logger(
        `Bot 名稱: `.brightBlue + `${client.user.tag}`.blue + `\n` +
        `加入幾個伺服器: `.brightBlue + `${client.guilds.cache.size} 伺服器`.blue + `\n` +
        `已偵測全部伺服器的成員人數: `.brightBlue + `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} 成員`.blue + `\n` +
        `Slash 指令: `.brightBlue + `${client.slashCommands.size}`.blue + `\n` +
        `Discord.js: `.brightBlue + `v${Discord.version}`.blue + `\n` +
        `Node.js: `.brightBlue + `${process.version}`.blue + `\n` +
        `系統: `.brightBlue + `${process.platform} ${process.arch}`.blue + `\n` +
        `記憶體: `.brightBlue + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`.blue
      );
    } catch{ /* */ }
  } catch (e) {
    console.log(e)
  }
}
