const config = require('../../botconfig/config.json');
const {
    MessageEmbed
} = require('discord.js');
const ms = require("ms");

module.exports = {
    name: 'giveaway',
    description: '開始抽獎!',
    cooldown: 0,
    userPermissions: ["MANAGE_GUILD"],
    botPermissions: ["MANAGE_GUILD"],
    // toggleOff: true,
    options: [{
            name: "start",
            description: "開始抽獎!",
            type: "SUB_COMMAND",
            options: [{
                    name: "duration",
                    description: "提供此抽獎活動的時間（1m、1h、1d）",
                    type: "STRING",
                    required: true
                },
                {
                    name: "winners",
                    description: "選擇此抽獎活動的獲獎者數量",
                    type: "INTEGER",
                    required: true
                },
                {
                    name: "prize",
                    description: "提供獎品名稱",
                    type: "STRING",
                    required: true
                },
                {
                    name: "channel",
                    description: "選擇抽獎地點",
                    type: "CHANNEL",
                    //channelTypes: ["GUILD_TEXT"]
                }
            ]
        },
        {
            name: "edit",
            description: "修改抽獎活動內容",
            type: "SUB_COMMAND",
            options: [{
                    name: "message-id",
                    description: "提供抽獎活動的訊息 ID。",
                    type: "STRING",
                    required: true
                }, {
                    name: "duration",
                    description: "提供此抽獎活動的時間（1m、1h、1d)",
                    type: "STRING",
                    required: true
                },
                {
                    name: "winner",
                    description: "選擇此抽獎活動的獲獎者數量",
                    type: "INTEGER",
                    required: true
                },
                {
                    name: "prize",
                    description: "提供獎品名稱",
                    type: "STRING",
                    required: true
                },
                {
                    name: "channel",
                    description: "選擇抽獎地點",
                    type: "CHANNEL",
                    //channelTypes: ["GUILD_TEXT"]
                }
            ]
        }, {
            name: "end",
            description: "提早結束抽獎活動!",
            type: "SUB_COMMAND",
            options: [{
                name: "message-id",
                description: "提供抽獎活動的訊息ID。",
                type: "STRING",
                required: true
            }]
        },
        {
            name: "pause",
            description: "暫停抽獎活動",
            type: "SUB_COMMAND",
            options: [{
                name: "message-id",
                description: "提供抽獎活動的訊息ID。",
                type: "STRING",
                required: true
            }]
        },
        {
            name: "resume",
            description: "恢復抽獎活動",
            type: "SUB_COMMAND",
            options: [{
                name: "message-id",
                description: "提供抽獎活動的訊息ID。",
                type: "STRING",
                required: true
            }]
        },
        {
            name: "reroll",
            description: "更換中獎者",
            type: "SUB_COMMAND",
            options: [{
                name: "message-id",
                description: "提供抽獎活動的訊息ID。",
                type: "STRING",
                required: true
            }]
        },
        {
            name: "delete",
            description: "刪除抽獎活動",
            type: "SUB_COMMAND",
            options: [{
                name: "message-id",
                description: "提供抽獎活動的訊息ID。",
                type: "STRING",
                required: true
            }]
        },
    ],

    run: async (client, interaction, args, ee) => {
        const {
            options
        } = interaction;

        const Sub = options.getSubcommand();

        const errorEmbed = new MessageEmbed()
            .setColor(ee.wrongcolor)

        const successEmbed = new MessageEmbed()
            .setColor(ee.color)

        switch (Sub) {
            case "start": {
                const gchannel = options.getChannel("channel") || interaction.channel;
                const duration = options.getString("duration");
                const winnerCount = options.getInteger("winners");
                const prize = options.getString("prize");

                client.giveawaysManager.start(gchannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize: `${client.allEmojis.giveaway.drop} ${prize} ${client.allEmojis.giveaway.drop}`,
                    hostedBy: interaction.user || null,
                    thumbnail: interaction.guild.iconURL({ dynamic: true }) || null,
                    messages: {
                        giveaway: `>>> ${client.allEmojis.giveaway.react} **抽獎活動開始** ${client.allEmojis.giveaway.react}`,
                        giveawayEnded: `>>> ${client.allEmojis.giveaway.react} **抽獎活動已結束** ${client.allEmojis.giveaway.react}`,
                        drawing: `結束: {timestamp}`,
                        // timeRemaining: "Time remaining: **{duration}**!",
                        dropMessage: `成為第一個做出反應的人 ${client.allEmojis.giveaway.react} !`,
                        inviteToParticipate: `>>>   按下 ${client.allEmojis.giveaway.react} = 參加！`,
                        winMessage: `${client.allEmojis.giveaway.react} **恭喜** {winners}!\n> 你已獲得 **{this.prize}**中獎資格\n> **Jump:** {this.messageURL}\n抽獎主持人: {this.hostedBy}`,
                        embedFooter: '{this.winnerCount} 優勝者',
                        noWinner: `>>> 抽獎活動取消, 沒有人參與. :cry:`,
                        hostedBy: `抽獎主持人: {this.hostedBy}`,
                        winners: '中獎人:',
                        endedAt: '結束於',
                    },
                    lastChance: {
                        enabled: true,
                        content: '⚠️ **最後機會進入！** ⚠️',
                        threshold: 5000,
                        embedColor: '#FF0000'
                    }
                }).then(async () => {
                    successEmbed.setDescription("抽獎已成功啟動")
                    return interaction.reply({
                        embeds: [successEmbed],
                        ephemeral: true
                    });
                }).catch((err) => {
                    successEmbed.setDescription(`發生了錯誤\n>>> ${err}`)
                    return interaction.reply({
                        embeds: [errorEmbed],
                        ephemeral: true
                    });
                })
            }
            break;
        case "edit": {
            const messageId = options.getString("message-id");
            const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

            if (!giveaway) {
                errorEmbed.setDescription(`無法查詢此抽獎活動的資訊 : ${messageId}`);
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            }
            const duration = options.getString("duration");
            const newWinnerCount = options.getInteger("winners");
            const newPrize = options.getString("prize");

            client.giveawaysManager.edit(messageId, {
                addTime: ms(duration),
                newWinnerCount,
                newPrize: `${client.allEmojis.giveaway.drop} ${newPrize} ${client.allEmojis.giveaway.drop}`,
            }).then(async () => {
                successEmbed.setDescription("抽獎已成功更新")
                return interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                });
            }).catch((err) => {
                errorEmbed.setDescription(`發生了錯誤\n>>> ${err}`)
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            })
        }
        break;
        case "end": {
            const messageId = options.getString("message-id");
            const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

            if (!giveaway) {
                errorEmbed.setDescription(`無法查詢此抽獎活動的資訊 : ${messageId}`);
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            }

            client.giveawaysManager.end(messageId).then(() => {
                successEmbed.setDescription(`抽獎已結束`)
                return interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                })
            }).catch((err) => {
                errorEmbed.setDescription(`發生了錯誤\n>>> ${err}`)
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            });
        }
        break;
        case "pause": {
            const messageId = options.getString("message-id");
            const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

            if (!giveaway) {
                errorEmbed.setDescription(`無法查詢此抽獎活動的資訊 : ${messageId}`);
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            }

            client.giveawaysManager.pause(messageId, {
                pauseOptions: {
                    isPaused: true,
                    content: '⚠️ **此抽獎活動已暫停!** ⚠️',
                    unPauseAfter: null,
                    embedColor: '#FFFF00'
                }
            }).then(() => {
                successEmbed.setDescription(`抽獎已暫停`)
                return interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                })
            }).catch((err) => {
                errorEmbed.setDescription(`發生了錯誤\n>>> ${err}`)
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            });
        }
        break;
        case "resume": {
            const messageId = options.getString("message-id");
            const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

            if (!giveaway) {
                errorEmbed.setDescription(`無法查詢此抽獎活動的資訊 : ${messageId}`);
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            }

            client.giveawaysManager.unpause(messageId).then(() => {
                successEmbed.setDescription(`抽獎活動已恢復`)
                return interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                })
            }).catch((err) => {
                errorEmbed.setDescription(`發生了錯誤\n>>> ${err}`)
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            });
        }
        break;
        case "reroll": {
            const messageId = options.getString("message-id");
            const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

            if (!giveaway) {
                errorEmbed.setDescription(`無法查詢此抽獎活動的資訊 : ${messageId}`);
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            }

            client.giveawaysManager.reroll(messageId, {
                messages: {
                    congrat: `${client.allEmojis.giveaway.react} 新的獲勝者: {winners}!, 你獲得了 **{this.prize}**!\n{this.messageURL}`,
                    error: '沒有人加入抽獎活動qwq'
                }
            }).then(() => {
                successEmbed.setDescription(`抽獎活動已重新換人`)
                return interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                })
            }).catch((err) => {
                errorEmbed.setDescription(`發生了錯誤\n>>> ${err}`)
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            });
        }
        break;
        case "delete": {
            const messageId = options.getString("message-id");
            const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

            if (!giveaway) {
                errorEmbed.setDescription(`無法查詢此抽獎活動的資訊 : ${messageId}`);
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            }

            client.giveawaysManager.delete(messageId).then(() => {
                successEmbed.setDescription(`抽獎已刪除`)
                return interaction.reply({
                    embeds: [successEmbed],
                    ephemeral: true
                })
            }).catch((err) => {
                errorEmbed.setDescription(`發生了錯誤\n>>> ${err}`)
                return interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
            });
        }
        break;
        }
    }
}