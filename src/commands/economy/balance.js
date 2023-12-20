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
		const targerUserId =
			interaction.options.get("lietotajs")?.value || interaction.member.id;
		await interaction.deferReply();

		const user = await User.findOne({
			userId: targerUserId,
			guildId: interaction.guild.id,
		});
		if (!user) {
			interaction.editReply(`<@${targerUserId}> nav izveidots profils...`);
			return;
		}

		interaction.editReply(
			targerUserId === interaction.member.id
				? `Tavā makā ir **${user.balance}**`
				: `<@${targerUserId}> makā ir **${user.balance}**`
		);
	},

	name: "mananauda",
	description: "Apskaties cik tavā kontā ir naudas",
	options: [
		{
			name: "lietotajs",
			description: "apskaties kāda cita lietotāja maku",
			type: ApplicationCommandOptionType.User,
			required: false,
		},
	],
};
