const { Schema, model } = require("mongoose");
const allSchema = new Schema({
	clientId: {
		type: String,
		required: true,
	},
	feniksZaudejumi: {
		type: Number,
		default: 0,
	},
	feniksaUzvaras: {
		type: Number,
		default: 0,
	},
});

module.exports = model("globalStats", allSchema);
