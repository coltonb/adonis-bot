const _ = require("lodash");
const Command = require("../command.js");

class Rank extends Command {
  constructor() {
    const args = [
      {
        id: "category",
        description: "The category to rank the members by.",
        default: "",
      },
    ];

    super(
      "rank",
      {
        aliases: ["rank"],
        description: "A command that objectively ranks the channel's members.",
      },
      args
    );
  }

  exec_with_logging(message, args, logger) {
    logger.info(`Ranking users by: ${args.category}`);
    const response = this.constructor._buildRankResponse(
      args.category,
      message
    );

    logger.info(`Sending message: ${response}`);
    message.channel.send(response);
    logger.info(`Sent message.`);
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
