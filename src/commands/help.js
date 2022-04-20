const { Client, Attachment, Message, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { replacePlaceholders } = require("../structures/language");

module.exports = {
    name: "help",
	aliases: ["h", "hilfe"],
	usage: "a!help [command]",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */

    execute(message, args, client) {
        if(!args[0]) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "success_command").data;
            return message.channel.send(msg);
        } else if(args[0].includes("a!")) return message.channel.send({content: "Please specify the command without the prefix for further help"})

        if (["announce", "sendmessage"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "announce").data;
            return message.channel.send(msg);
        } else if (["customcmd", "ccmd"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "customcmd").data;
            return message.channel.send(msg);
        } else if (["joinroles", "jr"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "joinroles").data;
            return message.channel.send(msg);
        } else if (["reactionroles", "rr"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "reactionroles").data;
            return message.channel.send(msg);
        } else if (["webhook", "youtube"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "webhook").data;
            return message.channel.send(msg);
        } else if (["welcomemsg", "wm"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "welcmsg").data;
            return message.channel.send(msg);
        } else if (["ban", "kick", "unban"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "ban_kick_unban").data;
            return message.channel.send(msg);
        } else if (["permissions", "perms"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "permissions").data;
            return message.channel.send(msg);
        } else if (["log", "logging"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "log").data;
            return message.channel.send(msg);
        } else if (["disable", "enable"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "disable_enable").data;
            return message.channel.send(msg);
        } else if (["language", "lang"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "language").data;
            return message.channel.send(msg);
        } else if (["report", "userreport"].includes(args[0].toLowerCase())) {
            const msg = replacePlaceholders( message.guildId, "others", "help", "report").data;
            return message.channel.send(msg);
        } else {
            message.channel.send({content: "For this command there is no detailed help document available, to find the right usage just use the command without further arguments."})
        }

    }
};