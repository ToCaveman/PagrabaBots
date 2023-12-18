// stupid ass kods kas domats lai apceltu noteiktus cilvekus
//sobrid ieklaute:
//1039086985907806220 - svaistamize
//897740828389302303 - rudis
//297710605522173954 - markus

const { Client, Message } = require("discord.js");
const targetClientIDs = [
	"1039086985907806220",
	"897740828389302303",
	"297710605522173954",
];
var replies = [
	"klusu objekt",
	"OBJEKTS!",
	"neruna...",
	"punķutapa",
	"ORIGO bomzis",
	"lietots produkts",
	"uztaisi sviestmaizi",
	"kurš deva tiesūbas runāt?",
];
/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {
	if (targetClientIDs.includes(message.author.id)) {
		var randReply = replies[(Math.random() * replies.length) | 0];
		message.channel.send(`${message.member} ${randReply}`);
	}
};
