//url uz manas majaslapas json fialu
const url = "https://beanson.lv/list.json";

// kods ko misters gpt uzgenereja
// Using Fetch API to get the JSON data
function fetchUpload() {
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			// Work with the JSON data here
			uploadName = data["data"][0]["name"];
			uplaodDate = data["data"][0]["date"];
			return uploadName;
			return uplaodDate;
			//console.log(uploadName);
		})
		.catch((error) => {
			// Handle any errors that occurred during the fetch
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
