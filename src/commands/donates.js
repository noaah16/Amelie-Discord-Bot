const { Client, Attachment, Message, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { replacePlaceholders } = require("../structures/language");
const db = require("../structures/data/data");

module.exports = {
    name: "donates",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */

    execute(message, args, client) {
        message.channel.send({content: "Currently we do not offer the possibility to support us financially. However, we thank you for your interest :) <3"})

    }
};