const {
	Client,
	Interaction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");
const Statistika = require("../../models/statistika");

module.exports = {
	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 * @returns
	 */
	callback: async (client, interaction) => {
		if (!interaction.inGuild()) {
			interaction.reply("so kommandu var izmantot tikai serveros");
			return;
		}

		const userId = interaction.user.id;
		let user = await User.findOne({ userId: userId });
		if (!user) {
			user = new User({ userId });
			await user.save();
			console.log("izveidoju jaunu cliveka profilu?");
		}

		let statistika = await Statistika.findOne({ userId: userId });
		if (!statistika) {
			statistika = new Statistika({ userId });
			await statistika.save();
			console.log("izveidoju jaunu statistikas profilu");
		}

		// sis bus reals spaggeti kods bet nu ko lai dara
		let statistikasVertiba = interaction.options.get("kura").value;
		const izveletaStatistika = statistikasVertiba.toLowerCase();
		console.log(izveletaStatistika);
		if (izveletaStatistika === "kastes") {
			let kasteembed = new EmbedBuilder()
				.setTitle("**Tava /kaste statistika**")
				.setColor("Random")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Kopā atvērtas:",
						value: `**${statistika.kastes.reizes}** kastes`,
						inline: true,
					},
					{
						name: "Kopā iztērēts uz kastēm:",
						value: `**${statistika.kastes.zaudejumi}**`,
						inline: true,
					},
					{
						name: "No kastēm izcelts:",
						value: `**${statistika.kastes.ieguvumi}**`,
						inline: true,
					},
				]);
			await interaction.reply({
				embeds: [kasteembed],
			});
			return;
		}
		if (izveletaStatistika === "sacikstes") {
			let saciksteembed = new EmbedBuilder()
				.setTitle("**Tava /sacikstes statistika**")
				.setColor("Random")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Esi braucis:",
						value: `**${statistika.sacikstes.reizes}** reizes`,
						inline: true,
					},
					{
						name: "Esi ieguvis:",
						value: `**${statistika.sacikstes.ieguvumi}**`,
						inline: true,
					},
					{
						name: "Pirmo vietu esi ieguvis:",
						value: `**${statistika.sacikstes.vieta1}** reizes`,
						inline: true,
					},
					{
						name: "Otro vietu esi ieguvis:",
						value: `**${statistika.sacikstes.vieta2}** reizes`,
						inline: true,
					},
					{
						name: "Trešo vietu esi ieguvis:",
						value: `**${statistika.sacikstes.vieta3}** reizes`,
						inline: true,
					},
					{
						name: "Ceturto vietu esi ieguvis:",
						value: `**${statistika.sacikstes.vieta4}** reizes`,
						inline: true,
					},
					{
						name: "Padirisis esi:",
						value: `**${statistika.sacikstes.zaudes}** reizes`,
						inline: true,
					},
				]);
			await interaction.reply({
				embeds: [saciksteembed],
			});
			return;
		}
		if (izveletaStatistika === "darbs") {
			let darbsembed = new EmbedBuilder()
				.setTitle("**Tava darba statistika**")
				.setColor("Random")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Strādājis esi:",
						value: `**${statistika.darbs.reizes}** reizes`,
						inline: true,
					},
					{
						name: "Kopējie darba ienākumi:",
						value: `**${statistika.darbs.ienakumi}**`,
						inline: true,
					},
				]);
			await interaction.reply({
				embeds: [darbsembed],
			});
			return;
		}

		if (izveletaStatistika === "masinas") {
			let masinaembed = new EmbedBuilder()
				.setTitle("**Tava masinas statistika**")
				.setColor("Random")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Mašīnās esi ieguldījis:",
						value: `**${statistika.masinas.ieguldijums}**`,
						inline: true,
					},
					{
						name: "Kopējā zaudētā izturība:",
						value: `**${statistika.masinas.zaudetaizturiba}**`,
						inline: true,
					},
				]);
			await interaction.reply({
				embeds: [masinaembed],
			});
			return;
		}

		if (izveletaStatistika === "feniks") {
			let fenkaembed = new EmbedBuilder()
				.setTitle("**Tava feņkas statistika**")
				.setDescription("Tu nēssi bača")
				.setColor("Random")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Aparātus esi griezis:",
						value: `**${user.fenikssReizes}** reizes`,
						inline: true,
					},
					{
						name: "Izcēlis esi:",
						value: `**${user.fenikssIeguvumi}**`,
						inline: true,
					},
					{
						name: "Kruķītajos aparātos padirisis esi:",
						value: `**${user.fenikssZaudejumi}**`,
						inline: true,
					},
				]);
			await interaction.reply({
				embeds: [fenkaembed],
			});
			return;
		}

		if (izveletaStatistika === "depozits") {
			let depembed = new EmbedBuilder()
				.setTitle("**Tava depozīta statistika**")
				.setColor("Random")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Kopā esi ievāktācis:",
						value: `**${user.kopejiDepozits}** pudeles`,
						inline: true,
					},
					{
						name: "No traomāta esi ieguvis:",
						value: `**${user.depozitsIeguvumi}**`,
						inline: true,
					},
				]);
			await interaction.reply({
				embeds: [depembed],
			});
			return;
		}

		if (izveletaStatistika === "zagt") {
			let zagtembed = new EmbedBuilder()
				.setTitle("**Tava zagšanas statistika**")
				.setColor("Random")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Esi zadzis:",
						value: `**${statistika.zagt.reizes}** reizes`,
						inline: true,
					},
					{
						name: "Izdevušās zādzības:",
						value: `**${statistika.zagt.izdevies}**\n(Pizģuks tāds)`,
						inline: true,
					},
					{
						name: "Neizdevušās zādzības:",
						value: `**${statistika.zagt.neizdevies}**`,
						inline: true,
					},
					{
						name: "No zagšanas esi ieguvis:",
						value: `**${statistika.zagt.nozagts}**`,
						inline: true,
					},
					{
						name: "No zagšanas esi padirsis:",
						value: `**${statistika.zagt.zaudets}**`,
						inline: true,
					},
					{
						name: "No tevis nozagts:",
						value: `**${statistika.zagt.notevisnozagts}**`,
						inline: true,
					},
				]);
			await interaction.reply({
				embeds: [zagtembed],
			});
			return;
		}

		if (izveletaStatistika === "lugties") {
			let depembed = new EmbedBuilder()
				.setTitle("**Tava lūgšanās statistika**")
				.setDescription("Bomzis")
				.setColor("Random")
				.setFooter({
					text: "PAGRABA IEMĪTNIEKS 2023",
					iconURL: client.user.displayAvatarURL(),
				})
				.addFields([
					{
						name: "Lūdzies esi:",
						value: `**${statistika.ubagosana.reizes}** reizes`,
						inline: true,
					},
					{
						name: "Lūgšanās ieguvumi:",
						value: `**${statistika.ubagosana.ieguvumi}**`,
						inline: true,
					},
					{
						name: "Bača tevi ir aptīrijis:",
						value: `**${statistika.ubagosana.bacapzaga}** reizes`,
						inline: true,
					},
					{
						name: "Bača no tevis ir nozadzis:",
						value: `**${statistika.ubagosana.bacanozaga}**`,
						inline: true,
					},
				]);
			await interaction.reply({
				embeds: [depembed],
			});
			return;
		}
	},
	name: "statistika",
	//deleted: true,
	description: "Apskaties savu statistiku",
	options: [
		{
			name: "kura",
			description: "Statistikas sadaļa, kuru vēlies redzēt",
			required: true,
			type: ApplicationCommandOptionType.String,
			choices: [
				{
					name: "Kastes",
					value: "kastes",
				},
				{
					name: "Sacīkstes",
					value: "sacikstes",
				},
				{
					name: "Darbs",
					value: "darbs",
				},
				{
					name: "Mašīnas",
					value: "masinas",
				},
				{
					name: "Fēnikss",
					value: "feniks",
				},
				{
					name: "Depozīts",
					value: "depozits",
				},
				{
					name: "Zagšana",
					value: "zagt",
				},
				{
					name: "Lūgšanās",
					value: "lugties",
				},
			],
		},
	],
};
