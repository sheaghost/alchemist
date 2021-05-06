const config = {
	token: "",
	prefix: ""
};

///////////////////////////////
///////////////////////////////
// STARTUPS ///////////////////
const Eris = require("@erupcja/selfbot-eris");
const self = new Eris(
    config.token,
    {
        allowedMentions: {
            everyone: true,
            roles: true,
            users: true
        }
    }
);

///////////////////////////////
///////////////////////////////
// VARIABLES //////////////////
const devs = { "extase#0001" };
const discord = "";
const source = "https://github.com/ex7ase/gandalf";
const donors = {};
let cmds = [];

///////////////////////////////
///////////////////////////////
// CLASSES ////////////////////
class embed {
	constructor() {
		this.embed = {};
	}
	
	boolean(bool) {
		if (!Boolean(bool) || !bool || !bool === null) {
			return false;
		} else {
			return bool;
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
	
	description(name) {
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
	
	color() {}
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
///////////////////////////////
// CMDS ///////////////////////
enter({
	name: "help",
	aliases: ["menu", "cmds"],
	group: "info",
	topic: "Shows the cmds or cmd info.",
	usage: "(cmd)",
	code: function(msg, args) {
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
				return self.createMessage(
					msg.channel.id,
					`**${args[0]}** is an invalid cmd.`
				);
			} else {
				return self.createMessage(
					msg.channel.id,
					new embed()
						.title(cmd.name)
						.description(cmd.topic)
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
									+ "**" + cmd.usage,
								inline: true
							}
						])
				);
			};
		}
	}
});
///////////////////////////////
enter({
});

///////////////////////////////
///////////////////////////////
// EVENTS /////////////////////
client.on("messageCreate", async function(msg) {
	if (!msg.guild || 
		!msg.content.startsWith(config.prefix)) {
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
		return data.code(msg, args);
	};
});
