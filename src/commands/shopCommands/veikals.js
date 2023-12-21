const { Client, Interaction } = require("discord.js");
const items = require("../../shopItems");
module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		console.log(items);
		if (items.length === 0) {
			interaction.reply("Šobrīd veikalā nekas netiek pārdots...");
			return;
		}
		const shopList = items.map((value, index) => {
			return `\n**${index + 1}.** ${value.item}: ${value.price}`;
		});
		console.log(shopList);
		interaction.reply(`**VEIKALS:**${shopList}`);
	},

	name: "veikals",
	description: "paskaties, ko pārdod veikalā",
};
