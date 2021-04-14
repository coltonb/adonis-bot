const _ = require("lodash");
const Command = require("../command.js");

class Rank extends Command {
  static async process(message, args, commandLogger) {
    const prompt = args.join(" ");

    commandLogger.info(`Ranking users by ${prompt}`);
    const members = _.shuffle(
      message.channel.members
        .filter((member) => !member.user.bot)
        .map((member) => member.displayName)
    );
    let response = prompt;

    for (let i = 0; i < members.length; i += 1) {
      response += `\n${i + 1}. ${members[i]}`;
    }

    commandLogger.info(`Sending message: ${response}`);
    message.channel.send(response);
    commandLogger.info(`Sent message.`);
  }
}

module.exports = Rank;
