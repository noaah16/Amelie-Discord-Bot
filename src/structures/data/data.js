const Database = require("better-sqlite3");

let dbRef;

var amelie_data = {
	name: "Amelie",
	version: "2.0"
};

var commands = [
	//MANAGEMENT//
	"announce",
	"ban",
	"botinfo",
	"ccmd",
	"disable",
	"enable",
	"guildinfo",
	"joinroles",
	"kick",
	"language",
	"log",
	"mute",
	"permissions",
	"purge",
	"reactionroles",
	"unban",
	"unmute",
	"userinfo",
	"webhook",
	"welcmsg",
	//FUN & GAMES//

	//OTHERS//
]

const save_command = (guildId, command, msg) => {
	try {
		const db = getConnection();

		const insertStmt = db.prepare(
			"INSERT INTO custom_commands(guildId, command, msg) VALUES(?, ?, ?)"
		);
		insertStmt.run(guildId, command, msg);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const remove_command = (guildId, command) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM custom_commands WHERE guildId = ? AND command = ?"
		);
		cleanStmt.run(guildId, command);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_command = (guildId, command) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM custom_commands WHERE guildId = ? AND command = ?"
		);
		const result = getStmt.get(guildId, command);

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_commandlist = (guildId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM custom_commands WHERE guildId = ?"
		);
		const result = getStmt.all(guildId);

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};

const save_logging = (guildId, log, channel) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM logging WHERE guildId = ? AND log = ?"
		);
		cleanStmt.run(guildId, log);

		const insertStmt = db.prepare(
			"INSERT INTO logging(guildId, log, channel) VALUES(?, ?, ?)"
		);
		insertStmt.run(guildId, log, channel);

	} catch (e) {
		return {
			error: e,
		};
	}
};
const remove_logging = (guildId, log) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM logging WHERE guildId = ? AND log = ?"
		);
		cleanStmt.run(guildId, log);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_logging = (guildId, log) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM logging WHERE guildId = ? AND log = ?"
		);
		const result = getStmt.get(guildId, log);

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};

const save_ban = (guildId, userId, duration) => {
	try {
		const db = getConnection();

		const insertStmt = db.prepare(
			"INSERT INTO ban(guildId, userId, duration) VALUES(?, ?, ?)"
		);
		insertStmt.run(guildId, userId, duration);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const remove_ban = (guildId, userId) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM ban WHERE guildId = ? AND userId = ?"
		);
		cleanStmt.run(guildId, userId);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_ban = () => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM ban"
		);
		const result = getStmt.all();

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};

const save_reactionrole = (guildId, reactionId, channelId, messageId, roleId, emoji) => {
	try {
		const db = getConnection();

		const insertStmt = db.prepare(
			"INSERT INTO reactionrole(guildId, reactionId, channelId, messageId, roleId, emoji) VALUES(?, ?, ?, ?, ?, ?)"
		);
		insertStmt.run(guildId, reactionId, channelId, messageId, roleId, emoji);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const remove_reactionrole = (guildId, reactionId) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM reactionrole WHERE guildId = ? AND reactionId = ?"
		);
		cleanStmt.run(guildId, reactionId);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_reactionrole = (guildId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare("SELECT * FROM reactionrole WHERE guildId = ?");
		const result = getStmt.all(guildId);

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};

const save_roles = (userId, role) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM join_roles WHERE userId = ? AND role = ?"
		);
		cleanStmt.run(userId, role);

		const insertStmt = db.prepare(
			"INSERT INTO join_roles(userId, role) VALUES(?, ?)"
		);
		const info = insertStmt.run(userId, role);

		return {
			data: info.lastInsertRowid,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const remove_roles = (userId, role) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM join_roles WHERE userId = ? AND role = ?"
		);
		cleanStmt.run(userId, role);

		return {};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_roles = (userId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare("SELECT * FROM join_roles WHERE userId = ?");
		const result = getStmt.get(userId);

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_roleslist = (userId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare("SELECT * FROM join_roles WHERE userId = ?");
		const result = getStmt.all(userId);

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};

const save_usability = (guildId, command) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM usability WHERE guildId = ? AND command = ?"
		);
		cleanStmt.run(guildId, command);

		const insertStmt = db.prepare(
			"INSERT INTO usability(guildId, command) VALUES(?, ?)"
		);
		insertStmt.run(guildId, command);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const remove_usability = (guildId, command) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare("SELECT * FROM usability WHERE guildId = ? AND command = ?");
		const result = getStmt.get(guildId, command);

		const cleanStmt = db.prepare(
			"DELETE FROM usability WHERE guildId = ? AND command = ?"
		);
		cleanStmt.run(guildId, command);

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_usability = (guildId, command) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare("SELECT * FROM usability WHERE guildId = ? AND command = ?");
		const result = getStmt.get(guildId, command);

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_usabilitylist = (guildId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare("SELECT * FROM usability WHERE guildId = ?");
		const result = getStmt.all(guildId);

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};

const save_permissions = (guildId, permissions, roleId) => {
	try {
		const db = getConnection();

		const insertStmt = db.prepare(
			"INSERT INTO permissions(guildId, permissions, role) VALUES(?, ?, ?)"
		);
		insertStmt.run(guildId, permissions, roleId);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const remove_permissions = (guildId, permissions, roleId) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM permissions WHERE guildId = ? AND permissions = ? AND role = ?"
		);
		cleanStmt.run(guildId, permissions, roleId);

		return {};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_permissions = (guildId, permissions) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM permissions WHERE guildId = ? AND permissions = ?"
		);
		const result = getStmt.get(guildId, permissions);
		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_permissionslist = (guildId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM permissions WHERE guildId = ?"
		);
		const result = getStmt.all(guildId);
		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_permissionsliste = (guildId, permissions) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM permissions WHERE guildId = ? AND permissions = ?"
		);
		const result = getStmt.all(guildId, permissions);
		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};

