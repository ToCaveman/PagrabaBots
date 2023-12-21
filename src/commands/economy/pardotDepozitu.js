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

		let user = await User.findOne({ userId });
		if (!user) {
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
		user.balance += ieguvumi;
		user.depozitsIeguvumi += ieguvumi;
		interaction.editReply(
			`Tu pārdevi ${user.depozitaPudeles} depozīta pudeles un ieguvi **${ieguvumi}**\nTavā makā tagad ir: **${user.balance}**`
		);

		user.depozitaPudeles = 0;
		await user.save();
	},
	name: "pardotdepozitu",
	description: "Pārdod savu depozītu, katra pudele ir vērta 10",
};
