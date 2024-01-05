const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
//const Masinas = require("../../masinas");
const User = require("../../models/User");
const UserMasinas = require("../../models/userMasinas");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("šo kommandu var izmantot tikai serveros");
			return;
		}
		const userId = interaction.user.id;
		let userMasina = await UserMasinas.findOne({ userId: userId });
		if (!userMasina) {
			userMasina = new UserMasinas({ userId });
			await userMasina.save();
			interaction.reply("Tev tiek izveidots mašīnu profils");
			return;
		}

		if (userMasina.name === "Kajas" || userMasina.price === 0) {
			interaction.reply("TEV NEPIEDER NEVIENA MAŠĪNA");
			return;
		}

		let embed = new EmbedBuilder()
			.setTitle(`TAVA MAŠĪNA: ${userMasina.name}`)
			.setColor("Random")
			.setDescription("Tavas mašīnas statistika/informācija")
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2024",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "**Atlikusī izturība:**",
					value: `**${userMasina.currentDurability}/${userMasina.maxDurability}**`,
				},
				{
					name: "**Ātrums:**",
					value: `**${userMasina.speedStat}**`,
				},
				{
					name: "**Cena:**",
					value: `**${userMasina.price}**`,
				},
			]);

		await interaction.reply({
			embeds: [embed],
		});
	},

	name: "manamasina",
	description: "Apskaties informāciju par savu mašīnu",
};
