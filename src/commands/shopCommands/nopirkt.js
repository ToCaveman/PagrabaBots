const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
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
		const allItems = [];
		for (item of shopItems) {
			allItems.push(item);
		}
		const userId = interaction.user.id;
		const itemToBuy = interaction.options.get("lieta").value;
		const manta = allItems.find((item) => item.item === itemToBuy);
		if (!manta) {
			interaction.reply("sada lieta nepastav");
			return;
		}

		let user = await User.findOne({
			userId: userId,
		});
		if (!user) {
			interaction.reply(`<@${userId}> nav izvaidots profils(tagad to dara)`);
			user = new User({ userId });
			await user.save();
			return;
		}
		let userInventory = await Inventory.findOne({
			userId: userId,
		});
		if (!userInventory) {
			interaction.reply(`<@${userId}> nav izvaidots profils(tagad to dara)`);
			userInventory = new Inventory({ userId });
			await userInventory.save();
			return;
		}
		if (user.balance < manta.price) {
			interaction.reply(
				`Tev nepiektiek naudas lai nopirktu so mantu!\nMANTAS CENA: ${manta.price}\nTAVA KONTA: ${user.balance}`
			);
			return;
		}
		userInventory.inventory.push(manta);
		user.balance -= manta.price;
		await user.save();
		await userInventory.save();
		console.log(`${manta}\nNOSAUKUMS: ${manta.item}\nCENA:${manta.price}`);
		interaction.reply(`TU NOPIRKI ${manta.item}\nIZMAKSAS: ${manta.price}`);
	},

	name: "pirkt",
	deleted: true,
	description: "noperc kadu lietu no veikala",
	options: [
		{
			name: "lieta",
			description: "lieta, ko velies nopirkt",
			required: true,
			type: ApplicationCommandOptionType.String,
		},
	],
};
