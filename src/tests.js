const items = {
	veikals: {
		bacha: {
			name: "Bača",
			value: 100,
			info: "uzlabo savu veiksmi fenka",
			removedOnUse: true,
			use: async (interaction) => {
				// ... (use function implementation)
			},
		},
		virve: {
			name: "Virve",
			value: 20,
			info: "Pakaries",
			removedOnUse: true,
			use: async (interaction) => {
				// ... (use function implementation)
			},
		},
	},
	bomzosana: {
		luzins: {
			name: "Metāllūzins",
			value: 10,
			info: "lūznis",
		},
	},
};

const itemList = require(".//itemList");

// User input
const userInput = "Virve";

// Find the key only within the veikals object based on user input
const veikalsKeys = Object.keys(itemList.veikals);
let foundKey = null;

for (const key of veikalsKeys) {
	if (itemList.veikals[key].name.toLowerCase() === userInput.toLowerCase()) {
		foundKey = key;
		break;
	}
}

if (foundKey !== null) {
	console.log(`Found key in veikals: ${foundKey}`);
	// Access the corresponding item in veikals using items.veikals[foundKey]
	// For example: const virveItem = items.veikals[foundKey];
} else {
	console.log("Key not found in veikals");
}
