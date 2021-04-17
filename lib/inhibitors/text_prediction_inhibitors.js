const { Inhibitor } = require("discord-akairo");
const logger = require("../logger.js");

class TextPredictionInhibitor extends Inhibitor {
  constructor() {
    super("textPredictionInhibitor", {
      type: "all",
    });
  }

  exec(message) {
    const textPredictor = this.client.services.textPredictor;

    textPredictor.ingestMessage(message.content);
    textPredictor.ingestMessage(message.content, message.member.displayName);
  }
}

module.exports = TextPredictionInhibitor;
