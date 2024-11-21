export interface Interaction {
  question: string;
  response: string;
  timestamp: string;
}

export interface Score {
  type: "boolean" | "percentage";
  value: number;
  metrics: Record<string, any>;
  error?: string;
}

export interface Test {
  name: string;
  description: string;
  script: string;
  handleMessage: (query: string, test: Test) => Promise<string>;
  evaluate: (answer: string, interactionLog: Interaction[]) => Score;
}

export interface Domain {
  name: string;
  purpose: string;
  metadata: Record<string, any>;
  tests: Test[];
}

export type ProctorConfiguration = {
  domains: Domain[];
};

export class Proctor {
  private domains: Domain[] = [];
  private totalTests: number = 0;
  private currentTest: Test | undefined = undefined;

  constructor({ domains }: ProctorConfiguration | undefined = { domains: [] }) {
    this.domains = domains;
  }

  public registerDomain(domain: Domain) {
    this.domains.push(domain);
  }

  public run() {
    const totalTests = this.domains.reduce(
      (acc, domain) => acc + domain.tests.length,
      0,
    );
    this.totalTests = totalTests;

    this.domains.forEach((domain) => {
      this.runDomain(domain);
    });
  }

  private runDomain(domain: Domain) {
    domain.tests.forEach((test) => {
      this.runTest(test);
    });
  }

  private runTest(test: Test) {
    this.currentTest = test;
  }

  public async handleAgentAnswer() {}
}
