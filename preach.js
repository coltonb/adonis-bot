const _ = require("lodash");
const logger = require("./logger.js");

class Preach {
  constructor(redis) {
    this.redis = redis;
  }

  async chooseStartingWord() {
    logger.debug(`Retrieving start word from Redis ...`);
    const startingWord = await this.redis.srandmember("preach:dictionary");
    logger.debug(`Retrieved starting word from Redis: ${startingWord}`);
    return startingWord;
  }

  async chooseNextWord(currentWord) {
    logger.debug(`Retrieving next word from Redis for ${currentWord} ...`);

    let key = `preach:words:${currentWord}`;
    const nextWordLength = await this.redis.llen(key);

    if (nextWordLength == 0) return null;

    const nextWordIndex = _.random(0, nextWordLength - 1);
    const nextWord = await this.redis.lindex(key, nextWordIndex);

    logger.debug(
      `Retrieved next word ${nextWord} from Redis for ${currentWord}`
    );

    return nextWord;
  }

  async generateMessage(prompt = "") {
    logger.info(`Building message from prompt: ${prompt}`);

    const messageList = prompt.length == 0 ? [] : prompt.split(" ");
    if (messageList.length === 0) {
      messageList.push(await this.chooseStartingWord());
    }
    let nextWord = _.last(messageList);

    for (let i = 0; messageList.length < 30; i++) {
      if (i > 0) messageList.push(nextWord);
      nextWord = await this.chooseNextWord(nextWord);
      if (nextWord == null) break;
    }

    const message = messageList.join(" ");
    logger.info(`Built message: ${message}`);
    return message;
  }

  ingestMessage(message) {
    logger.info(`Ingesting message: ${message}`);

    const words = message.content
      .split(/\s/)
      .filter((word) => word.length !== 0);
    for (let i = 0; i < words.length - 1; i += 1) {
      this.redis.sadd("preach:dictionary", words[i]);
      this.redis.lpush(`preach:words:${words[i]}`, words[i + 1]);
    }
  }
}

module.exports = Preach;
