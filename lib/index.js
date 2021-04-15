require("dotenv").config();
const redis = require("async-redis");
const Discord = require("discord.js");

const commands = require("./commands");
const CommandRegistry = require("./command_registry.js");
const TextPredictor = require("./text_predictor.js");
const logger = require("./logger.js");

const bot = new Discord.Client();
const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });
const textPredictor = new TextPredictor(redisClient);

const commandRegistry = new CommandRegistry();
for (command of commands) commandRegistry.registerCommand(command);
commandRegistry.addDependency("textPredictor", textPredictor);

bot.on("ready", function () {
  logger.info("Bot ready.");
});

bot.on("message", async (message) => {
  const commandLogger = logger.child({ requestId: message.id });

  textPredictor.ingestMessage(message);
  textPredictor.ingestMessage(message, message.member.displayName);
  commandRegistry.handleMessage(message, commandLogger);
});

bot.login(process.env.BOT_TOKEN);
