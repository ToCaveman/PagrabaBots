const { Schema, model } = require("mongoose");
const statistikasSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	kastes: {
		reizes: {
			type: Number,
			default: 0,
		},
		zaudejumi: {
			type: Number,
			default: 0,
		},
		ieguvumi: {
			type: Number,
			default: 0,
		},
	},
	sacikstes: {
		reizes: {
			type: Number,
			default: 0,
		},
		vieta1: {
			type: Number,
			default: 0,
		},
		vieta2: {
			type: Number,
			default: 0,
		},
		vieta3: {
			type: Number,
			default: 0,
		},
		vieta4: {
			type: Number,
			default: 0,
		},
		zaudes: {
			type: Number,
			default: 0,
		},
		ieguvumi: {
			type: Number,
			default: 0,
		},
	},
	darbs: {
		reizes: {
			type: Number,
			default: 0,
		},
		ienakumi: {
			type: Number,
			default: 0,
		},
	},
	masinas: {
		zaudetaizturiba: {
			type: Number,
			default: 0,
		},
		ieguldijums: {
			type: Number,
			default: 0,
		},
	},
	ubagosana: {
		reizes: {
			type: Number,
			default: 0,
		},
		bacapzaga: {
			type: Number,
			default: 0,
		},
		bacanozaga: {
			type: Number,
			default: 0,
		},
		ieguvumi: {
			type: Number,
			default: 0,
		},
	},
	zagt: {
		reizes: {
			type: Number,
			default: 0,
		},
		nozagts: {
			type: Number,
			default: 0,
		},
		zaudets: {
			type: Number,
			default: 0,
		},
		izdevies: {
			type: Number,
			default: 0,
		},
		neizdevies: {
			type: Number,
			default: 0,
		},
		notevisnozagts: {
			type: Number,
			default: 0,
		},
	},
});

module.exports = model("Statistika", statistikasSchema);
