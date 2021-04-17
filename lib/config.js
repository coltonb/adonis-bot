class Setting {
  constructor(name, defaultValue) {
    this.name = name;
    this.defaultValue = defaultValue;
  }
}

class Config {
  static SETTINGS = [
    new Setting("BOT_TOKEN"),
    new Setting("REDIS_URL"),
    new Setting("LOGGING_LEVEL", "debug"),
  ];

  constructor() {
    this.settings = {};

    for (const setting of this.constructor.SETTINGS) {
      const value = process.env[setting.name] || setting.defaultValue;

      if (value === undefined) {
        throw new Error(`Missing required configuration: ${setting.name}`);
      }

      this.settings[setting.name] = value;
    }
  }
}

module.exports = new Config();
