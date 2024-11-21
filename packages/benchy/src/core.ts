type ITestConfiguration = {
  name: string;
};

export class Test {
  _name: string;

  constructor({ name }: ITestConfiguration) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
}

type IDomainConfiguration = {
  name: string;
};

export class Domain {
  private _name: string;
  private _tests: Record<string, Test> = {};

  constructor({ name }: IDomainConfiguration) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  get tests() {
    return this._tests;
  }
}

export class Proctor {
  domains: Record<string, Domain> = {};

  constructor() {}

  registerDomain(domain: Domain) {
    this.domains[domain.name] = domain;
    console.info("Domain registered");
  }
}
