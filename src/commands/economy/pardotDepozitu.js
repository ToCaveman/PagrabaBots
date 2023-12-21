const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("šo kommandu var izmantot tikai serveros!");
			return;
		}
		await interaction.deferReply();
		const userId = interaction.user.id;

		let user = await User.findOne({ userId }).select("userId depozitaPudeles");
		if (!user) {
			user = new User({ userId });
		}
		let userbalance = await User.findOne({ userId }).select("userId balance");
		if (!userbalance) {
			user = new User({ userId });
		}
		if (user.depozitaPudeles < 1) {
			await interaction.editReply(
				`Tev nav nevienas depozīta pudeles, ko var pārdot 🍼❌`
			);
			return;
		}

		//depozita pudelu pardosanas logika?
		var depozitaVertiba = 10;
		var ieguvumi = depozitaVertiba * user.depozitaPudeles;
		userbalance.balance += ieguvumi;
		interaction.editReply(
			`Tu pārdevi ${user.depozitaPudeles} depozīta pudeles un ieguvi **${ieguvumi}**\nTavā makā tagad ir: **${userbalance.balance}**`
		);

		user.depozitaPudeles = 0;
		await userbalance.save();
		await user.save();
	},
	name: "pardotdepozitu",
	description: "Pārdod savu depozītu, katra pudele ir vērta 10",
};
