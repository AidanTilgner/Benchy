import { OpenAI } from "openai";
import { Message } from "./core";

const SYSTEM_PROMPT = (
  context: string,
) => `You are the proctor for a test being given to an agent of some kind.
      Given context of a test, you should respond to the best of your ability to agent questions and clarifications.
      If the context does not provide necessary information to respond accurately, favor saying you don't know.

      Here is the context provided about the test currently being run:
      ${context}
`;

type BaseDialogueHandlerConfig = {
  context: string;
};

export abstract class BaseDialogueHandler {
  protected context: string;

  constructor({ context }: BaseDialogueHandlerConfig) {
    this.context = context;
  }

  public abstract respond(message: Message): Promise<Message> | Message;
}

type OpenAIDialogueHanderConfig = {
  context: string;
  model: OpenAI.ChatModel;
};

export class OpenAIDialogueHandler extends BaseDialogueHandler {
  private model: OpenAI.ChatModel;
  private client: OpenAI;

  constructor(client: OpenAI, { context, model }: OpenAIDialogueHanderConfig) {
    super({ context });
    this.model = model;
    this.client = client;
  }

  public async respond(message: Message): Promise<Message> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT(this.context),
          },
          {
            role: "user",
            content: message.content,
          },
        ],
      });
      if (!completion.choices[0]) {
        throw new Error("No choices returned from OpenAI");
      }
      const content = completion.choices[0]?.message.content;
      if (!content) {
        throw new Error("Content was empty");
      }
      return {
        content: content,
      } satisfies Message;
    } catch (err) {
      throw new Error("Error responding to query: " + err);
    }
  }
}
