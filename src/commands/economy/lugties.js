const { Client, Interaction } = require("discord.js");
const User = require("../../models/User");
const Cooldown = require("../../models/cooldown");

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
			let user = await User.findOne({ userId }).select("userId balance");
			if (!user) {
				user = new User({ userId });
			}
			let userDepozits = await User.findOne({ userId }).select(
				"userId depozitaPudeles"
			);
			if (!userDepozits) {
				user = new User({ userId });
			}
			const chance = getRandomNumber(0, 100);
			// bača tevi apzog loģika
			if (chance < 30) {
				const stolenAmount = getRandomNumber(5, 50);
				if (stolenAmount > user.balance) {
					user.balance -= user.balance;
					await user.save();
					await interaction.editReply(
						`Bača 🤬 no tevis gribēja nozagt ${stolenAmount} 🤑, bet tu biji pārāk nabadzīgs tāpēc viņš tev nozaga visu to kas tev bija 😝`
					);
					cooldown.endsAt = Date.now() + 200_000;
					await cooldown.save();
					return;
				}

				user.balance -= stolenAmount;
				userDepozits.depozitaPudeles = 0;
				await user.save();
				await interaction.editReply(
					`Tu ubagoji un bača nozaga tavu naudu **-${stolenAmount}** 😥\nViņš arī paņēma visas tavas depozīta pudeles.`
				);
				cooldown.endsAt = Date.now() + 200_000;
				await cooldown.save();
				await userDepozits.save();
				return;
			}
			const amount = getRandomNumber(10, 90);

			user.balance += amount;
			cooldown.endsAt = Date.now() + 200_000;
			await Promise.all([cooldown.save(), user.save()]);
			var randAtbildite = atbildites[(Math.random() * atbildites.length) | 0];
			await interaction.editReply(
				`${randAtbildite} **${amount}**\nTagad tavā makā ir: **${user.balance}**`
			);
		} catch (error) {
			console.log(`Kļūme lūgties kommandā: ${error}`);
		}
	},
	name: "lugties",
	description: "ubago uz ielas (var būt bīstami)",
};
