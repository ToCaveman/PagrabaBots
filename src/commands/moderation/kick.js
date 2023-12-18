const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	callback: async (client, interaction) => {
		const targetUserId = interaction.options.get("lietotajs").value;
		const reason =
			interaction.options.get("reason")?.value || "iemesls nav dots";
		await interaction.deferReply();

		const targetUser = await interaction.guild.members.fetch(targetUserId);

		if (!targetUser) {
			await interaction.editReply("šāds lietotājs nespastāv");
			return;
		}
		if (targetUser.id === interaction.guild.ownerId) {
			await interaction.editReply("nav iespējams izmest servera īpašnieku");
			return;
		}

		const targetUserRolePosition = targetUser.roles.highest.position;
		const requestUserRolePosition = interaction.member.roles.highest.position;
		const botRolePosition = interaction.guild.members.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition) {
			await interaction.editReply(
				"tu nevari izmest šo lietotāju, jo viņiem ir tās pašas atļaujas vai arī augstākas"
			);
			return;
		}

		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				"nevaru izmest šo leitotāju, jo šim lietotājam ir tās pašas atļaujas vai arī augstākas par mani"
			);
			return;
		}

		try {
			await targetUser.kick(reason);
			await interaction.editReply(
				`Lietotājs ${targetUser} ir izmests\nIemesls: ${reason}`
			);
		} catch (error) {
			console.log(`kļūme izmešanā: ${error}`);
		}
	},

	name: "kick",
	description: "izmet nabagu!",
	//devOnly: Boolean,
	//testOnly: Boolean,

	options: [
		{
			name: "lietotajs",
			description: "cilvēks, ko izmest",
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
		{
			name: "reason",
			description: "iemesls izmešanai",
			required: false,
			type: ApplicationCommandOptionType.String,
		},
	],
	premissionsRequired: [PermissionFlagsBits.Administrator],
	botPermissions: [PermissionFlagsBits.Administrator],
};
