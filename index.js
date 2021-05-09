///////////////////////////////
///////////////////////////////
// SETTINGS ///////////////////
let config = {
    token: "",
    prefix: "",
    color: "#2f3136",
    gmail: {
        user: "",
        pass: ""
    },
    numkey: ""
};

///////////////////////////////
///////////////////////////////
// STARTUPS ///////////////////
const moment = require("moment");
const ms = require("ms");
const superfetch = require("node-superfetch");
const nodemailer = require("nodemailer");
const Eris = require("@erupcja/selfbot-eris");
const { MessageEmbed } = require("discord.js");
const bot = new Eris(
    config.token, {
    allowedMentions: {
        everyone: true,
        roles: true,
        users: true
    }
});

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
const devs = ["extase#0001"];
const discord = {
    id: "839994435529998349",
    invite: "https://discord.gg/y5mSnWhGJr"
};

const source = "https://github.com/ex7ase/alchemist";
const donors = {};
let cmds = [];

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
        case "utility":
            return "[-] Utility";
        case "fun":
            return "[!] Fun";
    };
};
///////////////////////////////
function normalize(array) {
    return array
        .map(a => a)
        .join("\n");
};
///////////////////////////////
function embed() {
    return new MessageEmbed()
        .setColor(config.color)
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
    need: 0,
    code: async function (msg, args) {
        if (args.length) {
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
                    `\`${args[0]}\` is an invalid cmd.`
                );
            } else {
                return bot.createMessage(
                    msg.channel.id, {
                    embed: embed()
                        .setTitle(cmd.name)
                        .setDescription(cmd.topic)
                        .addFields(
                            {
                                name: "Aliases",
                                value: cmd.aliases
                                    .map(a => `\`${a}\``)
                                    .join("\n"),
                                inline: true
                            },
                            {
                                name: "Usage",
                                value: "\`"
                                    + config.prefix
                                    + cmd.name
                                    + "\`"
                                    + " "
                                    + cmd.usage,
                                inline: true
                            }
                        )
                });
            };
        } else {
            const groups = [...new Set(
                cmds.map(c => c.group)
            )];

            let fields = [];

            for (const group of groups) {
                fields.push({
                    name: organize(group),
                    value: cmds
                        .filter(c => c.group === group)
                        .map(c => `\`${c.name}\``)
                        .join("\n"),
                    inline: true
                });
            };

            await bot.createMessage(
                msg.channel.id, {
                embed: embed()
                    .setDescription(`Use \`${config.prefix}help (cmd)\` for more.`)
                    .addFields(fields)
            });
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
    need: 0,
    code: async function (msg, args) {
        await bot.createMessage(
            msg.channel.id,
            normalize([
                `Ping: \`${bot.shards.get(0).latency}\``,
                `Latency: \`${Date.now() - msg.createdAt}\``
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
    need: 0,
    code: async function (msg, args) {
        const user = msg.mentions[0]
            ? msg.mentions[0]
            : bot.user;

        await bot.createMessage(
            msg.channel.id, {
            embed: embed()
                .setTitle(`${user.username}'s Avatar`)
                .setDescription(
                    user.avatarURL
                        .replace("size=128", "size=256")
                )
        });
    }
});
///////////////////////////////
register({
    name: "whois",
    aliases: ["userinfo", "profile", "plr"],
    group: "info",
    topic: "Shows data on someone.",
    usage: "(mention)",
    need: 0,
    code: async function (msg, args) {
        const user = msg.mentions[0]
            ? msg.mentions
            : bot.user;

        await bot.createMessage(
            msg.channel.id, {
            embed: embed()
                .setTitle(user.username)
                .setDescription([
                    `Tag: \`${user.username}#${user.discriminator}\``,
                    `Avatar: \`[Link](${user.avatarURL})\``,
                    `Made: \`${moment(user.createdAt)
                        .format("LL")}\``
                ])
        });
    }
});
///////////////////////////////
register({
    name: "guild",
    aliases: ["guildinfo", "serverinfo"],
    group: "info",
    topic: "Shows data on a guild.",
    usage: "()",
    need: 0,
    code: async function (msg, args) {
        const guild = msg.member.guild || args[0];

        if (args[0] && !bot.guilds.get(args[0])) {
            return bot.createMessage(
                msg.channel.id,
                `\`${args[0]}\` is an invalid guild ID.`
            );
        };

        await bot.createMessage(
            msg.channel.id, {
            embed: embed()
                .setThumbnail(guild.iconURL)
                .setTitle(guild.name)
                .setDescription([
                    `ID: \`${guild.id}\``,
                    `Owner: <@${guild.ownerID}>`,
                    `Boosts: \`${guild.premiumSubscriptionCount}\``,
                    `Level: \`${guild.premiumTier}\``,
                    `Members: \`${guild.memberCount}\``,
                    `Emojis: \`${guild.emojis.size}\``,
                    `Channels: \`${guild.channels.size}\``,
                    `Roles: \`${guild.roles.size}\``
                ])
        });
    }
});
///////////////////////////////
register({
    name: "guide",
    aliases: ["guidebook"],
    group: "info",
    topic: "Shows the guide.",
    usage: "()",
    need: 0,
    code: async function (msg, args) {
        await bot.createMessage(
            msg.channel.id, {
            embed: embed()
                .setTitle("Guide")
                .setDescription([
                    "Credits:",
                    devs
                        .map(d => `\`${d}\``)
                        .join("\n"),
                    " ",
                    `Support: \`${discord.invite}\``,
                    `CMDS: \`${cmds.length}\``
                ])
                .setFooter(discord.invite)
                .toJSON()
        });
    }
});
///////////////////////////////
register({
    name: "gmail",
    aliases: ["gm", "email", "mail"],
    group: "utility",
    topic: "GMails an email 'x' times.",
    usage: "(email) (number) (subject) (msg)",
    need: 4,
    code: async function (msg, args) {
        const time = ms(parseInt(args[1]) * 1.5 * 1000);

        await bot.createMessage(
            msg.channel.id,
            `Estimated time 'til finished: \`${time}\``
        );

        let count = 0;

        for (let i = 0; i < args[1]; i++) {
            setTimeout(() => {
                transporter.sendMail({
                    from: config.gmail.user,
                    to: args[0],
                    subject: "",
                    text: args.slice(3).join(" ")
                });

                count = count + 1;
            }, 1500);
        };

        setTimeout(async () => {
            await bot.createMessage(
                msg.channel.id,
                "Sent the email(s)."
            );
        }, parseInt(args[1]) * 1.5 * 1000);
    }
});
///////////////////////////////
register({
    name: "date",
    aliases: ["time"],
    group: "utility",
    topic: "Shows the date and time.",
    usage: "()",
    need: 0,
    code: async function (msg, args) {
        await bot.createMessage(
            msg.channel.id,
            normalize([
                `Date: \`${moment(Date.now())
                    .format("LL")}\``,
                `Time: \`${moment(Date.now())
                    .format("LT")}\``
            ]));
    }
});
///////////////////////////////
register({
    name: "ip",
    aliases: ["ipinfo"],
    group: "utility",
    topic: "Shows info on an IP.",
    usage: "(IP)",
    need: 1,
    code: async function (msg, args) {
        const { body } = await superfetch
            .get(`http://ip-api.com/json/${args[0]}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);

        if (!body || body.country === undefined ||
            body.country === "" && args.length) {
            return bot.createMessage(
                msg.channel.id,
                `\`${args[0]}\` is an invalid IP.`
            );
        } else {
            return bot.createMessage(
                msg.channel.id, {
                embed: embed()
                    .setTitle(args[0])
                    .setDescription([
                        `Country: \`${body.country}\``,
                        `Region: \`${body.regionName}\``,
                        `City: \`${body.city}\``,
                        `ZIP: \`${body.zip !== ""
                            ? body.zip
                            : "N/A"}\``,
                        `Domain: \`${body.org !== ""
                            ? body.org
                            : "N/A"
                        }\``,
                        `Timezone: \`${body.timezone}\``,
                        `Provider: \`${body.isp}\``,
                        `AS: \`${body.as}\``
                    ])
                    .toJSON()
            });
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
    need: 1,
    code: async function (msg, args) {
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
    need: 1,
    code: async function (msg, args) {
        const { body } = await superfetch
            .get(`http://apilayer.net/api/validate?access_key=${config.numkey}&number=${args[0]}`);

        if (!body || body.local_format === undefined ||
            body.local_format === undefined && args.length) {
            return bot.createMessage(
                msg.channel.id,
                `\`${args[0]}\` is an invalid number.`
            );
        } else {
            return bot.createMessage(
                msg.channel.id, {
                embed: embed()
                    .setTitle(body.number)
                    .setDescription([
                        `In-Service: \`${body.valid}\``,
                        `Country: \`${body.country_name}\``,
                        `City: \`${body.location !== null
                            ? body.location
                            : "N/A"}\``,
                        `Local: \`${body.local_format}\``,
                        `Prefix: \`${body.country_prefix}\``,
                        `Carrier: \`${body.carrier !== ""
                            ? body.carrier
                            : "NA"}\``,
                        `Type: \`${body.line_type}\``
                    ])
            });
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
    need: 2,
    code: async function (msg, args) {
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
        });
    }
});

///////////////////////////////
///////////////////////////////
// EVENTS /////////////////////
bot.on("hello", async function () {
    console.log(
        `\n> CMDS:     ${cmds.length}`,
        `\n> SUPPORT:  ${discord.invite}`,
        `\n> LOGIN:    ${bot.token}`
    );
});
///////////////////////////////
bot.on("error", async function () {
    return;
});
///////////////////////////////
bot.on("messageCreate", async function (msg) {
    if (msg.author.id === bot.user.id &&
        msg.embeds.length) {
        setTimeout(() => {
            msg.delete();
        }, 25000);
    };

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
            data = cmds[i];
        } else {
            for (let k = 0; k < cmds[i].aliases.length; k++) {
                if (cmds[i].aliases[k] === cmd) {
                    data = cmds[i];
                };
            };
        };
    };

    if (!data) {
        return;
    } else {
        if (data.need !== 0 && args.length < data.need) {
            return bot.createMessage(
                msg.channel.id,
                "You're missing args."
            );
        } else {
            msg.delete();
            data.code(msg, args);
        };
    };
});

bot.connect();
