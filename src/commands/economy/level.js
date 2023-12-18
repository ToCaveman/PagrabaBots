const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	AttachmentBuilder,
} = require("discord.js");
const Level = require("../../models/level");
const canvacord = require("canvacord");
const calculateLevelXp = require("../../utils/calculateLevelXp");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */

	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("šo kommandu var palaist tikai serveros");
			return;
		}

		await interaction.deferReply();
		const mentionedUserId = interaction.options.get("lietotajs")?.value;
		const targetUserId = mentionedUserId || interaction.member.id;
		const targetUserObj = await interaction.guild.members.fetch(targetUserId);
		const fetchedLevel = await Level.findOne({
			userId: targetUserId,
			guildId: interaction.guild.id,
		});
		if (!fetchedLevel) {
			interaction.editReply(
				mentionedUserId
					? `${targetUserObj.user.tag} pagaidām nav līmeņu. (Nav reģistrēts datubāzē...)`
					: "Tev nav līmeņa..."
			);
			return;
		}

		let allLevels = await Level.find({
			guildId: interaction.guild.id,
		}).select("-_id userId level xp");
		allLevels.sort((a, b) => {
			if (a.level === b.level) {
				return b.xp - a.xp;
			} else {
				return b.level - a.level;
			}
		});
		let currentRank =
			allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
		const rank = new canvacord.Rank()
			.setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
			.setRank(currentRank)
			.setLevel(fetchedLevel.level)
			.setCurrentXP(fetchedLevel.xp)
			.setRequiredXP(calculateLevelXp(fetchedLevel.level))
			.setStatus(targetUserObj.presence.status)
			.setProgressBar("#cb00ff", "COLOR")
			.setUsername(targetUserObj.user.username);
		const data = await rank.build();
		const attachment = new AttachmentBuilder(data);
		interaction.editReply({ files: [attachment] });
	},

	name: "limenis",
	description: "parāda tavu vai kāda cita cilvēka līmeni",
	options: [
		{
			name: "lietotajs",
			description: "lietotājs, kura līmni gribi redzēt",
			type: ApplicationCommandOptionType.Mentionable,
			required: false,
		},
	],
};
