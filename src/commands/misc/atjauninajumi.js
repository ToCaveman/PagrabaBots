const { Client, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
	callback: async (client, interaction) => {
		const embed = new EmbedBuilder()
			.setTitle("**PAGRABA BOTA ATAJUNINĀJUMI!**")
			.setDescription("atajuninajums 30/12/2023")
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2023",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "Statistika!",
					value: "Apskties kādu no savām statistikām\n/statistika",
				},
			]);
		await interaction.reply({
			embeds: [embed],
		});
	},

	name: "jaunumi",
	description: "jaunakie robota atjauniajumi",
};
