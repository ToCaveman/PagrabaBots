const { Schema, model } = require("mongoose");
const inventorySchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	inventory: {
		type: Object,
		default: {},
	},
});

module.exports = model("Inventory", inventorySchema);
