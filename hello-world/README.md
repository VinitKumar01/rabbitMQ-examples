# Run rabbitmq via docker

docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management

# Send message to queue

bun send.ts

# Receive message from queue

bun receive.ts
