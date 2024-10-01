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
      validator: function(value) {
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

// Middleware to enforce specific validation based on movement type
stockMovementSchema.pre('validate', function(next) {
  if (this.type === 'Sale' || this.type === 'Adjustment') {
    if (this.quantityChange > 0) {
      return next(new Error('Quantity change must be negative for Sale and Adjustment types.'));
    }
  } else if (this.type === 'Purchase' || this.type === 'Return') {
    if (this.quantityChange < 0) {
      return next(new Error('Quantity change must be positive for Purchase and Return types.'));
    }
  }
  next();
});

export const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
