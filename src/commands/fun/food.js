const { Client, Attachment, Message, MessageEmbed } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");
const RedditImageFetcher = require("reddit-image-fetcher");
const topgg = require("../../index");

const global_suitable = true;

module.exports = {
    name: "food",
    aliases: [],
    usage: "",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    
    async execute(message, args, client) {
        if (!global_suitable) return 
        
        topgg.hasVoted(message.author.id).then(async c => {
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
                    subreddit: ['food']
                }).then(result => {
                    message.channel.send({content: `${result[0].image}`})
                });

            }
        });
    }
};