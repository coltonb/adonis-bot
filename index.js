require("dotenv").config();
const redis = require("async-redis");
const Discord = require("discord.js");
const Preach = require("./preach.js");
const logger = require("./logger.js");

const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });
const bot = new Discord.Client();

preacher = new Preach(redisClient);

function messageIsHumanCommand(message) {
  return message.content[0] == "/" && !message.author.bot;
}

bot.on("ready", function () {
  logger.info("Bot ready.");
});

bot.on("message", async (message) => {
  preacher.ingestMessage(message);
  if (messageIsHumanCommand(message)) {
    const tokens = message.content.substr(1).split(" ");
    const command = tokens[0];
    const args = tokens.slice(1);
    const argsString = args.join(" ");

    if (command === "preach") {
      message.channel.send(await preacher.generateMessage(argsString));
    }
  }
});

bot.login(process.env.BOT_TOKEN);
