const { Command } = require("discord-akairo");

class _Command extends Command {
  exec(message, args) {
    return this.exec_with_logging(
      message,
      args,
      this.client.logger.child({
        requestId: message.id,
        command: this.constructor.name,
      })
    );
  }

  exec_with_logging(message, args, logger) {
    throw new Error("Not implemented.");
  }
}

module.exports = _Command;
