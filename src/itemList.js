const User = require("./models/User");
function getRandomNumber(x, y) {
	const range = y - x + 1;
	const randomNumber = Math.floor(Math.random() * range);
	return randomNumber + x;
}
module.exports = {
	veikals: {
		bacha: {
			name: "Bacha",
			value: 100,
			info: "uzlabo savu veiksmi fenka",
			removedOnUse: true,
			use: async (interaction) => {
				let userId = interaction.member.id;
				let user = await User.findOne({ userId: userId });
				if (!user) {
					return "ej dirst";
				}
				user.balance += 1;
				await user.save();
				return `tavam makam pievienoju 1`;
			},
		},
		virve: {
			name: "Virve",
			value: 20,
			info: "Pakaries",
			removedOnUse: true,
			use: async (interaction) => {
				let userId = interaction.member.id;
				let user = await User.findOne({ userId: userId });
				if (!user) {
					return "ej dirst";
				}
				//user.balance = 0;
				//await user.save();
				return `Tu pakāries un zaudēji visu savu naudu... 💀`;
			},
		},
		wacapoditis: {
			name: "Wacap Oditis",
			value: 265,
			info: "Nezināma dzira",
			removedOnUse: true,
			use: async (interaction) => {
				let userId = interaction.member.id;
				let user = await User.findOne({ userId: userId });
				if (!user) {
					return "ej dirst";
				}
				const zadziba_amount = getRandomNumber(1, 1000);
				user.balance += zadziba_amount;
				await user.save();
				return `Tu apštirījies un apzagi banku!\nTu ieguvi: **${zadziba_amount}**`;
			},
		},
	},
	bomzosana: {
		metalluzins: {
			name: "Metāllūzins",
			value: 10,
			info: "lūznis",
		},
	},
};
