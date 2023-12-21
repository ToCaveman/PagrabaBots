const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const Level = require("../../models/level");

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
		const userId = interaction.member.id;
		await interaction.deferReply();
		const user = await User.findOne({
			userId: userId,
		});
		if (!user) {
			interaction.reply(`<@${userId}> nav izveidots profils...`);
			return;
		}
		const fetchedLevel = await Level.findOne({
			userId: userId,
			guildId: interaction.guild.id,
		});

		const embed = new EmbedBuilder()
			.setTitle(interaction.user.displayName)
			.setDescription(`Lietotāja: ${interaction.user.tag} profils`)
			.setThumbnail(interaction.user.displayAvatarURL())
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2023",
			})
			.addFields([
				{
					name: "MAKS 💰",
					value: `${user.balance}`,
				},
				{
					name: "DEPOZĪTA PUDELES 🍾",
					value: `${user.depozitaPudeles}`,
				},
				{
					name: "LĪMENIS 🍗",
					value: `${fetchedLevel.level}`,
				},
			]);

		await interaction.editReply({
			embeds: [embed],
		});
	},

	name: "profils",
	description: "apskaties savu profilu",
};
