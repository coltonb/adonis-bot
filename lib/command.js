const commandRegistry = require("./command_registry.js");

class Command {
  static dependencies = [];

  static async process(message, args, commandLogger) {
    throw new Error("process not implemented.");
  }

  static async execute(message, args, commandLogger) {
    return await this.process(
      message,
      args,
      commandLogger.child({ command: this.name })
    );
  }

  static loadDependency(dependencyName) {
    if (!this.dependencies.includes(dependencyName))
      throw new Error(
        `${dependencyName} has not been declared as a dependency.`
      );

    try {
      return commandRegistry.getDependency(dependencyName);
    } catch (error) {
      throw new Error(
        `Command ${this.name} requires ${dependencyName} as a dependency, but dependency was not found in the CommandRegistry.`
      );
    }
  }
}

module.exports = Command;
