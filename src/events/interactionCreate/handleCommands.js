const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
	if (!interaction.isChatInputCommand()) {
		return;
	}
	const localCommands = getLocalCommands();

	try {
		const commandObject = localCommands.find(
			(cmd) => cmd.name === interaction.commandName
		);

		if (!commandObject) return;
		if (commandObject.devOnly) {
			if (!devs.includes(interaction.member.id)) {
				interaction.reply({
					content: "tikai veidotajiem ir piekluve sitajai kommandai",
					ephemeral: true,
				});
				return;
			}
		}
		if (commandObject.testOnly) {
			if (!(interaction.guild.id === testServer)) {
				interaction.reply({
					content: "kommandu seit nevar palaist",
					ephemeral: true,
				});
				return;
			}
		}
		if (commandObject.permissionsRequired?.lenght) {
			for (const permission of commandObject.permissionsRequired) {
				if (!interaction.member.permissions.has(permission)) {
					interaction.reply({
						content:
							"tev nav pietiekam atlauju lai palaistu so kommandu (lohs)",
						ephemeral: true,
					});
					return;
				}
			}
		}

		if (commandObject.botPermissions?.lenght) {
			for (const permission of commandObject.botPermissions) {
				const bot = interaction.guild.members.me;
				if (!bot.permissions.has(permission)) {
					interaction.reply({
						content: "man nav pietiekamu atlauju preiks sis kommandas",
						ephemeral: true,
					});
					return;
				}
			}
		}

		await commandObject.callback(client, interaction);
	} catch (error) {
		console.log(`klume: ${error}`);
	}
};
