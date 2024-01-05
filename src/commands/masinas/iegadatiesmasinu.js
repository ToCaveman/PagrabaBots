const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const Masinas = require("../../masinas");
const User = require("../../models/User");
const UserMasinas = require("../../models/userMasinas");
//const UserTests = require("../../models/tests");

// saja koda ir loti daudz ka lieka bet nedzesisu ara jo varbut noderes

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	async autocomplete(client, interaction) {
		const focusedValue = interaction.options.getFocused();
		const choices = [];
		for (a of Masinas) {
			choices.push(a.name);
		}
		const filtered = choices.filter((choice) =>
			choice.startsWith(focusedValue)
		);
		await interaction.respond(
			filtered.map((choice) => ({ name: choice, value: choice }))
		);
	},

	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("šo kommandu var izmantot tikai serveros");
			return;
		}
		const userId = interaction.user.id;

		// let userMasinas = UserMasinas.findOne({ lietotajaId: userId });
		// if (!userMasinas) {
		// 	console.log("nav masinu profila");
		// 	userMasinas = new UserMasinas({ userId });
		// 	await userMasinas.save();
		// 	interaction.reply("abcdefgh");
		// }

		let userMasina = await UserMasinas.findOne({ userId: userId });
		if (!userMasina) {
			userMasina = new UserMasinas({ userId });
			await userMasina.save();
			console.log("tev tiek izveidots masinu profils");
		}

		let user = await User.findOne({ userId: userId });
		if (!user) {
			user = new User({ userId });
			await user.save();
			interaction.reply("tev tiek izveidots profils");
		}

		let visasMasinas = [];

		for (objekts of Masinas) {
			visasMasinas.push(objekts);
		}

		const izveltaMasina = interaction.options.get("masina").value;
		const masina = visasMasinas.find((obj) => obj.name === izveltaMasina);
		if (!masina) {
			interaction.reply(
				"Šāda mašīna nepastāv!\nVai uzrakstīji ar lielo burtu?\nVai māki rakstīt?\nVarbūt robots stulbs.."
			);
			return;
		}
		// var nameValue = userMasina.masina[0].name;
		// var priceValue = userMasina.masina[0].price;
		// var durValue = userMasina.masina[0].durability;
		// var speedValue = userMasina.masina[0].speedStat;

		var nameValue = userMasina.name;
		if (nameValue === masina.name) {
			interaction.reply("Tev jau pieder šī mašīna");
			return;
		}
		if (user.balance < masina.price) {
			interaction.reply(
				`Tev navpeitiekami daudz naļika lai iegādātos šo braucamo\nTev ir: ${user.balance}\nBet vajag: ${masina.price}`
			);
			return;
		}

		if (userMasina.name !== "Kajas") {
			interaction.reply(
				"Tev vispirms ir jāpārdod tava šobrīdēja mašīna pirms tu vari iegādāties jaunu!"
			);
			return;
		}
		// async function updateDocument() {
		// 	const filter = { userId: userId };
		// 	const update = { $set: { name: "kaka" } };

		// 	UserMasinas.updateOne(filter, update)
		// 		.then((result) => {
		// 			console.log("Document updated successfully:", result);
		// 		})
		// 		.catch((err) => {
		// 			console.error(err);
		// 		});

		// 	//await userMasina.save();
		// }
		// updateDocument();
		// userMasina.masina[0].name === masina.name;
		// userMasina.masina[0].price === masina.price;
		// userMasina.masina[0].durability === masina.durability;
		// userMasina.masina[0].speedStat === masina.speedStat;

		userMasina.name = masina.name;
		userMasina.price = masina.price;
		userMasina.maxDurability = masina.durability;
		userMasina.currentDurability = masina.durability;
		userMasina.speedStat = masina.speedStat;

		user.balance -= masina.price;
		await userMasina.save();
		await user.save();

		let embed = new EmbedBuilder()
			.setColor("Random")
			.setTitle("TU IEGĀDĀJIES JAUNU MAŠĪNU!")
			.setDescription("Pirkums izdevās...")
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2023",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "**Tavs jaunais braucamais:**",
					value: `Nosaukums: **${masina.name}**\nĀtrums: **${masina.speedStat}**\nIztruība: **${masina.durability}**\nCena: **${masina.price}**`,
				},
			]);

		await interaction.reply({
			embeds: [embed],
		});
	},

	name: "pirktmasinu",
	//deleted: true,
	description: "Iegādājies kādu no pieejamājām mašīnām",
	options: [
		{
			name: "masina",
			description: "mašīna, ko vēlies iegādāties",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
		},
	],
};
