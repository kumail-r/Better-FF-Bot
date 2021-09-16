require('dotenv').config();
console.clear();

const Client = require("./structures/Client.js")

const client = new Client()

const fs = require("fs");
fs.readdirSync("./src/commands").filter(file => file.endsWith(".js")).forEach(file => {
    /**
     * @type {Command}
     */
    const command = require(`./commands/${file}`);
    console.log(`Command ${command.name} loaded`);
    client.commands.set(command.name, command)
});
const PREFIX = process.env.BETTER_FF_BOT_PREFIX;

console.log(process.env.BETTER_FF_BOT_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) =>{
    if (message.author.bot) return; // if bot message, return
    console.log(message.content); // print created message to log
    if (!message.content.startsWith(PREFIX)) return; // if does not start with the chosen prefix, return
    
    const [command_name, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/); // save command into command variable and arguments into args array
    const command = client.commands.find(cmd=>cmd.name == command_name);
    if (!command) return message.reply(`\`${PREFIX}${command_name}\` is not a valid command. Use \`${PREFIX}help\` for more information.`);
    command.run(message, args, client);
});


client.login(process.env.BETTER_FF_BOT_TOKEN);