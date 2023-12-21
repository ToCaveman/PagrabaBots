const { Schema, model } = require("mongoose");
const statsSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	fenikssIeguvumi: {
		type: Number,
		default: 0,
	},
	fenikssZaudejumi: {
		type: Number,
		default: 0,
	},
	fenikssReizes: {
		type: Number,
		default: 0,
	},
	kopejiDepozits: {
		type: Number,
		default: 0,
	},
	depozitsIeguvumi: {
		type: Number,
		default: 0,
	},
});

module.exports = model("Stats", statsSchema);
