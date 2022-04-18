const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");
const axios = require("axios")

const global_suitable = true;

module.exports = {
    name: "userinfo",
	aliases: ["user", "member"],
	usage: "a!userinfo <@member>",
	
    /**
     * @param {Message} message 
     * @param {String[]} args
     * @param {Client} client
     */
    
	async execute(message, args, client, moment, permissions, cmd) {
		const disable = db.get_usability(message.guildId, module.exports.name).data;
		const cmd_notfound = replacePlaceholders(message.guildId, "events", "cmd_notfound", "data", [{ regex: /{command}/g, value: `${cmd}` }]);
		if (disable) return message.channel.send(cmd_notfound)
		
		//const invalid_usage = replacePlaceholders(message.guildId, "events", "invalid_usage", "data", [{ regex: /{usage}/g, value: `\`${module.exports.usage}\`` }]);

		if (global_suitable == false) return

		const member = message.mentions.members.last() || message.member;

		const embed = new MessageEmbed()
		.setTitle(`${member.user.username}'s user information`)
		.setThumbnail(member.user.avatarURL({dynamic: true, size: 512}))
		.setDescription(`**General**\n` + 
		`> **Username:** ${member.user.tag}\n` +
		`> **Mention:** ${member.user.toString()}\n` +
		`> **User ID:** \`${member.user.id}\`\n` +
		`> **Badges:** ${member.user.flags.toArray().join(", ") || "NONE"}\n\n` +
		
		`> **Joined Discord:** <t:${parseInt(member.user.createdTimestamp / 1000)}:R>\n` +
		`> **Joined Server:** <t:${parseInt(member.joinedTimestamp / 1000)}:R>\n\n` +
		
		`**Roles**\n` +
		`> ${member.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}`)
		.setColor("9b4a51")

		const data = await axios.get(`https://discord.com/api/users/${member.id}`, {
			headers: {
				Authorization: `Bot ${client.token}`
			}
		}).then(d => d.data);
		if(data.banner) {
			let url = data.banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
			url = `https://cdn.discordapp.com/banners/${member.id}/${data.banner}${url}`;
			embed.setImage(url)
		}

		message.channel.send({embeds: [embed]})
    }
};