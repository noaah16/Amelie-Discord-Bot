const { Client } = require("discord.js");
const moment = require("moment");
const dbl = require("../index");
const request = new (require("rss-parser"))();
const { DateTime } = require("luxon");

const db = require("../structures/data/data");
const cache = require('../structures/cache')

const execute = (client) => {
    console.log(`[${moment().format('h:mm a')}][AMELIE] > ` + "Amelie 2.2 was successfully started.");
    console.log(`[${moment().format('h:mm a')}][AMELIE] > ` + "Amelie is on " + client.guilds.cache.size + " guilds and has a total of " + client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + " users.");
    console.log(`[${moment().format('h:mm a')}][AMELIE] > Invite: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);

    dbl.on('posted', () => {
        console.log(`[${moment().format('h:mm a')}][AMELIE] > Server count posted!`);
    })

    dbl.on('error', e => {
        console.log(`[${moment().format('h:mm a')}][AMELIE] > Oops! ${e}`);
    });

    const bans = db.get_ban()
    let e = ""
    bans.data.forEach(element => {
        cache.ban.set(element.guildId+element.userId, {
            guildId: element.guildId,
            member: element.userId,
            duration: element.duration
        })
        e += "fff"
    })
    if(!e == "") {
        console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Bulk Activity on the database! [BAN (in cache)]");
    }

    // 15 minutes event (können direkte datenbank abfragen getätigt werden, jedoch nur direkte, keine massen abfragen)
    setInterval(async () => {
        const youtube = db.get_youtube()

        let string = ""
        youtube.data.forEach(async (yt, index) => {
            string += `${index + 1}`
            var data = await request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${yt.channelURL}`).catch(console.error)
            if (!data.items[0]) return
            var videoData = data.items[0];

            const check = db.get_checklist(yt.channelId)

            if (!check.data) {
                let channel = client.channels.cache.get(yt.channelId);
                const msg = yt.message
                channel.send(msg.replace('{author}', data.items[0].author).replace('{-}', "\n") + `\n` + videoData.link)
                db.save_check(yt.channelId, videoData.link)
                return;

            } else {
                const check = db.get_check(yt.channelId)
                check.data.forEach((check) => {
                    if (check.channelURL == videoData.link) {
                        return;
                    }
                })
            }
        })
        console.log(`[${moment().format('h:mm a')}][AMELIE] > ` + `The YouTube database was successfully queried. (${string})`)
    }, 60000 * 15)

    // 15 second event (dürfen nur cache abfragen getätigt werden.)
    setInterval(async () => {
        cache.ban.forEach(async(value, keys) => {
            var guild = client.guilds.cache.get(`${value.guildId}`);
            if (DateTime.now() > DateTime.fromISO(value.duration)) {
                const userid = `${value.member}`
                try {
                    const bans = await guild.bans.fetch()
                    const user = bans.get(userid)
                    if (user) {
                        guild.members.unban(`${value.member}`).then(() => {
                            cache.ban.delete(keys)
                            console.log(value, keys)
                            db.remove_ban(value.guildId, value.member)
                            console.log(`[${moment().format('h:mm a')}][AMELIE DATA] > ` + "Activity on the database!");
                        }).catch((err) => {
                            return console.log(err)
                        })
                    } else {
                        db.remove_ban(value.guildId, value.member)
                        cache.ban.delete(keys)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        })
    }, 30000);


    const status = [
        `ameliebot.com`,
        `bycranix.de`
    ]

    let counter = 0
    const updateStaus = () => {
        client.user?.setPresence({ 
            status: "online",
            activities: [{ name: status[counter] }] 
        })
        if (++counter >= status.length) { counter = 0 }
        setTimeout(updateStaus, 1000 * 5)
    }
    updateStaus()
};

module.exports = {
	name: "ready",
	once: true,
	execute,
};
