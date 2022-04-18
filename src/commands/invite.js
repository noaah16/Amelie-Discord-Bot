const { Client, Attachment, Message, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { replacePlaceholders } = require("../structures/language");
const db = require("../structures/data/data");

module.exports = {
    name: "invite",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */

    execute(message, args, client) {

        const embed = new MessageEmbed()
        .setTitle("Invite Amelie to your server :heart: ")
        .setDescription("You can invite Amelie to your server by clicking the button.\nIf you need help join our [Support Server](https://discord.gg/xt3Jmkjexz) :heart: ")
        .setColor("#9b4a51")

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL("https://discordapp.com/oauth2/authorize?client_id=731134109656547342&scope=bot&permissions=8")
					.setLabel('Invite Amelie <3')
					.setStyle("LINK"),
			);

        message.channel.send({embeds: [embed], components: [row]})

    }
};