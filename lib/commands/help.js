const { Command } = require("discord-akairo");

class Help extends Command {
  constructor() {
    const args = [
      {
        id: "command",
        type: "commandAlias",
        description: "The command to show help text for.",
      },
    ];

    super("help", {
      aliases: ["help"],
      description: "Shows the help text for a given command.",
      args: args,
    });

    this.args = args;
  }

  _generateCommandHelpText(command, options = {}) {
    let helpText = `\`${command.id}`;

    if (command.args.length > 0) {
      helpText += ` ${command.args.map((arg) => arg.id).join(" ")}`;
    }

    helpText += `\` - ${command.description}`;

    if (options.verbose) {
      for (const arg of command.args) {
        helpText += `\n- \`${arg.id}\``;
        helpText += `\n  - description: ${arg.description}`;
        helpText += `\n  - type: \`${arg.type || "string"}\``;
      }
    }

    return helpText;
  }

  async exec(message, args) {
    let response = "";

    if (!args.command) {
      const commands = this.client.commandHandler.modules;

      for (const [id, command] of commands) {
        response += `\n${this._generateCommandHelpText(command)}`;
      }
    } else {
      response = this._generateCommandHelpText(args.command, {
        verbose: true,
      });
    }

    this.client.logger.info(`Sending message: ${response}`);
    message.channel.send(response);
    this.client.logger.info(`Sent message.`);
  }
}

module.exports = Help;
