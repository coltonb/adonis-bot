class Command {
  static dependencies = [];
  static description = "A command.";
  static positionalArgs = [];
  static args = {};

  constructor(commandRegistry) {
    this.commandRegistry = commandRegistry;
  }

  static _parseArgsForCommand(args) {
    for (let index = 0; index < this.positionalArgs.length; index++) {
      const positionalArg = this.positionalArgs[index];
      args[positionalArg.name] = args._[index] || this.positionalArgs.default;
    }

    for (let argName of Object.keys(this.args)) {
      const arg = this.args[argName];
      args[argName] ||= arg.default;
    }
  }

  static get commandName() {
    return this.name.toLowerCase();
  }

  get commandName() {
    return this.constructor.commandName;
  }

  async process(message, args, commandLogger) {
    throw new Error("process not implemented.");
  }

  async execute(message, args, commandLogger) {
    this.constructor._parseArgsForCommand(args);

    return await this.process(
      message,
      args,
      commandLogger.child({ command: this.name })
    );
  }

  loadDependency(dependencyName) {
    if (!this.constructor.dependencies.includes(dependencyName))
      throw new Error(
        `${dependencyName} has not been declared as a dependency.`
      );

    try {
      return this.commandRegistry.getDependency(dependencyName);
    } catch (error) {
      throw new Error(
        `Command ${this.name} requires ${dependencyName} as a dependency, but ${dependencyName} was not added to the CommandRegistry.`
      );
    }
  }
}

module.exports = Command;
