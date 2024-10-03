import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: [true, 'Item is required'],
  },
  type: {
    type: String,
    enum: {
      values: ['Purchase', 'Sale', 'Return', 'Adjustment'],
      message: 'Type must be one of the following: Purchase, Sale, Return, Adjustment',
    },
    required: [true, 'Movement type is required'],
  },
  quantityChange: {
    type: Number,
    required: [true, 'Quantity change is required'],
    validate: {
      validator: function (value) {
        return value !== 0;
      },
      message: 'Quantity change must be a non-zero value',
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes must not exceed 500 characters'],
  },
});


// Middleware to store item name when a stock movement is created
stockMovementSchema.pre('save', async function (next) {
  if (this.isNew) {
    const item = await mongoose.model('InventoryItem').findById(this.item);
    if (item) {
      this.itemName = item.name;
    }
  }
  next();
});

// Middleware to set item to null if the associated InventoryItem is deleted
stockMovementSchema.pre('save', async function (next) {
  if (!this.item) {
    this.item = null;
  }
  next();
});


export const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
