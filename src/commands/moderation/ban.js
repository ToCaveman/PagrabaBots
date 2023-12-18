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
			await interaction.editReply(
				"nav iespējams bannot servera īpašnieku loh dauni"
			);
			return;
		}

		const targetUserRolePosition = targetUser.roles.highest.position;
		const requestUserRolePosition = interaction.member.roles.highest.position;
		const botRolePosition = interaction.guild.members.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition) {
			await interaction.editReply(
				"tu nevari bannot šo lietotāju, jo viņiem ir tās pašas atļaujas vai arī augstākas"
			);
			return;
		}

		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				"nevaru bannot šo leitotāju, jo šim lietotājam ir tās pašas atļaujas vai arī augstākas par mani"
			);
			return;
		}

		try {
			await targetUser.ban({ reason });
			await interaction.editReply(
				`Lietotājs ${targetUser} ir ticis bannots\nIemesls: ${reason}`
			);
		} catch (error) {
			console.log(`kļūme bannošanā: ${error}`);
		}
	},

	name: "ban",
	description: "izbano nabagu!",
	//devOnly: Boolean,
	//testOnly: Boolean,

	options: [
		{
			name: "lietotajs",
			description: "cilveks ko bannot",
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
		{
			name: "reason",
			description: "iemesls banam",
			required: false,
			type: ApplicationCommandOptionType.String,
		},
	],
	premissionsRequired: [PermissionFlagsBits.Administrator],
	botPermissions: [PermissionFlagsBits.Administrator],
};
