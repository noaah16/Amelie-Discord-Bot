const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
    name: "joinroles",
	aliases: ["roles", "jr"],
	usage: "a!jr <add|remove> <@role>",
	
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

        if (["add", "set"].includes(args[0])) {
            if (!args[1]) return message.channel.send({ content: "error" })

            message.mentions.roles.forEach(ele => {
                if(!ele.editable) {
                    const msg = replacePlaceholders(message.guildId, "management", "joinroles", "cannot_assign", [{ regex: /{role}/g, value: ele }]).data;
                    return message.channel.send(msg)
                }
                role = ele
                const value = role.id        
                console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
                db.save_roles(message.guildId, value);
            });

            const msg = replacePlaceholders(message.guildId, "management", "joinroles", "added").data;
            message.channel.send(msg)

            const joinRoles = db.get_roleslist(message.guildId);
            let string = ""
            joinRoles.data.forEach(role => {
                string += `> <@&${role.role}> \`${role.role}\`\\n`;
                console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Buld Activity on the database! [JR List]");
            });

            if(string == "") {
                const msg = replacePlaceholders(message.guildId, "management", "joinroles", "not_found").data;
                return message.channel.send(msg)
            } else {
                const msg = replacePlaceholders(message.guildId, "management", "joinroles", "list", [{ regex: /{roles}/g, value: string }]).data;
                message.channel.send(msg)
                addJoinRole(client, message)
            }

        } else if (["remove", "delete"].includes(args[0])) {
            if (!args[1]) return message.channel.send({ content: "error" })

            db.remove_roles(message.guildId, args[1]);

            message.mentions.roles.forEach(ele => {
                role = ele
                const value = role.id
                console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
                db.remove_roles(message.guildId, value);
            })

            const msg = replacePlaceholders(message.guildId, "management", "joinroles", "removed").data;
            message.channel.send(msg)

            const joinRoles = db.get_roleslist(message.guildId);
            
            let string = ""
            joinRoles.data.forEach(role => {
                string += `> <@&${role.role}> \`${role.role}\`\\n`;
                console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Bulk Activity on the database! [JR List]");
            });
            if(string == "") {
                return;
            } else {
                const msg = replacePlaceholders(message.guildId, "management", "joinroles", "list", [{ regex: /{roles}/g, value: string }]).data;
                message.channel.send(msg)
                removeJoinRole(client, message)
            }

        } else if (["list"].includes(args[0])) {
            const joinRoles = db.get_roleslist(message.guildId);
            
            let string = ""
            joinRoles.data.forEach(role => {
                string += `> <@&${role.role}> \`${role.role}\`\\n`;
            });
            if(string == "") {
                const msg = replacePlaceholders(message.guildId, "management", "joinroles", "not_found").data;
                return message.channel.send(msg)
            }
            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");

            const msg = replacePlaceholders(message.guildId, "management", "joinroles", "list", [{ regex: /{roles}/g, value: string }]).data;
            message.channel.send(msg)

        } else {
            message.channel.send(invalid_usage)
        }
    }
}; 

function addJoinRole(client, message) {
	const logging = db.get_logging(message.guildId, "addJoinRole")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("JoinRoles added")
			.setDescription(`> New role/s was added by <@${message.author.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}
function removeJoinRole(client, message) {
	const logging = db.get_logging(message.guildId, "removeJoinRole")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("JoinRoles removed")
			.setDescription(`> Role/s was removed by <@${message.author.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}