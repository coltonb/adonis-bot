const { Command } = require("discord-akairo");

class _Command extends Command {
  exec(message, args) {
    const commandName = this.constructor.name;
    const requestLogger = this.client.logger.child({
      requestId: message.id,
      command: commandName,
    });

    requestLogger.info(
      `Handling ${commandName} for message: ${message.content}`
    );
    const result = this.exec_with_logging(message, args, requestLogger);
    requestLogger.info(
      `Handled ${commandName} for message: ${message.content}`
    );

    return result;
  }

  exec_with_logging(message, args, logger) {
    throw new Error("Not implemented.");
  }
}

module.exports = _Command;
