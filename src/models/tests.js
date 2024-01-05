const { Schema, model } = require("mongoose");
const testSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	masina: {
		type: Object,
	},
});

module.exports = model("Test", testSchema);
