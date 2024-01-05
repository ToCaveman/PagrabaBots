const { Schema, model } = require("mongoose");
const masinuSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		default: "Kajas",
	},
	maxDurability: {
		type: Number,
		default: 0,
	},
	currentDurability: {
		type: Number,
		default: 0,
	},
	speedStat: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		default: 0,
	},
});

module.exports = model("Masina", masinuSchema);
