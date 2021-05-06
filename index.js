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
let commands = [];

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
};

///////////////////////////////
///////////////////////////////
// FUNCTIONS //////////////////
function enter(options) {
	return commands.push({
		name: options.name,
		aliases: options.aliases,
		group: options.group,
		topic: options.topic,
		usage: options.usage,
		ability: options.ability
	});
};

///////////////////////////////
///////////////////////////////
// COMMANDS ///////////////////
enter({
	
	
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
	const command = args
		.shift()
		.toLowerCase();
});
