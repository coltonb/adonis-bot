require("dotenv").config();
const redis = require("async-redis");
const Discord = require("discord.js");

const commands = require("./commands");
const commandRegistry = require("./command_registry.js");
for (command of commands) commandRegistry.registerCommand(command);

const logger = require("./logger.js");
const TextPredictor = require("./text_predictor.js");

const bot = new Discord.Client();
const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });
const textPredictor = new TextPredictor(redisClient);
commandRegistry.addDependency("textPredictor", textPredictor);

bot.on("ready", function () {
  logger.info("Bot ready.");
});

bot.on("message", async (message) => {
  const commandLogger = logger.child({ requestId: message.id });
  textPredictor.ingestMessage(message);
  commandRegistry.handleMessage(message, commandLogger);
});

bot.login(process.env.BOT_TOKEN);
