const { MessageEmbed } = require("discord.js");
const Command = require("../structures/Command.js");
const PREFIX = process.env.BETTER_FF_BOT_PREFIX;
module.exports = new Command({
    name: "help",
    description: "Provides information to the user regarding the bot and its commands.",
    async run(message, args, client) {
        const helpEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help Menu')
            .setDescription('This is the help menu where you can get a list of all the commands that can be performed using the bot as well as what they do.')
            .setTimestamp()
            .setFooter('Bot by kum#9965');
        
        names = Array.from(client.commands);
        
        for (i in names){
            const temp = names[i][1];
            helpEmbed.addField(`\`${PREFIX}`+temp['name'] + "`", temp['description'], true);
        }
        message.reply({ embeds: [helpEmbed] });
    }
});