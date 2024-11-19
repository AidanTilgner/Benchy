# Aidan - Running a test
So what will an individual test look like? It's a bit discombobulated at the moment, but essentially each test comes down to the following phases:
1. Initiation: the test is initialized
2. Dialogue: a dialogue is formed between the agent and the test, the test itself
3. Evaluation: an evaluation script checks the completed test report

## Phases
**Initiation**
The initiation stage simply ensures that the state of the environment is ready for the test to actuallly run. This will consist of a `initiate_test` event, which fires when the agent is ready for the test to start. Then, an initialization script will run, in case any setup is required for the test.

**Dialogue**
The test itself is a dialogue between the test runner and the agent. That means that the test itself needs to be capable of recieving prompts from the agent, as well as vice versa. This is to mimic the dialogical aspect of agent workflows, but it also introduces an aspect of non-determinism to the test. Once a response is prepared by the test, it will be sent back to the agent.

The prompts recieved by the test will be handled by a language model, equipped with context regarding the specific test, which will allow it to respond to prompts as a human test runner may. We will call this entity, tasked with overseeing a specific test, the "proctor".

agent_prompt -> test.recieveAgentPrompt() -> prompt_agent

**Evaluation**
Upon completion of the test, an `submit_test` event will fire, at which point a report file will be generated. The agent itself will submit its "results", which we'll get to when we talk about the structure of the test. But essentially the test itself will be like Advent of Code, where the goal is to produce a certain correct answer. The report file will include information including but not limited to:
- The dialogue between the agent and the proctor
- The result that the agent has decided upon

> [!question]
> Should the evaluation be a file or a database entry? Argument for the latter is ease of storage, while the former favors interfaceability.

Evaluation won't run immediately, because that would be unnecessary. Once the report file is generated, the evaluation can take place whenever, so for efficiency's sake, we'll complete all of the tests before moving onto the evaluation itself.

The evaluation script will take this report file as an input, and return a grade. The grade will be in the following format (or something like it):
```ts
type Evaluation = {
  test: {
    name: string;
    description: string;
  }
  grade: {
    format: "boolean" | "percentage";
    value: number;
  }
}
```


## Makeup of a test
An individual test will consist of the following components:
- a configuration file
- an initialization script
- a proctor instructions file
- an evaluation script

These files will each expose a common interface that will allow them to be utilized in a standardized fashion by the system.
