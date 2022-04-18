const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");
const { amelie_data } = require("../../structures/data/data");
const status = new Map()

const global_suitable = true;

module.exports = {
	name: "botinfo",
	aliases: ["amelie", "bot"],
	usage: "a!botinfo",
	
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

		if(args[0] == "status" && message.author.id == "320996868332978206") {
			status.set("string", {
				input: args.slice(1).join(" ")
			})
			message.channel.send({content: "success"})
		}

		if(status.has("string")) {
			var input = status.get("string").input
			var icon = "<:newerror:926976473456320512>"
		}

		require("moment-duration-format");
		const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

		const msg = replacePlaceholders(message.guildId, "management", "botinfo", "only_send", [
			{ regex: /{status_icon}/g, value: icon || "<:newsuccess:926972978888048711>" }, 
			{ regex: /{status_text}/g, value: input || "Currently there are no problems" },

			{ regex: /{guilds}/g, value: client.guilds.cache.size},
			{ regex: /{version}/g, value: db.amelie_data.version},
			{ regex: /{uptime}/g, value: duration},
			{ regex: /{members}/g, value: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()},
		]).data;
		message.channel.send(msg)

	}
};