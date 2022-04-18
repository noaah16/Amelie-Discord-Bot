const { MessageEmbed } = require("discord.js");
const db = require("../structures/data/data");

module.exports = async (client) => {
    client.on('messageDelete', async message => {
        const logging = db.get_logging(message.guild.id, "messageDelete")

        if (logging.data) { 
            const auditLogs = await message.guild.fetchAuditLogs()
            const user = auditLogs.entries.first().executor.id

            if(user == client.user.id) return;
    
            const embed = new MessageEmbed()
                .setTitle("<:newerror:926976473456320512> Message deleted")
                .setDescription(`> A message was deleted by <@${user}>\n\n**Information**\n> **Channel:** \`${message.channel.id}\` ` + "(<#" + message.channel.id + ">)\n" +
                    `> **Message ID:** \`${message.id}\`` +
                    `\n> **Message created:** <t:${parseInt(message.createdTimestamp / 1000)}:R>\n\n> **Content:**\n${message.content || "<:newerror:926976473456320512> " + "`The message is either an embed or is too old.`"}`)
                .setColor("9b2525")
    
            const msg = client.channels.cache.get(logging.data.channel)
            return msg.send({ embeds: [embed] }).catch(err => {return})
        }

    });
    client.on('channelCreate', channel => {
        const logging = db.get_logging(channel.guild.id, "channelCreate")
        const alllog = db.get_logging(channel.guild.id, "ALL")

        let chn = ""
        if (logging.data) {
            chn += `${logging.data.channel}`
        } else {
            if (alllog.data) {
                chn += `${alllog.data.channel}`
            } else return
        }

        const channelCreatedId = channel.id;

        channel.guild.fetchAuditLogs({ 'type': 'CHANNEL_CREATE' })
            .then(logs => logs.entries.find(entry => entry.target.id == channelCreatedId))
            .then(entry => {
                author = entry.executor;

                var currentdate = new Date();

                const embed = new MessageEmbed()
                    .setTitle("<:newsuccess:926972978888048711> Channel created")
                    .setDescription(`> A channel was created\n\n**Information**\n> **Channel:** \`${channel.id}\` ` + "(<#" + channel.id + ">)\n" +
                        `> **Created by:** ${author.tag} ` + "(<@" + author.id + ">)\n" +
                        `> **Channel created:** <t:${parseInt(currentdate / 1000)}:R>`)
                    .setColor("238351")

                const guildLog = client.channels.cache.get(chn)
                guildLog.send({ embeds: [embed] })
                return;
            })
    });
    client.on('channelDelete', channel => {
        const logging = db.get_logging(channel.guild.id, "channelDelete")
        const alllog = db.get_logging(channel.guild.id, "ALL")

        let chn = ""
        if (logging.data) {
            chn += `${logging.data.channel}`
        } else {
            if (alllog.data) {
                chn += `${alllog.data.channel}`
            } else return
        }

        const channelDeleteId = channel.id;

        channel.guild.fetchAuditLogs({ 'type': 'CHANNEL_DELETE' })
            .then(logs => logs.entries.find(entry => entry.target.id == channelDeleteId))
            .then(entry => {
                author = entry.executor;

                var currentdate = new Date();

                const embed = new MessageEmbed()
                    .setTitle("<:newerror:926976473456320512> Channel deleted")
                    .setDescription(`> **SAFETY WARNING** - A channel has been deleted\n\n**Information**\n> **Channel:** \`${channel.id}\` ` + "(#" + channel.name + ")\n" +
                        `> **Deleted by:** ${author.tag} ` + "(<@" + author.id + ">)\n" +
                        `> **Channel deleted:** <t:${parseInt(currentdate / 1000)}:R>`)
                    .setColor("9b2525")

                const guildLog = client.channels.cache.get(chn)
                guildLog.send({ embeds: [embed] })
                return;
            })
    });
    client.on("messagePinned", (message) => {
        const logging = db.get_logging(message.guild.id, "messagePinned")
        const alllog = db.get_logging(message.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
            .setTitle("Message pinned")
            .setDescription(`> A message was pinned\n\n**Information**\n> **Channel:** \`${message.channel.id}\` ` + "(<#" + message.channel.id + ">)\n" +
                `> **Message ID:** \`${message.id}\`\n> **Message Author:** ${message.author.tag} ` + "(<@" + message.author.id + ">)\n" +
                `> **Message created:** <t:${parseInt(message.createdTimestamp / 1000)}:R>`)
            .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })

    });
    client.on("messageContentEdited", (message, oldContent, newContent) => {
        const logging = db.get_logging(message.guild.id, "messageContentEdited")
        const alllog = db.get_logging(message.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
            .setTitle("Message edited")
            .setDescription(`> A message was edited\n\n**Information**\n> **Channel:** \`${message.channel.id}\` ` + "(<#" + message.channel.id + ">)\n" +
                `> **Message ID:** \`${message.id}\`\n> **Message Author:** ${message.author.tag} ` + "(<@" + message.author.id + ">)\n" +
                `> **Message created:** <t:${parseInt(message.createdTimestamp / 1000)}:R>\n\n**Now**\n> ${newContent}\n\n**Previous**\n> ${oldContent}`)
            .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("rolePermissionsUpdate", async (role) => {
        const logging = db.get_logging(role.guild.id, "rolePermissionsUpdate")
        const alllog = db.get_logging(role.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await role.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' })
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
            .setTitle("Role permissions update")
            .setColor("9b4a51")
            .setDescription(`> The permissions of a role have been changed\n\n` +
                `**Information**\n` +
                `> **Role:** <@&${role.id}> \n` +
                `> **ID:** \`${role.id}\`\n` +
                `> **Author:** <@${user}>`)

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("guildMemberBoost", (member) => {
        const logging = db.get_logging(member.guild.id, "guildMemberBoost")
        const alllog = db.get_logging(member.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
            .setTitle("Server boosting")
            .setColor("#db4fee")
            .setDescription(`> Your server has been boosted by ${member}`)

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("guildMemberUnboost", (member) => {
        const logging = db.get_logging(channel.guild.id, "guildMemberUnboost")
        const alllog = db.get_logging(channel.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
            .setTitle("Server unboosting")
            .setColor("#db4fee")
            .setDescription(`> ${member} has removed his boost for your server`)

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
        console.log(member.user.tag + " has stopped boosting " + member.guild.name + "...");
    });
    client.on("guildMemberRoleAdd", async (member, role) => {
        const logging = db.get_logging(member.guild.id, "guildMemberRoleAdd")
        const alllog = db.get_logging(member.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await role.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' })
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
            .setTitle("Role added")
            .setColor("#9b4a51")
            .setDescription(`> A role was added to a user\n\n**Information**\n> **User:** ${member}\n> **Author:** <@${user}>\n> **Added:** ${role}`)

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("guildMemberRoleRemove", async (member, role, e) => {
        const logging = db.get_logging(member.guild.id, "guildMemberRoleRemove")
        const alllog = db.get_logging(member.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await role.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' })
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
            .setTitle("Role removed")
            .setColor("#9b4a51")
            .setDescription(`> A role was removed from a user\n\n**Information**\n> **User:** ${member}\n> **Author:** <@${user}>\n> **Removed:** ${role}`)

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("guildMemberNicknameUpdate", async (member, oldNickname, newNickname) => {
        const logging = db.get_logging(member.guild.id, "guildMemberNicknameUpdate")
        const alllog = db.get_logging(member.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
            .setTitle("User nickname update")
            .setColor("9b4a51")
            .setDescription(`> The nickname of a user was changed\n\n` +
                `**Information**\n` +
                `> **Member:** ${member} \n` +
                `> **New Nickname:** ${newNickname}\n` +
                `> **Old Nickname:** ${oldNickname}`)

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })

        console.log(member.user.tag + "'s nickname is now " + newNickname);
    });
    client.on("guildBoostLevelUp", async (guild, oldLevel, newLevel) => {
        const logging = db.get_logging(channel.guild.id, "guildBoostLevelUp")
        const alllog = db.get_logging(channel.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
            .setTitle("Booster Level Up")
            .setColor("#db4fee")
            .setDescription(`> Woaah. Your server has a level up\nYour new Level: ${newLevel}`)
            .setThumbnail("https://cdn.discordapp.com/attachments/948222932730150963/963043788790583306/qq911bvdqwu51.gif")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("guildBoostLevelDown", async (guild, oldLevel, newLevel) => {
        const logging = db.get_logging(channel.guild.id, "guildBoostLevelDown")
        const alllog = db.get_logging(channel.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
            .setTitle("Booster Level Down")
            .setColor("#db4fee")
            .setDescription(`> Your server has a level down\nYour new Level: ${newLevel}`)
            .setThumbnail("https://cdn.discordapp.com/attachments/948222932730150963/963043788790583306/qq911bvdqwu51.gif")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
        console.log(guild.name + " returned to the boost level: " + newLevel);
    });
    client.on("guildChannelTopicUpdate", async (channel, oldTopic, newTopic) => {
        const logging = db.get_logging(channel.guild.id, "guildChannelTopicUpdate")
        const alllog = db.get_logging(channel.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await channel.guild.fetchAuditLogs({ type: "CHANNEL_UPDATE" })
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
            .setTitle("Channel topic update")
            .setColor("9b4a51")
            .setDescription(`> The topic of a channel was changed\n\n` +
                `**Information**\n` +
                `> **Channel:** <#${channel.id}> \n` +
                `> **Author:** <@${user}>` + `\n\n**Now**\n> ${newTopic}\n\n**Previous**\n> ${oldTopic}`)

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("messageReactionRemoveAll", async (reaction) => {
        const logging = db.get_logging(reaction.guild.id, "messageReactionRemoveAll")
        const alllog = db.get_logging(reaction.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await reaction.guild.fetchAuditLogs()
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
            .setTitle("All reactions removes")
            .setDescription(`> All reactions of a message have been removed.` +
                `\n\n**Information**\n` +
                `> **Channel:** \`${reaction.channel.id}\` ` + "(<#" + reaction.channel.id + ">)\n" +
                `> **Message ID:** \`${reaction.id}\`\n` +
                `> **Message Author:** ${user} ` + "(<@" + user + ">)\n")
            .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("roleCreate", async (role) => {
        const logging = db.get_logging(role.guild.id, "roleCreate")
        const alllog = db.get_logging(role.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await role.guild.fetchAuditLogs()
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
        .setTitle("Role created")
        .setDescription(`> Role was created by <@${user}>\n\n**Information**\n> **Role:** ${role}\n> **ID:** \`${role.id}\``)
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("roleDelete", async (role) => {
        const logging = db.get_logging(role.guild.id, "roleDelete")
        const alllog = db.get_logging(role.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await role.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' })
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
        .setTitle("<:newerror:926976473456320512> Role deleted")
        .setDescription(`> Role was deleted by <@${user}>\n\n**Information**\n> **Role:** ${role.name}\n> **ID:** \`${role.id}\`\n> **Created:** <t:${parseInt(role.createdTimestamp / 1000)}:R>`)
        .setColor("9b2525")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("stickerCreate", async (sticker) => {
        const logging = db.get_logging(sticker.guild.id, "stickerCreate")
        const alllog = db.get_logging(sticker.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await sticker.guild.fetchAuditLogs()
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
        .setTitle("Sticker created")
        .setDescription(`> Sticker was created by <@${user}>\n\n**Information**\n> **Stickername:** ${sticker.name}\n> **ID:** \`${sticker.id}\``)
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("stickerDelete", async (sticker) => {
        const logging = db.get_logging(sticker.guild.id, "stickerDelete")
        const alllog = db.get_logging(sticker.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await sticker.guild.fetchAuditLogs()
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
        .setTitle("Sticker deleted")
        .setDescription(`> Sticker was deleted by <@${user}>\n\n**Information**\n> **Stickername:** ${sticker.name}\n> **ID:** \`${sticker.id}\``)
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("emojiCreate", async (emoji) => {
        const logging = db.get_logging(emoji.guild.id, "emojiCreate")
        const alllog = db.get_logging(emoji.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await emoji.guild.fetchAuditLogs()
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
        .setTitle("Emoji created")
        .setDescription(`> Emoji was created by <@${user}>\n\n**Information**\n> **Emojiname:** ${emoji.name}\n> **ID:** \`${emoji.id}\``)
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("emojiDelete", async (emoji) => {
        const logging = db.get_logging(emoji.guild.id, "emojiDelete")
        const alllog = db.get_logging(emoji.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await emoji.guild.fetchAuditLogs()
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
        .setTitle("Emoji deleted")
        .setDescription(`> Emoji was deleted by <@${user}>\n\n**Information**\n> **Emojiname:** ${emoji.name}\n> **ID:** \`${emoji.id}\``)
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("emojiUpdate", async (emoji) => {
        const logging = db.get_logging(emoji.guild.id, "emojiUpdate")
        const alllog = db.get_logging(emoji.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await emoji.guild.fetchAuditLogs()
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
        .setTitle("Emoji updated")
        .setDescription(`> Emoji was updated by <@${user}>\n\n**Information**\n> **Emojiname:** ${emoji.name}\n> **ID:** \`${emoji.id}\``)
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("messageReactionAdd", async (reaction, user) => {
        const logging = db.get_logging(reaction.message.guildId, "messageReactionAdd")
        const alllog = db.get_logging(reaction.message.guildId, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
        .setTitle("Reaction added")
        .setDescription(`> A reaction was added by ${user}\n\n**Information**\n> **Emoji:** ${reaction.emoji}\n> **Message ID:** \`${reaction.message.id}\``)
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("messageReactionRemove", async (reaction, user) => {
        const logging = db.get_logging(reaction.message.guildId, "messageReactionRemove")
        const alllog = db.get_logging(reaction.message.guildId, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
        .setTitle("Reaction removed")
        .setDescription(`> A reaction was removed by ${user}\n\n**Information**\n> **Emoji:** ${reaction.emoji}\n> **Message ID:** \`${reaction.message.id}\``)
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("guildMemberAdd", async (member) => {
        const logging = db.get_logging(member.guild.id, "guildMemberAdd")
        const alllog = db.get_logging(member.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
        .setTitle("User joined")
        .setDescription(`> ${member} has joined the server\n\n**Information**\n> **Username:** ${member.user.tag}\n> **ID:** \`${member.user.id}\`\n> **Joined Discord:** <t:${parseInt(member.user.createdTimestamp / 1000)}:R>`)
        .setThumbnail(member.user.avatarURL({dynamic: true, size: 512}))
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("guildMemberRemove", async (member) => {
        const logging = db.get_logging(member.guild.id, "guildMemberRemove")
        const alllog = db.get_logging(member.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
        .setTitle("User leave")
        .setDescription(`> ${member} has leave the server\n\n**Information**\n> **Username:** ${member.user.tag}\n> **ID:** \`${member.user.id}\`\n> **Joined Discord:** <t:${parseInt(member.user.createdTimestamp / 1000)}:R>`)
        .setThumbnail(member.user.avatarURL({dynamic: true, size: 512}))
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("inviteCreate", async (invite) => {
        const logging = db.get_logging(invite.guild.id, "inviteCreate")
        const alllog = db.get_logging(invite.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const embed = new MessageEmbed()
        .setTitle("Invite created")
        .setDescription(`> An Invite was created by ${invite.inviter}` +
            `\n\n**Information**\n` +
            `> **Channel:** \`${invite.channelId}\` ` + "(<#" + invite.channelId + ">)\n" +
            `> **Expires:** <t:${parseInt(invite.expiresTimestamp / 1000)}:R>\n` +
            `> **Code:** ${invite.code}\n` +
            `> **Max Users:** ${invite.maxUses}\n`)
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });
    client.on("inviteDelete", async (invite) => {
        const logging = db.get_logging(invite.guild.id, "inviteDelete")
        const alllog = db.get_logging(invite.guild.id, "ALL")

        let chn = ""
        if (logging.data) { chn += `${logging.data.channel}` } else { if (alllog.data) { chn += `${alllog.data.channel}` } else return }

        const auditLogs = await invite.guild.fetchAuditLogs()
        const user = auditLogs.entries.first().executor.id

        const embed = new MessageEmbed()
        .setTitle("Invite created")
        .setDescription(`> The Invite \`${invite.code}\` was deleted by <@${user}>`)
        .setColor("9b4a51")

        const id = client.channels.cache.get(chn)
        id.send({ embeds: [embed] })
    });

}