module.exports = async (client, guildId) => {
	let appliactionCommands;
	if (guildId) {
		const guild = await client.guilds.fetch(guildId);
		appliactionCommands = guild.commands;
	} else {
		appliactionCommands = await client.appliaction.commands;
	}

	await appliactionCommands.fetch();
	return appliactionCommands;
};
