require("dotenv").config();
const redis = require("async-redis");
const { AkairoClient, CommandHandler } = require("discord-akairo");
const TextPredictor = require("./text_predictor.js");

const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });
const logger = require("./logger.js");

class MyClient extends AkairoClient {
  constructor() {
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

    this.textPredictor = new TextPredictor(redisClient);
    this.logger = logger;
  }
}

const client = new MyClient();
client.login(process.env.BOT_TOKEN);
