const { Client, Interaction, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const dailyAmount = 100;

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	dailyGeneratedAmount = Math.floor(Math.random() * (max - min) + min);
	return dailyGeneratedAmount;
}

module.exports = {
	name: "ikdieniskais",
	description: "saņem savu ikdienišķo naudas injekciju",
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply({
				content: "šo kommandu var izmantot tikai serveros",
				ephemeral: true,
			});
			return;
		}

		try {
			await interaction.deferReply();
			let query = {
				userId: interaction.member.id,
				//guildId: interaction.guild.id,
			};
			let user = await User.findOne(query);
			if (user) {
				const lastDailyDate = user.lastDaily.toDateString();
				const currDate = new Date().toDateString();
				if (lastDailyDate === currDate) {
					interaction.editReply(
						`Šodien jau esi saņēmis savu naudas injekciju... rīt vari nākt atpakaļ`
					);
					return;
				}
				user.lastDaily = new Date();
			} else {
				user = new User({
					...query,
					lastDaily: new Date(),
				});
			}
			const dailyAmount1 = getRandomInt(50, 200);
			user.balance += dailyAmount1;
			user.experience += getRandomInt(1, 5);
			await user.save();
			let embed = new EmbedBuilder()
				.setTitle("TU SAŅĒMI SAVU IKDIENIŠĶO NAUDAS INJEKCIJU")
				.setDescription(
					`**${dailyAmount1}** ir ticis injicēts tavā kontā\nTAVĀ KONTĀ IR: ${user.balance}`
				)
				.setColor("Yellow")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2024",
					iconURL: client.user.displayAvatarURL(),
				});

			await interaction.editReply({
				embeds: [embed],
			});
		} catch (error) {
			console.log(`Kļūme ikdienišķajā kommandā: ${error}`);
		}
	},
};
