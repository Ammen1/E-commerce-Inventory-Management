import mongoose from "mongoose";
import Chapa from "chapa";
import { Transaction } from '../models/payment.Model.js';
import Order from "../models/order.Model.js";



const chapa = new Chapa(process.env.TEST_SECRET_KEY);

export async function initiateTransaction(req, res) {
  const { email, first_name, last_name, amount, currency, items, callbackUrl } = req.body;  
  const now = new Date();
  const txRef = `tx-${now.getTime()}`;
  
  // Ensure required fields are present
  if (!email || !first_name || !last_name || !amount || !currency || !items) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Convert items to ObjectId if they are not already
  const orderIds = items.map(item => new mongoose.Types.ObjectId(item)); 

  const data = {
    email,
    first_name,
    last_name,
    amount,
    currency,
    items: orderIds,
    callbackUrl: `http://localhost:5000/api/transactions/verify/${txRef}`,
    tx_ref: txRef,
    return_url: "http://localhost:5000/thank-you",
    customization: {
      title: '2utube',
      description: 'Payment for your services',
    },
  };

  try {
    const response = await chapa.initialize(data);
    
    const transaction = await Transaction.create({
      ...data,
      status: response.status,
    });

    res.status(200).json({ detail: response, txRef });
  } catch (error) {
    console.error('Error initiating transaction:', error);
    res.status(500).json({ error: 'Failed to initiate transaction. Please try again.' });
  }
}


export async function verifyTransaction(req, res) {
  const { txId } = req.params;

  try {
    // Find the transaction by transaction reference
    const transaction = await Transaction.findOne({ tx_ref: txId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Verify the transaction with Chapa
    const verificationResult = await chapa.verify(transaction.tx_ref);

    // Update the transaction status
    transaction.status = verificationResult.status;
    await transaction.save();

    // If transaction is successful, mark the corresponding order as paid
    if (verificationResult.status === 'success') {
      const order = await Order.findById(transaction.items);
      if (order) {
        await order.markAsPaid();
      }
    }

    res.status(200).json(verificationResult);
  } catch (error) {
    console.error('Error verifying transaction:', error);
    res.status(500).json({ error: 'Failed to verify transaction. Please try again.' });
  }
}


export async function getAllTransactions(req, res) {
  try {
    // Populate the items field with the title of the related orders
    const transactions = await Transaction.find().populate('items', 'title');
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions. Please try again.' });
  }
}
