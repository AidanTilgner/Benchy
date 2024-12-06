import express from "express";
import { Context, Message } from "./core";
import axios from "axios";

// From the user to the test runner
export interface Incoming {
  recieveMessage: (message: Message) => Promise<void> | void;
}

// from the test runner to the user
export interface Outgoing {
  sendMessage: (message: Message) => Promise<void> | void;
}

export type AdapterContext = {
  incoming: Incoming;
  context: Context;
};

type HTTPAdapterConfig = {
  port: number;
  callbackUrl: string;
};

export const HTTPAdapter =
  ({ port, callbackUrl }: HTTPAdapterConfig) =>
  async ({
    incoming: { recieveMessage },
  }: AdapterContext): Promise<Outgoing> => {
    try {
      const app = express();

      app.get("/", (req, res) => {
        res.send({
          message: "You've found the Benchy HTTP Adapter.",
          routes: [
            {
              path: "/message",
              method: "POST",
              description: "Send a message.",
              parameters: {
                content: "string",
              },
            },
            {
              path: "/test",
              method: "GET",
              description: "Get the current test.",
            },
          ],
        });
      });

      app.post("/message", async (req, res) => {
        try {
          const message = req.body;
          recieveMessage(message);
          res.send({
            message: "Message recieved successfully.",
          });
        } catch (err) {
          console.error("Error taking message input.");
          res
            .send({
              message: "Error taking message input.",
            })
            .status(500);
        }
      });

      app.get("/test", async (req, res) => {
        try {
          res.send({
            message: "[Current Test]",
            data: "nothing to see here...",
          });
        } catch (err) {
          console.error(err);
        }
      });

      app.listen(port, () => {
        console.info(`Benchy HTTP Adapter listening on port ${port}`);
      });

      const sendMessage = async (message: Message) => {
        console.log("Sending message: ", message);
        const cb = `${callbackUrl}/message`;
        console.log("Posting to: ", cb);
        await axios.post(cb, {
          message,
        });
      };

      return {
        sendMessage,
      } satisfies Outgoing;
    } catch (err) {
      throw new Error("Error running HTTP adapter.");
    }
  };
