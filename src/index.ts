import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 3000;

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "You have reached Benchy!",
  });
});

console.log(`Server is running on http://localhost:${PORT}`);

serve({
  fetch: app.fetch,
  port: typeof PORT === "number" ? PORT : 3000,
});
