const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const Level = require("../../models/level");
const Stats = require("../../models/stats");
const UserMasinas = require("../../models/userMasinas");
const Statistika = require("../../models/statistika");

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
		let statistika = await Statistika.findOne({ userId: userId });
		if (!statistika) {
			statistika = new Statistika({ userId });
			await statistika.save();
			console.log("izveidoju jaunu statistikas profilu");
		}
		if (!user) {
			interaction.editReply(
				`<@${userId}> nav izveidots profils... (TAGAD TIEK IZVEIDOTS...)\n izdari /ikdieniskais`
			);
			user = new User({ userId });
		}
		let userMasina = await UserMasinas.findOne({ userId: userId });
		if (!userMasina) {
			userMasina = new UserMasinas({ userId });
			await userMasina.save();
			console.log("tev tiek izveidots masinu profils");
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
				text: "PAGRABA IEMĪTNIEKS 2024",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "MAKS 💰",
					value: `${user.balance}`,
					//inline: true,
				},
				{
					name: "DARBS",
					value: `${user.darbs}`,
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
					name: "PIEREDZE",
					value: `${user.experience}`,
					//inline: true,
				},
				{
					name: "MAŠĪNA",
					value: `${userMasina.name}`,
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
