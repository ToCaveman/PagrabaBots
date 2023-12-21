const { Schema, model } = require("mongoose");
const userSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	//guildId: {
	//type: String,
	//required: true,
	//},
	balance: {
		type: Number,
		default: 10,
	},
	depozitaPudeles: {
		type: Number,
		default: 0,
	},
	lastDaily: {
		type: Date,
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
	noziedots: {
		type: Number,
		default: 0,
	},
});

module.exports = model("User", userSchema);
