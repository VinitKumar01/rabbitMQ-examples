import { createClient } from "redis";

const client = createClient();

async function StartWorker() {
  await client.connect();
  console.log("worker connected to redis");

  while (true) {
    console.log("Waiting fot submission");
    const submission = await client.brPop("submissions", 0);

    console.log(JSON.parse(submission?.element as string));
  }
}

StartWorker();

