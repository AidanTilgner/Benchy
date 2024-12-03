import { InterfaceConfig, Outgoing } from "./interface";
import Logger from "./utils/logger";

class Library {
  private _domains: Domain[];

  constructor() {
    this._domains = [];
  }

  get domains() {
    return this._domains;
  }

  registerDomain(domain: Domain) {
    this._domains.push(domain);
  }

  get lastDomain() {
    return this.domains.at(-1);
  }
}

type Context = {
  library: Library;
  logger: Logger;
};

const context: Context = {
  library: new Library(),
  logger: new Logger({ name: "Benchy Core" }),
};

type IScoreConfig = {
  type: "boolean" | "percentage";
  value: number;
  feedback?: string;
  metrics?: Record<string, any>;
  error?: string;
};
export class Score {
  type: IScoreConfig["type"];
  value: IScoreConfig["value"];
  feedback?: IScoreConfig["feedback"];
  metrics?: IScoreConfig["metrics"];
  error?: IScoreConfig["error"];

  constructor({ type, value, metrics, error, feedback }: IScoreConfig) {
    this.type = type;
    this.value = value;
    this.metrics = metrics;
    this.error = error;
    this.feedback = feedback;
  }
}

export type Message = {
  content: string;
};

export interface Interaction {
  question: Message;
  response: Message;
  timestamp: string;
}

export interface Results {
  interactionLog: Interaction[];
  finalAnswer: string;
}

type ITestConfig = {
  name: string;
  description?: string;
  initialize: () => void;
  onPrompt: (message: Message) => Promise<Message> | Message;
  evaluate: (results: Results) => Promise<Score> | Score;
};
export class Test {
  name: string;
  description?: string;
  initialize: () => void;
  onPrompt: (message: Message) => Promise<Message> | Message;
  evaluate: (results: Results) => Promise<Score> | Score;

  constructor({
    name,
    description,
    initialize,
    onPrompt,
    evaluate,
  }: ITestConfig) {
    this.name = name;
    this.description = description;
    this.initialize = initialize;
    this.onPrompt = onPrompt;
    this.evaluate = evaluate;
  }

  public describe(description: string) {
    this.description = description;
    return this;
  }
}

type IDomainConfig = {
  name: string;
  description?: string;
};
export class Domain {
  name: string;
  description?: string;
  tests: Test[] = [];

  constructor({ name, description }: IDomainConfig) {
    this.name = name;
    this.description = description;
  }

  public describe(description: string) {
    this.description = description;
    return this;
  }

  public registerTest(test: Test) {
    this.tests.push(test);
  }
}

const checkContextInitialized = () => {
  try {
    if (!context) {
      throw new Error("Context not initialized.");
    }
    if (!context.library) {
      throw new Error("No library initialized in context.");
    }
    return true;
  } catch (err) {
    console.error("Error checking context initialized.");
    return false;
  }
};

export function domain(name: string, cb?: () => void) {
  try {
    checkContextInitialized();
    const domain = new Domain({
      name,
    });
    context.library.registerDomain(domain);
    if (cb) {
      cb();
    }
    return domain;
  } catch (err) {
    throw new Error(`Error registering domain "${name}": ${err}`);
  }
}

type TestFunctionConfig = Omit<ITestConfig, "name" | "description">;

export function test(name: string, config: TestFunctionConfig) {
  try {
    checkContextInitialized();
    const test = new Test({
      name,
      ...config,
    });
    if (!context.library.lastDomain) {
      throw new Error(
        "A domain must be registered before a test can be assigned to it.",
      );
    }
    context.library.lastDomain.registerTest(test);
    return test;
  } catch (err) {
    throw new Error(`Error registering test "${name}": ${err}`);
  }
}

interface Report {
  name: string;
  results: Record<
    string,
    Record<
      string,
      {
        results: Results;
        score: Score;
      }
    >
  >;
}

type IReportConfig<C> = {
  name: string;
  outDir: string;
  interface: (properties: InterfaceConfig<C>) => Promise<Outgoing> | Outgoing;
};

export function report<InterfaceConfig>({
  name,
  outDir,
}: IReportConfig<InterfaceConfig>) {
  const lib = context.library;

  console.info(`Running report ${name}...`);

  const checkDuplicates = () => {
    const names = new Set();
    for (const d of lib.domains) {
      if (names.has(d.name)) {
        throw new Error(
          `Multiple domains with name "${d.name}" found. Duplicate domain names are not allowed.`,
        );
      }
      const testNames = new Set();
      for (const t of d.tests) {
        if (testNames.has(t.name)) {
          throw new Error(
            `Multiple tests with name "${t.name}" found under the same domain. Duplicate test names are not allowed under the same domain.`,
          );
        }
      }
    }
  };
  checkDuplicates();

  const report: Report = { name: name, results: {} };

  lib.domains.forEach((d) => {
    console.info(`--- ${d.name} ---`);
    d.tests.forEach((t) => {
      console.log("    Test: ", t.name);
    });
  });
}
