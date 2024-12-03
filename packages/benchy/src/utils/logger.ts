type LoggerConfig = {
  name: string;
};

export default class Logger {
  private name: string;
  constructor({ name }: LoggerConfig) {
    this.name = name;
  }

  private appends() {
    return `${Date.now()} [${this.name}]: `;
  }

  public log(...args: any[]) {
    console.log(this.appends(), ...args);
  }

  public info(...args: any[]) {
    console.info(this.appends(), ...args);
  }

  public error(...args: any[]) {
    console.error(this.appends(), ...args);
  }

  public warn(...args: any[]) {
    console.warn(this.appends(), ...args);
  }
}
