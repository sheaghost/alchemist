///////////////////////////////
///////////////////////////////
// SETTINGS ///////////////////
let config = {
	token: "TOKEN_HERE",
	prefix: "!",
	color: 0x2f3136 // 0xcode (for example, 0x2f3136)
};

///////////////////////////////
///////////////////////////////
// STARTUPS ///////////////////
const moment = require("moment");
const ms = require("ms");
const superfetch = require("node-superfetch");
const Eris = require("@erupcja/selfbot-eris");
const bot = new Eris(
	config.token, {
		allowedMentions: {
			everyone: true,
			roles: true,
			users: true
		},
		intents: [
			"guildMembers",
			"getAllUsers",
			"guilds"
		]
	}
);

///////////////////////////////
///////////////////////////////
// VARIABLES //////////////////
const devs = { "extase#0001" };
const discord = { id: "", invite: "" };
const source = "https://github.com/ex7ase/gandalf";
const donors = {};
let cmds = [];

///////////////////////////////
///////////////////////////////
// CLASSES ////////////////////
class embed {
	constructor() {
		this.embed = { color: config.color };
	}
	
	boolean(value) {
		if (!Boolean(value) || !value || !value === null) {
			return false;
		} else {
			return value;
		};
	}
	
	clamp(array) {
		if (Array.isArray(array)) {
			return array
				.map(a => a)
				.join("\n");
		} else {
			return array;
		};
	}
	
	author(name, icon, url) {
		this.embed.author = {
			name,
			icon,
			url
		};
		
		return { embed: this.embed };
	}
	
	thumbnail(url) {
		this.embed.thumbnail = url;
		return { embed: this.embed };
	}
	
	title(name) {
		this.embed.title = name;
		return { embed: this.embed };
	}
	
	url(name) {
		this.embed.url = name;
		return { embed: this.embed };
	}
	
	desc(name) {
		this.embed.description = this.clamp(name);
		return { embed: this.embed };
	}
	
	field(name, value, inline) {
		this.embed.fields.push({
			name: name,
			value: this.clamp(value),
			inline: this.boolean(inline)
		});
	}
	
	fields(array) {
		array.forEach(a => {
			this.embed.fields.push({
				name: a.name,
				value: this.clamp(a.value),
				inline: this.boolean(a.inline)
			});
		}):
	}
	
	footer(name, icon) {
		this.embed.footer = { name, icon };
		return { embed: this.embed };
	}
	
	image(url) {
		this.embed.image = { url };
		return { embed: this.embed };
	}
	
	timestamp(name = Date.now()) {
		if (timestamp instanceof Date) {
			name = name.getTime();
		};
		
		this.embed.timestamp = name;
		return { embed: this.embed };
	}
};

///////////////////////////////
///////////////////////////////
// FUNCTIONS //////////////////
function enter(options) {
	return cmds.push({
		name: options.name,
		aliases: options.aliases,
		group: options.group,
		topic: options.topic,
		usage: options.usage,
		code: options.code
	});
};
///////////////////////////////
function organize(string) {
	switch (string) {
		case "info":
			return "𐐪𐑂: Info";
			break;
		case "utility":
			return "𐐪𐑂: Utility";
			break;
		case "fun":
			return "𐐪𐑂: Fun";
			break;
	};
};
///////////////////////////////
function normalize(array) {
	return array
		.map(a => a)
		.join("\n");
};

