import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      unique: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Reserved quantity cannot be negative'],
    },
    warehouse: {
      type: String,
      trim: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Threshold cannot be negative'],
    },
    lastRestocked: {
      type: Date,
    },
  },
  {
    timestamps: true,
    // Enable optimistic locking with version key
    versionKey: '__v',
  }
);

// Indexes
inventorySchema.index({ product: 1 });

// Virtual for available quantity
inventorySchema.virtual('availableQuantity').get(function () {
  return this.quantity - this.reservedQuantity;
});

// Virtual for low stock check
inventorySchema.virtual('isLowStock').get(function () {
  return this.availableQuantity <= this.lowStockThreshold;
});

// Ensure virtuals are included in JSON
inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
