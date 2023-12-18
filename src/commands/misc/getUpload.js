//url uz manas majaslapas json fialu
const url = "https://beanson.lv/list.json";

// kods ko misters gpt uzgenereja
function fetchUpload() {
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			uploadName = data["data"][0]["name"];
			uplaodDate = data["data"][0]["date"];
			return uploadName;
			return uplaodDate;
		})
		.catch((error) => {
			console.error("Fetch error:", error);
		});
}

module.exports = {
	name: "augsupielade",
	description: "dabū jaunāko augšupielādi no manas mājaslapas",
	callback: async (client, interaction) => {
		await fetchUpload();
		await interaction.deferReply();
		interaction.editReply(
			`Saite: https://beanson.lv/uploads/${uploadName}\nAugšupielādes datums: ${uplaodDate}`
		);
	},
};
