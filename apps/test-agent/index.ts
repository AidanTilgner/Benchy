import { domain, test, report, Score } from "@quasarbrains/benchy/core";
import { OpenAIDialogueHandler } from "@quasarbrains/benchy/dialogue";
import { HTTPInterface } from "@quasarbrains/benchy/interface";
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
