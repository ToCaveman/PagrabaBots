const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
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
		const daudzums = interaction.options.get("daudzums").value;
		if (daudzums < 1) {
			interaction.reply("kaut kas jau ir jāaizsūta ne?");
			return;
		}
		const sutitajsId = interaction.member.id;
		const targetUserId = interaction.options.get("lietotajs").value;
		if (targetUserId === interaction.member.id) {
			interaction.reply("nav iespējams ziedot sev pašam (daunis)");
			return;
		}
		const sutitajs = await User.findOne({
			userId: sutitajsId,
		});
		if (!sutitajs) {
			interaction.reply(`<@${sutitajsId}> nav izveidots profils...`);
			return;
		}
		if (sutitajs.balance < daudzums) {
			interaction.reply("Pats nabags tev nemaz nav tik daudz naudas");
			return;
		}
		const sanemejs = await User.findOne({
			userId: targetUserId,
		});
		if (!sanemejs) {
			interaction.reply(`<@${targetUserId}> nav izveidots profils...`);
			return;
		}
		sanemejs.balance += daudzums;
		sutitajs.balance -= daudzums;
		sutitajs.noziedots += daudzums;
		//sutitajs.experience += getRandomNumber(1, 5);
		await sanemejs.save();
		await sutitajs.save();
		let embed = new EmbedBuilder()
			.setTitle("Tika veikts zideojums...")
			.setDescription(
				`<@${sutitajsId}> nosūtīja **${daudzums}** <@${targetUserId}>`
			)
			.setColor("Navy")
			.setFooter({
				text: "PAGRABA IEMĪTNIEKS 2023",
				iconURL: client.user.displayAvatarURL(),
			});
		await interaction.reply({
			embeds: [embed],
		});
	},

	name: "ziedot",
	description: "legali kadam pievinot naudu no sava maka",
	options: [
		{
			name: "daudzums",
			description: "daudzums ko kādam vēlies ziedot",
			required: true,
			type: ApplicationCommandOptionType.Number,
		},
		{
			name: "lietotajs",
			description: "lietotajs, kam vēlies ziedot",
			required: true,
			type: ApplicationCommandOptionType.User,
		},
	],
};
