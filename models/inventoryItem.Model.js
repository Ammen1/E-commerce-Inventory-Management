import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [2, 'Item name must be at least 2 characters long'],
    maxlength: [100, 'Item name must not exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description must not exceed 500 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: ['Electronics', 'Clothing', 'Home', 'Food', 'Other'],
      message: 'Category is either: Electronics, Clothing, Home, Food, Other',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    default: 0,
    min: [0, 'Quantity must be at least 0'],
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold must be at least 0'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
}, { timestamps: true });

// Create indexes for performance optimization
inventoryItemSchema.index({ name: 1 });
inventoryItemSchema.index({ category: 1, price: -1 });

// Add a custom validation method to ensure that quantity is always above the lowStockThreshold when quantity is updated
inventoryItemSchema.pre('save', function (next) {
  if (this.quantity < this.lowStockThreshold) {
    return next(new Error('Quantity cannot be less than low stock threshold.'));
  }
  next();
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
export default InventoryItem;
