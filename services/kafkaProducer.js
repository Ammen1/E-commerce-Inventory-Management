import { Kafka, Partitioners, logLevel } from 'kafkajs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'inventory-system',
  brokers: brokers,
  logLevel: logLevel.DEBUG,
});

const producer = kafka.producer();

const startProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka producer connected successfully.');
  } catch (error) {
    console.error('Error connecting to Kafka producer:', error);
  }
};

const sendKafkaMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(message) },
      ],
    });
    console.log(`Message sent to Kafka topic ${topic}:`, message);
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
  }
};

// Call this function to start the producer when the module is imported
startProducer();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

const sendLowStockAlert = async (alert) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: alert.recipientEmail || 'amenguda@gmail.com',
    subject: `Low Stock Alert: ${alert.itemName}`,
    text: `The stock for item '${alert.itemName}' is low.\nCurrent Quantity: ${alert.currentQuantity}\nThreshold: ${alert.threshold}\n`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent for low stock alert: ${alert.itemName}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { sendLowStockAlert, sendKafkaMessage }; 
