import { Kafka } from 'kafkajs';

// Create the client with the broker list
const kafka = new Kafka({
  clientId: 'my-backend-service',
  brokers: ['localhost:9092']  // Ensure this matches your Docker exposed port
});

const producer = kafka.producer();

const sendMessage = async () => {
  try {
    await producer.connect();
    console.log('Producer connected');
    
    await producer.send({
      topic: 'test',
      messages: [
        { key: 'key1', value: 'hello world' },
        { key: 'key2', value: 'hey hey!' }
      ],
    });
    console.log('Message sent successfully');
    
    await producer.disconnect();
    console.log('Producer disconnected');
  } catch (error) {
    console.error('Error in producer:', error);
  }
};

sendMessage().catch(console.error);
