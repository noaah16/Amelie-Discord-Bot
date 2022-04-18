const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
    name: "reactionroles",
    aliases: ["rr"],
    usage: "a!rr <add|remove> <#channel> <messageId> <@role> <emoji>",

    /**
     * @param {Message} message 
     * @param {String[]} args
     * @param {Client} client
     */

    async execute(message, args, client, moment, permissions, cmd) {
		const disable = db.get_usability(message.guildId, module.exports.name).data;
        const cmd_notfound = replacePlaceholders(message.guildId, "events", "cmd_notfound", "data", [{ regex: /{command}/g, value: `${cmd}` }]);
		if (disable) return message.channel.send(cmd_notfound)
		
		const invalid_usage = replacePlaceholders(message.guildId, "events", "invalid_usage", "data", [{ regex: /{usage}/g, value: `\`${module.exports.usage}\`` }]);
		const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data");

        if (global_suitable == false) return
        if (permissions == false) return message.channel.send(no_permissions)
        
        if (!args[0]) return message.channel.send(invalid_usage)

        if (["add", "create"].includes(args[0].toLowerCase())) {
            if (!message.mentions.channels.first()) return message.channel.send(invalid_usage)
            if (!message.mentions.roles.first()) return message.channel.send(invalid_usage)
            if (!args[4]) return message.channel.send(invalid_usage)

            var rolei = "null";
            rolei = message.mentions.roles.first()
            var emoji = args[4];

            var role = message.guild.roles.cache.get(rolei.id);
            if (!role) {
                const msg = replacePlaceholders(message.guildId, "management", "reactionroles", "role_not_found").data;
                message.channel.send(msg)
                return;
            }

            var emojiData;
            if (args[4].startsWith("<")) {
                emojiData = client.emojis.cache.find(c => c == emoji);
                if (!emojiData) {
                    emoji = args[4].split(":")[2].slice(0, -1);
                    console.log(`${emoji} 2`)
                    if (!client.guilds.cache.find(guild => guild.emojis.cache.find(e => e.id == emoji))) return message.channel.send({ content: "emoji error 404" })
                } else emoji = emojiData.id
            }
            function generateId() {
                var length = 8,
                    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    value = "";
                for (var i = 0, n = charset.length; i < length; ++i) {
                    value += charset.charAt(Math.floor(Math.random() * n));
                }
                return value;
            }
            const reactionId = generateId()

            var chn = "null";
            chn = message.mentions.channels.first()
            message.client.channels.fetch(chn.id).then(channel => {
                channel.messages.fetch(args[2]).then(m => {
                    m.react(emoji).catch((err) => {
                        const msg = replacePlaceholders(m.guildId, "management", "reactionroles", "cannot_react").data;
                        return m.channel.send(msg)
                    }).catch((err) => {return})

                    const msg = replacePlaceholders(message.guildId, "management", "reactionroles", "created", [{ regex: /{reactionId}/g, value: `${reactionId}` }]).data;

                    message.channel.send(msg)
                    db.save_reactionrole(message.guildId, reactionId, chn.id, args[2], rolei.id, emoji)
                    createReactionRole(client, message, emoji, args, rolei)
                    console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");

                }).catch((err) => {
                    const msg = replacePlaceholders(message.guildId, "management", "reactionroles", "cannot_react").data;
                    return message.channel.send(msg)
                })
            }).catch((err) => {return})

        } else if (["remove", "delete"].includes(args[0].toLowerCase())) {
            const reactionId = args[1]
            if (!args[1]) return message.channel.send(invalid_usage)
            db.remove_reactionrole(message.guildId, reactionId)
            removeReactionRole(client, message, reactionId)
            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
            const msg = replacePlaceholders(message.guildId, "management", "reactionroles", "removed", [{ regex: /{reactionId}/g, value: `${reactionId}` }]).data;
            message.channel.send(msg)

            const list = db.get_reactionrole(message.guildId)

            let emoji

            const embed = new MessageEmbed()
                .setTitle("List of all reaction roles")
                .setColor("#9b4a51")

            let string = ""
            list.data.forEach((element) => {
                if (element.emoji > 2) emoji = message.guild.emojis.cache?.find(emoji => emoji.id == element.emoji)
                else emoji = element.emoji
                string = embed.addFields({ name: `**Reaction ID:** \`${element.reactionId}\``, value: `> **Emoji:** ${emoji}\n> **Message ID:** \`${element.messageId}\`\n> **Role:** <@&${element.roleId}>`, inline: true },)
                console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Bulk Activity on the database! [RR List]");
            });
            if (string == "") return;

            message.channel.send({ embeds: [embed] })

        } else if (["list"].includes(args[0].toLowerCase())) {
            const list = db.get_reactionrole(message.guildId)

            let emoji

            const embed = new MessageEmbed()
                .setTitle("List of all reaction roles")
                .setColor("#9b4a51")

            let string = ""

            list.data.forEach((element) => {
                if (element.emoji > 2) emoji = message.guild.emojis.cache?.find(emoji => emoji.id == element.emoji)
                else emoji = element.emoji
                string = embed.addFields({ name: `**Reaction ID:** \`${element.reactionId}\``, value: `> **Emoji:** ${emoji}\n> **Message ID:** \`${element.messageId}\`\n> **Role:** <@&${element.roleId}>`, inline: true },)
                console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Bulk Activity on the database! [RR List]");
            });

            if (string == "") {
                const msg = replacePlaceholders(message.guildId, "management", "reactionroles", "reaction_not_found").data;
                return message.channel.send(msg)
            }

            message.channel.send({ embeds: [embed] })

        } else {
            return message.channel.send(invalid_usage)
        }

    }
};

function removeReactionRole(client, message, reactionId) {
	const logging = db.get_logging(message.guildId, "removeReactionRole")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("ReactionRole created")
			.setDescription(`> Reaction role \`${reactionId}\` was deleted by <@${message.author.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}
function createReactionRole(client, message, emoji, args, rolei) {
	const logging = db.get_logging(message.guildId, "createReactionRole")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("ReactionRole created")
			.setDescription(`> A reaction role was created by <@${message.author.id}>\n\n` + 
            `**Information**\n` + 
            `> **Emoji:** ${emoji}\n`+
            `> **Message ID:** \`${args[2]}\`\n`+
            `> **Role:** <@&${rolei.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}