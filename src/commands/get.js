const { Client, Attachment, Collection, Message, MessageEmbed, User, MessageButton, MessageActionRow } = require("discord.js");
const db = require("../structures/data/data");
const fs = require('fs');
const { replacePlaceholders } = require("../structures/language");
const amelie = require("amelies-images")

module.exports = {
    name: "get",
    description: "",

    /**
     * @param {Message} message
     * @param {String[]} args
     * @param {Client} client
     */

    async execute(message, args, client, moment, permissions) {

        amelie.image("kiss")

    }
};
