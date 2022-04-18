const { readFileSync } = require("fs");
const { get_language } = require("../structures/data/data");
const moment = require("moment")

/**
 * @param {string} guildId 
 * @param {string} category 
 * @param {string} subCategory 
 * @param {string} responseId
 * @param {Array<{regex: RegExp, value: string}>} [replaces]
 * @returns {Promise<undefined|Object>} 
 */
const replacePlaceholders = (
	guildId,
	category,
	subCategory,
	responseId,
	replaces = []
) => {
	const language = (get_language(guildId, "LANGUAGE") || "english")

	const langFilePath = `./src/languages/${language}.json`;
	const langFile = JSON.parse(readFileSync(langFilePath));

	let responseStr = "";

	try {
		const response = langFile[category][subCategory][responseId];
		responseStr = JSON.stringify(response);
		replaces.forEach((r) => { responseStr = responseStr.replace(r.regex, r.value); });
	} catch (e) {
		console.log(`[${moment().format('h:mm a')}][AMELIE] > ` + `Unable to find the response ${category}->${subCategory}->${responseId} in the ${langFilePath}`);
		return;
	}

	return JSON.parse(responseStr);
};

module.exports = {
	replacePlaceholders,
};
