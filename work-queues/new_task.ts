import amqp from "amqplib";

const connection = await amqp.connect("amqp://localhost");

const channel = await connection.createChannel();

const queue = "task_queue";
const msg = process.argv.slice(2).join("") || "Hello world";

await channel.assertQueue(queue, {
  durable: true, // makes sure queue is not lost if RabbitMQ dies. If we have multiple queues with same name durability is lost so assertQueue will only create an queue if it doesn't exist and if it exists then it will use the same that's why we have durability after we are creating them again in worker and task file as we don't know which will run first so to ensure that any file can be runned first without creating same queue again or getting an error.
  arguments: {
    "x-queue-type": "quorum",
  },
});

channel.sendToQueue(queue, Buffer.from(msg), {
  persistent: true, // persists messages which helps if RabbitMQ server dies.
});
console.log(" [x] Sent %s", msg);

setTimeout(function () {
  connection.close();
  process.exit(0);
}, 500);
