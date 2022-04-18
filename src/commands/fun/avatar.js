const { Client, Attachment, Message, MessageEmbed } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");

const global_suitable = true;

module.exports = {
    name: "avatar",
    aliases: [],
    usage: "",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    
    execute(message, args, client) {
        if (!global_suitable) return message.channel.send({ content: `**A global deactivation has been performed for this command.**\nFor more information see the official support server\n||This command has been completely disabled and is not currently processing any requests||` })
		
        const member = message.mentions.users.first() || message.author;
        const embed = new MessageEmbed()
        .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }))
        .setTimestamp()
        .setTitle(member.username + "'s Avatar")
        .setAuthor({name: `${message.author.tag}`, iconURL: member.displayAvatarURL({ dynamic: true, size: 512 })})
        .setColor("#9b4a51")

        message.channel.send({ embeds: [embed] })

    }
};