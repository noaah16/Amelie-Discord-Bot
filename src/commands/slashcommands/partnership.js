const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Attachment, Message, MessageEmbed, User, MessageButton } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals') // Now we extract the showModal method

const db = require("../../structures/data/data");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('partnership')
        .setDescription('list all commands'),
    execute(interaction, client) {
        const modal = new Modal()
            .setCustomId('bug')
            .setTitle('Report a Bug')
            .addComponents(
                new TextInputComponent()
                    .setCustomId('userId')
                    .setLabel('What is your User ID?')
                    .setStyle('SHORT')
                    .setMinLength(18)
                    .setMaxLength(18)
                    .setPlaceholder('350828709029292546 (optional)')
                    .setRequired(false),
                new TextInputComponent()
                    .setCustomId('description')
                    .setLabel('Describe exactly how the bug is triggered')
                    .setStyle('LONG')
                    .setMinLength(20)
                    .setMaxLength(4000)
                    .setPlaceholder('The Amelie love button is broken, when I try to press it Amelie just doesn\'t respond.')
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId('screens')
                    .setLabel('Please leave here links to screenshots')
                    .setStyle('LONG')
                    .setMinLength(10)
                    .setMaxLength(3000)
                    .setPlaceholder('use https://ameliebot.com/upload/ (optional)')
                    .setRequired(false),
            )

        showModal(modal, {
            client: client,
            interaction: interaction
        })
        client.on('modalSubmit', async (modal) => {
            if (modal.customId === 'bug') {
                const userId = modal.getTextInputValue('userId')
                const description = modal.getTextInputValue('description')
                const screens = modal.getTextInputValue('screens')
                modal.reply("Your report has been sent to us. Thank you for your help <3")

                const embed = new MessageEmbed()
                    .setTitle("Bug Report")
                    .setDescription(`**Report**\n\`${description}\`\n\n**Information**\n> **ExecutorId:** ${userId}\n> **Screenshots:**\n>>> ${screens} `)
                    .setColor("9b4a51")

                const msg = client.channels.cache.get("960962835918250044")
                msg.send({ embeds: [embed] })

            }
        });
    }
}