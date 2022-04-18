const { SlashCommandBuilder } = require("@discordjs/builders");
const { Client, Formatters, Attachment, Message, MessageEmbed, User, MessageButton, MessageActionRow } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals') // Now we extract the showModal method

const db = require("../../structures/data/data");

/**
 * @param {Client} client 
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a member or bug')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Do you want to report a bug in Amelie or a member?')
                .setRequired(true)
                .addChoice('Bug', 'bug')
                .addChoice('Spelling mistake', 'spelling_mistake')),
    async execute(interaction, client) {
        const discordModals = require('discord-modals')
        discordModals(client);

        if (interaction.options.getString("choice") == "bug") {
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
        } else if (interaction.options.getString("choice") == "spelling_mistake") {
            const modal = new Modal()
            .setCustomId('spelling_mistake')
            .setTitle('Report a Spelling mistake')
            .addComponents(
                new TextInputComponent()
                    .setCustomId('language')
                    .setLabel('What language is it?')
                    .setStyle('SHORT')
                    .setMinLength(3)
                    .setMaxLength(20)
                    .setPlaceholder('English')
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId('incorrect')
                    .setLabel('Which text is it?')
                    .setStyle('LONG')
                    .setMinLength(5)
                    .setMaxLength(1000)
                    .setPlaceholder('Please write in here the complete sentence that is incorrect')
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId('correct')
                    .setLabel('How to write the text correctly?')
                    .setStyle('LONG')
                    .setMinLength(5)
                    .setMaxLength(2000)
                    .setPlaceholder('Please enter the complete correct sentence here')
                    .setRequired(true),
            )

        showModal(modal, {
            client: client,
            interaction: interaction
        })
        client.on('modalSubmit', async (modal) => {
            if (modal.customId === 'spelling_mistake') {
                const language = modal.getTextInputValue('language')
                const correct = modal.getTextInputValue('correct')
                const incorrect = modal.getTextInputValue('incorrect')
                modal.reply("Your report has been sent to us. Thank you for your help <3")

                const embed = new MessageEmbed()
                    .setTitle("Spelling mistake Report")
                    .setDescription(`**Incorrect text**\n\`${incorrect}\`\n**Correct text**\n\`${correct}\`\n\n> **Language:**\n> ${language} `)
                    .setColor("9b4a51")

                const msg = client.channels.cache.get("960962835918250044")
                msg.send({ embeds: [embed] })

            }
        });
        }

    }
}