require("dotenv").config();
const redis = require("async-redis");
const _ = require("lodash");
const Discord = require("discord.js");
const winston = require("winston");

const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });
const bot = new Discord.Client();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const MESSAGES = {};

async function chooseStartingWord() {
  return await redisClient.srandmember("preach:starting-words");
}

async function chooseWord(currentWord) {
  let key = `preach:words:${currentWord}`;
  const nextWordLength = await redisClient.llen(key);

  if (nextWordLength == 0) return null;

  const nextWordIndex = _.random(0, nextWordLength - 1);
  return await redisClient.lindex(key, nextWordIndex);
}

async function generateMessage() {
  const message = [];

  const startingWord = await chooseStartingWord();
  let nextWord = startingWord;

  do {
    message.push(nextWord);
    nextWord = await chooseWord(nextWord);
  } while (message.length < 30 && nextWord !== null);

  return message.join(" ");
}

function ingestMessage(message) {
  logger.info(`Ingesting message: ${message}`);

  words = message.content.split(" ");
  for (let i = 0; i < words.length - 1; i += 1) {
    if (i == 0) redisClient.sadd("preach:starting-words", words[i]);
    redisClient.lpush(`preach:words:${words[i]}`, words[i + 1]);
  }
}

bot.on("ready", function () {
  console.log("ready");
});

bot.on("message", async (message) => {
  ingestMessage(message);

  if (message.content === "/preach") {
    const messageToSend = await generateMessage(MESSAGES);
    message.channel.send(messageToSend);
  }
});

bot.login(process.env.BOT_TOKEN);
