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
			interaction.reply({
				content: "Šo kommandu var palaist tikai serveros",
				ephemeral: true,
			});
			return;
		}
		const targetUserId =
			interaction.options.get("lietotajs")?.value || interaction.member.id;
		const daudzums = interaction.options.get("daudzums").value;

		const user = await User.findOne({
			userId: targetUserId,
		});
		if (!user) {
			interaction.reply(`<@${targetUserId}> nav izveidots profils...`);
			return;
		}
		user.balance += daudzums;
		await user.save();
		interaction.reply(
			targetUserId === interaction.member.id
				? `Tavam makam pievineoju **${daudzums}**`
				: `<@${targetUserId}> makam pievienoju **${daudzums}**`
		);
	},
	name: "peivienotnaudu",
	description: "kommanda tikai veidotajiem lai nelegali pievineotu naudu",
	devOnly: true,
	options: [
		{
			name: "daudzums",
			description: "naudas daudzums ko nelegali pievienot",
			type: ApplicationCommandOptionType.Number,
			required: true,
		},
		{
			name: "lietotajs",
			description: "lietotajs kam dot naudu",
			type: ApplicationCommandOptionType.User,
			required: false,
		},
	],
};
