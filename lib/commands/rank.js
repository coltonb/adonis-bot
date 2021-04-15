const _ = require("lodash");
const Command = require("../command.js");

class Rank extends Command {
  static description =
    "A command that objectively ranks the channel's members.";
  static positionalArgs = [
    {
      name: "category",
      description: "The category to rank the members by.",
      default: "",
    },
  ];

  async process(message, args, commandLogger) {
    commandLogger.info(`Ranking users by: ${args.prompt}`);
    const response = this.constructor._buildRankResponse(args.prompt, message);

    commandLogger.info(`Sending message: ${response}`);
    message.channel.send(response);
    commandLogger.info(`Sent message.`);
  }

  static _getShuffledListOfMembers(message) {
    return _.shuffle(
      message.channel.members
        .filter((member) => !member.user.bot)
        .map((member) => member.displayName)
    );
  }

  static _buildRankResponse(rankPrompt, message) {
    const members = this._getShuffledListOfMembers(message);
    let response = rankPrompt;
    for (let i = 0; i < members.length; i += 1) {
      response += `\n${i + 1}. ${members[i]}`;
    }
    return response;
  }
}

module.exports = Rank;
