const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
    name: "welcomemessage",
	aliases: ["wm", "welcmsg", "welcomemsg"],
	usage: "a!welcmsg <add|remove> <message>",
	
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
        
        if(!args[0]) return message.channel.send(invalid_usage)
        if (["add", "create", "set"].includes(args[0].toLowerCase())) {
            const welcomemessage = args.slice(1).join(" ")

            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
            db.save_welcomemessage(message.guildId, welcomemessage)

            const msg = replacePlaceholders(message.guildId, "management", "welcmsg", "created").data;
            createWelcomeMessage(client, message)
            return message.channel.send(msg)

        } else if (["remove", "delete"].includes(args[0].toLowerCase())) {
            const welcmsg = db.get_welcomemessage(message.guildId);
            if(!welcmsg.data) return message.channel.send({content: "error"})

            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
            db.remove_welcomemessage(message.guildId)

            const msg = replacePlaceholders(message.guildId, "management", "welcmsg", "removed").data;
            removeWelcomeMessage(client, message)
            return message.channel.send(msg)
            
        } else {
            return message.channel.send(invalid_usage)
        }
    }
};

function createWelcomeMessage(client, message) {
	const logging = db.get_logging(message.guildId, "createWelcomeMessage")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Welcome message created")
			.setDescription(`> A welcome message has been created by <@${message.author.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}
function removeWelcomeMessage(client, message) {
	const logging = db.get_logging(message.guildId, "removeWelcomeMessage")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Welcome message removed")
			.setDescription(`> A welcome message has been removed by <@${message.author.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}