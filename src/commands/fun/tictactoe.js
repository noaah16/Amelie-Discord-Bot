const { Client, Attachment, Message, MessageEmbed } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");

const global_suitable = true;


module.exports = {
    name: "tictactoe",
    aliases: [],
    usage: "",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */

    //permissions tictactoe

    execute(message, args, client) {
        if (!global_suitable) return

        db.dbl.hasVoted(message.author.id).then(c => {
            if (!c) {
                const embed = new MessageEmbed()
                    .setTitle(`<:error:874006471686385664> Not voted`)
                    .setDescription(`You can only use the command after you have voted for Amelie.\n` +
                        `**Vote now:** [https://www.ameliebot.com/vote/](https://www.ameliebot.com/vote/)`)
                    .setColor('#ff4d4d')
                message.channel.send({ embeds: [embed] })
            } else {
                const simplydjs = require("simply-djs")
                simplydjs.tictactoe(message, {
                    embedColor: "#9b4a51",
                    timeoutEmbedColor: "#9b4a51",
                    embedFoot: "This game is based on the Simply-DJS package",
                    credit: false,
                })
            }
        })
    }
};