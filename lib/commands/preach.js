const Command = require("../command.js");

class Preach extends Command {
  static dependencies = ["textPredictor"];

  static async process(message, args, commandLogger) {
    const textPredictor = this.loadDependency("textPredictor");
    const prompt = args.join(" ");

    commandLogger.info("Generating message...");
    const response = await textPredictor.predict(prompt);
    commandLogger.info(`Sending message: ${response}`);

    message.channel.send(response);

    commandLogger.info(`Sent message.`);
  }
}

module.exports = Preach;
