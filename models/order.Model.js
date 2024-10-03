import mongoose from "mongoose";

// Define order schema
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      onDelete: 'SET NULL',
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "InventoryItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
        },
        price: {
          type: Number,
          required: true,
        },
        subtotal: {
          type: Number,
          required: true
        }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Completed", "Cancelled"],
      default: "Pending",
    },
    importantTransaction: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// Pre-save hook to handle important transactions
orderSchema.pre("save", function (next) {
  const largeOrderThreshold = 5000;
  if (this.totalAmount >= largeOrderThreshold) {
    this.importantTransaction = true;
  }
  next();
});

// Middleware to handle cascading customer deletion
orderSchema.pre("remove", async function (next) {
  try {
    // If customer is deleted, handle how to deal with orders
    if (this.customer) {
      this.customer = null;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Create and export Order model
const Order = mongoose.model("Order", orderSchema);
export default Order;
