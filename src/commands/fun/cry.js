const { Client, Attachment, Message, MessageEmbed } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");
const fetch = require('node-fetch');
const topgg = require("../../index");

const global_suitable = true;

module.exports = {
    name: "cry",
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
                let url = `https://developers.ameliebot.com/api/image-api/cry/`;
                let settings = { method: "Get" };
        
                fetch(url, settings).then(res => res.json()).then((json) => {
                    const embed = new MessageEmbed()
                        .setImage(json.url)
                        .setColor("9b4a51")
                        .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    message.channel.send({ embeds: [embed] })
                }).catch(err => {
                    message.channel.send({ content: "The Amelie Image-API is currently not available" })
                })
            }
        });

    }
};