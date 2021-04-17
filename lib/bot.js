require("dotenv").config();
const redis = require("async-redis");
const { AkairoClient, CommandHandler } = require("discord-akairo");
const config = require("./config.js");
const TextPredictor = require("./services/text_predictor.js");

class Bot extends AkairoClient {
  constructor(services = {}) {
    super(
      {
        // Options for Akairo go here.
      },
      {
        // Options for discord.js goes here.
      }
    );

    this.commandHandler = new CommandHandler(this, {
      directory: "./lib/commands/",
      prefix: "?",
    });
    this.commandHandler.loadAll();

    this.services = services;
  }
}

const redisClient = redis.createClient({ url: config.settings.REDIS_URL });

const client = new Bot(
  (services = {
    textPredictor: new TextPredictor(redisClient),
  })
);

client.login(config.settings.BOT_TOKEN);
