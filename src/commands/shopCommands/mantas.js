const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	IntegrationApplication,
	EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const Inventory = require("../../models/inventory");
const shopItems = require("../../shopItems");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("so kommandu var izmantot tikai serveros");
			return;
		}
		const userId = interaction.user.id;
		let userInventory = await Inventory.findOne({
			userId: userId,
		});
		if (!userInventory) {
			interaction.reply("Tev nav izveidots profils (tagad tiek izveidots)");
			userInventory = new Inventory({ userId });
			await userInventory.save();
			return;
		}
		let userItems = [];
		const invItems = userInventory.inventory;
		if (!invItems) {
			interaction.reply("tav nav nevienas mantas");
			return;
		}
		for (item of invItems) {
			userItems.push({ nosaukums: item.item, vertiba: item.value });
		}
		let embed = {
			title: "TAVAS MANTAS",
			description: `Leitotaja ${interaction.user.globalName} mantas`,
			fields: [],
			tiemestamp: new Date().toISOString(),
			footer: {
				text: "PAGRABA IEMITNIEKS 2023",
				icon_url: client.user.displayAvatarURL(),
			},
		};
		for (suds of userItems) {
			let nosaukums = suds.nosaukums;
			let vertiba = suds.vertiba;
			embed.fields.push({ name: nosaukums, value: vertiba });
		}
		await interaction.reply({
			embeds: [embed],
		});
	},
	name: "mantas",
	deleted: true,
	description: "apskaties kadas mantas tev pieder",
};
