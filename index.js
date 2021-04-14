require('dotenv').config()
const _ = require('lodash');

const Discord = require('discord.js');
const bot = new Discord.Client();

const MESSAGES = {};

function generateMessage() {
  const message = [];

  const startingWord = _.sample(_.keys(MESSAGES)) || "I have no data to preach ):";
  let nextWord = startingWord;

  do {
    message.push(nextWord);
    nextWord = _.sample(MESSAGES[nextWord]);
  } while (message.length < 30 && nextWord !== null)

  return message.join(" ");
}

function ingestMessage(message) {
  words = message.content.split(" ");

  for (let i = 0; i < words.length - 1; i += 1) {
    (MESSAGES[words[i]] || (MESSAGES[words[i]] = [])).push(words[i + 1])
  }
}

bot.on('ready', function () {
  console.log("ready")
})

bot.on('message', message => {
  ingestMessage(message)

  if (message.content === '/preach') {
    message.channel.send(generateMessage(MESSAGES))
  }
})

bot.login(process.env.BOT_TOKEN)