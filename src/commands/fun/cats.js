const { Client, Attachment, Message, MessageEmbed } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");
const topgg = require("../../index");

const RedditImageFetcher = require("reddit-image-fetcher");

const global_suitable = true;

module.exports = {
    name: "cats",
    aliases: [],
    usage: "",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */

    execute(message, args, client) {
        if (!global_suitable) return message.channel.send({ content: `**A global deactivation has been performed for this command.**\nFor more information see the official support server\n||This command has been completely disabled and is not currently processing any requests||` })

        topgg.hasVoted(message.author.id).then(c => {
            if (!c) {
                const embed = new MessageEmbed()
                    .setTitle(`<:error:874006471686385664> Not voted`)
                    .setDescription(`You can only use the command after you have voted for Amelie.\n` +
                        `**Vote now:** [https://www.ameliebot.com/vote/](https://www.ameliebot.com/vote/)`)
                    .setColor('#ff4d4d')
                return message.channel.send({ embeds: [embed] })
            } else {

                RedditImageFetcher.fetch({
                    type: 'custom',
                    subreddit: ['cats', 'Catswhoyell', 'sleepingcats']
                }).then(result => {
                    message.channel.send({content: `${result[0].image}`})
                });

            }
        });
    }
};