const { Client, Interaction, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const Cooldown = require("../../models/cooldown");
const Statistika = require("../../models/statistika");

function getRandomNumber(x, y) {
	const range = y - x + 1;
	const randomNumber = Math.floor(Math.random() * range);
	return randomNumber + x;
}
var atbildites = [
	"Kungs briesmonis tev noziedoja",
	"Tu Pepsi pudelē atradi",
	"Tu izlēmi paskatītes nezināmā nodalījumā tavā makā un atradi",
	"Es nezinu kā tas ir iespējams, bet tu tualetes papīra rullī atradi",
	"Bača iznāca no Fēniksa un bija laimējis lielu piķi tapēc tavai smirdigajai dirsai noziedoja",
	"Tavs nakts paralīzes dēmons atrada naudu kraukšķīgā zeķē:",
	"No debesīm nokrita (kas par...)",
	"Tu maizes kukulī atradi",
	"Tev nezināms svešinieks iedeva pagaršot nezināmu dziru... tomēr, tad kad tu pamodies tavam makam tika pievienoti",
	"Tu pakratīji savu krūzīti un tev tajā tikai iemesti",
];
module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply({
				content: "Šo kommandu var palaist tikai serveros",
				ephemeral: true,
			});
			return;
		}
		try {
			await interaction.deferReply();
			const commandName = "lugties";
			const userId = interaction.user.id;
			let cooldown = await Cooldown.findOne({ userId, commandName });

			if (cooldown && Date.now() < cooldown.endsAt) {
				const { default: prettyMs } = await import("pretty-ms");
				await interaction.editReply(
					`Tev vēl jāatdzesējas pirms atkal varēsi lūgties.\nLūdzies atkal pēc: **${prettyMs(
						cooldown.endsAt - Date.now()
					)}**`
				);
				return;
			}
			if (!cooldown) {
				cooldown = new Cooldown({ userId, commandName });
			}
			let user = await User.findOne({ userId });
			if (!user) {
				user = new User({ userId });
			}
			let statistika = await Statistika.findOne({ userId: userId });
			if (!statistika) {
				statistika = new Statistika({ userId });
				await statistika.save();
				console.log("izveidoju jaunu statistikas profilu");
			}
			const chance = getRandomNumber(0, 100);
			statistika.ubagosana.reizes += 1;
			// bača tevi apzog loģika
			if (chance < 30) {
				const stolenAmount = getRandomNumber(5, 50);
				if (stolenAmount > user.balance) {
					user.balance -= user.balance;
					user.experience += getRandomNumber(1, 5);
					statistika.ubagosana.bacapzaga += 1;
					await user.save();
					let apzaga = new EmbedBuilder()
						.setTitle("Tu ubagoji uz ielas...")
						.setDescription(
							`Bača 🤬 no tevis gribēja nozagt ${stolenAmount} 🤑, bet tu biji pārāk nabadzīgs tāpēc viņš tev nozaga visu to kas tev bija 😝`
						)
						.setColor("Red")
						.setFooter({
							text: "PAGRABA IEMĪTNIEKS 2023",
							iconURL: client.user.displayAvatarURL(),
						});
					await interaction.editReply({
						embeds: [apzaga],
					});
					cooldown.endsAt = Date.now() + 200_000;
					await cooldown.save();
					await statistika.save();
					return;
				}

				user.balance -= stolenAmount;

				statistika.ubagosana.bacapzaga += 1;
				statistika.ubagosana.bacanozaga += stolenAmount;
				user.depozitaPudeles = 0;
				user.experience += getRandomNumber(1, 2);
				let apzaga2 = new EmbedBuilder()
					.setTitle("Tu ubagoji uz ielas...")
					.setDescription(
						`Tu ubagoji un bača nozaga tavu naudu **-${stolenAmount}** 😥\nViņš arī paņēma visas tavas depozīta pudeles.`
					)
					.setColor("Green")
					.setFooter({
						text: "PAGRABA IEMĪTNIEKS 2023",
						iconURL: client.user.displayAvatarURL(),
					});
				await interaction.editReply({
					embeds: [apzaga2],
				});
				cooldown.endsAt = Date.now() + 200_000;
				await cooldown.save();
				await user.save();
				await statistika.save();
				return;
			}
			let amount = getRandomNumber(10, 90);
			statistika.ubagosana.ieguvumi += amount;
			user.balance += amount;
			user.experience += getRandomNumber(1, 3);
			cooldown.endsAt = Date.now() + 200_000;
			await Promise.all([cooldown.save(), user.save(), statistika.save()]);
			var randAtbildite = atbildites[(Math.random() * atbildites.length) | 0];
			let ubagotajs = new EmbedBuilder()
				.setTitle("Tu ubagoji uz ielas...")
				.setDescription(
					`${randAtbildite} **${amount}**\nTagad tavā makā ir: **${user.balance}**`
				)
				.setColor("Red")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				});
			await interaction.editReply({
				embeds: [ubagotajs],
			});
		} catch (error) {
			console.log(`Kļūme lūgties kommandā: ${error}`);
		}
	},
	name: "lugties",
	description: "ubago uz ielas (var būt bīstami)",
};
