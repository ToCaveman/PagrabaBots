const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const Cooldown = require("../../models/cooldown");
const User = require("../../models/User");
const UserMasinas = require("../../models/userMasinas");
const Statistika = require("../../models/statistika");

function getRandomNumber(x, y) {
	const range = y - x + 1;
	const randomNumber = Math.floor(Math.random() * range);
	return randomNumber + x;
}

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
		let statistika = await Statistika.findOne({ userId: userId });
		if (!statistika) {
			statistika = new Statistika({ userId });
			await statistika.save();
			console.log("izveidoju jaunu statistikas profilu");
		}

		const commandName = "sacikstes";
		let cooldown = await Cooldown.findOne({ userId, commandName });
		if (cooldown && Date.now() < cooldown.endsAt) {
			const { default: prettyMs } = await import("pretty-ms");
			await interaction.reply(
				`Tev vēl jāatdzesējas pirms atkal varēsi piedalīties sacīkstēs.\nSacīkstēs varēsi peidalīties pēc: **${prettyMs(
					cooldown.endsAt - Date.now()
				)}**`
			);
			return;
		}
		if (!cooldown) {
			cooldown = new Cooldown({ userId, commandName });
		}

		if (userMasina.currentDurability < 1 && userMasina.name !== "Kajas") {
			interaction.reply(
				"Tava mašīna ir salūzusi izmanto /labotmasinu un tad piedalies sacīkstēs"
			);
			return;
		}
		if (userMasina.name === "Kajas") {
			interaction.reply("Tev nav mašīnas... ar kājām skreisi?");
			return;
		}

		// uzvaras aprekinasana
		//misters gpt
		function calculateWinProbability(carSpeed) {
			// Normalize speed to a value between 0 and 1
			const normalizedSpeed = carSpeed / 10; // Adjust 10 to the maximum speed

			// Random 50/50 chance
			const randomChance = Math.random();

			// Multiply the random chance by the normalized speed and scale to 0-100
			let winProbability = randomChance * normalizedSpeed * 100;

			// Limit the result to be between 0 and 100
			winProbability = Math.min(winProbability, 100);

			return winProbability;
		}

		// Example usage:
		const masinasAtrums = userMasina.speedStat;
		const probability = calculateWinProbability(masinasAtrums);
		console.log(`Win Probability: ${probability}`);
		//vietu ienakumi
		const vieta_1 = getRandomNumber(4000, 5000);
		const vieta_2 = getRandomNumber(1750, 2250);
		const vieta_3 = getRandomNumber(1250, 1750);
		const vieta_4 = getRandomNumber(550, 1150);

		// vietu iegusasnas iespejas
		// 1 vieta > 70
		// 2 vieta > 50
		// 3 vieta > 30
		// 4 pateiciba par piedalisnasos > 23

		//masinas plisanas logika
		let atnemtaIzturiba;
		let vissSapisas = Math.random() > 0.91;
		if (vissSapisas) {
			atnemtaIzturiba = userMasina.currentDurability;
		} else {
			if (userMasina.currentDurability >= 3) {
				atnemtaIzturiba = getRandomNumber(1, 3);
			} else {
				atnemtaIzturiba = 1;
			}
		}
		// pirma vieta
		if (probability >= 70) {
			user.balance += vieta_1;
			userMasina.currentDurability -= atnemtaIzturiba;
			statistika.masinas.zaudetaizturiba += atnemtaIzturiba;
			cooldown.endsAt = Date.now() + 600_000;
			statistika.sacikstes.ieguvumi += vieta_1;
			statistika.sacikstes.reizes += 1;
			statistika.sacikstes.vieta1 += 1;
			await statistika.save();
			await cooldown.save();
			await user.save();
			await userMasina.save();
			let embed1 = new EmbedBuilder()
				.setTitle("SACĪKŠU REZULTĀTI!")
				.setDescription("Tavi rezultāti...")
				.setColor("Gold")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Tava vieta:",
						value: "1.Vieta",
						inline: true,
					},
					{
						name: "Ienākumi:",
						value: `**+${vieta_1}**`,
						inline: true,
					},
					{
						name: "Mašīnas statuss:",
						value: `Izturība: **${userMasina.currentDurability}/${userMasina.maxDurability}**`,
						inline: true,
					},
				]);
			await interaction.reply({
				embeds: [embed1],
			});
			return;
		}

		// otra vieta
		if (probability >= 50) {
			user.balance += vieta_2;
			userMasina.currentDurability -= atnemtaIzturiba;
			statistika.masinas.zaudetaizturiba += atnemtaIzturiba;
			cooldown.endsAt = Date.now() + 600_000;
			statistika.sacikstes.ieguvumi += vieta_2;
			statistika.sacikstes.reizes += 1;
			statistika.sacikstes.vieta2 += 1;
			await statistika.save();
			await cooldown.save();
			await user.save();
			await userMasina.save();
			let embed1 = new EmbedBuilder()
				.setTitle("SACĪKŠU REZULTĀTI!")
				.setDescription("Tavi rezultāti...")
				.setColor("Green")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Teva vieta:",
						value: "2.Vieta",
					},
					{
						name: "Ienākumi:",
						value: `**+${vieta_2}**`,
					},
					{
						name: "Mašīnas statuss:",
						value: `Izturība: **${userMasina.currentDurability}/${userMasina.maxDurability}**`,
					},
				]);
			await interaction.reply({
				embeds: [embed1],
			});
			return;
		}

		// tresa vieta
		if (probability >= 30) {
			user.balance += vieta_3;
			userMasina.currentDurability -= atnemtaIzturiba;
			statistika.masinas.zaudetaizturiba += atnemtaIzturiba;
			cooldown.endsAt = Date.now() + 600_000;
			statistika.sacikstes.ieguvumi += vieta_3;
			statistika.sacikstes.reizes += 1;
			statistika.sacikstes.vieta3 += 1;
			await statistika.save();
			await cooldown.save();
			await user.save();
			await userMasina.save();
			let embed1 = new EmbedBuilder()
				.setTitle("SACĪKŠU REZULTĀTI!")
				.setDescription("Tavi rezultāti...")
				.setColor("Blue")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Teva vieta:",
						value: "3.Vieta",
					},
					{
						name: "Ienākumi:",
						value: `**+${vieta_3}**`,
					},
					{
						name: "Mašīnas statuss:",
						value: `Izturība: **${userMasina.currentDurability}/${userMasina.maxDurability}**`,
					},
				]);
			await interaction.reply({
				embeds: [embed1],
			});
			return;
		}

		// atziniba vieta
		if (probability > 19.5) {
			user.balance += vieta_4;
			userMasina.currentDurability -= atnemtaIzturiba;
			statistika.masinas.zaudetaizturiba += atnemtaIzturiba;
			cooldown.endsAt = Date.now() + 600_000;
			statistika.sacikstes.ieguvumi += vieta_4;
			statistika.sacikstes.reizes += 1;
			statistika.sacikstes.vieta4 += 1;
			await statistika.save();
			await cooldown.save();
			await user.save();
			await userMasina.save();
			let embed1 = new EmbedBuilder()
				.setTitle("SACĪKŠU REZULTĀTI!")
				.setDescription("Tavi rezultāti...")
				.setColor("Blue")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Teva vieta:",
						value: "4.Vieta",
					},
					{
						name: "Ienākumi:",
						value: `**+${vieta_4}**`,
					},
					{
						name: "Mašīnas statuss:",
						value: `Izturība: **${userMasina.currentDurability}/${userMasina.maxDurability}**`,
					},
				]);
			await interaction.reply({
				embeds: [embed1],
			});
			return;
		}

		userMasina.currentDurability -= atnemtaIzturiba;
		cooldown.endsAt = Date.now() + 600_000;
		statistika.masinas.zaudetaizturiba += atnemtaIzturiba;
		//statistika.sacikstes.ieguvumi += vieta_1;
		statistika.sacikstes.reizes += 1;
		statistika.sacikstes.zaudes += 1;
		await statistika.save();
		await cooldown.save();
		await userMasina.save();
		let embed1 = new EmbedBuilder()
			.setTitle("SACĪKŠU REZULTĀTI!")
			.setDescription("Tavi rezultāti...")
			.setColor("Red")
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2023",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "Teva vieta:",
					value: `${getRandomNumber(5, 20)}.Vieta`,
				},
				{
					name: "Ienākumi:",
					value: `**+0** (nabags)`,
				},
				{
					name: "Mašīnas statuss:",
					value: `Izturība: **${userMasina.currentDurability}/${userMasina.maxDurability}**`,
				},
			]);
		await interaction.reply({
			embeds: [embed1],
		});

		// function generateProbabilities() {
		// 	const probabilities = [];

		// 	for (let i = 1; i <= 20; i++) {
		// 		const carSpeed = i;

		// 		for (let j = 0; j < 5; j++) {
		// 			const probability = calculateWinProbability(carSpeed);
		// 			probabilities.push({ carSpeed, probability });
		// 		}
		// 	}

		// 	return probabilities;
		// }

		// // Example usage:
		// const generatedProbabilities = generateProbabilities();
		// console.log(generatedProbabilities);
	},

	name: "sacikstes",
	//deleted: true,
	description: "piedalies sacīkstēs",
};
