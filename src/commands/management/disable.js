const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
    name: "disable",
	aliases: [],
	usage: "a!disable <command>",
	
    /**
     * @param {Message} message 
     * @param {String[]} args
     * @param {Client} client
     */
    
    execute(message, args, client, moment) {
		if(!global_suitable) return message.channel.send({content: `**A global deactivation has been performed for this command.**\nFor more information see the official support server\n||This command has been completely disabled and is not currently processing any requests||`})
        
        const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data")
		if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(no_permissions)

        if (["announce"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "announce", "false")

        } else if (["ban", "unban"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "ban_unban", "false")

        } else if (["botinfo"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "botinfo", "false")

        } else if (["ccmd", "customcommands"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "ccmd", "false")

        } else if (["guildinfo", "amelie", "serverinfo"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "amelie", "false")

        } else if (["joinroles", "jr"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "joinroles", "false")

        } else if (["log", "logging"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "logging", "false")

        } else if (["kick"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "kick", "false")

        } else if (["history", "hty"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "history", "false")

        } else if (["purge"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "purge", "false")

        } else if (["reactionroles"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "reactionroles", "false")

        } else if (["userinfo"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "userinfo", "false")

        } else if (["webhooks", "webhook"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "webhook", "false")

        } else if (["welcmsg", "wmsg", "welcomemessage"].includes(args[0].toLowerCase())) {
            db.save_usability(message.guildId, "welcmsg", "false")
        }
        
        console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
        const message_success = replacePlaceholders(message.guildId, "management", "usability", "disable",  [{ regex: /{command}/g, value: args[0].toUpperCase() }]).data;
        message.channel.send(message_success)
        disableCommand(client, message, args)

    }
};

function disableCommand(client, message, args) {
	const logging = db.get_logging(message.guildId, "disableCommand")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Command disabled")
			.setDescription(`> The command \`${args[0].toUpperCase()}\` was disabled by <@${message.author.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}