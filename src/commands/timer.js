const PREFIX = process.env.BETTER_FF_BOT_PREFIX;
const Command = require("../structures/Command.js");
const ms = require("ms");
module.exports = new Command({
    name: "timer",
    description: "Reminds the user when time is up with optional message.",
    async run(message, args, client) {
        if (args.length === 0) return message.reply(`Usage: \`${PREFIX}timer [time] [optional message]\``);
        
        var timer = args[0];
        var reminderMessage = args.join(" ").substring(`${PREFIX}${args[0]}`.length);
        
        // late night hacky code. not proud of it, but it seems to work so I won't touch it for now.
        if (isNaN(ms(args[0]))){
            if (args.length === 1) return message.reply(`Usage: \`${PREFIX}timer [time] [optional message]\`.`);
            if (isNaN(ms(args[0] + " " + args[1])))return message.reply(`Usage: \`${PREFIX}timer [time] [optional message]\`.`);
            // this means that args[0] + args[1] is a valid time
            timer = args[0] + " " + args[1];    
            reminderMessage = args.join(" ").substring(`${PREFIX}${args[0]}${args[1]} `.length);
        }
        else{
            if (!isNaN(ms(args[0] + " " + args[1]))){
                timer = args[0] + " " + args[1];    
                reminderMessage = args.join(" ").substring(`${PREFIX}${args[0]}${args[1]} `.length); 
            }
        }

        message.reply(`Okay, I will remind you in ${ms(ms(timer), {long:true})}.`);
        setTimeout(function(){
            if (message.deleted) return message.channel.send(`<@${message.author.id}>, here's your timer message:\n` + reminderMessage);
            message.reply("Timer: " + reminderMessage);
        }, ms(timer));
        return;
    }
});