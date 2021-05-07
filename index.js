///////////////////////////////
///////////////////////////////
// SETTINGS ///////////////////
let config = {
	token: "TOKEN_HERE",
	prefix: "!",
	color: 0x2f3136, // 0xcode (for example, 0x2f3136)
	gmail: {
		user: "",
		pass: ""
	}
};

///////////////////////////////
///////////////////////////////
// STARTUPS ///////////////////
const moment = require("moment");
const ms = require("ms");
const superfetch = require("node-superfetch");
const nodemailer = require("nodemailer");
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

const transporter = nodemailer
	.createTransport({
		service: "gmail",
		auth: {
			user: config.gmail.user,
			pass: config.gmail.pass
		}
	});

///////////////////////////////
///////////////////////////////
// VARIABLES //////////////////
const devs = { "extase#0001" };
const discord = { 
	id: "839994435529998349", 
	invite: "discord.gg/Wdrsu2xQez" 
};

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
		
		return { embed: this.embed };
	}
	
	fields(array) {
		array.forEach(a => {
			this.embed.fields.push({
				name: a.name,
				value: this.clamp(a.value),
				inline: this.boolean(a.inline)
			});
		}):
		
		return { embed: this.embed };
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
function register(options) {
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
			return "[*] Info";
			break;
		case "utility":
			return "[-] Utility";
			break;
		case "fun":
			return "[!] Fun";
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
register({
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
register({
	name: "ping",
	aliases: ["pingppong", "ms"],
	group: "info",
	topic: "Shows your ping and latency.",
	usage: "()",
	code: async function(msg, args) {
		await bot.createMessage(
			msg.channel.id,
			normalize([
				`Ping: **${bot.shards.get(0).latency}**`,
				`Latency: **${Date.now() - msg.createdAt}**`
			])
		);
	}
});
///////////////////////////////
register({
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
register({
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
register({
	name: "guild",
	aliases: ["guildinfo", "serverinfo"],
	group: "info",
	topic: "Shows data on a guild.",
	usage: "()",
	code: async function(msg, args) {
		const guild = msg.member.guild || args[0];
		
		if (args[0] && !bot.guilds.get(args[0])) {
			return self.createMessage(
				msg.channel.id,
				`**${args[0]}** is an invalid guild ID.`
			);
		};
		
		await bot.createMessage(
			msg.channel.id,
			new embed()
				.thumbnail(guild.iconURL)
				.title(guild.name)
				.desc([
                	`ID: \`${guild.id}\``,
                    `Owner: <@${guild.ownerID}>`,
                    `Boosts: \`${guild.premiumSubscriptionCount}\``,
                    `Level: \`${guild.premiumTier}\``,
                    `Members: \`${guild.memberCount}\``,
                    `Emojis: \`${guild.emojis.size}\``,
                    `Channels: \`${guild.channels.size}\``,
                    `Roles: \`${guild.roles.size}\``
                ])
		);
	}
});
///////////////////////////////
register({
	name: "credits",
	aliases: ["creds"],
	group: "info",
	topic: "Shows the credits.",
	usage: "()",
	code: async function(msg, args) {
		await bot.createMessage(
			msg.channel.id,
			new embed()
				.title("Credits")
				.desc(
					devs
						.map(d => `\`${d}\``)
						.join("\n")
				)
				.footer(discord.invite)
		);
	}
});
///////////////////////////////
register({
	name: "gmail",
	aliases: ["gm", "email", "mail"],
	group: "utility",
	topic: "GMails an email 'x' times.",
	usage: "(email) (number) (msg)",
	code: async function(msg, args) {
		for (let i = 0; i < args[1]; i++) {
			transporter.sendMail({
				from: config.gmail.user,
				to: args[0],
				subject: "",
				text: args.slice(1).join(" ")
			});
		};
		
		await bot.createMessage(
			msg.channel.id,
			normalize([
				"GMailed!",
				`Email: **${args[0]}**`,
				`Amount sent: **${args[1]}**`
			])
		);
	}
});
///////////////////////////////
register({
	name: "date",
	aliases: ["time"],
	group: "utility",
	topic: "Shows the date and time.",
	usage: "()",
	code: async function(msg, args) {
		await bot.createMessage(
			[
				`Date: **${moment(Date.now())
                    .format("LL")}**`,
                `Time: **${moment(Date.now())
                    .format("LT")}**`
			]
		);
	}
});
///////////////////////////////
register({
	name: "ip",
	aliases: ["ipinfo"],
	group: "utility",
	topic: "Shows info on an IP.",
	usage: "(IP)",
	code: async function(msg, args) {
		const { body } = await superfetch
            .get(`http://ip-api.com/json/${args[0]}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);

        if (!body || body.country === undefined ||
		   body.country === "") {
            return bot.createMessage(
                msg.channel.id,
                `**${args[0]}** is an invalid IP.`
            );
        } else {
			return bot.createMessage(
				msg.channel.id,
				new embed()
					.title(args[0])
					.desc([
						`Country: \`${body.country}\``,
                        `Region: \`${body.regionName}\``,
                        `City: \`${body.city}\``,
                        `ZIP: ${body.zip !== ""
                                ? `\`${body.zip}\``
                                : "**N/A**"}`,
                        `Domain: ${body.org !== ""
                                ? `\`${body.org}\``
                                : "**N/A**"
                           }`,
                        `Timezone: \`${body.timezone}\``,
                        `Provider: \`${body.isp}\``,
                        `AS: \`${body.as}\``
					])
			);
		};
	}
});
///////////////////////////////
register({
	name: "half",
	aliases: ["halftoken", "tokenhalf"],
	group: "utility",
	topic: "Shows half of a user's token.",
	usage: "(ID)",
	code: async function(msg, args) {
		const base64 = require("js-base64");
		
		await bot.createMessage(
			msg.channel.id,
			`\`\`\`${base64.encode(args[0])}\`\`\``
		);
	}
});
///////////////////////////////
register({
	name: "number",
	aliases: ["phone", "#"],
	group: "utility",
	topic: "Shows info on a phone number.",
	usage: "(number)",
	code: async function(msg, args) {
		const { body } = await superfetch
            .get(`http://apilayer.net/api/validate?access_key=${process.env.NUMKEY}&number=${args[0]}`);

        if (!body || body.local_format === "" ||
            body.local_format === null) {
            return bot.createMessage(
                msg.channel.id,
                `**${args[0]}** is an invalid number.`
            );
        } else {
			return bot.createMessage(
				msg.channel.id,
				new embed()
					.title(body.number)
					.desc([
                    	`In-Service: \`${body.valid}\``,
                        `Country: \`${body.country_name}\``,
                        `City: ${body.location !== null
                                ? `\`${body.location}\``
                                : "**N/A**"}`,
                        `Local: \`${body.local_format}\``,
                        `Prefix: \`${body.country_prefix}\``,
                        `Carrier: \`${body.carrier}\``,
                        `Type: \`${body.line_type}\``
                    ])
			);
		};
	}
});
///////////////////////////////
register({
	name: "status",
	aliases: ["activity"],
	group: "utility",
	topic: "Changes your status.",
	usage: "(type) (text)",
	code: async function(msg, args) {
		let type;
		
		switch (args[0]) {
			case "playing":
				type = 0;
				break;
			case "streaming":
				type = 1;
				break;
			case "listening":
				type = 2;
				break;
			case "watching":
				type = 3;
				break;
		};

        bot.editStatus(
            "dnd", {
                name: args.slice(1).join(" "),
                type: type,
                url: "https://twitch.tv/ALCHEMISTTT"
            }
        );
	}
});

///////////////////////////////
///////////////////////////////
// EVENTS /////////////////////
bot.on("hello", async function() {
	console.log([
		`> CMDS:     ${cmds.length}`,
		`> SUPPORT:  ${discord.invite}`,
		`> LOGIN:    ${bot.token}`,
		`            ${bot.user.tag}`,
		`            ${bot.user.id}`
	]);
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
