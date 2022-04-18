const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
	name: "guildinfo",
	aliases: ["info", "serverinfo", "server"],
	usage: "a!guildinfo",
	
    /**
     * @param {Message} message 
     * @param {String[]} args
     * @param {Client} client
     */

	async execute(message, args, client, moment, permissions, cmd) {
		const disable = db.get_usability(message.guildId, module.exports.name).data;
		const cmd_notfound = replacePlaceholders(message.guildId, "events", "cmd_notfound", "data", [{ regex: /{command}/g, value: `${cmd}` }]);
		if (disable) return message.channel.send(cmd_notfound)

		//const invalid_usage = replacePlaceholders(message.guildId, "events", "invalid_usage", "data", [{ regex: /{usage}/g, value: `\`${module.exports.usage}\`` }]);

		if (global_suitable == false) return

		const msg = replacePlaceholders(message.guildId, "management", "guildinfo", "only_send", [
			{ regex: /{guild_name}/g, value: message.guild.name }, 
			{ regex: /{guild_id}/g, value: message.guild.id },

			{ regex: /{members}/g, value: message.guild.memberCount },
			{ regex: /{created}/g, value: `<t:${parseInt(message.guild.createdTimestamp / 1000)}:R>` },
			{ regex: /{boosts}/g, value: message.guild.premiumSubscriptionCount || "NONE" },
			{ regex: /{channels}/g, value: message.guild.channels.cache.size },
			{ regex: /{emojis}/g, value: message.guild.stickers.cache.size + message.guild.emojis.cache.size },
			{ regex: /{icon}/g, value: message.guild.iconURL({dynamic: true}) },
		]).data;

		message.channel.send(msg)

	}
};