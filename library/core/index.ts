interface IMessage {
  type: "user" | "assistant" | "system";
}

interface ITest {
  initiate(): void;
  evaluate(): void;
}

interface IProctorConfig {
  test: ITest;
}

export class Proctor {
  private test: ITest;

  constructor({ test }: IProctorConfig) {
    this.test = test;
  }
}

interface ITestRunnerConfig {
  tests: ITest[];
}

export class TestRunner {
  tests: ITest[] = [];
  proctor: Proctor;

  constructor({ tests }: ITestRunnerConfig) {
    this.tests = tests;
  }

  registerTest(test: ITest) {
    this.tests.push(test);
  }
}
