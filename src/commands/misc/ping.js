module.exports = {
	name: "ping",
	description: "pong!",
	//devOnly: Boolean,
	//testOnly: Boolean,
	//options: Object[],
	//deleted: Boolean

	callback: async (client, interaction) => {
		await interaction.deferReply();
		const reply = await interaction.fetchReply();
		const ping = reply.ceatedTimestamp - interaction.createdTimestamp;
		interaction.editReply(
			`pong client:${ping}ms | websocekt:${client.ws.ping}ms`
		);
	},
};
