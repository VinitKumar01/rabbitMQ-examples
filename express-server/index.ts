import express, { json } from "express";
import { createClient } from "redis";

const client = createClient();

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "Hello",
  });
});

app.post("/submit", async (req, res) => {
  const { problemId, userId, code, language } = req.body;

  //TODO: push to postgress

  await client.lPush(
    "submissions",
    JSON.stringify({ problemId, userId, code, language }),
  );

  res.json({
    message: "submission received",
  });
});

async function StartServer() {
  await client.connect();
  console.log("Connected to redis");

  app.listen(3000, () => {
    console.log("Listening to port 3000");
  });
}

StartServer();