const save_welcomemessage = (guildId, message) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM welcome_message WHERE guildId = ?"
		);
		cleanStmt.run(guildId);

		const insertStmt = db.prepare(
			"INSERT INTO welcome_message(guildId, message) VALUES(?, ?)"
		);
		insertStmt.run(guildId, message);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const remove_welcomemessage = (guildId) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM welcome_message WHERE guildId = ?"
		);
		cleanStmt.run(guildId);

	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_welcomemessage = (guildId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM welcome_message WHERE guildId = ?"
		);
		const result = getStmt.get(guildId);
		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};

const save_language = (guildId, key, value) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM language WHERE guildId = ? AND key = ?"
		);
		cleanStmt.run(guildId, key);

		const insertStmt = db.prepare("INSERT INTO language VALUES(?, ?, ?)");
		insertStmt.run(guildId, key, value);

		return {};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_language = (guildId, key) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM language WHERE guildId = ? AND key = ?"
		);
		const result = getStmt.get(guildId, key);

		return result ? result.value : undefined;
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_languagelist = (guildId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM language WHERE guildId = ?"
		);
		const result = getStmt.all(guildId);
		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};

const save_youtube = (guildId, channelId, channelURL, message) => {
	try {
		const db = getConnection();

		const insertStmt = db.prepare("INSERT INTO webhook_youtube VALUES(?, ?, ?, ?)");
		insertStmt.run(guildId, channelId, channelURL, message);

		return {};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const remove_youtube = (guildId, channelURL) => {
	try {
		const db = getConnection();

		const cleanStmt = db.prepare(
			"DELETE FROM webhook_youtube WHERE guildId = ? AND channelURL = ?"
		);
		cleanStmt.run(guildId, channelURL);

		return {};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_youtube = () => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM webhook_youtube"
		);
		const result = getStmt.all();
		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_youtubelist = (guildId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare("SELECT * FROM webhook_youtube WHERE guildId = ?");
		const result = getStmt.all(guildId);

		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};

const save_check = (channelId, channelURL) => {
	try {
		const db = getConnection();

		const insertStmt = db.prepare(
			"INSERT INTO yt_check(channelId, channelURL) VALUES(?, ?)"
		);
		insertStmt.run(channelId, channelURL);
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_check = (channelId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM yt_check WHERE channelId = ?"
		);
		const result = getStmt.all(channelId);
		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};
const get_checklist = (channelId) => {
	try {
		const db = getConnection();

		const getStmt = db.prepare(
			"SELECT * FROM yt_check WHERE channelId = ?"
		);

		const result = getStmt.get(channelId);
		return {
			data: result,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
};


/**
 * @returns {Database} Database connection
 */
const getConnection = () => {
	if (dbRef) {
		return dbRef;
	}

	const dbPath = `./src/structures/data/data.db`;
	dbRef = new Database(dbPath);

	dbRef.exec("CREATE TABLE IF NOT EXISTS custom_commands (guildId TEXT, command TEXT, msg TEXT);");
	dbRef.exec("CREATE TABLE IF NOT EXISTS join_roles (userId TEXT, role TEXT PRIMARY KEY);");
	dbRef.exec("CREATE TABLE IF NOT EXISTS ban (guildId TEXT, userId TEXT, duration TEXT);");
	dbRef.exec("CREATE TABLE IF NOT EXISTS welcome_message (guildId TEXT, message TEXT);");
	dbRef.exec("CREATE TABLE IF NOT EXISTS language (guildId TEXT, key TEXT, value TEXT, PRIMARY KEY(guildId, key));");
	dbRef.exec("CREATE TABLE IF NOT EXISTS usability (guildId TEXT, command TEXT);");
	dbRef.exec("CREATE TABLE IF NOT EXISTS logging (guildId TEXT, log TEXT, channel TEXT);");
	dbRef.exec("CREATE TABLE IF NOT EXISTS reactionrole (guildId TEXT, reactionId TEXT, channelId TEXT, messageId TEXT, roleId TEXT, emoji TEXT);");
	dbRef.exec("CREATE TABLE IF NOT EXISTS permissions (guildId TEXT, permissions TEXT, role TEXT);");

	dbRef.exec("CREATE TABLE IF NOT EXISTS webhook_youtube (guildId TEXT, channelId TEXT, channelURL TEXT, message TEXT);");
	dbRef.exec("CREATE TABLE IF NOT EXISTS yt_check (channelId TEXT, channelURL TEXT);");

	return dbRef;
};

module.exports = {
	getConnection,
	commands,
	amelie_data,

	save_command,
	remove_command,
	get_command,
	get_commandlist,

	get_roles,
	get_roleslist,
	save_roles,
	remove_roles,

	save_language,
	get_language,
	get_languagelist,

	save_usability,
	remove_usability,
	get_usability,
	get_usabilitylist,

	save_logging,
	remove_logging,
	get_logging,

	save_permissions,
	remove_permissions,
	get_permissions,
	get_permissionslist,
	get_permissionsliste,

	save_welcomemessage,
	remove_welcomemessage,
	get_welcomemessage,

	save_reactionrole,
	remove_reactionrole,
	get_reactionrole,

	save_youtube,
	remove_youtube,
	get_youtube,
	get_youtubelist,

	get_check,
	get_checklist,
	save_check,

	save_ban,
	remove_ban,
	get_ban,
};
