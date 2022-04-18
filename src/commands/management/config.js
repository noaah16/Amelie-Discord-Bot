const { Client, Attachment, Message, MessageEmbed } = require("discord.js");

const { replacePlaceholders } = require("../../structures/language");
const db = require("../../structures/data/data");

const global_suitable = true;

module.exports = {
    name: "config",
    aliases: ["cfg"],
    usage: "a!config",

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
		const no_permissions = replacePlaceholders(message.guildId, "events", "no_permissions", "data");

        if (global_suitable == false) return
        if (permissions == false) return message.channel.send(no_permissions)

        const language = db.get_languagelist(message.guildId);
        const usabilitys = db.get_usabilitylist(message.guildId);

        let language_string = ""
        let usability_string = ""

        usabilitys.data.forEach((element) => {
            usability_string += `\`${element.command}\` - `
        });

        language.data.forEach(element => {
            if(element.value == "german") { language_string += `Deutsch :flag_de:`; }
            else if(element.value == "hungary") { language_string += `Hungary :flag_hu:`; }
            else if(element.value == "japanese") { language_string += `Japanese :flag_jp:`; }
        });

        if(language_string == "") {
            language_string += `English :flag_us:`;
        }

        if(usability_string == "") {
            usability_string += `No command is disabled`;
        }

        const msg = replacePlaceholders(message.guildId, "management", "config", "embed")

        const embed = new MessageEmbed()
        .setTitle(`${msg.title}`)
        .setColor("#9b4a51")
        .setDescription(`**${msg.description_language}** ${language_string}\n\n**${msg.description_disablecommands}**\n> ${usability_string.slice(0, -2)}`)
        .setImage("https://media.discordapp.net/attachments/888053404218294352/953753502633590894/wallpaper.png")

        message.channel.send({embeds: [embed]})
        console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
    }
};