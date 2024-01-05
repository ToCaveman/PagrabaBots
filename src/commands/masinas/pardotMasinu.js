const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
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

		let user = await User.findOne({ userId: userId });
		if (!user) {
			user = new User({ userId });
			await user.save();
			interaction.reply("tev tiek izveidots profils");
		}

		if (userMasina.price === 0) {
			interaction.reply("Tev nav mašīnas, ko pārdot");
			return;
		}

		const vecaisVards = userMasina.name;

		let masinasVertiba = userMasina.price;
		let masinasIzturiba = userMasina.currentDurability;
		let maxIzturiba = userMasina.maxDurability;
		let izturbasCena = 1000;
		let cikIzturibaTrukst = (maxIzturiba -= masinasIzturiba);

		if (masinasIzturiba < 1) {
			interaction.reply("Tava mašīna ir lūznis to neviens negribēs pirkt");
			return;
		}

		let masinasPardosanasCena = (masinasVertiba -=
			cikIzturibaTrukst * izturbasCena);
		if (masinasPardosanasCena < 0) {
			masinasPardosanasCena = 100;
		}
		let embed = new EmbedBuilder()
			.setTitle(`TU PĀREDVI SAVU MAŠĪNU!`)
			.setDescription(`Pārdotā mašīna: ${vecaisVards}`)
			.setColor("Random")
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2023",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "Pārdevi par:",
					value: `**${masinasPardosanasCena}**`,
				},
			]);

		userMasina.name = "Kajas";
		userMasina.maxDurability = 0;
		userMasina.currentDurability = 0;
		userMasina.price = 0;
		userMasina.speedStat = 0;

		user.balance += masinasPardosanasCena;

		await userMasina.save();
		await user.save();

		await interaction.reply({
			embeds: [embed],
		});
	},

	name: "pardotmasinu",
	description:
		"Pārdod savu šobrīdējo mašinu (nauda, ko iegūsi ir atkarīga no mašīnas stāvokļa/izturības)",
};
