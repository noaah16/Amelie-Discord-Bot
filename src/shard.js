const { ShardingManager } = require('discord.js');
const moment = require('moment');
require("dotenv").config();

let manager = new ShardingManager('./src/index.js', {
    token: process.env.TOKEN,
    totalShards: "auto",
});

manager.on('shardCreate', shard => {
    console.log(`[${moment().format('h:mm a')}][AMELIE] > ` + "Launched shard " + shard.id);
});

manager.spawn();