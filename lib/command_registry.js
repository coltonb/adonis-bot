const logger = require("./logger.js");
const parse = require("yargs-parser");

class CommandRegistry {
  constructor() {
    this._dependencies = {};
    this._commands = {};
  }

  getDependency(dependencyName) {
    const dependency = this._dependencies[dependencyName];
    if (!dependency) throw new Error(`Dependency ${dependencyName} not found.`);
    return dependency;
  }

  addDependency(dependencyName, dependency) {
    if (this._dependencies[dependencyName])
      throw new Error("Depedency already exists.");
    this._dependencies[dependencyName] = dependency;
  }

  registerCommand(command) {
    const commandName = command.commandName;
    if (this.getCommand(commandName))
      throw new Error(`Command ${commandName} already registered.`);
    this._commands[commandName] = new command(this);
  }

  getCommand(commandName) {
    return this._commands[commandName];
  }

  getAllCommands() {
    return Object.values(this._commands);
  }

  async runCommand(commandName, args, message, commandLogger) {
    const command = this.getCommand(commandName);
    if (!command) {
      commandLogger.warn(`Unhandled command: ${commandName}`);
      return;
    }
    return await command.execute(message, args, commandLogger);
  }

  static messageIsHumanCommand(message) {
    return message.content[0] == "/" && !message.author.bot;
  }

  async handleMessage(message, commandLogger) {
    if (!this.constructor.messageIsHumanCommand(message)) return;

    commandLogger.info(`Handling message: ${message}`);

    const args = parse(message.content.substr(1));
    const commandName = args._.shift();

    await this.runCommand(commandName, args, message, commandLogger);

    commandLogger.info(`Handled message: ${message}`);
  }
}

module.exports = CommandRegistry;
