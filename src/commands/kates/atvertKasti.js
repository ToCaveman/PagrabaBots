const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const KastesMantas = require("../../kastuMantas");
const Statistika = require("../../models/statistika");
const kastuMantas = require("../../kastuMantas");

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
		let user = await User.findOne({ userId: userId });
		if (!user) {
			user = new User({ userId });
			await user.save();
			console.log("izveidoju jaunu cliveka profilu?");
		}

		let statistika = await Statistika.findOne({ userId: userId });
		if (!statistika) {
			statistika = new Statistika({ userId });
			await statistika.save();
			console.log("izveidoju jaunu statistikas profilu");
		}

		let kastesCena = 250;
		if (kastesCena > user.balance) {
			interaction.reply(
				`Tu esi pārāk nabadzīgs lai atvērtu kasti! Vajag: **${kastesCena}**`
			);
			return;
		}

		//const izveletaKaste = interaction.options.get("kura").value;
		const keys = Object.keys(KastesMantas.kaste1);
		const randomKey = keys[Math.floor(Math.random() * keys.length)];
		const randomObj = KastesMantas.kaste1[randomKey];
		console.log("random key: ", randomKey);
		console.log("the obj: ", randomObj);

		var ieguta_nauda = randomObj.price - kastesCena;
		user.balance += ieguta_nauda;
		statistika.kastes.reizes += 1;
		statistika.kastes.zaudejumi += kastesCena;
		statistika.kastes.ieguvumi += randomObj.price;
		await statistika.save();
		await user.save();
		let embed = new EmbedBuilder()
			.setTitle("TU ATVĒRI KASTI!")
			.setDescription(`Kastes izmaksas: ${kastesCena}`)
			.setColor("Purple")
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2024",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "No kastes izkrita:",
					value: `**${randomObj.ids[0]}**\n${randomObj.apraksts}`,
					inline: true,
				},
				{
					name: "Cena:",
					value: `**${randomObj.price}**`,
					inline: true,
				},
				{
					name: "Ienākumi:",
					value: `**${ieguta_nauda}**`,
					inline: true,
				},
			]);
		await interaction.reply({
			embeds: [embed],
		});
	},
	name: "kaste",
	//deleted: true,
	description: "Atver kasti 250",
	// options: [
	// 	{
	// 		name: "kura",
	// 		description: "Kaste, ko vēlies atvērt",
	// 		required: true,
	// 		type: ApplicationCommandOptionType.String,
	// 	},
	// ],
};
