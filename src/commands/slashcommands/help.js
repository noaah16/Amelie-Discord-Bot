const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Attachment, Message, MessageEmbed, User, MessageButton, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");

const db = require("../../structures/data/data");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('help'),
    async execute(interaction) {
        const msg = replacePlaceholders(interaction.guild.id, "others", "help", "success_command").data;

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Announce',
                            description: 'With this feature you can send messages and embeds to custom channels',
                            value: 'announce',
                            emoji: "📢"
                        },
                        {
                            label: 'Custom Commands',
                            description: 'With this function you can create custom commands',
                            value: 'customcmd',
                            emoji: "📔"
                        },
                        {
                            label: 'Join Roles',
                            description: 'With this function, you can add roles that will be ...',
                            value: 'joinroles',
                            emoji: "📥"
                        },
                        {
                            label: 'Reaction Roles',
                            description: 'With this function you can create reaction roles, respond to them and receive a role',
                            value: 'reactionroles',
                            emoji: "🌿"
                        },
                        {
                            label: 'Webhook',
                            description: 'With this function, you can create YouTube webhooks, so you will be notified as soon ...',
                            value: 'webhook',
                            emoji: "📦"
                        },
                        {
                            label: 'Welcome Message',
                            description: 'With this feature you can create welcome messages that users will receive via direct ...',
                            value: 'welcmsg',
                            emoji: "📰"
                        },
                        {
                            label: 'Ban, Kick & Unban',
                            description: 'With these functions, you can ban & kick users from your server easily and quickly',
                            value: 'ban_kick_unban',
                            emoji: "📤"
                        },
                        {
                            label: 'Permissions',
                            description: 'With this function, you can grant user permissions to certain functions of Amelie',
                            value: 'permissions',
                            emoji: "🪧"
                        },
                        {
                            label: 'Logging',
                            description: 'With this function you can log what is happening on your server',
                            value: 'log',
                            emoji: "📜"
                        },
                        {
                            label: 'Disable & Enable',
                            description: 'With this function, you can disable and enable commands from Amelie',
                            value: 'disable_enable',
                            emoji: "🔒"
                        },
                        {
                            label: 'Language',
                            description: 'With this function, you can change the language of Amelie',
                            value: 'language',
                            emoji: "🇯🇵"
                        },
                        {
                            label: 'Report',
                            description: 'With this function, you can report a bug or spelling mistake',
                            value: 'report',
                            emoji: "📋"
                        },
                    ]),
            );

        const e = await interaction.reply({ ...msg, components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: "SELECT_MENU"
        })

        collector.on("collect", async (collected) => {
            const value = collected.values[0]

            if(value == "announce") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "announce").data;
                collected.update(msg)
            } else if(value == "customcmd") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "customcmd").data;
                collected.update(msg)
            } else if(value == "joinroles") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "joinroles").data;
                collected.update(msg)
            } else if(value == "reactionroles") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "reactionroles").data;
                collected.update(msg)
            } else if(value == "webhook") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "webhook").data;
                collected.update(msg)
            } else if(value == "welcmsg") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "welcmsg").data;
                collected.update(msg)
            } else if(value == "ban_kick_unban") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "ban_kick_unban").data;
                collected.update(msg)
            } else if(value == "permissions") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "permissions").data;
                collected.update(msg)
            } else if(value == "log") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "log").data;
                collected.update(msg)
            } else if(value == "disable_enable") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "disable_enable").data;
                collected.update(msg)
            } else if(value == "language") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "language").data;
                collected.update(msg)
            } else if(value == "report") {
                const msg = replacePlaceholders( interaction.guild.id, "others", "help", "report").data;
                collected.update(msg)
            }

        })

    }
}