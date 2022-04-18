const { MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
	name: "announce",
	aliases: ["sendmessage", "send", "message"],
	usage: "a!announce <embed|normal> <#channel> <message>",

	/**
	 * @param {Message} message 
	 * @param {String[]} args
	 * @param {Client} client
	 */

	async execute(message, args, client, moment, permissions, cmd) {
		const disable = db.get_usability(message.guildId, module.exports.name).data
		const cmd_notfound = replacePlaceholders(message.guildId, "events", "cmd_notfound", "data", [{ regex: /{command}/g, value: `${cmd}` }]);
		if (disable) return message.channel.send(cmd_notfound)

		const invalid_usage = replacePlaceholders(message.guildId, "events", "invalid_usage", "data", [{ regex: /{usage}/g, value: `\`${module.exports.usage}\`` }]);
		const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data");

		if (global_suitable == false) return
		if (permissions == false) return message.channel.send(no_permissions)

		if (args.length < 3 || !["embed", "normal"].includes(args[0].toLowerCase()) || !message.mentions.channels.first() || args[1] != "<#" + message.mentions.channels.first().id + ">") return message.channel.send(invalid_usage);
		if (args[0].toLowerCase() == "normal") {
			const m = message.mentions.channels.first().send(args.slice(2).join(" "))
			const messageOptions = replacePlaceholders(message.guildId, "management", "announce", "success_send", [{ regex: /{channel}/g, value: args[1] }]).data;

			m.then(() => {
				message.channel.send(messageOptions);
				sendAnnounce(client, message)
			}).catch((error) => {
				const msg = replacePlaceholders(message.guildId, "management", "announce", "sending_failed").data;
				return message.channel.send(msg)
			})

		} else {
			var embed = new MessageEmbed();
			while (args[2].toLowerCase().startsWith("color") || args[2].toLowerCase().startsWith("title") || args[2].toLowerCase().startsWith("image") || args[2].toLowerCase().startsWith("thumbnail") || args[2].toLowerCase().startsWith("footer")) {
				if (args[2].toLowerCase().startsWith("color")) {
					embed.setColor(args[2].substring(7, args[2].length - 1));
					args.splice(2, 1);
				} else if (args[2].toLowerCase().startsWith("image")) {
					var title = args[2].substring(7, args[2].length);
					args.splice(2, 1);
					while (!title.endsWith('"') && args[2]) {
						title += " " + args[2];
						args.splice(2, 1);
					}
					embed.setImage(title.substring(0, title.length - 1));
				} else if (args[2].toLowerCase().startsWith("footer")) {
					var title = args[2].substring(8, args[2].length);
					args.splice(2, 1);
					while (!title.endsWith('"') && args[2]) {
						title += " " + args[2];
						args.splice(2, 1);
					}
					embed.setFooter(title.substring(0, title.length - 1));
				} else if (args[2].toLowerCase().startsWith("thumbnail")) {
					var title = args[2].substring(11, args[2].length);
					args.splice(2, 1);
					while (!title.endsWith('"') && args[2]) {
						title += " " + args[2];
						args.splice(2, 1);
					}
					embed.setThumbnail(title.substring(0, title.length - 1));
				} else {
					var title = args[2].substring(7, args[2].length);
					args.splice(2, 1);
					while (!title.endsWith('"') && args[2]) {
						title += " " + args[2];
						args.splice(2, 1);
					}
					embed.setTitle(title.substring(0, title.length - 1));
				}
			}
			if (args.length < 1) return message.channel.send(invalid_usage);
			embed.setDescription(args.slice(2).join(" "));
			const m = message.mentions.channels.first().send({ embeds: [embed] }).catch(err => {return})
			const messageOptions = replacePlaceholders(message.guildId, "management", "announce", "success_send", [{ regex: /{channel}/g, value: args[1] }]).data;

			m.then(message => {
				message.channel.send(messageOptions);
				sendAnnounce(client, message)
			}).catch((error) => {
				const msg = replacePlaceholders(message.guildId, "management", "announce", "sending_failed").data;
				return message.channel.send(msg)
			})
		}
	}
};

function sendAnnounce(client, message) {
	const logging = db.get_logging(message.guildId, "sendAnnounce")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Message sent")
			.setDescription("> A message was sent with the `a!announce` command")
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}