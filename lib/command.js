const { Command } = require("discord-akairo");
const logger = require("./logger.js");

class _Command extends Command {
  constructor(id, options, args = {}) {
    options.args = args;
    super(id, options);
    this.args = args;
  }

  async exec(message, args) {
    const commandName = this.constructor.name;
    const requestLogger = logger.child({
      request: {
        id: message.id,
        content: message.content,
      },
      command: commandName,
    });

    requestLogger.info(`Handling command ${commandName}`);
    const result = await this.exec_with_logging(message, args, requestLogger);
    requestLogger.info(`Handled command ${commandName}`);

    return result;
  }

  async exec_with_logging(message, args, logger) {
    throw new Error("Not implemented.");
  }
}

module.exports = _Command;
