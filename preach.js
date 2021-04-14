const _ = require("lodash");
const logger = require("./logger.js");

class Preach {
  constructor(redis) {
    this.redis = redis;
  }

  async chooseStartingWord() {
    logger.info(`Retrieving start word from Redis ...`);
    const startingWord = await this.redis.srandmember("preach:starting-words");
    logger.info(`Retrieved starting word from Redis: ${startingWord}`);
    return startingWord;
  }

  async chooseNextWord(currentWord) {
    logger.info(`Retrieving next word from Redis for ${currentWord} ...`);

    let key = `preach:words:${currentWord}`;
    const nextWordLength = await this.redis.llen(key);

    if (nextWordLength == 0) return null;

    const nextWordIndex = _.random(0, nextWordLength - 1);
    const nextWord = await this.redis.lindex(key, nextWordIndex);

    logger.info(
      `Retrieved next word ${nextWord} from Redis for ${currentWord}`
    );

    return nextWord;
  }

  _getStartingWordFromPrompt(prompt) {
    return prompt.pop();
  }

  async generateMessage(prompt = []) {
    logger.info(`Building message from prompt: ${prompt}`);

    if (prompt.length === 0) prompt = [await this.chooseStartingWord()];

    const messageList = _.clone(prompt);
    let nextWord = this._getStartingWordFromPrompt(prompt);

    while (messageList.length < 30 && nextWord !== null) {
      nextWord = await this.chooseNextWord(nextWord);
      messageList.push(nextWord);
    }

    const message = messageList.join(" ");

    logger.info(`Built message: ${message}`);

    return message;
  }

  ingestMessage(message) {
    logger.info(`Ingesting message: ${message}`);

    const words = message.content.split(" ");
    for (let i = 0; i < words.length - 1; i += 1) {
      if (i == 0) this.redis.sadd("preach:starting-words", words[i]);
      this.redis.lpush(`preach:words:${words[i]}`, words[i + 1]);
    }
  }
}

module.exports = Preach;
