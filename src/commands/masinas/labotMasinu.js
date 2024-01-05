const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
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

		let statistika = await Statistika.findOne({ userId: userId });
		if (!statistika) {
			statistika = new Statistika({ userId });
			await statistika.save();
			console.log("izveidoju jaunu statistikas profilu");
		}

		let user = await User.findOne({ userId: userId });
		if (!user) {
			user = new User({ userId });
			await user.save();
			interaction.reply("tev tiek izveidots profils");
		}

		if (userMasina.name === "Kajas") {
			interaction.reply("Tev nav mašīnas, ko labot... Savas kājas labosi ja?");
			return;
		}

		if (userMasina.currentDurability === userMasina.maxDurability) {
			interaction.reply("Tava mašīna nav jālabo");
			return;
		}

		const maksimalaIzturiba = userMasina.maxDurability;

		const izmaksa = 550;
		const cikIztrubaTrukst = (userMasina.maxDurability -=
			userMasina.currentDurability);
		const labosanasDaudzums =
			interaction.options.get("daudzums")?.value || cikIztrubaTrukst;
		const cikDaudzizturibaBus =
			userMasina.currentDurability + labosanasDaudzums;
		if (cikDaudzizturibaBus > maksimalaIzturiba) {
			interaction.reply("Tavu mašīnu tik daudz nevar salabot");
			return;
		}
		if (labosanasDaudzums < 1) {
			interaction.reply(
				"Mašīnai vajag salabot vismaz vienu vai vairāk izturības punktu"
			);
			return;
		}
		const cikJamaksa = labosanasDaudzums * izmaksa;
		if (user.balance < cikJamaksa) {
			interaction.reply(
				"Tev nav pietikeami daudz naļika, lai salabotu savu drandaļetu!"
			);
			return;
		}

		userMasina.currentDurability += labosanasDaudzums;
		userMasina.maxDurability = maksimalaIzturiba;
		user.balance -= cikJamaksa;
		statistika.masinas.ieguldijums += cikJamaksa;

		await userMasina.save();
		await user.save();
		await statistika.save();

		let embed = new EmbedBuilder()
			.setTitle("TU SALABOJI SAVU MAŠĪNU!")
			.setDescription(`Salabotā mašīna: ${userMasina.name}`)
			.setColor("Random")
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2023",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "Izmaksas:",
					value: `**${cikJamaksa}**`,
				},
				{
					name: "Salabotā izturība:",
					value: `**+${labosanasDaudzums}**`,
				},
			]);

		await interaction.reply({
			embeds: [embed],
		});
	},

	name: "labotmasinu",
	description:
		"Salabo savu šobrīdējo mašīnu (Viena labojuma punkta izmaksas ir 550)",
	options: [
		{
			name: "daudzums",
			description: "Cik izturības punktus vēlies labot.",
			required: false,
			type: ApplicationCommandOptionType.Number,
		},
	],
};
