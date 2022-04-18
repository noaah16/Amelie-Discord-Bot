const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
    name: "permissions",
    aliases: ["perms"],
    usage: "a!perms <add|remove> <permission> <@role>",

    /**
     * @param {Message} message 
     * @param {String[]} args
     * @param {Client} client
     */

    async execute(message, args, client, moment, permissions, cmd) {
		const invalid_usage = replacePlaceholders(message.guildId, "events", "invalid_usage", "data", [{ regex: /{usage}/g, value: `\`${module.exports.usage}\`` }]);
		const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data");

        if (global_suitable == false) return
        if (permissions == false) return message.channel.send(no_permissions)
        
        if (!args[0]) return message.channel.send(invalid_usage)
        if (["add", "set"].includes(args[0])) {
            var role = "null";
            role = message.mentions.roles.first()
            if (!message.mentions.roles.first()) return message.channel.send(invalid_usage)

            const permissions = db.get_permissions(message.guildId, args[1], role.id).data

            if (permissions && permissions.permissions == args[1] && permissions.role == role.id) {
                const msg = replacePlaceholders(message.guildId, "management", "permissions", "already_exist", [{ regex: /{role}/g, value: `<@&${role.id}>` }, { regex: /{perms}/g, value: `${args[1].toUpperCase()}` }]).data;
                message.channel.send(msg)
                return;
            }

            if (["announce"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["ban"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["unban"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["kick"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["config"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["customcommands"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["joinroles"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["logging"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["permissions"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["purge"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["reactionroles"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["webhook"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["welcomemessage"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["say"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["manager"].includes(args[1].toLowerCase())) {
                db.save_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else {
                const msg = replacePlaceholders(message.guildId, "management", "permissions", "permission_notfound", [{ regex: /{perms}/g, value: `${args[1].toUpperCase()}` }]).data;
                return message.channel.send(msg)
            }

            const msg = replacePlaceholders(message.guildId, "management", "permissions", "assigned", [{ regex: /{role}/g, value: `<@&${role.id}>` }, { regex: /{perms}/g, value: `${args[1].toUpperCase()}` }]).data;
            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
            message.channel.send(msg)
            addPermission(client, message, args)

        } else if (["remove", "delete"].includes(args[0])) {

            var role = "null";
            role = message.mentions.roles.first()
            if (!message.mentions.roles.first()) return message.channel.send(invalid_usage)

            const permissions = db.get_permissions(message.guildId, args[1], role.id).data

            if (!permissions || !permissions.permissions == args[1] && !permissions.role == role.id) {
                const msg = replacePlaceholders(message.guildId, "management", "permissions", "not_exist", [{ regex: /{perms}/g, value: `${args[1].toUpperCase()}` }]).data;
                message.channel.send(msg)
                return;
            }

            if (["announce"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["ban"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["unban"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["kick"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["config"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["customcommands"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["joinroles"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["logging"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["permissions"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["purge"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["reactionroles"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["webhook"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["welcomemessage"].includes(args[1].toLowerCase())) {
                db.remove_permissions(message.guildId, args[1].toLowerCase(), role.id)
            } else if (["say"].includes(args[1])) {
                db.remove_permissions(message.guildId, args[1], role.id)
            } else {
                const msg = replacePlaceholders(message.guildId, "management", "permissions", "permission_notfound", [{ regex: /{perms}/g, value: `${args[1].toUpperCase()}` }]).data;
                return message.channel.send(msg)
            }

            const msg = replacePlaceholders(message.guildId, "management", "permissions", "removed", [{ regex: /{role}/g, value: `<@&${role.id}>` }, { regex: /{perms}/g, value: `${args[1].toUpperCase()}` }]).data;
            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
            message.channel.send(msg)
            removePermission(client, message, args)

        } else if (["list"].includes(args[0].toLowerCase())) {
            const permission = db.get_permissionsliste(message.guildId, args[1])

            if(!args[1]) {
                const msg = replacePlaceholders(message.guildId, "management", "permissions", "list_not_specified").data;
                return message.channel.send(msg)
            }

            let string = "";
            if(permission.data) {
                permission.data.forEach(element => {
                    string += `- <@&${element.role}> `
                })
            }
            if(string == "") {
                const msg = replacePlaceholders(message.guildId, "management", "permissions", "permission_notfound", [{ regex: /{perms}/g, value: `${args[1].toUpperCase()}` }]).data;
                return message.channel.send(msg)
            }
            const msg = replacePlaceholders(message.guildId, "management", "permissions", "list", [{ regex: /{role}/g, value: `${string}` }, { regex: /{permslist}/g, value: `${args[1].toLowerCase()}` },{ regex: /{perms}/g, value: `${args[1].toUpperCase()}` }]).data;
            return message.channel.send(msg)
        } else {
            return message.channel.send(invalid_usage)
        }
    }
};

function addPermission(client, message, args) {
	const logging = db.get_logging(message.guildId, "addPermission")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Permission added")
			.setDescription(`> <@&${role.id}> was assigned the \`${args[1].toUpperCase()}\` by ${message.author.id}`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}

function removePermission(client, message, args) {
	const logging = db.get_logging(message.guildId, "removePermission")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Permission removed")
			.setDescription(`> <@&${role.id}> was removed the \`${args[1].toUpperCase()}\` by ${message.author.id}`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}