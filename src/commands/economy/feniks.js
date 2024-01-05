const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const Stats = require("../../models/stats");
const Cooldown = require("../../models/cooldown");
const GlobalStats = require("../../models/visparigs");

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
			interaction.reply({
				content: "Šo kommandu var palaist tikai serveros",
				ephemeral: true,
			});
			return;
		}
		const userId = interaction.member.id;
		const commandName = "fenikss";
		let cooldown = await Cooldown.findOne({ userId, commandName });
		if (cooldown && Date.now() < cooldown.endsAt) {
			const { default: prettyMs } = await import("pretty-ms");
			await interaction.reply(
				`Tev vēl jāatdzesējas pirms atkal varēsi griezt aparātus.\nAparātus varēsi izmantot pēc: **${prettyMs(
					cooldown.endsAt - Date.now()
				)}**`
			);
			return;
		}
		if (!cooldown) {
			cooldown = new Cooldown({ userId, commandName });
		}

		var likme = interaction.options.get("likme").value;
		if (likme < 20) {
			interaction.reply("Tu nevari griezt mazāk nekā 20");
			return;
		}

		let user = await User.findOne({
			userId: userId,
		});
		if (!user) {
			interaction.reply(`<@${userId}> nav izveidots profils...`);
			user = new User({ userId });
			await user.save();
			return;
		}

		let globalStats = await GlobalStats.findOne({
			clientId: client.user.id,
		});
		if (!globalStats) {
			globalStats = new GlobalStats({ clientId: client.user.id });
		}

		// naudas kasanas logika
		if (likme > user.balance) {
			interaction.reply(
				`Tu mēģini griezt vairāk naudu nekā tev ir!\n**TAVS MAKS: ${user.balance}**\n**TAVA LIKME: ${likme}**`
			);
			return;
		}
		const uzvareja = Math.random() > 0.65;
		if (!uzvareja) {
			user.balance -= likme;
			user.fenikssZaudejumi += likme;
			user.fenikssReizes += 1;
			globalStats.feniksZaudejumi += likme;
			let fenikszaude = new EmbedBuilder()
				.setTitle("Tu iegrezi aparātus...")
				.setDescription(
					`Tu iegriezi ${likme} un kruķītajos aparātos pakāsi savu naudu! 😜`
				)
				.setColor("Red")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				});
			await interaction.reply({
				embeds: [fenikszaude],
			});
			cooldown.endsAt = Date.now() + 5_000;
			//user.experience += getRandomInt(1, 2);
			await cooldown.save();
			await user.save();
			await globalStats.save();
			return;
		}
		//var uzvaret lidz +150%
		var uzvarasDaudzums = Number((likme * (Math.random() + 0.55)).toFixed(0));
		user.balance += uzvarasDaudzums;
		user.fenikssReizes += 1;
		user.fenikssIeguvumi += uzvarasDaudzums;
		user.experience += getRandomInt(1, 5);
		const kopejaUzvara = (uzvarasDaudzums += likme);

		let feniksuzvara = new EmbedBuilder()
			.setTitle("TU iegriezi aparātus...")
			.setDescription(
				`🎰Tu iegriezi ${likme} un izcēli ${kopejaUzvara}🎰!\nTavā makā tagad ir: **${user.balance}**`
			)
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2023",
				iconURL: client.user.displayAvatarURL(),
			})
			.setColor("DarkGreen");

		await interaction.reply({
			embeds: [feniksuzvara],
		});
		cooldown.endsAt = Date.now() + 5_000;
		globalStats.feniksaUzvaras += uzvarasDaudzums;
		await user.save();
		await cooldown.save();
		await globalStats.save();
	},
	name: "fenikss",
	description: "zaudē savus dzīves iekrājumus kruķītajos aparātos :))))",
	options: [
		{
			name: "likme",
			description: "likme ko griezīsi...",
			type: ApplicationCommandOptionType.Number,
			required: true,
		},
	],
};
