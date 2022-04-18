require("dotenv").config();
const Discord = require('discord.js');
const { Client, MessageEmbed } = require("discord.js");
const moment = require("moment");
const fs = require('fs');
const client = new Client({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
        "GUILD_EMOJIS_AND_STICKERS"
    ],
    partials: [
        'USER',
        'MESSAGE',
        'CHANNEL',
        'REACTION',
        'GUILD_MEMBER',
        'GUILD_SCHEDULED_EVENT'
    ],
});

const global_suitable = true;

const DBL = require("dblapi.js");
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2NTIyNjIxNjUwMzY0MDA2NSIsImJvdCI6dHJ1ZSwiaWF0IjoxNjQzOTk4MTQ2fQ.H1tW_H4_s-WaeYvl6780u2ZsGVeuvQcHU3wHJioqlFE', client);
module.exports = dbl;

const token = process.env.TOKEN;
const prefix = "a!";

const { replacePlaceholders } = require("./structures/language");
const db = require("./structures/data/data");

const logs = require('discord-logs');
logs(client, { debug: false });

let cache = require('./structures/cache')
let map_d = new Set()
let cooldown = 1000;

client.commands = new Discord.Collection();
client.scommands = new Discord.Collection();

const important = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'))
for (const file of important) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}
const management = fs.readdirSync('./src/commands/management/').filter(file => file.endsWith('.js'))
for (const file of management) {
    const command = require(`./commands/management/${file}`);

    client.commands.set(command.name, command);
}
const funAndGames = fs.readdirSync('./src/commands/fun/').filter(file => file.endsWith('.js'))
for (const file of funAndGames) {
    const command = require(`./commands/fun/${file}`);

    client.commands.set(command.name, command);
}
const slash_commands = fs.readdirSync("./src/commands/slashcommands").filter(file => file.endsWith(".js"));
slash_commands.forEach(commandFile => {
    const command_s = require(`./commands/slashcommands/${commandFile}`);
    client.scommands.set(command_s.data.name, command_s);
});

const event = require(`${__dirname}/events/ready`);

if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
} else {
    console.log(`[${moment().format('h:mm a')}][AMELIE] > An error occurred when starting Amelie`);
}

client.on("guildMemberAdd", async (member) => {
    const welcome_message = db.get_welcomemessage(member.guild.id);
    const joinRoles = db.get_roleslist(member.guild.id);

    if (welcome_message.data) {
        const msg = welcome_message.data.message
        member.send({ content: `${msg.replace('{member}', member).replace('{server}', member.guild.name)}` }).catch((err) => {return;})
        console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
    }

    joinRoles.data.forEach(element => {
        member.roles.add(element.role).catch(err => {return;})
        console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Bulk Activity on the database! [JR Add]");
    });

});

client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;
    const rr = db.get_reactionrole(reaction.message.guildId)
    rr.data.forEach(async (rr) => {
        var guild = await client.guilds.fetch(rr.guildId).catch(console.error);

        if (reaction.emoji.name == rr.emoji || reaction.emoji.id == rr.emoji && reaction.message.id == rr.messageId) {
            var userId = await guild.members.fetch(user.id);
            let role = await guild.roles.fetch(rr.roleId);
            userId.roles.add(role);
            return console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
        }
    })
});

client.on("messageReactionRemove", async (reaction, user) => {
    if (user.bot) return;
    const rr = db.get_reactionrole(reaction.message.guildId)
    rr.data.forEach(async (rr) => {
        var guild = await client.guilds.fetch(rr.guildId).catch(console.error);

        if (reaction.emoji.name == rr.emoji || reaction.emoji.id == rr.emoji && reaction.message.id == rr.messageId) {
            var userId = await guild.members.fetch(user.id);
            let role = await guild.roles.fetch(rr.roleId);
            userId.roles.remove(role);
            return console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
        }
    })
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const messageOptions = replacePlaceholders(message.guildId, "events", "global_deactivated", "data");
    if (message.author.id != "320996868332978206") return message.channel.send(messageOptions);

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if (map_d.has(message.author.id)) return message.reply({ content: "Jooo chill, you are too fast, I am totally overwhelmed." })
    try {
        if (command) {
            const perms = db.get_permissionsliste(message.guildId, command.name)
            let permissions = false
            perms.data.forEach(element => {
                if (message.member.roles.cache.get(element.role)) {
                    permissions = true
                }
            });
            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");

            if (message.member.permissions.has("ADMINISTRATOR")) {
                permissions = true
            }

            command.execute(message, args, client, moment, permissions, cmd);
        } else {
            if (cache.ccmd.get(message.guildId) == message.guildId && cache.ccmd.has(cmd + message.guildId)) {
                if (cmd == cache.ccmd.get(cmd + message.guildId) && cache.ccmd.get(message.guildId) == message.guildId) {
                    return message.channel.send({ content: `${cache.ccmd.get("message" + message.guildId)}` })
                }
            } else {
                const ccmd = db.get_command(message.guildId, cmd);
                if (!ccmd.data) {
                    const a = ["inv", "collect", "sell", "lyra", "lyras", "use"]
                    for(let i = 0; i < a.length; i++) {
                        if(cmd == a[i]) return;
                    }
                    const cmd_notfound = replacePlaceholders(message.guildId, "events", "cmd_notfound", "data", [{ regex: /{command}/g, value: `${cmd}` }]);
                    return message.channel.send(cmd_notfound)
                }
                cache.ccmd.set(message.guildId, message.guildId)
                cache.ccmd.set(cmd + message.guildId, cmd)
                cache.ccmd.set("message" + message.guildId, ccmd.data.msg)
                console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
                if (cmd == cache.ccmd.get(cmd + message.guildId) && cache.ccmd.get(message.guildId) == message.guildId) {
                    return message.channel.send({ content: `${cache.ccmd.get("message" + message.guildId)}` })
                }
                map_d.add(message.author.id);
                setTimeout(() => {
                    map_d.delete(message.author.id)
                }, cooldown)
            }
        }
        map_d.add(message.author.id);
        setTimeout(() => {
            map_d.delete(message.author.id)
        }, cooldown)
        return;
    } catch (err) {
        console.log(err)
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command_s = client.scommands.get(interaction.commandName)

    if (command_s) {
        try {
            await command_s.execute(interaction, client)
        } catch (error) {
            console.log(error)

            if (interaction.deferred || interaction.replied) {
                interaction.editReply("error")
            } else {
                interaction.reply("error")
            }
        }
    }
})

client.on("rateLimit", limitInfo => {
    console.log(`[${moment().format('h:mm a')}][AMELIE] > ` + "You are being rate limited")
});

require("./events/logging")(client);

client.login(token)