const mongoose = require('mongoose');

// Order.jsonc ke exact schema se match karta hai
const orderSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: [true, 'Product name required hai'],
      trim: true,
    },
    product_id: {
      type: String,
      trim: true,
    },
    product_type: {
      type: String,
      trim: true,
    },
    product_category: {
      type: String,
      trim: true,
    },
    customer_name: {
      type: String,
      required: [true, 'Customer name required hai'],
      trim: true,
    },
    customer_email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Phone number required hai'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address required hai'],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity 1 se kam nahi ho sakti'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Base44 compatibility
orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderSchema.virtual('created_date').get(function () {
  return this.createdAt;
});

module.exports = mongoose.model('Order', orderSchema);
