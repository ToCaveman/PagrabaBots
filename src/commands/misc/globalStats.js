const { Client, Interaction, EmbedBuilder } = require("discord.js");
const GlobalStats = require("../../models/visparigs");
module.exports = {
	callback: async (client, interaction) => {
		let globalStats = await GlobalStats.findOne({
			clientId: client.user.id,
		});
		const embed = new EmbedBuilder()
			.setTitle("**PAGRABA BOTA GLOBĀLĀ STATISTIKA**")
			.setDescription("visu lietotāju ieguvumi un zaudējumi")
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2023",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "FĒNIKSĀ PAKĀSTS:",
					value: `**${globalStats.feniksZaudejumi}**`,
				},
				{
					name: "FĒNIKSĀ UZVARĒTS:",
					value: `**${globalStats.feniksaUzvaras}**`,
				},
			]);
		await interaction.reply({
			embeds: [embed],
		});
	},

	name: "globalastatistika",
	description: "apsakties globālo statistiku",
};
