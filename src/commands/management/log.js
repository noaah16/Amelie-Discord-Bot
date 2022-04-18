const { Client, Attachment, Message, MessageEmbed, MessageButton } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");
const paginationEmbed = require('discordjs-button-pagination');

const global_suitable = true;

module.exports = {
    name: "logging",
    aliases: ["log", "serverlog"],
    usage: "a!log <set|remove> <ALL|[log]> <#channel>",

    /**
     * @param {Message} message 
     * @param {String[]} args
     * @param {Client} client
     */

    async execute(message, args, client, moment, permissions, cmd) {
        const disable = db.get_usability(message.guildId, module.exports.name).data;
        const cmd_notfound = replacePlaceholders(message.guildId, "events", "cmd_notfound", "data", [{ regex: /{command}/g, value: `${cmd}` }]);
		if (disable) return message.channel.send(cmd_notfound)

        const invalid_usage = replacePlaceholders(message.guildId, "events", "invalid_usage", "data", [{ regex: /{usage}/g, value: `\`${module.exports.usage}\`` }]);
        const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data");

        if (global_suitable == false) return
        if (permissions == false) return message.channel.send(no_permissions)

        if (!args[0]) return message.channel.send(invalid_usage)

        const logs = [
            "messageDelete",
            "messageContentEdited",
            "messagePinned",
            "messageReactionAdd",
            "messageReactionRemove",
            "messageReactionRemoveAll",

            "channelCreate",
            "channelDelete",
            "channelPinsUpdate",
            "guildChannelPermissionsUpdate",
            "guildChannelTopicUpdate",

            "stickerCreate",
            "stickerDelete",
            "emojiCreate",
            "emojiDelete",
            "emojiUpdate",

            "roleCreate",
            "roleDelete",
            "rolePositionUpdate",
            "rolePermissionsUpdate",

            "inviteCreate",
            "inviteDelete",

            "guildMemberAdd",
            "guildMemberRemove",
            "guildMemberBoost",
            "guildMemberUnboost",
            "guildMemberRoleAdd",
            "guildMemberRoleRemove",
            "guildMemberNicknameUpdate",
            "guildBoostLevelUp",
            "guildBoostLevelDown",

            "sendAnnounce",
            "disableCommand",
            "enableCommand",
            "createCommand",
            "removeCommand",
            "addJoinRole",
            "removeJoinRole",
            "changeLanguage",
            "addPermission",
            "removePermission",
            "createReactionRole",
            "removeReactionRole",
            "createWebhook",
            "removeWebhook",
            "createWelcomeMessage",
            "removeWelcomeMessage",
            "createBan",
            "removeBan"
        ]

        if (["add", "set"].includes(args[0])) {
            var chn = "null";
            chn = message.mentions.channels.first()

            if(!chn) return message.channel.send(invalid_usage)

            let log = ""
            if (args[2] == "ALL") {
                for (const e of logs) {
                    db.save_logging(`${message.guildId}`, e, chn.id)
                    log += "true"
                }
            } else {
                for (let i = 0; i < logs.length; i++) {
                    if (args[2] == logs[i]) {
                        db.save_logging(`${message.guildId}`, args[2], chn.id)
                        log += "true"
                        args.splice(2, 1)
                    }
                }
            }
            if (log == "") {
                const msg = replacePlaceholders(message.guildId, "management", "logging", "notfound").data;
                return message.channel.send(msg)
            }

            const msg = replacePlaceholders(message.guildId, "management", "logging", "added", [{ regex: /{channel}/g, value: `<#${chn.id}>` }]).data;
            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
            message.channel.send(msg)
        } else if (["remove", "delete"].includes(args[0])) {
            let log = ""
            if (args[1] == "ALL") {
                for (const e of logs) {
                    db.remove_logging(message.guildId, e)
                    log += "true"
                }
            } else {
                for (let i = 0; i < logs.length; i++) {
                    if (args[1] == logs[i]) {
                        db.remove_logging(message.guildId, args[1])
                        log += "true"
                        args.splice(1, 1)
                    }
                }
            }
            if (log == "") return message.channel.send({ content: "error" })

            const msg = replacePlaceholders(message.guildId, "management", "logging", "removed").data;
            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
            message.channel.send(msg)

        } else if (["list"].includes(args[0])) {
            const row = db.getConnection().prepare("SELECT * FROM logging WHERE guildId = ? AND log = ?")

            const map_site1 = [
                "messageDelete",
                "messageContentEdited",
                "messagePinned",
                "messageReactionAdd",
                "messageReactionRemove",
                "messageReactionRemoveAll",

                "channelCreate",
                "channelDelete",
                "channelPinsUpdate",
                "guildChannelPermissionsUpdate",
                "guildChannelTopicUpdate",
            ]
            const map_site2 = [
                "guildMemberAdd",
                "guildMemberRemove",
                "guildMemberBoost",
                "guildMemberUnboost",
                "guildMemberRoleAdd",
                "guildMemberRoleRemove",
                "guildMemberNicknameUpdate",
                "guildBoostLevelUp",
                "guildBoostLevelDown",

                "inviteCreate",
                "inviteDelete",
            ]
            const map_site3 = [
                "stickerCreate",
                "stickerDelete",
                "emojiCreate",
                "emojiDelete",
                "emojiUpdate",
            ]
            const map_site4 = [
                "roleCreate",
                "roleDelete",
                "rolePositionUpdate",
                "rolePermissionsUpdate",
            ]
            const map_site5 = [
                "sendAnnounce",
                "disableCommand",
                "enableCommand",
                "createCommand",
                "removeCommand",
                "addJoinRole",
                "removeJoinRole",
                "changeLanguage",
                "addPermission",
                "removePermission",
                "createReactionRole",
                "removeReactionRole",
                "createWebhook",
                "removeWebhook",
                "createWelcomeMessage",
                "removeWelcomeMessage",
                "createBan",
                "removeBan"
            ]

            let m = ""
            var site = map_site1
            for (let i = 0; i < site.length; i++) {
                const e = row.get(message.guildId, `${site[i]}`)
                if (e) {
                    m += `> \`${site[i]}\` - <#${e.channel}>\n`
                } else {
                    m += `> \`${site[i]}\`\n`
                }
            }
            let a = "";
            var site = map_site2
            for (let i = 0; i < site.length; i++) {
                const e = row.get(message.guildId, `${site[i]}`)
                if (e) {
                    a += `> \`${site[i]}\` - <#${e.channel}>\n`
                } else {
                    a += `> \`${site[i]}\`\n`
                }
            }

            let b = "";
            var site = map_site3
            for (let i = 0; i < site.length; i++) {
                const e = row.get(message.guildId, `${site[i]}`)
                if (e) {
                    b += `> \`${site[i]}\` - <#${e.channel}>\n`
                } else {
                    b += `> \`${site[i]}\`\n`
                }
            }

            let c = "";
            var site = map_site4
            for (let i = 0; i < site.length; i++) {
                const e = row.get(message.guildId, `${site[i]}`)
                if (e) {
                    c += `> \`${site[i]}\` - <#${e.channel}>\n`
                } else {
                    c += `> \`${site[i]}\`\n`
                }
            }

            let d = "";
            var site = map_site5
            for (let i = 0; i < site.length; i++) {
                const e = row.get(message.guildId, `${site[i]}`)
                if (e) {
                    d += `> \`${site[i]}\` - <#${e.channel}>\n`
                } else {
                    d += `> \`${site[i]}\`\n`
                }
            }

            const embed1 = new MessageEmbed()
                .setTitle("Logging List")
                .setDescription("> Here all logs are listed, behind each used log the channel is shown in which the log is posted.\n\n**Messages & Channels**\n" + m)
                .setColor("9b4a51");

            const embed2 = new MessageEmbed()
                .setTitle("Logging List")
                .setDescription("> Here all logs are listed, behind each used log the channel is shown in which the log is posted.\n\n**Guild**\n" + a)
                .setColor("9b4a51");

            const embed3 = new MessageEmbed()
                .setTitle("Logging List")
                .setDescription("> Here all logs are listed, behind each used log the channel is shown in which the log is posted.\n\n**Sticker & Emojis**\n" + b)
                .setColor("9b4a51");

            const embed4 = new MessageEmbed()
                .setTitle("Logging List")
                .setDescription("> Here all logs are listed, behind each used log the channel is shown in which the log is posted.\n\n**Roles**\n" + c)
                .setColor("9b4a51");

            const embed5 = new MessageEmbed()
                .setTitle("Logging List")
                .setDescription("> Here all logs are listed, behind each used log the channel is shown in which the log is posted.\n\n**Amelie Commands**\n" + d)
                .setColor("9b4a51");

            const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Previous')
                .setStyle('PRIMARY');
            const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Next')
                .setStyle('PRIMARY');

            pages = [
                embed1,
                embed2,
                embed3,
                embed4,
                embed5,
            ];

            buttonList = [
                button1,
                button2
            ]
            paginationEmbed(message, pages, buttonList);

        } else {
            return message.channel.send(invalid_usage)
        }
    }
};