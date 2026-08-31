const mongoose = require('mongoose');

// Product.jsonc ke exact schema se match karta hai
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name required hai'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price required hai'],
      min: [0, 'Price negative nahi ho sakta'],
    },
    type: {
      type: String,
      enum: ['Gift Box', 'Individual Item'],
      default: 'Gift Box',
    },
    category: {
      type: String,
      required: [true, 'Category required hai'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    inclusions: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      enum: ['', 'Best Seller', 'New Arrival'],
      default: '',
    },
    gender: {
      type: String,
      enum: ['all', 'him', 'her'],
      default: 'all',
    },
    best_seller: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto manage
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Base44 ke saath compatibility ke liye: id field expose karo
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// created_date virtual — Base44 convention match karne ke liye
productSchema.virtual('created_date').get(function () {
  return this.createdAt;
});

module.exports = mongoose.model('Product', productSchema);
