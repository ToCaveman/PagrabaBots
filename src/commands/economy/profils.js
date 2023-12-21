const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const Level = require("../../models/level");
const Stats = require("../../models/stats");

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
		const userId = interaction.user.id;
		await interaction.deferReply();
		let user = await User.findOne({
			userId: userId,
		});
		if (!user) {
			interaction.reply(`<@${userId}> nav izveidots profils...`);
			user = new User({ userId });
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
					//inline: true,
				},
				{
					name: "DEPOZĪTA PUDELES 🍾",
					value: `${user.depozitaPudeles}`,
					//inline: true,
				},
				{
					name: "LĪMENIS 🍗",
					value: `${fetchedLevel.level}`,
					//inline: true,
				},
				{
					name: "FENIKSA IEGUVUMI 🎰",
					value: `${user.fenikssIeguvumi}`,
					//inline: true,
				},
				{
					name: "FENIKSA ZAUDĒJUMI 🎰❌",
					value: `${user.fenikssZaudejumi}`,
					//inline: true,
				},
				{
					name: "DEPOZITA IEGUVUMI 🧨",
					value: `${user.depozitsIeguvumi}`,
					//inline: true,
				},
				{
					name: "DEP PUDELES KOPĀ 🍾",
					value: `${user.kopejiDepozits}`,
					//inline: true,
				},
				{
					name: "LABDARĪBAI ZIEDOTS 🏥",
					value: `${user.noziedots}`,
					//inline: true,
				},
			]);

		await interaction.editReply({
			embeds: [embed],
		});
	},

	name: "profils",
	description: "apskaties savu profilu",
};
