const { default: axios } = require("axios");
const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command.js");
const PREFIX = process.env.BETTER_FF_BOT_PREFIX;
const dcs = ["Aether", "Chaos", "Crystal", "Elemental", "Gaia", "Korea", "Light", "Mana", "Primal", "猫小胖", "莫古力", "陆行鸟"];

module.exports = new Command({
    name: "mb",
    description: "View marketboard data using Universalis API.",
    async run(message, args, client) {
        if (args.length === 0 | args.length === 1) return message.reply(`Usage: \`${PREFIX}mb [data center] [item name]\``); // if no args provided
        args[0] = args[0][0].toUpperCase() + args[0].substr(1).toLowerCase();
        if (dcs.indexOf(args[0]) === -1) return message.reply(`${args[0]} is an invalid data center.`); // if dc is invalid
        const searchTerm = args.join("+").substring(args[0].length + 1); // the item the user is trying to purchase
        
        axios.get(`https://xivapi.com/search`, {
            data: `{"indexes":"item","columns":"ID,Name,Icon","body":{"query":{"bool":{"must":[{"wildcard":{"NameCombined_en":"*${searchTerm.replaceAll("+", " ")}*"}}]}},"from":0,"size":100}}`
        })
        .then((response) => {
            //console.log(response.data);
            if (response.data['Pagination']['ResultsTotal'] === 0) return message.reply("No items found.");

            // console.log("name: " + response.data['Results'][0]["Name"]); // got info!!
            // console.log("id: " + response.data['Results'][0]["ID"]);

            axios.get(`https://universalis.app/api/${args[0].toLowerCase()}/${response.data['Results'][0]["ID"]}?listings=10`)
            .then((uvResponse) => {
                if (Object.keys(uvResponse.data['listings']).length === 0) return message.reply("No listings found.");
                const priceDataEmbed = new MessageEmbed()
                    .setTitle(`${response.data['Results'][0]["Name"]} listings on ${args[0]}`)
                    .setFooter('Using Universalis API')
                    .setColor('#873B8D')
                    .setURL(`https://universalis.app/market/${response.data['Results'][0]["ID"]}`)
                    .setThumbnail(`https://universalis-ffxiv.github.io/universalis-assets/icon2x/${response.data['Results'][0]["ID"]}.png`)
                    .setDescription(`**Minimum price**: ${uvResponse.data['minPrice']}\n**Minimum price (HQ)**: ${uvResponse.data['minPriceHQ']}\n` + 
                    `**Average Price (NQ)**: ${uvResponse.data['averagePriceNQ']}\n**Average Price (HQ)**: ${uvResponse.data['averagePriceHQ']}\n`);
                    
                let priceString = "";
                let worldString = "";
                let hqString = "";
                for (let i = 0; i < Object.keys(uvResponse.data['listings']).length; i++){
                    //console.log(uvResponse.data['listings'][i]); // debug
                    priceString += `${uvResponse.data['listings'][i]['pricePerUnit']}g x ${uvResponse.data['listings'][i]['quantity']}`;
                    worldString += `${uvResponse.data['listings'][i]['worldName']}`;
                    hqString += uvResponse.data['listings'][i]['hq'] ? "HQ" : "NQ";
                    if (i != Object.keys(uvResponse.data['listings']).length - 1){ // add new line if not the last one!
                        priceString = priceString + "\n";
                        worldString = worldString + "\n";
                        hqString += "\n";
                    }
                }
                priceDataEmbed.addField("Price/Quantity", priceString, true)
                    .addField("Quality", hqString, true)
                    .addField("Server", worldString, true);
                message.reply({ embeds: [priceDataEmbed] });
            })
            .catch((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            console.log(error);
            return message.reply("There was a problem reaching XIVAPI. Please try again later.");
        });
    }
});
