import express from "express";
import { Message } from "./core";
import axios from "axios";

// From the user to the test runner
interface Incoming {
  incomingMessage: (message: Message) => Promise<void> | void;
}

// from the test runner to the user
interface Outgoing {
  outgoingMessage: (message: Message) => Promise<void> | void;
}

type HTTPInterfaceConfig = {
  config: {
    port: number;
    callbackUrl: string;
  };
  incoming: Incoming;
};

export const httpInterface = async ({
  config,
  incoming,
}: HTTPInterfaceConfig): Promise<Outgoing> => {
  try {
    const { port, callbackUrl } = config;
    const app = express();

    app.post("/message", async (req, res) => {
      try {
        const message = req.body;
        incoming.incomingMessage(message);
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

    app.listen(port, () => {
      console.info(`Benchy HTTP Server listening on port ${port}`);
    });

    const onMessageOut = (message: Message) => {
      console.log("Sending message: ", message);
      axios.post(callbackUrl + "/message", {
        message,
      });
    };

    return {
      outgoingMessage: onMessageOut,
    } satisfies Outgoing;
  } catch (err) {
    throw new Error("Error running HTTP interface.");
  }
};
