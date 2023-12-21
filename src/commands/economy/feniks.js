const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
} = require("discord.js");
const User = require("../../models/User");
const Stats = require("../../models/stats");
const Cooldown = require("../../models/cooldown");

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
		if (likme < 10) {
			interaction.reply("Tu nevari griezt mazāk nekā 10");
			return;
		}

		const user = await User.findOne({
			userId: userId,
		});
		if (!user) {
			interaction.reply(`<@${userId}> nav izveidots profils...`);
			return;
		}

		let userFeniksaUzvara = await Stats.findOne({ userId }).select(
			"userId fenikssIeguvumi"
		);
		if (!userFeniksaUzvara) {
			userFeniksaUzvara = new Stats({ userId });
		}

		let userFeniksaZaude = await Stats.findOne({ userId }).select(
			"userId fenikssZaudejumi"
		);
		if (!userFeniksaZaude) {
			userFeniksaZaude = new Stats({ userId });
		}

		// naudas kasanas logika
		if (likme > user.balance) {
			interaction.reply(
				`Tu mēģini griezt vairāk naudu nekā tev ir!\n**TAVS MAKS: ${user.balance}**\n**TAVA LIKME: ${likme}**`
			);
			return;
		}
		const uzvareja = Math.random() > 0.7;
		if (!uzvareja) {
			user.balance -= likme;
			await user.save();
			userFeniksaZaude.fenikssZaudejumi += likme;
			interaction.reply(
				`Tu iegriezi ${likme} un kruķītajos aparātos pakāsi savu naudu! 😜`
			);
			cooldown.endsAt = Date.now() + 25_000;
			await cooldown.save();
			await userFeniksaZaude.save();
			return;
		}
		//var uzvaret lidz +150%
		var uzvarasDaudzums = Number((likme * (Math.random() + 0.55)).toFixed(0));
		user.balance += uzvarasDaudzums;
		userFeniksaUzvara.fenikssIeguvumi += uzvarasDaudzums;
		const kopejaUzvara = (uzvarasDaudzums += likme);
		await user.save();
		interaction.reply(
			`🎰Tu iegriezi ${likme} un izcēli ${kopejaUzvara}🎰!\nTavā makā tagad ir: **${user.balance}**`
		);
		cooldown.endsAt = Date.now() + 25_000;
		await userFeniksaUzvara.save();
		await cooldown.save();
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
