const { Client, Attachment, Message, MessageEmbed } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data")

const global_suitable = true;

module.exports = {
    name: "say",
    aliases: [],
    usage: "",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    
    execute(message, args, client, moment, permissions) {
        if (!global_suitable) return

        const invalid_usage = replacePlaceholders(message.guildId, "events", "invalid_usage", "data", [{ regex: /{usage}/g, value: `\`${module.exports.usage}\`` }]);
        const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data")
        if (permissions == false) return message.channel.send(no_permissions)

        if (args.length < 1) {
            return message.channel.send(invalid_usage)
        }
        const deleteMessage = message.delete();
        if (message.deletable) {deleteMessage;};
        message.channel.send(args.join(" "));

    }
};