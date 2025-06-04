import { Kafka } from 'kafkajs';

// Create the client with the broker list
const kafka = new Kafka({
  clientId: 'my-backend-service',
  brokers: ['localhost:9092']  // Ensure this matches your Docker exposed port
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const runConsumer = async () => {
  try {
    await consumer.connect();
    console.log('Consumer connected');
    
    await consumer.subscribe({ topic: 'test', fromBeginning: true });
    console.log('Consumer subscribed to topic "test"');
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
        });
      },
    });
  } catch (error) {
    console.error('Error in consumer:', error);
  }
};

runConsumer().catch(console.error);
