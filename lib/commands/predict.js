const Command = require("../command.js");

class Predict extends Command {
  static dependencies = ["textPredictor"];
  static description = "A command that predicts text for a given user.";
  static positionalArgs = [
    {
      name: "user",
      description:
        "The user to predict text for. Leave blank to predict using *all* the data.",
      default: "",
    },
  ];
  static args = {
    prompt: {
      description: "The prompt to begin the predicted text with.",
      default: "",
    },
  };

  async process(message, args, commandLogger) {
    const textPredictor = this.loadDependency("textPredictor");

    commandLogger.info(`Generating message for ${args.user || "all users"}`);
    const response = await textPredictor.predict(args.prompt, args.user);

    commandLogger.info(`Sending message: ${response}`);
    message.channel.send(response);
    commandLogger.info(`Sent message.`);
  }
}

module.exports = Predict;
