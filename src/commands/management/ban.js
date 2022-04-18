const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");
const cache = require("../../structures/cache")
const { DateTime } = require("luxon");

const global_suitable = true;

module.exports = {
    name: "ban",
    aliases: ["ban-member"],
    usage: "a!ban <@member> [time] [reason]",

    /**
     * @param {Message} message 
     * @param {String[]} args
     * @param {Client} client
     */

    async execute(message, args, client, moment, permissions, cmd) {
        const disable = db.get_usability(message.guildId, "ban").data;
        const cmd_notfound = replacePlaceholders(message.guildId, "events", "cmd_notfound", "data", [{ regex: /{command}/g, value: `${cmd}` }]);
		if (disable) return message.channel.send(cmd_notfound)

        console.log(permissions)

        const invalid_usage = replacePlaceholders(message.guildId, "events", "invalid_usage", "data", [{ regex: /{usage}/g, value: `\`${module.exports.usage}\`` }]);
        const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data");

        if (global_suitable == false) return
        if (permissions == false) return message.channel.send(no_permissions)

        if (!args[0]) return message.reply(invalid_usage)

        const member = message.guild.members.cache.get(args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0])

        try {
            const bans = await message.guild.bans.fetch()
            const user = bans.get(args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0])
            if (user) {
                const message_member_isbanned = replacePlaceholders(message.guildId, "management", "ban", "isbanned", [{ regex: /{member}/g, value: args[0] }]).data;
                return message.channel.send(message_member_isbanned)
            }
        } catch (err) {
            console.log(err);
        }

        const message_member_selfban = replacePlaceholders(message.guildId, "management", "ban", "member_selfban").data;
        if (message.author.id == member) return message.channel.send(message_member_selfban)

        let reason = ``
        let duration = ``

        if(args[1]) {
            if (args[1].endsWith("mt") || args[1].endsWith("h") || args[1].endsWith("m")) {
                let time = ""
                if (args[1].endsWith("mt")) {
                    time = DateTime.now().plus({ months: args[1].replace("mt", "") })
                    duration = `${args[1].replace("mt", "")}]} month/s`
                } else if (args[1].endsWith("h")) {
                    time = DateTime.now().plus({ hours: args[1].replace("h", "") })
                    duration = `${args[1].replace("h", "")}} hour/s`
                } else if (args[1].endsWith("m")) {
                    time = DateTime.now().plus({ minutes: args[1].replace("m", "") })
                    duration = `${args[1].replace("m", "")} minute/s`
                } else {
                    return message.channel.send({ content: "" })
                }
                var dd = time
                reason = `${args.slice(2).join(" ")}`
            } else {
                reason = `${args.slice(1).join(" ")}`
            }
        } else {
            reason = `${args.slice(1).join(" ")}`
        }

        if (message.guild.members.cache.get(args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0])) {

            const message_not_bannable = replacePlaceholders(message.guildId, "management", "ban", "not_bannable", [{ regex: /{member}/g, value: member }]).data;
            if (!member.bannable) return message.channel.send(message_not_bannable)

            member.ban({ reason: reason || "no reason" })

            const embed = new MessageEmbed()
                .setTitle("<:newerror:926976473456320512> You have been banned")
                .setColor("#9b2525")
                .setDescription("You have just been banned from a guild.\n\n" +
                    "**Information**\n" +
                    "> **Guild:** " + `${message.guild.name}\n` +
                    "> **Reason:** " + `${reason || "No reason"}\n` +
                    "> **Duration:** " + `\`${duration || "Permanent"}\``)

            const user = client.users.cache.get(member.id);
            user.send({ embeds: [embed] }).catch(e => {return;})

        } else {
            message.guild.members.ban(args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0]);
        }

        const message_success = replacePlaceholders(message.guildId, "management", "ban", "success_ban", [
            { regex: /{member}/g, value: args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0] },
            { regex: /{author}/g, value: message.author.id },

            { regex: /{duration}/g, value: duration || "Permanent" },
            { regex: /{reason}/g, value: reason || "No reason" },
        ]).data;
        message.channel.send(message_success)

        cache.ban.set(message.guildId + args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0], {
            guildId: message.guildId,
            member: args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0],
            duration: `${dd}`
        })

        if (dd) {
            db.save_ban(message.guildId, args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0], `${dd}`)
            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
        }
        createBan(client, message, args, reason, duration)
    }
};

function createBan(client, message, args, reason, duration) {
	const logging = db.get_logging(message.guildId, "createBan")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Member banned")
			.setDescription(`> A member was banned by <@${message.author.id}>\n\n**Information**\n`+
            `> **Member:** ${args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0]}\n` +
            `> **Reason:** ${reason || "No reason"}\n` + 
            `> **Duration:** \`${duration || "Permanent"}\``)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}