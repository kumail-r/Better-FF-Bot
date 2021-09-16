require('dotenv').config();
const { default: axios } = require("axios");
const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command.js");
const PREFIX = process.env.BETTER_FF_BOT_PREFIX;
const servers = [
    "Adamantoise",
    "Aegis",
    "Alexander",
    "Anima",
    "Asura",
    "Atomos",
    "Bahamut",
    "Balmung",
    "Behemoth",
    "Belias",
    "Brynhildr",
    "Cactuar",
    "Carbuncle",
    "Cerberus",
    "Chocobo",
    "Coeurl",
    "Diabolos",
    "Durandal",
    "Excalibur",
    "Exodus",
    "Faerie",
    "Famfrit",
    "Fenrir",
    "Garuda",
    "Gilgamesh",
    "Goblin",
    "Gungnir",
    "Hades",
    "Hyperion",
    "Ifrit",
    "Ixion",
    "Jenova",
    "Kujata",
    "Lamia",
    "Leviathan",
    "Lich",
    "Louisoix",
    "Malboro",
    "Mandragora",
    "Masamune",
    "Mateus",
    "Midgardsormr",
    "Moogle",
    "Odin",
    "Omega",
    "Pandaemonium",
    "Phoenix",
    "Ragnarok",
    "Ramuh",
    "Ridill",
    "Sargatanas",
    "Shinryu",
    "Shiva",
    "Siren",
    "Tiamat",
    "Titan",
    "Tonberry",
    "Typhon",
    "Ultima",
    "Ultros",
    "Unicorn",
    "Valefor",
    "Yojimbo",
    "Zalera",
    "Zeromus",
    "Zodiark",
    "Spriggan",
    "Twintania",
    "HongYuHai",
    "ShenYiZhiDi",
    "LaNuoXiYa",
    "HuanYingQunDao",
    "MengYaChi",
    "YuZhouHeYin",
    "WoXianXiRan",
    "ChenXiWangZuo",
    "BaiYinXiang",
    "BaiJinHuanXiang",
    "ShenQuanHen",
    "ChaoFengTing",
    "LvRenZhanQiao",
    "FuXiaoZhiJian",
    "Longchaoshendian",
    "MengYuBaoJing",
    "ZiShuiZhanQiao",
    "YanXia",
    "JingYuZhuangYuan",
    "MoDuNa",
    "HaiMaoChaWu",
    "RouFengHaiWan",
    "HuPoYuan"];
module.exports = new Command({
    name: "player",
    description: "Responds with player data.",
    async run(message, args, client) {
        if (args.length === 0 | args.length !== 3) return message.reply(`Usage: \`${PREFIX}player [server] [first name] [last name]\``);
        args[0] = args[0][0].toUpperCase() + args[0].substr(1).toLowerCase(); // convert server name to XIVAPI formatting (uppercase first letter)        
        if (servers.indexOf(args[0]) === -1) return message.reply(`${args[0]} is an invalid server.`); // if server is invalid
        axios.get(`https://xivapi.com/character/search?name=${args[1]}+${args[2]}&server=${args[0]}`) 
            .then((response) => {
                if (response.data['Pagination']['Results'] === 0) return message.reply(`No users named \`${args[1]} ${args[2]}\` found on \`${args[0]}.\``); // no user found
                const id = response.data['Results'][0]['ID']; // store user id
                axios.get(`https://xivapi.com/character/${id}?data=MIMO`)
                    .then((char) => {
                        console.log(char.data["Character"]);
                        const charDataEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(char.data['Character']['Name'])
                        .setURL(`https://na.finalfantasyxiv.com/lodestone/character/${id}/`)
                        .setDescription(char.data['Character']['Bio'])
                        .setThumbnail(char.data['Character']['Avatar'])
                        .setTimestamp()
                        .setFooter('Bot by kum#9965')
                        .addField("Mounts", `${Object.keys(char.data['Mounts']).length}`, true)
                        .addField("Minions", `${Object.keys(char.data['Minions']).length}`, true);
                        message.reply({ embeds: [charDataEmbed] });
                    })
                    .catch((error) => {
                        console.log("error: " + error);
                    });
            })
            .catch((error) => {
                console.log("error:" + error);
            });
    }
});