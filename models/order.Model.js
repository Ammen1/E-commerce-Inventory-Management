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
          required: true,
        },
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
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate totalAmount based on item subtotals
orderSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((acc, item) => acc + item.subtotal, 0);
  
  // Mark as an important transaction if totalAmount exceeds the threshold
  const largeOrderThreshold = 5000;
  if (this.totalAmount >= largeOrderThreshold) {
    this.importantTransaction = true;
  }

  next();
});

// Middleware to handle cascading customer deletion (if needed)
orderSchema.pre("remove", async function (next) {
  try {
    if (this.customer) {
      // Keep the orders and just set the customer to null
      await mongoose.model("Order").updateMany({ customer: this.customer }, { $set: { customer: null } });
      console.log(`All orders for customer ${this.customer} have been deleted or updated.`);
    }
    next();
  } catch (err) {
    console.error(`Error during order deletion: ${err.message}`);
    next(err);
  }
});

// Method to mark the order as paid
orderSchema.methods.markAsPaid = async function () {
  this.paid = true;
  await this.save();
};

const Order = mongoose.model("Order", orderSchema);
export default Order;
