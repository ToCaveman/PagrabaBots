const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("Šo kommandu var izmantot tikai serveros");
			return;
		}

		const targetUserId =
			interaction.options.get("lietotajs")?.value || interaction.member.id;
		const makavertiba = interaction.options.get("makavertiba").value;
		if (makavertiba < 0) {
			interaction.reply(
				"navar maka vērtību uzlikt negatīvu...\nTu taču negribētu būt parādos..."
			);
			return;
		}
		const user = await User.findOne({
			userId: targetUserId,
		});
		if (!user) {
			interaction.reply(`<@${targetUserId}> nav izveidots profils...`);
			return;
		}
		user.balance = makavertiba;
		await user.save();
		interaction.reply(
			`Samainīju <@${targetUserId}> maka vērtību uz **${makavertiba}**`
		);
	},

	name: "uzliktmaku",
	description: "nelegali kadam izmainit maka vertibu",
	devOnly: true,
	options: [
		{
			name: "makavertiba",
			description: "cik daudz naudas būs maka",
			required: true,
			type: ApplicationCommandOptionType.Number,
		},
		{
			name: "lietotajs",
			description: "lietotājs kura maka vērtību mainīsi",
			type: ApplicationCommandOptionType.User,
		},
	],
};
