const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const Darbi = require("../../darbi");
const Cooldown = require("../../models/cooldown");
const Statistika = require("../../models/statistika");

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	dailyGeneratedAmount = Math.floor(Math.random() * (max - min) + min);
	return dailyGeneratedAmount;
}

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("so kommandu var izmantot tikai serveros!");
			return;
		}
		const userId = interaction.user.id;
		let user = await User.findOne({
			userId: userId,
		});
		if (!user) {
			interaction.reply(`<@${userId}> nav izveidots profils...`);
			user = new User({ userId });
			await user.save();
			return;
		}
		let statistika = await Statistika.findOne({ userId: userId });
		if (!statistika) {
			statistika = new Statistika({ userId });
			await statistika.save();
			console.log("izveidoju jaunu statistikas profilu");
		}
		const commandName = "stradat";
		let cooldown = await Cooldown.findOne({ userId, commandName });
		if (cooldown && Date.now() < cooldown.endsAt) {
			const { default: prettyMs } = await import("pretty-ms");
			await interaction.reply(
				`Tev vēl jāatdzesējas pirms atkal varēsi strādāt.\nStrādāt varēsi atkal pēc: **${prettyMs(
					cooldown.endsAt - Date.now()
				)}**`
			);
			return;
		}
		if (!cooldown) {
			cooldown = new Cooldown({ userId, commandName });
		}

		let visiDarbi = [];

		for (lieta of Darbi) {
			visiDarbi.push(lieta);
		}
		const lietotajaDarbs = user.darbs;
		const darbsKoStradat = visiDarbi.find((obj) => obj.name === lietotajaDarbs);

		if (lietotajaDarbs === "Bezdarbnieks") {
			interaction.reply("TU ESI BEZDARBNIEKS!!! TEV NAV DARBA KO STRADAT");
			return;
		}

		const ienakumi = darbsKoStradat.income;
		const darbaVards = darbsKoStradat.name;
		const iegutaPie = getRandomInt(1, 10);
		let embed = new EmbedBuilder()
			.setTitle("Tavi darbadienas ieguvumi.")
			.setDescription(`Tavs darbs: ${darbaVards}`)
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2023",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "IEGŪTĀ PEĻŅA",
					value: `${ienakumi}`,
				},
				{
					name: "IEGŪTĀ PIEREDZE",
					value: `${iegutaPie}`,
				},
			]);

		await interaction.reply({
			embeds: [embed],
		});
		cooldown.endsAt = Date.now() + 10_000_000;
		user.experience += iegutaPie;
		user.balance += ienakumi;
		statistika.darbs.reizes += 1;
		statistika.darbs.ienakumi += ienakumi;
		await cooldown.save();
		await user.save();
		await statistika.save();

		//console.log(`DARBS:${darbaVards}\nIENAKUMI:${ienakumi}`);

		// let embed = {
		// 	title: "TAVS JAUNAIS DARBS",
		// 	description: `Apsveicu! tagad tavs darbs ir ${izveletaisDarbs.name}`,
		// 	fields: [
		// 		{
		// 			name: izveletaisDarbs.name,
		// 			value: `Ienakumi: ${izveletaisDarbs.income}`,
		// 		},
		// 	],
		// 	footer: {
		// 		text: "PAGRABA IEMITNIEKS 2023",
		// 		icon_url: client.user.displayAvatarURL(),
		// 	},
		// };
		// await interaction.reply({
		// 	embeds: [embed],
		// });
	},
	name: "stradat",
	//deleted: true,
	description: "strada savu darbu (ja tev tads ir)",
};
