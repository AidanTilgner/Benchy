# Defining the interface
I'm inspired by Jest's rather straightforward interface for testing, and I want to think of Benchy as enabling TDD for agent development. So, given that source of inspiration, let's think about what a nice interface for Benchy would be.

We should keep in mind that when the user runs something like `pnpm test:agent`, it will start an individual session. So, we can create stuff on the backend regarding that session, such as the runner and proctor program, and we don't need the user to explicitly initialize those things.

The focus should be on providing a declarative and intuitive interface. While Jest is already well suited for many testing cases, for agents specifically, the focus should be on allowing more complex interactions for a specific task, as well as options for dialogue. Therefore, the library should include I/O utilities that can be used for handling I/O in specific tests, as well as evaluation utilities.

**Utilities**
A key feature of this library will be the ability to handle I/O between the agent and the test. This is crucial because this is a key functional difference between a library like Jest and Benchy, as Benchy will have such utilities. We've talked about interfaces before, and considered adapters such as HTTP adapters. I think it's important to continue considering such things, as the goal is to build a benchmark library which can be interfaced with through any language.

I/O utilities will be crucial, and there should be quick ways of setting up the various interfaces test-side. This way, all the user *should* have to focus on is 1) defining the test and 2) integrating it with their own agent through either http or some other manual setup. Additionally, having the ability to handle dialogue will be important. We can provide utilities to allow them to create a new I/O handler, where provided context per-test, the handler will answer questions from the agent using OpenAI's API or something. Otherwise, there will be a custom I/O handler.

Evaluation utilities will be critical as well. Jest allows for things like `expect` and `toBe`, which are useful in allowing the user to test deterministic outputs. However, in such non-deterministic situations as this one, having something more abstract will be necessary. However, it does come down to test-design to some degreee. Either way, evaluation utilities such as a LMEvaluator class or something would be useful.

Therefore, the test needs to be capable of the following operations:
- **Initialization**: An initialization script will be fired when the agent side initiates it
- **I/O**: The agent can prompt the test, which should return
- **Evaluation**: Will be fired when the agent submits the test as completed, and return a score

**Example**
Let's just go over an example of this being used in-practice, and how it might look.

```ts
import { domain, test, report, Score } from "@quasarbrains/benchy/core";
import { OpenAIDialogueHandler } from "@quasarbrains/benchy/dialogue";
import p from "./package.json";
import { OpenAI } from "openai";
import { config } from "dotenv";

config();
const { OPENAI_API_KEY } = process.env;
if (!OPENAI_API_KEY) {
  throw new Error("No initialized OpenAI API Key.");
}

const OAIClient = new OpenAI({ apiKey: OPENAI_API_KEY });

domain("Mathematics", () => {
  test("Can add 2 + 2", {
    initialize: async () => {},
    onPrompt: async (prompt) => {
      const handler = new OpenAIDialogueHandler(OAIClient, {
        context: `The goal is for the agent to be able to add 2 + 2.`,
        model: "chatgpt-4o-latest",
      });
      return handler.respond(prompt);
    },
    evaluate: async (results) => {
      const { finalAnswer, interactionLog } = results;
      if (!(finalAnswer == "2")) {
        return new Score({
          type: "boolean",
          value: 0,
          feedback: "The agent did not properly calculate 2 + 2.",
        });
      }
      return new Score({
        type: "boolean",
        value: 1,
        feedback: "The agent successfully calculated 2 + 2.",
      });
    },
  });
}).describe("Tests the agent's ability to perform mathematical operations");

const { name, version } = p;
report({
  name: `${name} ${version}`,
  outDir: "./reports",
});
```

Or something like that.
