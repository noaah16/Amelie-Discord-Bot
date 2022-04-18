const { Client, Attachment, Message, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");

const global_suitable = true;

module.exports = {
    name: "chameleon",
    aliases: [],
    usage: "",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */

    execute(message, args, client) {
        if (!global_suitable) return message.channel.send({ content: `**A global deactivation has been performed for this command.**\nFor more information see the official support server\n||This command has been completely disabled and is not currently processing any requests||` })

        const row1 = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("green1")
                .setLabel("GREEN")
                .setStyle("SECONDARY")
                .setEmoji('💚'),
            new MessageButton()
                .setCustomId("green2")
                .setLabel("BLUE")
                .setStyle("SECONDARY")
                .setEmoji('💙'),
            new MessageButton()
                .setCustomId("green3")
                .setLabel("RED")
                .setStyle("SECONDARY")
                .setEmoji('❤️'),
            new MessageButton()
                .setCustomId("green4")
                .setLabel("PURPLE")
                .setStyle("SECONDARY")
                .setEmoji('💜')
        )


        const embed1 = new MessageEmbed()
            .setImage("https://cdn.discordapp.com/attachments/918149549455970344/926905278102904923/green.png")
            .setColor("#9b4a51")

        const embed2 = new MessageEmbed()
            .setImage("https://cdn.discordapp.com/attachments/918149549455970344/926905277465382972/blau.png")
            .setColor("#9b4a51")

        const embed3 = new MessageEmbed()
            .setImage("https://cdn.discordapp.com/attachments/918149549455970344/926905277154983936/red.png")
            .setColor("#9b4a51")

        const embed4 = new MessageEmbed()
            .setImage("https://cdn.discordapp.com/attachments/918149549455970344/926905277742219334/lila.png")
            .setColor("#9b4a51")


        const msg = message.channel.send({ embeds: [embed1], components: [row1] })

        client.on("interactionCreate", async (inaction) => {
            if (inaction.isButton()) {
                if (inaction.customId === "green1") {
                    (await msg).edit({ embeds: [embed1], components: [row1] })
                    inaction.deferUpdate()
                } else if (inaction.customId === "green2") {
                    (await msg).edit({ embeds: [embed2], components: [row1] })
                    inaction.deferUpdate()
                } else if (inaction.customId === "green3") {
                    (await msg).edit({ embeds: [embed3], components: [row1] })
                    inaction.deferUpdate()
                } else if (inaction.customId === "green4") {
                    (await msg).edit({ embeds: [embed4], components: [row1] })
                    inaction.deferUpdate()
                }
            }
        })
    }

};