import { Kafka, Partitioners, logLevel } from 'kafkajs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'inventory-system',
  brokers: brokers,
  // logLevel: logLevel.DEBUG,
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
      messages: [{ value: JSON.stringify(message) }],
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
    to: alert.recipientEmail,
    subject: `Low Stock Alert-Predefined Threshold: ${alert.itemName}`,
    text: `The stock for item '${alert.itemName}' is low.\nCurrent inventory levels: ${alert.currentQuantity}\nThreshold: ${alert.threshold}.\nTransaction type: ${alert.movementType}.\nQuantity change: ${alert.quantityChange}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent for low stock alert: ${alert.itemName}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

/**
 * Function to send order notifications for important events
 * @param {Object} notificationDetails - Contains details about the notification
 * @param {String} notificationDetails.type - Type of notification (e.g., "large-order", "out-of-stock")
 * @param {String} notificationDetails.message - Message to be sent
 * @param {Object} notificationDetails.order - Order object with relevant data
 * @param {Object} notificationDetails.customer - Customer details
 */
const sendOrderNotification = async ({ type, message}) => {
  const emailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `Order Notification: ${type}`,
    text: `Important transactions ${type},\n\n${message}\nType:${type}`,
  };

  try {
    // Send email notification
    await transporter.sendMail(emailOptions);
    console.log(`Order notification email sent for ${type}: ${message}`);

    // Send Kafka message
    const kafkaMessage = {
      type,
      message,
    };

    await sendKafkaMessage('order-notifications', kafkaMessage);
    console.log(`Order notification Kafka message sent for ${type}:`, kafkaMessage);
  } catch (error) {
    console.error(`Error sending order notification for ${type}:`, error);
  }
};

export { sendLowStockAlert, sendKafkaMessage, sendOrderNotification };
