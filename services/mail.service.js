"use strict";
const MoleculerMail = require("moleculer-mail");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const SENDER_ADDRESS = process.env.MAIL_SENDER || "sender@swimmer.io";
const MAIL_USER = process.env.MAIL_AUTH_USER;
const MAIL_PASS = process.env.MAIL_AUTH_PASS;

module.exports = {
	name: "mail",

	mixins: [MoleculerMail],
	/**
	 * Settings
	 */
	settings: {
		from: SENDER_ADDRESS,
		transport: {
			service: "gmail",
			auth: {
				user: MAIL_USER,
				pass: MAIL_PASS,
			},
		},
	},
};
