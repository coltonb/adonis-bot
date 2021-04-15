const Command = require("../command.js");

class Help extends Command {
  static description = "Shows the help text for a given command.";
  static positionalArgs = [
    {
      name: "command",
      description: "The command to show help text for.",
    },
  ];

  _generateCommandHelpText(commandName, options = {}) {
    const command = this.commandRegistry.getCommand(commandName);
    if (!command) return "Command not recognized.";

    const commandClass = command.constructor;
    let helpText = `\`${commandClass.commandName}`;

    if (commandClass.positionalArgs.length > 0) {
      helpText += ` ${commandClass.positionalArgs
        .map((arg) => arg.name)
        .join(" ")}`;
    }

    const commandArgsList = Object.keys(commandClass.args);
    if (commandArgsList.length > 0) {
      helpText += ` ${commandArgsList.map((arg) => `--${arg}`).join(" ")}`;
    }

    helpText += `\` - ${commandClass.description}`;

    if (options.verbose) {
      if (commandClass.positionalArgs.length > 0) {
        helpText += `\n- ${commandClass.positionalArgs.map(
          (arg) => `\`${arg.name}\` - ${arg.description}`
        )}`;
      }

      if (commandArgsList.length > 0) {
        helpText += `\n- ${commandArgsList.map(
          (arg) => `\`--${arg}\` - ${commandClass.args[arg].description}`
        )}`;
      }
    }

    return helpText;
  }

  async process(message, args, commandLogger) {
    let response = "";

    if (!args.command) {
      const commands = this.commandRegistry.getAllCommands();

      for (let command of commands) {
        response += `\n${this._generateCommandHelpText(command.commandName)}`;
      }
    } else {
      response = this._generateCommandHelpText(args.command, { verbose: true });
    }

    commandLogger.info(`Sending message: ${response}`);
    message.channel.send(response);
    commandLogger.info(`Sent message.`);
  }
}

module.exports = Help;
