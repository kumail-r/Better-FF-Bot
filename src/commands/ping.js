const Command = require("../structures/Command.js");
module.exports = new Command({
    name: "ping",
    description: "Replies with latency.",
    async run(message, args, client) {
        message.reply(`Pong! (${client.ws.ping} ms)`);
    }
});