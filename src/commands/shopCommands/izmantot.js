const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	IntegrationApplication,
	EmbedBuilder,
	messageLink,
} = require("discord.js");
const itemList = require("../../itemList");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		const item = interaction.options.get("manta").value;
		console.log(item);

		// Find the key only within the veikals object based on user input
		const veikalsKeys = Object.keys(itemList.veikals);
		console.log(veikalsKeys);
		let foundKey = null;

		for (const key of veikalsKeys) {
			if (itemList.veikals[key].name.toLowerCase() === item.toLowerCase()) {
				foundKey = key;
				break;
			}
		}

		if (foundKey !== null) {
			console.log(`Found key in veikals: ${foundKey}`);
			// Access the corresponding item in veikals using items.veikals[foundKey]
			// For example: const virveItem = items.veikals[foundKey];
		} else {
			console.log("Key not found in veikals");
		}

		const selectedItem = itemList.veikals[foundKey];
		console.log(`Name: ${selectedItem.name}`);
		console.log(`Value: ${selectedItem.value}`);
		console.log(`Info: ${selectedItem.info}`);

		const resultText = await selectedItem.use(interaction);
		interaction.reply(`${resultText}`);
	},

	name: "izmantot",
	description: "Izmanto kadu no mantam kas tev pieder",
	options: [
		{
			name: "manta",
			description: "manta, ko velies izmantot",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
};
