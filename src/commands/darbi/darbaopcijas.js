const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
} = require("discord.js");
const User = require("../../models/User");
const Darbi = require("../../darbi");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("so kommandu var izmantot tikai serveros!");
			return;
		}
		let visiDarbi = [];
		let embed = {
			title: "PIEEJAMIE DARBI",
			description: "SOBRID PIEEJAMIE DARBI",
			fields: [],
			footer: {
				text: "PAGRABA IEMITNIEKS 2024",
				icon_url: client.user.displayAvatarURL(),
			},
		};
		for (lieta of Darbi) {
			visiDarbi.push(lieta);
		}
		if (visiDarbi.length === 0) {
			interaction.reply("Sobrid nav pieejams neviens darbs");
			return;
		}
		for (darbins of visiDarbi) {
			let nosaukums = darbins.name;
			let vertiba = darbins.income;
			let pieredze = darbins.pieredze;
			embed.fields.push({
				name: nosaukums,
				value: `Darba ienakums: ${vertiba}\nVajadziga pieredze: ${pieredze}`,
			});
		}

		await interaction.reply({
			embeds: [embed],
		});
	},
	name: "darbi",
	description: "apsakties iespejamo darbu sarakstu",
};
