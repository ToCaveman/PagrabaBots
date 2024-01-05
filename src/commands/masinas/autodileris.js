const { Client, Interaction } = require("discord.js");
const Masinas = require("../../masinas");
const UserMasinas = require("../../models/userMasinas");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 * @returns
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("so kommandu var izmantot tikai serveros");
			return;
		}
		const userId = interaction.user.id;

		let userMasina = await UserMasinas.findOne({ userId: userId });
		if (!userMasina) {
			userMasina = new UserMasinas({ userId });
			await userMasina.save();
			interaction.reply("tev tiek izveidots masinu profils");
		}
		let visasMasinas = [];
		let embed = {
			title: "PIEEJAMAS MASINAS",
			description: "SOBRID PIEEJAMAS MASINAS",
			fields: [],
			footer: {
				text: "PAGRABA IEMITNIEKS 2024",
				icon_url: client.user.displayAvatarURL(),
			},
		};
		for (masina of Masinas) {
			visasMasinas.push(masina);
		}
		if (visasMasinas.length === 0) {
			interaction.reply("Sobrid nav pieejama neviena masina");
			return;
		}
		for (masinite of visasMasinas) {
			let nosaukums = masinite.name;
			let izturiba = masinite.durability;
			let cena = masinite.price;
			let atrums = masinite.speedStat;
			embed.fields.push({
				name: `**${nosaukums}**`,
				value: `Mašīnas cena: **${cena}**\nMašīnas ātrums: **${atrums}**\nMašīnas izturība: **${izturiba}**`,
				inline: true,
			});
		}

		await interaction.reply({
			embeds: [embed],
		});
	},
	name: "autoveikals",
	description: "apskaties šobrīdejo mašīnu piedāvājumu",
};