///////////////////////////////
///////////////////////////////
// CMDS ///////////////////////
enter({
	name: "help",
	aliases: ["menu", "cmds"],
	group: "info",
	topic: "Shows the cmds or cmd info.",
	usage: "(cmd)",
	code: async function(msg, args) {
		if (!args.length) {
			let cmd;
			
			for (let i = 0; i < cmds.length; i++) {
				if (cmds[i].name === args[0].toLowerCase()) {
					cmd = cmds[i];
				} else {
					for (let k = 0; k < cmds[i].aliases.length; k++) {
						if (cmds[i].aliases[k] === args[0].toLowerCase()) {
							cmd = cmds[i];
						};
					};
				};
			};
			
			if (!cmd) {
				return bot.createMessage(
					msg.channel.id,
					`**${args[0]}** is an invalid cmd.`
				);
			} else {
				return bot.createMessage(
					msg.channel.id,
					new embed()
						.title(cmd.name)
						.desc(cmd.topic)
						.fields([
							{
								name: "Aliases",
								value: cmd.aliases
									.map(a => `\`${a}\``)
									.join("\n"),
								inline: true
							},
							{
								name: "Usage",
								value: "**" 
									+ config.prefix
									+ cmd.name
									+ "**"
									+ cmd.usage,
								inline: true
							}
						])
				);
			};
		} else {
			const groups = [...new Set(
				cmds.map(c => c.group)
			)];
			
			let fields = [];
			
			for (const group of groups) {
				fields.push({
					name: organize(group),
					value: bot.cmds
						.filter(c => c.group === group)
						.map(c => `\`${c.name}\``)
						.join("\n"),
					inline: true
				});
			};
			
			await bot.createMessage(
				msg.channel.id,
				new embed()
					.desc(`Use __**${config.prefix}help** (cmd)__ for more.`)
					.fields(fields)
			);
		};
	}
});
///////////////////////////////
enter({
	name: "ping",
	aliases: ["pingppong", "ms"],
	group: "info",
	topic: "Shows your ping and latency.",
	usage: "()",
	code: async function(msg, args) {
		await bot.createMessage(normalize([
			`Ping: **${bot.ws.ping}**`,
			`Latency: **${Date.now() - msg.createdTimestamp}**`
		]));
	}
});
///////////////////////////////
enter({
	name: "avatar",
	aliases: ["av", "pfp"],
	group: "info",
	topic: "Shows yours or someone's avatar.",
	usage: "(mention)",
	code: async function(msg, args) {
		const user = msg.mentions[0]
			? msg.mentions[0]
			: self.user;
		
		await bot.createMessage(
			msg.channel.id,
			new embed()
				.title(`${user.username}'s Avatar`)
				.image(
					user.avatarURL
					   .replace("size=128", "size=256")
				)
		);
	}
});
///////////////////////////////
enter({
	name: "whois",
	aliases: ["userinfo", "profile", "plr"],
	group: "info",
	topic: "Shows data on someone.",
	usage: "(mention)",
	code: async function(msg, args) {
		const user = msg.mentions[0]
			? msg.mentions
			: self.user;
		
		await bot.createMessage(
			msg.channel.id,
			new embed()
				.title(user.username)
				.desc([
					`Tag: **${user.username}#${user.discriminator}**`,
                    `Avatar: **[Link](${user.avatarURL})**`,
                   	`Made: **${moment(user.createdAt)
                            .format("LL")}**`
				])
		);
	}
});

///////////////////////////////
///////////////////////////////
// EVENTS /////////////////////
bot.on("hello", async function() {
	if (bot.guilds.cache.get(discord.id)) {
		return;
	} else {
		console.log([
			`> CMDS:     ${cmds.length}`,
			`> SUPPORT:  ${discord.invite}`,
			`> LOGIN:    ${bot.token}`,
			`            ${bot.user.tag}`,
			`            ${bot.user.id}`
		]);
	};
});
///////////////////////////////
bot.on("messageCreate", async function(msg) {
	if (!msg.content.startsWith(config.prefix) ||
	   	msg.author.id !== bot.user.id) {
		return;
	};
	
	const args = msg.content
		.slice(config.prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args
		.shift()
		.toLowerCase();
	let data;
			
	for (let i = 0; i < cmds.length; i++) {
		if (cmds[i].name === cmd) {
			use = cmds[i];
		} else {
			for (let k = 0; k < cmds[i].aliases.length; k++) {
				if (cmds[i].aliases[k] === cmd) {
					use = cmds[i];
				};
			};
		};
	};
	
	if (!data) {
		return;
	} else {
		data.code(msg, args);
		
		setTimeout(() => {
			msg.delete();
		}, 25000);
	};
});
