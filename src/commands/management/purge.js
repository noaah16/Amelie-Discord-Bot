const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
	name: "purge",
	aliases: ["clear", "chatclear", "clearchat"],
	usage: "a!purge <int>",

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

		if (args[0] > 100) {
			const msg = replacePlaceholders(message.guildId, "management", "purge", "over100").data;
			return message.channel.send(msg);
		} else if (!isNaN(parseInt(args[0]))) {
			var query = parseInt(args[0]);
			if (query < 0 || query > 99) return message.channel.send(invalid_usage);

			message.channel.bulkDelete(query + 1, filterOld = true).then(async() => {
				const msg = replacePlaceholders(message.guildId, "management", "purge", "purged", [{ regex: /{int}/g, value: `${query}` }]).data;
				const me = await message.channel.send(msg);
				setTimeout(() => {
					me.delete()
				}, 2000);
			})
		} else {
			return message.channel.send(invalid_usage)
		}
	}
};