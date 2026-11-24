# Run RabbitMQ via Docker

docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management

# Start worker (run in multiple terminals to test fair dispatch)

bun worker.ts

# Send task to queue (each "." simulates 1 second of work)

bun new_task.ts "Hello..."
