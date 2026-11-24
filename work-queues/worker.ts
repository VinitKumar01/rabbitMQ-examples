import amqp from "amqplib";

const connection = await amqp.connect("amqp://localhost");

const channel = await connection.createChannel();

const queue = "task_queue";

await channel.assertQueue(queue, {
  durable: true,
  arguments: {
    "x-queue-type": "quorum",
  },
});

channel.prefetch(1); // Tells RabbitMQ to send only 1 unacked message to this worker at a time. Prevents overloading one busy worker while others sit idle (fair dispatch instead of blind round-robin).

console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
channel.consume(
  queue,
  function (msg) {
    if (msg == null) {
      console.log("Message is null");
      return;
    }
    const secs = msg.content.toString().split(".").length - 1;
    setTimeout(() => {
      console.log(" [x] Done");
      channel.ack(msg); // sends the acknowledgement.
    }, secs * 1000);
  },
  {
    noAck: false, // Makes sure that message is not deleted until the completion acknowledgement is received from consumer, this helps if consume receives the task and dies before completion then it will re-queue the task to another consumer, when true it deletes the msg after delivering and doesn't wait for completion acknowledgement. This doesn't save if rabbitMQ server itself dies, only if consumer.
  },
);
