const _ = require("lodash");
const logger = require("../logger.js");

class TextPredictor {
  constructor(redis) {
    this.redis = redis;
  }

  async chooseStartingWord(identifier) {
    logger.debug(`Retrieving start word from Redis ...`);
    let startingWord = await this.redis.srandmember(
      `text-predictor:${identifier}:dictionary`
    );
    logger.debug(`Retrieved starting word from Redis: ${startingWord}`);

    if (startingWord === null) {
      logger.warn("No starting word found.");
      startingWord = "No prediction data found.";
    }

    return startingWord;
  }

  async chooseNextWord(currentWord, identifier) {
    logger.debug(`Retrieving next word from Redis for ${currentWord} ...`);

    let key = `text-predictor:${identifier}:words:${currentWord}`;
    const nextWordLength = await this.redis.llen(key);

    if (nextWordLength == 0) return null;

    const nextWordIndex = _.random(0, nextWordLength - 1);
    const nextWord = await this.redis.lindex(key, nextWordIndex);

    logger.debug(
      `Retrieved next word ${nextWord} from Redis for ${currentWord}`
    );

    return nextWord;
  }

  async predict(prompt = "", identifier = "") {
    logger.debug(`Building message from prompt: ${prompt}`);

    const messageList = prompt.length == 0 ? [] : prompt.split(" ");
    if (messageList.length === 0) {
      messageList.push(await this.chooseStartingWord(identifier));
    }
    let nextWord = _.last(messageList);

    for (let i = 0; messageList.length < 30; i++) {
      if (i > 0) messageList.push(nextWord);
      nextWord = await this.chooseNextWord(nextWord, identifier);
      if (nextWord == null) break;
    }

    const message = messageList.join(" ");
    logger.debug(`Built message: ${message}`);
    return message;
  }

  async ingestMessage(message, identifier = "") {
    logger.debug(`Ingesting message: ${message} for ID ${identifier}`);
    const promises = [];

    const words = message.split(/\s/).filter((word) => word.length !== 0);
    for (let i = 0; i < words.length - 1; i += 1) {
      promises.push(
        this.redis.sadd(`text-predictor:${identifier}:dictionary`, words[i])
      );
      promises.push(
        this.redis.lpush(
          `text-predictor:${identifier}:words:${words[i]}`,
          words[i + 1]
        )
      );
    }

    await Promise.all(promises);
  }
}

module.exports = TextPredictor;
