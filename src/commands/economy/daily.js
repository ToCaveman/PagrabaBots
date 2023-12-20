const { Client, Interaction } = require("discord.js");
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
				guildId: interaction.guild.id,
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

			user.balance += getRandomInt(50, 150);
			await user.save();
			interaction.editReply(
				`${dailyGeneratedAmount} ir ticis injicēts tavā kontā\n**TAVĀ KONTĀ IR: **${user.balance}`
			);
		} catch (error) {
			console.log(`Kļūme ikdienišķajā kommandā: ${error}`);
		}
	},
};
