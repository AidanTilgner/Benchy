import { Hono } from "hono";
import { config } from "dotenv";

config();

const PORT = Number(process.env.SERVER_PORT) || 8080;

const app = new Hono();

app.post("/message", async (c) => {
  console.log("New message: ", c.body);
  return c.json({ message: "Message recieved loud and clear" });
});

export default {
  port: PORT,
  fetch: app.fetch,
};
