const { Client, Attachment, Message, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { replacePlaceholders } = require("../structures/language");
const db = require("../structures/data/data");

module.exports = {
    name: "report",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */

    execute(message, args, client) {
        const msg = replacePlaceholders( message.guildId, "others", "report", "cant_use").data;
        return message.channel.send(msg);

    }
};