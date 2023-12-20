const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
} = require("discord.js");
const User = require("../../models/User");
const cooldowns = new Set();

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

		const likme = interaction.options.get("likme").value;
		if (likme < 10) {
			interaction.reply("Tu nevari griezt mazāk nekā 10");
			return;
		}

		const user = await User.findOne({
			userId: targetUserId,
		});
		if (!user) {
			interaction.reply(`<@${targetUserId}> nav izveidots profils...`);
			return;
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
			interaction.reply(`Tu iegriezi ${likme} un pakāsi savu naudu! 😜`);
			return;
		}
		//var uzvaret lidz +150%
		const uzvarasDaudzums = Number((likme * (Math.random() + 0.55)).toFixed(0));
		user.balance += uzvarasDaudzums;
		await user.save();
		interaction.reply(
			`Tu iegriezi ${likme} un izcēli ${uzvarasDaudzums}!\nTavā makā tagad ir: **${user.balance}**`
		);
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
