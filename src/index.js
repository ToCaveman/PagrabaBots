require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require("mongoose");
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildPresences,
		IntentsBitField.Flags.MessageContent,
	],
	presence: {
		status: "online",
		activity: {
			name: "fenikss",
			type: "PLAYING",
		},
	},
});

(async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("savienojos ar datubazi 👍🎉");
		eventHandler(client);

		client.login(process.env.TOKEN);
	} catch (error) {
		console.log(`kļūme 😡: ${error}`);
	}
})();
