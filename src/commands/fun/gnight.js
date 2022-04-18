const { Client, Attachment, Message, MessageEmbed } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");

const global_suitable = true;

module.exports = {
    name: "gnight",
    aliases: ["gn"],
    usage: "",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    
    execute(message, args, client) {
		if (!global_suitable) return

        const messages = [
			`Good night ${message.author.toString()} and sleep well :kissing_heart: :heart: :heart_eyes:`,
			`Sleep well ${message.author.toString()} and dream of me :heart:`,
			`Sleep well ${message.author.toString()} and have sweet dreams :kissing_heart: :heart:`,
			`Good night ${message.author.toString()} :kissing_heart: :heart:`,
			`${message.author.toString()} so early? Ok joke Idk what time it is in your country. But I wish you a wonderful good night :heart: :grin:`,
			`GOOD NIGHT ${message.author.toString()}, I LOVE YOU AND SLEEP WELL!! :heart: :grin:`,
			`It's time for dreamland, good night and sleep well ${message.author.toString()}`,
			`Look up, we are both under the same starry sky, ${message.author.toString()} sleep well and sweet dreams^^`,
			`Sweet dreams and sleep well ${message.author.toString()}, soon it will be tomorrow again! :heart_eyes:`,
			`I wish you sweet dreams. Good night, ${message.author.toString()} :heart: :heart_eyes: :grin:`,
			`I can't wait to see you again, sleep tight and sweet dreams ${message.author.toString()} :heart: :grin:`,
			`I hope you are snuggled up warm, dream of me and sleep well ${message.author.toString()} :heart_eyes: :grin:`,
			`Together we are strong. Sleep well and good night ${message.author.toString()} :heart:`,
			`Feel hugged, see you tomorrow, sleep tight and sweet dreams ${message.author.toString()} :heart: :heart_eyes:`,
			`Look out of the window. Although we are not in the same place, we can both look at the same moon, good night and sweet dreams ${message.author.toString()} :heart: :heart_eyes: :grin:`,
			`Good night ${message.author.toString()}, sleep well, and if you can't sleep, I'll be up all night :heart: :grin:`,
			`Now it's off to bed.. Good night and sleep well, ${message.author.toString()}! :heart: :grin:`,
			`Good night ${message.author.toString()}, I wish you a blessed beauty sleep. :heart: :heart_eyes: :grin:`,
			`Good night and sweet dreams ${message.author.toString()}. But be careful where you sleepwalk :heart:`,
			`Sleep is the most delicious invention. Good night, ${message.author.toString()} :heart:`,
			`Yes, well, I'll stay awake for a while, you sleep well and sweet dreams, ${message.author.toString()}. :heart: :grin:`,
			`You are a wonderful person! I hope you are well, have a nice dream ${message.author.toString()} :heart_eyes: :grin:`,
			`I wish you a good night, sleep well ${message.author.toString()}, I look forward to tomorrow :heart:`,
			`I wish you a wonderful good night sleep well and sweet dreams ${message.author.toString()} :heart: :grin:`
		]
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
		message.reply(randomMessage);

    }
};