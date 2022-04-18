const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Attachment, Message, MessageEmbed, User, MessageButton } = require("discord.js");

const db = require("../../structures/data/data");

module.exports = {
    data: new SlashCommandBuilder()
	.setName('list')
	.setDescription('list all commands'),
    execute(interaction) {
        const paginationEmbed = require('discordjs-button-pagination');
        const embed1 = new MessageEmbed()
            .setTitle("Command List 1/4")
            .setDescription("Use `a!help <command>` to get more information\n\n" + 
            "> `a!amelie`\n" + 
            "> `a!announce`\n" + 
            "> `a!ban`\n" + 
            "> `a!botinfo`\n" + 
            "> `a!config`\n" + 
            "> `a!customcommands`\n" + 
            "> `a!disable`\n" + 
            "> `a!donates`\n" + 
            "> `a!enable`\n" + 
            "> `a!guildinfo`\n" + 
            "> `a!help`\n" + 
            "> `a!invite`\n")
            .setColor("9b4a51")
        const embed2 = new MessageEmbed()
            .setTitle("Command List 2/4")
            .setDescription("Use `a!help <command>` to get more information\n\n" + 
            "> `a!joinroles`\n" + 
            "> `a!kick`\n" + 
            "> `a!language`\n" + 
            "> `a!list`\n" + 
            "> `a!logging`\n" + 
            "> `a!permissions`\n" + 
            "> `a!purge`\n" + 
            "> `a!reactionroles`\n" + 
            "> `a!report`\n" + 
            "> `a!support`\n" + 
            "> `a!unban`\n" + 
            "> `a!userinfo`\n")
            .setColor("9b4a51")
            const embed3 = new MessageEmbed()
            .setTitle("Command List 3/4")
            .setDescription("Use `a!help <command>` to get more information\n\n" + 
            "> `a!webhook`\n" + 
            "> `a!avatar`\n" + 
            "> `a!cats`\n" + 
            "> `a!chameleon`\n" + 
            "> `a!collect`\n" + 
            "> `a!cry`\n" + 
            "> `a!dance`\n" + 
            "> `a!dogs`\n" + 
            "> `a!food`\n" + 
            "> `a!gmorning`\n" + 
            "> `a!gnight`\n" + 
            "> `a!happy`\n")
            .setColor("9b4a51")
            const embed4 = new MessageEmbed()
            .setTitle("Command List 4/4")
            .setDescription("Use `a!help <command>` to get more information\n\n" + 
            "> `a!hug`\n" + 
            "> `a!inventory`\n" + 
            "> `a!kiss`\n" + 
            "> `a!lyra`\n" + 
            "> `a!meme`\n" + 
            "> `a!riko`\n" + 
            "> `a!say`\n" + 
            "> `a!sell`\n" + 
            "> `a!wallpapers`\n" + 
            "> `a!tictactoe`\n" + 
            "> `a!top`\n" + 
            "> `a!use`\n")
            .setColor("9b4a51")

        const button1 = new MessageButton()
            .setCustomId("previousbtn")
            .setLabel("Previous Page")
            .setStyle("SECONDARY");
        const button2 = new MessageButton()
            .setCustomId("nextbtn")
            .setLabel("Next Page")
            .setStyle("SECONDARY");
        
        const pages = [
            embed1,
            embed2,
            embed3,
            embed4,
        ];

        const buttonList = [button1, button2];

        interaction.reply("List of all permissions")

        paginationEmbed(interaction, pages, buttonList);
        
    }
}