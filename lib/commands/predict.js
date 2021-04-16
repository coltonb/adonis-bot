const Command = require("../command.js");

class Predict extends Command {
  constructor() {
    const args = [
      {
        id: "member",
        type: "member",
        description:
          "The user to predict text for. Leave blank to predict using *all* the data.",
        unordered: true,
      },
      {
        id: "prompt",
        description: "The prompt to begin the predicted text with.",
        default: "",
        unordered: true,
      },
    ];

    super(
      "predict",
      {
        aliases: ["predict"],
        description: "A command that predicts text for a given user.",
      },
      args
    );
  }

  async exec_with_logging(message, args, logger) {
    const textPredictor = this.client.textPredictor;

    const memberName = args.member?.displayName;

    logger.info(`Generating message for ${memberName || "all members"}`);
    const response = await textPredictor.predict(args.prompt, memberName);

    logger.info(`Sending message: ${response}`);
    message.channel.send(response);
    logger.info(`Sent message.`);
  }
}

module.exports = Predict;
