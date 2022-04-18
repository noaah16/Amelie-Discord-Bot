const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
    name: "enable",
	aliases: [],
	usage: "a!enable <command>",
	
    /**
     * @param {Message} message 
     * @param {String[]} args
     * @param {Client} client
     */
    
    execute(message, args, client, moment) {
		if(!global_suitable) return message.channel.send({content: `**A global deactivation has been performed for this command.**\nFor more information see the official support server\n||This command has been completely disabled and is not currently processing any requests||`})

        const message_cannot_enabled = replacePlaceholders(message.guildId, "management", "usability", "already_disabled",  [{ regex: /{command}/g, value: args[0].toUpperCase() }]).data;
        const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data")
		if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(no_permissions)

        if (["announce"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "announce")
            if(!test.data) return message.channel.send(message_cannot_enabled)

        } else if (["ban", "unban"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "ban_unban")
            if(!test.data) return message.channel.send(message_cannot_enabled)

        } else if (["botinfo"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "botinfo")
            if(!test.data) return message.channel.send(message_cannot_enabled)
            
        } else if (["ccmd", "customcommands"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "ccmd")
            if(!test.data) return message.channel.send(message_cannot_enabled)
            
        } else if (["guildinfo", "amelie", "serverinfo"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "amelie")
            if(!test.data) return message.channel.send(message_cannot_enabled)
            
        } else if (["joinroles", "jr"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "joinroles")
            if(!test.data) return message.channel.send(message_cannot_enabled)
            
        } else if (["log", "logging"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "logging")
            if(!test.data) return message.channel.send(message_cannot_enabled)
            
        } else if (["kick"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "kick")
            if(!test.data) return message.channel.send(message_cannot_enabled)
            
        } else if (["history", "hty"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "history")
            if(!test.data) return message.channel.send(message_cannot_enabled)            
            
        } else if (["purge"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "purge")
            if(!test.data) return message.channel.send(message_cannot_enabled)           
            
        } else if (["reactionroles"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "reactionroles")
            if(!test.data) return message.channel.send(message_cannot_enabled)           
            
        } else if (["userinfo"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "userinfo")
            if(!test.data) return message.channel.send(message_cannot_enabled)            
            
        } else if (["webhooks", "webhook"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "webhook")
            if(!test.data) return message.channel.send(message_cannot_enabled)
            
        } else if (["welcmsg", "wmsg", "welcomemessage"].includes(args[0].toLowerCase())) {
            const test = db.remove_usability(message.guildId, "welcmsg")
            if(!test.data) return message.channel.send(message_cannot_enabled)
        }
                
        console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
        const message_success = replacePlaceholders(message.guildId, "management", "usability", "enable",  [{ regex: /{command}/g, value: args[0].toUpperCase() }]).data;
        message.channel.send(message_success)
        enableCommand(client, message, args)
    }
};

function enableCommand(client, message, args) {
	const logging = db.get_logging(message.guildId, "enableCommand")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Command enabled")
			.setDescription(`> The command \`${args[0].toUpperCase()}\` was enabled by <@${message.author.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}