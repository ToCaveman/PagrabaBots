const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	callback: async (client, interaction) => {
		const mentionable = interaction.options.get("lietotājs").value;
		const duration = interaction.options.get("ilgums").value;
		const reason =
			interaction.options.get("iemesls")?.value || "iemesls nav dots";

		await interaction.deferReply();
		const targetUser = await interaction.guild.members.fetch(mentionable);
		if (!targetUser) {
			await interaction.editReply("Šāds lietotājs nepastāv");
			return;
		}
		if (targetUser.user.bot) {
			await interaction.editReply("Nevaru timeoutot citu robotu");
			return;
		}
		const msDuration = ms(duration);
		if (isNaN(msDuration)) {
			await interaction.editReply("Lūdzu dodiet pareizu timeouta ilgumu");
			return;
		}
		if (msDuration < 5000 || msDuration > 2.419e9) {
			await interaction.editReply(
				"Ilgums nevar būt ilgāks par 28 dienām vai zemāks par 5 sekundēm"
			);
			return;
		}

		const targetUserRolePosition = targetUser.roles.highest.position;
		const requestUserRolePosition = interaction.member.roles.highest.position;
		const botRolePosition = interaction.guild.members.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition) {
			await interaction.editReply(
				"tu nevari timoutot šo lietotāju, jo viņiem ir tās pašas atļaujas vai arī augstākas"
			);
			return;
		}

		if (targetUserRolePosition >= botRolePosition) {
			await interaction.editReply(
				"nevaru timoutot šo leitotāju, jo šim lietotājam ir tās pašas atļaujas vai arī augstākas par mani"
			);
			return;
		}

		try {
			const { default: prettyMs } = await import("pretty-ms");

			if (targetUser.isCommunicationDisabled()) {
				await targetUser.timeout(msDuration, reason);
				await interaction.editReply(
					`${targetUser} timouts ir ticis atajunināts uz ${prettyMs(
						msDuration,
						{ verbose: true }
					)}\nIemesls: ${reason}`
				);
				return;
			}
			await targetUser.timeout(msDuration, reason);
			await interaction.editReply(
				`${targetUser} ir ticis timeoutots uz ${prettyMs(msDuration, {
					verbose: true,
				})}\nIemesls: ${reason}`
			);
		} catch (error) {
			console.log(`Kļūme timeout kommandā: ${error}`);
		}
	},

	name: "timeout",
	description: "timouto kādu cilvēku",

	options: [
		{
			name: "lietotājs",
			description: "litotājs, ko vēlies timeoutot.",
			type: ApplicationCommandOptionType.Mentionable,
			required: true,
		},
		{
			name: "ilgums",
			description: "ilgums (15m,2h,1 day)",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "iemesls",
			description: "iemesls",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	permissionsRequired: [PermissionFlagsBits.Administrator],
	botPermissions: [PermissionFlagsBits.Administrator],
};
