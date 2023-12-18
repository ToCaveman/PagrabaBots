//url uz manas majaslapas json fialu
const url = "https://beanson.lv/list.json";
const websiteUrl = "https://beanson.lv";
websiteStatus = "";
// kods ko misters gpt uzgenereja
// Using Fetch API to get the JSON data
function fetchStatus() {
	fetch(url)
		.then((response) => {
			if (response.ok) {
				websiteStatus = "ir ieslēgta";
			} else {
				websiteStatus = "nav ieslēgta";
			}
			return websiteStatus;
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

module.exports = {
	name: "majaslapasstatus",
	description: "dabū manas mājaslapas statusu hahahaha",
	callback: async (client, interaction) => {
		await fetchStatus();
		await interaction.deferReply();
		interaction.editReply(`Mājaslapa: ${websiteUrl} ${websiteStatus}`);
	},
};
