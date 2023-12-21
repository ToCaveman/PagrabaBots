const { Schema, model } = require("mongoose");
const inventorySchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	inventory: {
		type: Object,
	},
});

module.exports = model("Inventory", inventorySchema);
