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
		let userInventory = Inventory.findOne({
			userId: userId,
		});
		if (!userInventory) {
			interaction.reply(
				"tev nav mantu maisa, kas nozime, ka tev ari nav manti\nTavs mantu maiss tagad tiek izveidots"
			);
			userInventory = new Inventory({ userId });
			await userInventory.save();
			return;
		}
		await interaction.deferReply();
		let mantaToUse = Inventory.findOne({
			userId: userId,
			inventory: { item: interaction.options.get("manta").value },
		});
		const isConsumable = mantaToUse.inventory.item;

		console.log(isConsumable);
		if (mantaToUse.consumable === false) {
			console.log("neizmantojama mantas");
			interaction.editReply("so mantu nevar izmantot");
			return;
		}
		if (!mantaToUse) {
			interaction.editReply("tev nav sadas mantas!");
			return;
		}
		interaction.editReply("akkakaka");
	},

	name: "izmantot",
	description: "Izmanto kadu no mantam kas tev pieder",
	deleted: true,
	options: [
		{
			name: "manta",
			description: "manta, ko velies izmantot",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
};
