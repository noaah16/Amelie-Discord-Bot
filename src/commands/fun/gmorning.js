const { Client, Attachment, Message, MessageEmbed } = require("discord.js");
const { replacePlaceholders } = require("../../structures/language");

const global_suitable = true;

module.exports = {
    name: "gmorning",
    aliases: ["gm"],
    usage: "",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    
    execute(message, args, client) {
		if (!global_suitable) return
		
        const messages = [
			`Good morning ${message.author.toString()}, I hope you slept well and still have a nice day :grin: :heart:`,
			`GOOD MORNING ${message.author.toString()}!! HOPE YOU SLEPT WELL!!! :grin: :heart:`,
			`${message.author.toString()} good morning my friend :grin:`,
			`OMG I LOVE YOU ${message.author.toString()}!! GOOD MORNING! :heart:`,
			`Good morning ${message.author.toString()}`,
			`Good morning ${message.author.toString()}, I hope you had sweet dreams`,
			`Finally you are here ${message.author.toString()}! Good morning :grin: :heart:`,
			`${message.author.toString()} i wish you a wonderful start to the new day`,
			`And another morning that doesn't start in the Maldives, although? Maybe it does? also no matter good morning ${message.author.toString()}`,
			`Good morning ${message.author.toString()}, I hope you are well today, have a nice day :heart:`,
			`Good morning ${message.author.toString()}, a new day begins, with new worries and a lot of sorrow, or maybe still, with smile on your face?? no matter how you feel! Smile pleaseee!! :heart:`,
			`I wish you a wonderful good morning ${message.author.toString()} :heart:`,
			`Good morningggg ${message.author.toString()}, get out of the feathers and brush your teeth :heart: :heart_eyes: :grin:`,
			`Good morning ${message.author.toString()}, have a wonderful day :heart: :grin:`,
			`In the name of the clock, the coffee, the holy morning muffle & Amelie: Good morning ${message.author.toString()} :heart: :grin:`,
			`Good morning ${message.author.toString()}, once press from afar. Have a great day! :grin:`,
			`Good morning ${message.author.toString()}! Come well through the day! :heart_eyes: :grin:`,
			`Good morninggggg, with a smile on my face I woke up today, because I thought of you ${message.author.toString()} :heart_eyes: `,
			`Good morning ${message.author.toString()}, I wish you a good start to a wonderful day. :heart_eyes: `,
			`Good morning ${message.author.toString()}! Let's go! But take it easy! :heart_eyes:`,
			`Today is such a day, even my coffee needs a coffee, well good morning ${message.author.toString()} :heart: :heart_eyes:`,
			`Good morning ${message.author.toString()}, have a nice day, I'm going back to sleep :heart:`,
			`Good mooorninggggg ${message.author.toString()}, I wish you a wonderful beautiful day :heart:`,
			`hehe, so I'm on holiday, but I do not want to brag about it now, good morning ${message.author.toString()}, and do something productive :heart:`
		]

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

		message.reply(randomMessage);

    }
};