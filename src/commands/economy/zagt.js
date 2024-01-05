const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const Cooldown = require("../../models/cooldown");
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
		const targetUserId = interaction.options.get("lietotajs").value;

		const commandName = "zagt";
		let cooldown = await Cooldown.findOne({ userId, commandName });
		if (cooldown && Date.now() < cooldown.endsAt) {
			const { default: prettyMs } = await import("pretty-ms");
			await interaction.reply(
				`Tev vēl jāatdzesējas pirms atkal varēsi zagt.\n/zagt varēsi izmantot pēc: **${prettyMs(
					cooldown.endsAt - Date.now()
				)}**`
			);
			return;
		}
		if (!cooldown) {
			cooldown = new Cooldown({ userId, commandName });
		}

		let user = await User.findOne({ userId: userId });
		if (!user) {
			user = new User({
				userId,
			});
			await user.save();
		}

		let statistika = await Statistika.findOne({ userId: userId });
		if (!statistika) {
			statistika = new Statistika({ userId });
			await statistika.save();
			console.log("izveidoju jaunu statistikas profilu");
		}

		let targetUser = await User.findOne({ userId: targetUserId });
		if (!targetUser) {
			interaction.reply("šim lietotājam nav profila tapēc viņu nevar apzagt");
		}

		let targetstatistika = await Statistika.findOne({ userId: targetUserId });
		if (!targetstatistika) {
			targetstatistika = new Statistika({ userId });
			await targetstatistika.save();
			console.log("izveidoju jaunu statistikas profilu");
		}
		if (user.experience < 20) {
			interaction.reply(
				"tev nav pietiekami liela pieredze lai zagtu vajadzīga:20"
			);
			return;
		}
		if (user.balance < 200) {
			interaction.reply("Tu esi tik nabadzīgs, ka tev nav iespējas zagt");
			return;
		}
		if (user.balance > 50000) {
			interaction.reply(
				"Tev ir pārāk daudz naudas lai veiktu zādzības jobanais daunis"
			);
			return;
		}
		if (targetUser.balance < 500) {
			interaction.reply(
				"šim lietotājam nav pietiekami daudz naudas lai no viņa zagtu"
			);
			return;
		}
		statistika.zagt.reizes += 1;

		const zadzibaIzdevas = Math.random() > 0.65;
		if (!zadzibaIzdevas) {
			let atreibibasDaudzums = getRandomNumber(50, 200);
			let atnemtaPieredze = getRandomNumber(1, 5);
			statistika.zagt.neizdevies += 1;
			statistika.zagt.zaudets += atreibibasDaudzums;
			user.balance -= atreibibasDaudzums;
			user.experience -= atnemtaPieredze;
			targetUser.balance += atreibibasDaudzums;
			await user.save();
			await targetUser.save();
			await statistika.save();
			cooldown.endsAt = Date.now() + 200_000;
			await cooldown.save();
			let embed1 = new EmbedBuilder()
				.setTitle(`**TU MĒĢINĀJI APZAGT <@${targetUserId}>**`)
				.setDescription("zādzība neizdevās")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2024",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Tu mēģināji apzagt, bet tevi pieķēra... Atskaldīja un no tevis paša nozaga...",
						value: `**-${atreibibasDaudzums}**`,
					},
					{
						name: "Atņemtā pieredze:",
						value: `**-${atnemtaPieredze}**`,
					},
				]);
			await interaction.reply({
				embeds: [embed1],
			});
			return;
		}
		const atnemtPieredziIespeja = Math.random() > 0.8;
		let nozagtaisDaudzums = getRandomNumber(50, 200);
		user.balance += nozagtaisDaudzums;
		targetUser.balance -= nozagtaisDaudzums;
		statistika.zagt.nozagts += nozagtaisDaudzums;
		statistika.zagt.izdevies += 1;
		targetstatistika.zagt.notevisnozagts += nozagtaisDaudzums;
		if (atnemtPieredziIespeja) {
			user.experience -= 2;
		}
		await user.save();
		await targetUser.save();
		await statistika.save();
		await targetstatistika.save();
		cooldown.endsAt = Date.now() + 200_000;
		await cooldown.save();
		let embed2 = new EmbedBuilder()
			.setTitle(`**TU MĒĢINĀJI APZAGT <@${targetUserId}>**`)
			.setDescription("zādzība izdevās")
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2024",
				iconURL: client.user.displayAvatarURL(),
			})
			.addFields([
				{
					name: "Tavi ieguvumi",
					value: `**+${nozagtaisDaudzums}**`,
				},
			]);
		await interaction.reply({
			embeds: [embed2],
		});
	},
	name: "zagt",
	description: "zodz no kāda lietotāja (var deizgan traki atspēlēties)",
	options: [
		{
			name: "lietotajs",
			description: "lietotājs no kura vēlies pizģīt",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],
};
