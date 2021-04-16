const { Command } = require("discord-akairo");

class _Command extends Command {
  constructor(id, options, args = {}) {
    options.args = args;
    super(id, options);
    this.args = args;
  }

  async exec(message, args) {
    const commandName = this.constructor.name;
    const requestLogger = this.client.logger.child({
      requestId: message.id,
      command: commandName,
    });

    requestLogger.info(
      `Handling command ${commandName} for message: ${message.content}`
    );
    const result = await this.exec_with_logging(message, args, requestLogger);
    requestLogger.info(
      `Handled command ${commandName} for message: ${message.content}`
    );

    return result;
  }

  async exec_with_logging(message, args, logger) {
    throw new Error("Not implemented.");
  }
}

module.exports = _Command;
