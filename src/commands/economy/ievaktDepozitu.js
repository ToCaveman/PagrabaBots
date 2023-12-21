const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
} = require("discord.js");
const User = require("../../models/User");
const Cooldown = require("../../models/cooldown");

function getRandomNumber(x, y) {
	const range = y - x + 1;
	const randomNumber = Math.floor(Math.random() * range);
	return randomNumber + x;
}

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("šo kommandu var izmantot tikai serveros!");
			return;
		}
		await interaction.deferReply();
		const commandName = "depozits";
		const userId = interaction.user.id;
		let cooldown = await Cooldown.findOne({ userId, commandName });

		if (cooldown && Date.now() < cooldown.endsAt) {
			const { default: prettyMs } = await import("pretty-ms");
			await interaction.editReply(
				`Tev vēl jāatdzesējas pirms atkal varēsi ievākt depozītu.\nIevāc depozītu pēc: **${prettyMs(
					cooldown.endsAt - Date.now()
				)}**`
			);
			return;
		}
		if (!cooldown) {
			cooldown = new Cooldown({ userId, commandName });
		}
		let user = await User.findOne({ userId });
		if (!user) {
			user = new User({ userId });
		}
		//depozita ievaksanas logika?
		const depozitaPudele = getRandomNumber(1, 25);
		user.depozitaPudeles += depozitaPudele;
		await user.save();
		interaction.editReply(
			`Tu pa miskastēm savāci **${depozitaPudele}** depoziīta pudeles\nTagad tev ir **${user.depozitaPudeles}** depozīta pudeles`
		);
		cooldown.endsAt = Date.now() + 250_000;
		await cooldown.save();
	},
	name: "ievaktdepozitu",
	description: "Ievāc depozītu, ko pēctam varēsi pārdot",
};
