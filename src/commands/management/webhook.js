const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");
const fetch = require('node-fetch');

const global_suitable = true;

module.exports = {
    name: "webhook",
    aliases: ["hook", "wb"],
    usage: "a!webhook <add|remove> youtube <#channel> <CHANNEL ID> <notification message>",

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

        if (["add", "create"].includes(args[0].toLowerCase())) {
            if (!args[1]) return message.channel.send(invalid_usage)
            if (["youtube"].includes(args[1].toLowerCase())) {
                var chn = "null";
                chn = message.mentions.channels.first()
                if(!message.mentions.channels.first()) return message.channel.send(invalid_usage)

                const row = db.getConnection().prepare("SELECT * FROM webhook_youtube WHERE guildId = ?").get(message.guild.id)

                const channelId = chn.id
                var channelURL = args[3]
                const msg = args.slice(4).join(" ")

                if(row && channelURL == row.channelURL) {
                    const msg = replacePlaceholders(message.guildId, "management", "webhook", "already_exist").data;
                    return message.channel.send(msg)
                }
                
                if(!args[3]) return message.channel.send(invalid_usage)

                let url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${args[3]}&key=AIzaSyAihbfzKLpeo-VHPz5vdOlcwGP5TO_TnxQ`;
                let settings = { method: "Get" };

                fetch(url, settings)
                    .then(res => res.json())
                    .then((json) => {
                        if(!json.items) {
                            const msg = replacePlaceholders(message.guildId, "management", "webhook", "yt_webhook_not_found",  [{ regex: /{channelId}/g, value: args[3] }]).data;
                            return message.channel.send(msg)
                        }
                        console.log(json.items[0].snippet.thumbnails.high.url)
                        let item = json.items[0].snippet

                        let embed = new MessageEmbed()
                            .setTitle("<:newsuccess:926972978888048711> YouTube webhook was added")
                            .setThumbnail(item.thumbnails.high.url)
                            .setDescription(`The YouTube channel of **${item.title}** was successfully added\n\n` +
                                `**Information**\n` +
                                `> **Author:** [${item.title}](https://www.youtube.com/channel/${json.items[0].id}/)\n` +
                                `> **Channel ID:** \`${json.items[0].id}\`\n\n` +
                                `As soon as a new video is uploaded by ${item.title}, the webhook sends a message to the <#${chn.id}> channel`)
                            .setColor("#238351")
                        
                        if (!args[4]) return message.channel.send({ content: "Keine Message angegeben." })
                        console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
                        db.save_youtube(message.guildId, channelId, channelURL, msg)
                        message.channel.send({ embeds: [embed] })
                        createWebhook(client, message, args, channelId)

                    })

            } else {
                return message.channel.send(invalid_usage)
            }

        } else if (["remove", "delete"].includes(args[0].toLowerCase())) {
            if (!args[1]) return message.channel.send(invalid_usage)
            if (["youtube"].includes(args[1].toLowerCase())) {
                const link = args[2]

                if(!args[2]) return message.channel.send(invalid_usage)

                console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
                db.remove_youtube(message.guildId, link);
                const msg = replacePlaceholders(message.guildId, "management", "webhook", "removed",  [{ regex: /{id}/g, value: args[2] }]).data;
                message.channel.send(msg)
                return removeWebhook(client, message, args)
            } else {
                return message.channel.send(invalid_usage)
            }
        } else if (["list"].includes(args[0].toLowerCase())) {
            const youtube = db.get_youtubelist(message.guildId);

            let string = "";

            youtube.data.forEach((list) => {
                string += `> \`${list.channelURL}\` in <#${list.channelId}>\\n`;
            });

            const msg = replacePlaceholders(message.guildId, "management", "webhook", "webhook_list",  [{ regex: /{youtube}/g, value: string }]).data;
            return message.channel.send(msg)
        } else {
            return message.channel.send(invalid_usage)
        }
    }
};

function createWebhook(client, message, args, channelId) {
	const logging = db.get_logging(message.guildId, "createWebhook")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("ReactionRole created")
			.setDescription(`> A **YouTube** webhook was created by <@${message.author.id}>\n\n**Information**\n> **YouTube URL:** \`${args[3]}\`\n> **Channel ID:** <#${channelId}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}

function removeWebhook(client, message, args) {
	const logging = db.get_logging(message.guildId, "removeWebhook")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("ReactionRole created")
			.setDescription(`> The **YouTube** webhook \`${args[3]}\` was removed by <@${message.author.id}>`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}
