const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
    name: "kick",
    aliases: [],
    usage: "a!kick <@member>",

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
		const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data");

        if (global_suitable == false) return
        if (permissions == false) return message.channel.send(no_permissions)
        
        let member = message.mentions.members.first()
        if (!member) {
            const msg = replacePlaceholders(message.guildId, "management", "kick", "member_not_specified").data;
            return message.channel.send(msg)
        }
        if(message.author.id == member) {
            const msg = replacePlaceholders(message.guildId, "management", "kick", "member_selfkick").data;
            return message.channel.send(msg)
        }
        let reason = args.slice(1).join(" ");
        if (!reason) reason = 'No Reason';
        if (!member.kickable) {
            const msg = replacePlaceholders(message.guildId, "management", "kick", "member_not_kickable").data;
            return message.channel.send(msg)
        }

        member.kick(reason).then(() => {
            const msg = replacePlaceholders(message.guildId, "management", "kick", "kicked", [
                    { regex: /{member}/g, value: member.id }, 
                    { regex: /{author}/g, value: message.author.id },
                    { regex: /{reason}/g, value: reason },
            ]).data;
            message.channel.send(msg)
        }).catch(err => console.log(err))
    }
};