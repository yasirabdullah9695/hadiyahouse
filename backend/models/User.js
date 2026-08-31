const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User.jsonc ke schema se match karta hai + auth fields
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email required hai'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password required hai'],
      minlength: [6, 'Password 6 characters se zyada hona chahiye'],
      select: false, // by default password response mein nahi aayega
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Password save karne se pehle hash karo
userSchema.pre('save', async function (next) {
  // Sirf tab hash karo jab password change ho
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password compare karne ka method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// id virtual
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('User', userSchema);
