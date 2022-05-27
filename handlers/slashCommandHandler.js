const {
  readdirSync
} = require("fs");

module.exports = async (client) => {
  try {
    let amount = 0;
    const slashCommandsArray = [];
    readdirSync("./slashCommands/").forEach((dir) => {
      const slashCommands = readdirSync(`./slashCommands/${dir}/`).filter((file) => file.endsWith(".js"));
      for (let file of slashCommands) {
        const pull = require(`../slashCommands/${dir}/${file}`);
        if (pull.name) {
          client.slashCommands.set(pull.name, pull);
          if (["MESSAGE", "USER"].includes(pull.type)) delete pull.description;
          slashCommandsArray.push(pull)
          amount++
        } else {
          try {
            client.logger(`Slash功能 未讀取: ${file}`.brightRed)
          } catch {
            /* */}
          continue;
        }
      }
    });
    client.logger(`${amount} Slash功能 讀取`.brightGreen);

    client.on("ready", async () => {
        try {
          // For 1 Server Only
          // await client.guilds.cache.get("server id").commands.set(slashCommandsArray);
          // For Global Server
          await client.application.commands.set(slashCommandsArray);
        } catch (error) {
          console.log(error)
        }
      })
  } catch (e) {
    console.log(e.message);
  }
}
