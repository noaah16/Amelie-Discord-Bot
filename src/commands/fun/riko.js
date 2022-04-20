const { Client, MessageAttachment, Message, MessageEmbed } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");
const amelie = require("amelies-images")
const topgg = require("../../index");

const global_suitable = true;

module.exports = {
    name: "riko",
    aliases: [],
    usage: "",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */

    execute(message, args, client) {
        if (!global_suitable) return

        topgg.hasVoted(message.author.id).then(c => {
            if (!c) {
                const embed = new MessageEmbed()
                    .setTitle(`<:error:874006471686385664> Not voted`)
                    .setDescription(`You can only use the command after you have voted for Amelie.\n` +
                        `**Vote now:** [https://www.ameliebot.com/vote/](https://www.ameliebot.com/vote/)`)
                    .setColor('#ff4d4d')
                return message.channel.send({ embeds: [embed] })
            } else {
                amelie.image("rikoW52WVbE3KyyXPaHr4X7NWP3LFBSRSxmrsccXdtRzBZ").then(e => {
                    const embed = new MessageEmbed()
                        .setImage(e)
                        .setColor("9b4a51")
                        .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    message.channel.send({ embeds: [embed] })
                })
            }
        });

    }
};