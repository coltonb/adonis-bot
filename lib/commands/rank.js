const _ = require("lodash");
const Command = require("../command.js");

class Rank extends Command {
  static _get_shuffled_list_of_members(message) {
    return _.shuffle(
      message.channel.members
        .filter((member) => !member.user.bot)
        .map((member) => member.displayName)
    );
  }

  static _build_rank_response(rankPrompt, message) {
    const members = this._get_shuffled_list_of_members(message);
    let response = rankPrompt;
    for (let i = 0; i < members.length; i += 1) {
      response += `\n${i + 1}. ${members[i]}`;
    }
    return response;
  }

  static async process(message, args, commandLogger) {
    const prompt = args._.join(" ");

    commandLogger.info(`Ranking users by: ${prompt}`);
    const response = this._build_rank_response(prompt, message);

    commandLogger.info(`Sending message: ${response}`);
    message.channel.send(response);
    commandLogger.info(`Sent message.`);
  }
}

module.exports = Rank;
