const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");
const cache = require("../../structures/cache")

const global_suitable = true;

module.exports = {
    name: "customcommands",
	aliases: ["ccmd", "customcmd", "customcommand"],
	usage: "a!ccmd <add|remove> <command> <message>",
	
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

        const { commands } = require("../../structures/data/data")
 
        if (["add", "create"].includes(args[0])) {
            const parts = message.content.split(" ");
            const command = args[1]
            const msg = parts.slice(3).join(" ").trim();

            let bee = commands.length;

            for (let i = 0; i < bee; i++) {
                if (args[1] == commands[i]) {
                    const message_success = replacePlaceholders(message.guildId, "management", "ccmd", "overwritten", [{ regex: /{command}/g, value: args[1].toUpperCase() }]).data;
                    return message.channel.send(message_success)
                }
            }

            if (!args[1] || !args[2]) return message.channel.send(invalid_usage);

            const ccmd = db.get_command(message.guildId, command);
            if (!ccmd.data) {     
                console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
                db.save_command(message.guildId, `${command}`, msg);
                const message_success = replacePlaceholders(message.guildId, "management", "ccmd", "success_create", [{ regex: /{command}/g, value: args[1].toUpperCase() }]).data;
                message.channel.send(message_success);
                createCommand(client, message, args)
            } else if (args[1] == ccmd.data.command) {
                const msg = replacePlaceholders(message.guildId, "management", "ccmd", "already_exist").data;
                return message.channel.send(msg)
            }
        } else if (["delete", "remove"].includes(args[0])) {
            const command = args[1]

            const ccmd = db.get_command(message.guildId, command);
            if (!ccmd.data) { 
                const msg = replacePlaceholders(message.guildId, "management", "ccmd", "not_exist").data;
                return message.channel.send(msg)
             }
            
            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
            db.remove_command(message.guildId, command)
            cache.ccmd.delete(message.guildId)
            cache.ccmd.delete(command + message.guildId)
            cache.ccmd.delete("message" + message.guildId)
            const message_success = replacePlaceholders(message.guildId, "management", "ccmd", "success_deleted", [{ regex: /{command}/g, value: args[1].toUpperCase() }]).data;
            message.channel.send(message_success)
            removeCommand(client, message, args)
        } else if (["list"].includes(args[0])) {
            const ccmd = db.get_commandlist(message.guildId);
            let string = "";

            ccmd.data.forEach((ccmd) => {
                string += `> a!${ccmd.command}\n`;
            });

            if(string == "") {
                const msg = replacePlaceholders(message.guildId, "management", "ccmd", "list_empty").data;
                return message.channel.send(msg)
            }

            message.channel.send({ content: `List: \n${string}` })
            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
        } else {
            return message.channel.send(invalid_usage)
        }
    }
};

function createCommand(client, message, args) {
	const logging = db.get_logging(message.guildId, "createCommand")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Command created")
			.setDescription(`> The command \`${args[1].toUpperCase()}\` was created by <@${message.author.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}
function removeCommand(client, message, args) {
	const logging = db.get_logging(message.guildId, "removeCommand")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Command deleted")
			.setDescription(`> The command \`${args[1].toUpperCase()}\` was deleted by <@${message.author.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}