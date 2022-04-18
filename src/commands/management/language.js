const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
    name: "lang",
	aliases: ["language", "sprache"],
	usage: "a!language <lang>",
	
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
        const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data")
		if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(no_permissions)

        if (global_suitable == false) return
        
        const key = "LANGUAGE"
        if (!args[0]) return message.channel.send(invalid_usage)

        if (["de", "german"].includes(args[0])) {
            let value = "german"
            var lang = "**Deutsch** :flag_de:"
            db.save_language(message.guildId, key, value);

        } else if (["en", "english"].includes(args[0])) {
            let value = "english"
            var lang = "**English** :flag_us:"
            db.save_language(message.guildId, key, value);

        } else if (["hu", "hungary"].includes(args[0])) {
            let value = "hungary"
            var lang = "**Hungary** :flag_hu:"
            db.save_language(message.guildId, key, value);

        } else if (["jp"].includes(args[0])) {
            let value = "japanese"
            var lang = "**Japanese** :flag_jp:"
            db.save_language(message.guildId, key, value);
        } else {
            return message.channel.send(invalid_usage)
        }

        const success = replacePlaceholders(message.guildId, "management", "language", "success_lang_change", [{ regex: /{lang}/g, value: lang }]).data;
        console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
        message.channel.send(success)
        changeLanguage(client, message, lang)

    }
};

function changeLanguage(client, message, lang) {
	const logging = db.get_logging(message.guildId, "changeLanguage")

	if (logging.data) {
		const embed = new MessageEmbed()
			.setTitle("Language updated")
			.setDescription(`> Amelie's language was changed on this server to from <${message.author.id}> to ${lang}`)
			.setColor("9b4a51")

		const id = client.channels.cache.get(logging.data.channel)
		id.send({ embeds: [embed] })
	}
}