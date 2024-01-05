const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
} = require("discord.js");
const User = require("../../models/User");
const Darbi = require("../../darbi");

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
		let visiDarbi = [];

		for (lieta of Darbi) {
			visiDarbi.push(lieta);
		}
		const darbaOpcija = interaction.options.get("darbs").value;
		if (darbaOpcija === "pamest") {
			user.darbs = "Bezdarbnieks";
			await user.save();
			interaction.reply("Tu pameti savu darbu... \nTagad esi bezdarbienks!");
			return;
		}
		if (darbaOpcija === "pamest" && user.darbs === "Bezdarbnieks") {
			interaction.reply("TU JAU ESI BEZDARBNIEKS KO TU VEL CENTIES PAMEST?");
			return;
		}
		const izveletaisDarbs = visiDarbi.find((obj) => obj.name === darbaOpcija);
		if (!izveletaisDarbs) {
			interaction.reply(
				"sads darbs neeksiste\nIESPEJAMAS PROBLEMAS:\nbots debils\nNeierakstiji ar lielo burtu\ntu debils"
			);
			return;
		}
		if (izveletaisDarbs.pieredze > user.experience) {
			interaction.reply(
				`Tev nav pietiekama pieredze lai dabutu so darbu!\nVAJADZIGA PIEREDZE: **${izveletaisDarbs.pieredze}**\nTAVA PIEREDZE: **${user.experience}**`
			);
			return;
		}
		if (izveletaisDarbs.name === user.darbs) {
			interaction.reply("Tev jau ir sis darbs");
			return;
		}
		user.darbs = izveletaisDarbs.name;
		await user.save();
		let embed = {
			title: "TAVS JAUNAIS DARBS",
			description: `Apsveicu! tagad tavs darbs ir ${izveletaisDarbs.name}`,
			fields: [
				{
					name: izveletaisDarbs.name,
					value: `Ienakumi: ${izveletaisDarbs.income}`,
				},
			],
			footer: {
				text: "PAGRABA IEMITNIEKS 2024",
				icon_url: client.user.displayAvatarURL(),
			},
		};
		await interaction.reply({
			embeds: [embed],
		});
	},
	name: "dabutdarbu",
	description: "dabu kadu no iespejamajiem darbiem",
	options: [
		{
			name: "darbs",
			description:
				"darbs, ko velies iegut (ieraksti pamest ja gribi pamest savu darbu)",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
};
