const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
    name: "unban",
    aliases: [],
    usage: "a!unban <user>",

    /**
     * @param {Message} message 
     * @param {String[]} args
     * @param {Client} client
     */

    async execute(message, args, client, moment, permissions, cmd) {
        const disable = db.get_usability(message.guildId, "ban").data; 
        const cmd_notfound = replacePlaceholders(message.guildId, "events", "cmd_notfound", "data", [{ regex: /{command}/g, value: `${cmd}` }]);
		if (disable) return message.channel.send(cmd_notfound)

        const invalid_usage = replacePlaceholders(message.guildId, "events", "invalid_usage", "data", [{ regex: /{usage}/g, value: `\`${module.exports.usage}\`` }]);
        const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data");

        if (global_suitable == false) return
        if (permissions == false) return message.channel.send(no_permissions)

        if (!args[0]) return message.channel.send(invalid_usage);

        let member = args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0];

        try {
            const bans = await message.guild.bans.fetch()
            const user = bans.get(args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0])
            if (!user) {
                const message_member_isnotbanned = replacePlaceholders(message.guildId, "management", "ban", "isnotbanned", [{ regex: /{member}/g, value: args[0] }]).data;
                return message.channel.send(message_member_isnotbanned)
            }
        } catch (err) {
            console.log(err);
        }

        message.channel.guild.members.unban(member)

        const message_success = replacePlaceholders(message.guildId, "management", "unban", "unbanned", [{ regex: /{member}/g, value: args[0] }, { regex: /{author}/g, value: message.author.id }]).data;
        message.channel.send(message_success)
        removeBan(client, message, args)
    }
};

function removeBan(client, message, args) {
	const logging = db.get_logging(message.guildId, "removeBan")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Member unbanned")
			.setDescription(`> A member was unbanned by <@${message.author.id}>\n\n**Information**\n`+
            `> **Member:** ${args[0].match(/<@!?(\d{17,19})>/)?.[1] || args[0]}\n`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}