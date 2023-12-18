const { testServer } = require("../../../config.json");
const getAppliactionCommands = require("../../utils/getAppliactionCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");

module.exports = async (client) => {
	try {
		const localCommands = getLocalCommands();
		const appliactionCommands = await getAppliactionCommands(
			client,
			testServer
		);
		for (const localCommand of localCommands) {
			const { name, description, options } = localCommand;

			const existingCommand = await appliactionCommands.cache.find(
				(cmd) => cmd.name === name
			);

			if (existingCommand) {
				if (localCommand.deleted) {
					await appliactionCommands.delete(existingCommand.id);
					console.log(`izdesu kommand ${name}`);
					continue;
				}
				if (areCommandsDifferent(existingCommand, localCommand)) {
					await appliactionCommands.edit(existingCommand.id, {
						description,
						options,
					});
					console.log(`izmainiju kommandu ${name}`);
				}
			} else {
				if (localCommand.deleted) {
					console.log(
						`izlaizu kommandas ${name} registresanu jo to tapatas dzesis`
					);
					continue;
				}
				await appliactionCommands.create({
					name,
					description,
					options,
				});

				console.log(`registreju kommandu ${name}`);
			}
		}
	} catch (error) {
		console.log(`klume: ${error}`);
	}
};
