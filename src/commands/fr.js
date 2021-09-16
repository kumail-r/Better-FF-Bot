const { default: axios } = require("axios");
const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command.js");
// default values are from week 189 (https://www.reddit.com/r/ffxiv/comments/plihnk/fashion_report_full_details_for_week_of_9102021/)
var lastPosted = 1631270226; // default date
var imageLink = "https://i.imgur.com/Os34Kwx.png"; // default link
var lastWeek = "189"; // default week
module.exports = new Command({
    name: "fr",
    description: "Posts most recent fashion report full details.",
    async run(message, args, client) {
        const frEmbed = new MessageEmbed().setTitle("Fashion report values for week " + lastWeek).setImage(imageLink);
        const today = new Date();
        if ((today - lastPosted * 1000) / 1000 / 60 / 60 / 24 < 6){ // if the post was from within 6 days ago, then don't bother updating 
            console.log("used old fr value");
            return message.reply({ embeds: [frEmbed] });
        }
        console.log("updating fr: ");
        axios.get('https://www.reddit.com/user/kaiyoko/submitted.json')
        .then((response) => {
            for (let i = 0; i < 25; i++){
                var current = response.data['data']['children'][i]['data'];
                //console.log(current)
                if (current['title'].indexOf("Fashion Report - Full Details - For Week") !== -1){
                    if (current['created_utc'] === lastPosted){
                        console.log("couldn't find newer post to update to");
                        return message.reply({ embeds: [frEmbed] });
                    }
                    imageLink = current['url'];
                    lastPosted = current['created_utc'];
                    lastWeek = current['title'].substring(current['title'].indexOf("(Week") + 6, current['title'].indexOf("(Week") + 9);
                    console.log("successfully updated (found new post!)");
                    frEmbed.setTitle("Fashion report values for week " + lastWeek);
                    frEmbed.setImage(imageLink);
                    return message.reply({ embeds: [frEmbed] });
                }
            }
        })
        .catch((error) => {
            console.log(error);
            return message.reply("Unknown error, sorry!");
        });
    }
});