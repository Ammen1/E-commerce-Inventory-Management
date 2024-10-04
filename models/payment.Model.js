import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  }],
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'ETB', 'NGN', 'KES', 'GBP'],
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be positive"]
  },
  callbackUrl: {
    type: String,
    required: true
  },
  tx_ref: {
    type: String,
    required: true,
    unique: true
  },
  returnUrl: String,
  customization: {
    title: {
      type: String,
      default: 'Transaction Payment'
    },
    description: {
      type: String,
      default: 'Payment for services'
    }
  },
  status: {
    type: String,
    default: 'pending'
  }
}, {
  timestamps: true 
});


export const Transaction = mongoose.model('Transaction', transactionSchema);
