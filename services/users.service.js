"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "users",
	version: 1,

	/**
	 * Mixins
	 */
	mixins: [DbMixin("users")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["_id", "name", "result"],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: { type: "string", min: 2 },
			email: { type: "email" },
			result: {
				type: "number",
				integer: true,
				optional: true,
			},
		},
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		create: {
			rest: "POST /",
			async handler(ctx) {
				let body = ctx.params.body;
				return this._create(ctx, { ...body, result: 0 });
			},
		},

		list: {
			rest: "GET /",
			async handler() {
				return this.adapter.find({ sort: ["name"] });
			},
		},

		top: {
			rest: "GET /top",
			async handler() {
				return this.adapter.find({ sort: ["-result"], limit: 15 });
			},
		},

		update: {
			rest: "PUT /:id",
			params: {
				params: {
					type: "object",
					props: {
						id: { type: "string" },
					},
				},
				body: {
					type: "object",
					props: {
						name: { type: "string", min: 2, optional: true },
						email: { type: "email", optional: true },
						result: {
							type: "number",
							positive: true,
							integer: true,
							optional: true,
						},
					},
				},
			},
			async handler(ctx) {
				const newData = ctx.params.body;
				const params = ctx.params.params;

				if (newData.name) {
					const found = await this.adapter.findOne({
						name: newData.name,
					});
					if (found && found._id.toString() !== params.id.toString())
						throw new MoleculerClientError(
							"Name is exist!",
							422,
							"",
							[{ field: "name", message: "is exist" }]
						);
				}

				if (newData.email) {
					const found = await this.adapter.findOne({
						email: newData.email,
					});
					if (found && found._id.toString() !== params.id.toString())
						throw new MoleculerClientError(
							"Email is exist!",
							422,
							"",
							[{ field: "email", message: "is exist" }]
						);
				}
				newData.updatedAt = new Date();
				const update = {
					$set: newData,
				};
				const doc = await this.adapter.updateById(params.id, update);

				this.checkTopUser(doc);

				await this.entityChanged("updated", doc, ctx);
				// TODO: solve problem with normal event, decouple
				this.broker.call("api.broadcast", {
					namespace: "/www",
					event: "users",
					args: ["top", await this.broker.call("v1.users.top")],
				});
				return doc;
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB() {
			await this.adapter.insertMany([
				{
					name: "Vasya",
					email: "vasya@mail.ml",
					result: 100,
				},
				{
					name: "Petya",
					email: "petya@mail.ml",
					result: 200,
				},
				{
					name: "Looser",
					email: "looser@mail.ml",
					result: 0,
				},
				{
					name: "Roma",
					email: "roma@mail.ml",
					result: 25,
				},
			]);
		},

		async checkTopUser(updatedUser) {
			const oldTop = await this.broker.cacher.get("topUser");

			if (oldTop) {
				if (updatedUser.result > oldTop.result) {
					// update cache
					this.broker.cacher.set("topUser", updatedUser);

					if (oldTop._id === updatedUser._id) {
						return;
					}

					// send mail to old leader
					this.broker.call("mail.send", {
						to: oldTop.email,
						subject: "Новый чемпион бассейна",
						html: [
							`Имя: <b>${updatedUser.name}</b>`,
							`Почта: <b>${updatedUser.email}</b>`,
							`Результат: <b>${updatedUser.result}</b> м.`,
						].join("<br/>"),
					});
				}
			}
		},
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		// set top user into cache
		const topUser = await this.adapter.find({
			sort: ["-result"],
			limit: 1,
		});
		this.broker.cacher.set("topUser", topUser[0] || null);
	},
};
