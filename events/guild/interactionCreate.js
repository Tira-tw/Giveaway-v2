const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const {
	MessageEmbed,
	Collection
} = require("discord.js");
const Discord = require("discord.js");
const {
	onCoolDown,
} = require(`../../handlers/functions`);

module.exports = async (client, interaction) => {
	try {
    if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;
    if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) 
    return interaction.reply({content: `❌ 我需要權限 \`USE_EXTERNAL_EMOJIS\`` })
    if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS)) 
    return interaction.reply({content: `${client.allEmojis.x} 我需要權限 \`EMBED_LINKS\`` })
    if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.ADD_REACTIONS)) 
    return interaction.reply({embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setTitle(`${client.allEmojis.x} 我需要權限 \`ADD_REACTIONS\``)]})

		if (interaction.isCommand()) {
			const command = client.slashCommands.get(interaction.commandName);

      if (command) {
        // interaction.reply({
				// content: "An error has occured"
        // });

			const args = [];

			for (let option of interaction.options.data) {
				if (option.type === "SUB_COMMAND") {
					if (option.name) args.push(option.name);
					option.options?.forEach((x) => {
						if (x.value) args.push(x.value);
					})
				} else if (option.value) args.push(option.value);
			}

				if (command.toggleOff) {
					return await interaction.reply({
						embeds: [new MessageEmbed()
							.setTitle(`${client.allEmojis.x} **該指令已被開發人員禁用！請稍後再試。**`)
							.setColor(ee.wrongcolor)
						]
					}).catch((e) => {
						console.log(e)
					});
				}
				if (!interaction.member.permissions.has(command.userPermissions || [])) return await interaction.reply({
					embeds: [new MessageEmbed()
						.setDescription(`${client.allEmojis.x} **你沒有 \`${command.userPermissions.join(", ")}\` 權限使用 \`${command.name}\` 指令!**`)
						.setColor(ee.wrongcolor)
					],
					ephemeral: true
				}).catch((e) => {
					console.log(e)
				});
				if (!interaction.guild.me.permissions.has(command.botPermissions || [])) return await interaction.reply({
					embeds: [new MessageEmbed()
						.setDescription(`${client.allEmojis.x} **我沒有 \`${command.botPermissions.join(", ")}\` 權限使用 \`${command.name}\` 指令!**`)
						.setColor(ee.wrongcolor)
					],
					ephemeral: true
				}).catch((e) => {
					console.log(e)
				});
				if (onCoolDown(interaction, command)) {
					return await interaction.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setDescription(`${client.allEmojis.x} **請稍等 \`${onCoolDown(interaction, command).toFixed(1)} 秒\` 使用前 \`${command.name}\` 再次使用指令!.**`)
						],
            ephemeral: true
					});
				}
				command.run(client, interaction, args, ee);
			} else {
				return;
			}
		}

		if (interaction.isContextMenu()) {
			const command = client.Commands.get(interaction.commandName);
			if (command) command.run(client, interaction);
		}

	} catch (err) {
		console.log(err)
	}
}
