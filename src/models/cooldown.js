const { Schema, model } = require("mongoose");
const coolDownSchema = new Schema({
	commandName: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	endsAt: {
		type: Date,
		required: true,
	},
});
module.exports = model("Cooldown", coolDownSchema);
