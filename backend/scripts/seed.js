/**
 * Seed Script — Hadiya House
 * Pehli baar run karo: npm run seed
 * Ye admin user aur sample products DB mein daal dega
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ DB connected');
};

// ─── Sample Products ─────────────────────────────────────────────────────────
const sampleProducts = [
  {
    name: 'Nikah Gift Box — Premium',
    description: 'A beautifully curated premium gift box for the blessed occasion of Nikah. Thoughtfully packed with love and Islamic tradition.',
    price: 2499,
    type: 'Gift Box',
    category: 'Nikah',
    image: '',
    inclusions: ['Quran (Pocket Size)', 'Attar (Oud)', 'Tasbeeh (Pearl)', 'Prayer Mat', 'Wedding Card'],
    badge: 'Best Seller',
    gender: 'all',
    best_seller: true,
    hidden: false,
    featured: true,
  },
  {
    name: 'Hajj Mubarak Gift Box',
    description: 'Comprehensive gift box for the sacred journey of Hajj. Everything the pilgrim needs, elegantly packaged.',
    price: 1999,
    type: 'Gift Box',
    category: 'Hajj',
    image: '',
    inclusions: ['Ihram Cloth', 'Miswak', 'Dates (Medjool)', 'Zamzam Bottle', 'Dua Book', 'Attar'],
    badge: 'New Arrival',
    gender: 'all',
    best_seller: false,
    hidden: false,
    featured: false,
  },
  {
    name: 'Umrah Essentials Box',
    description: 'Carefully assembled essentials for a blessed Umrah journey. Premium quality, elegantly presented.',
    price: 1499,
    type: 'Gift Box',
    category: 'Umrah',
    image: '',
    inclusions: ['Miswak', 'Attar', 'Dua Book', 'Tasbeeh', 'Zamzam Bottle'],
    badge: '',
    gender: 'all',
    best_seller: false,
    hidden: false,
    featured: false,
  },
  {
    name: 'Hijab Starter Kit',
    description: 'A beautiful starter kit for sisters beginning their hijab journey. Packed with modesty and love.',
    price: 1299,
    type: 'Gift Box',
    category: 'Hijab Kit',
    image: '',
    inclusions: ['Premium Hijab (2 pieces)', 'Hijab Pins Set', 'Under-Cap', 'Attar (Floral)', 'Tasbeeh'],
    badge: 'New Arrival',
    gender: 'her',
    best_seller: false,
    hidden: false,
    featured: true,
  },
  {
    name: "Father's Islamic Gift Kit",
    description: 'A heartfelt gift for the man who taught you everything. Premium Islamic essentials for the father figure.',
    price: 1799,
    type: 'Gift Box',
    category: "Father's Gift Kit",
    image: '',
    inclusions: ['Premium Topi', 'Attar (Oud)', 'Tasbeeh', 'Prayer Mat', 'Islamic Calendar'],
    badge: '',
    gender: 'him',
    best_seller: false,
    hidden: false,
    featured: false,
  },
  {
    name: 'Hifz Completion Box',
    description: 'Celebrate the incredible achievement of completing memorization of the Quran with this special gift.',
    price: 2199,
    type: 'Gift Box',
    category: 'Hifz Completion',
    image: '',
    inclusions: ['Quran (Colour-coded Tajweed)', 'Attar Premium', 'Tasbeeh (Silver)', 'Prayer Mat (Velvet)', 'Certificate Frame'],
    badge: 'Best Seller',
    gender: 'all',
    best_seller: true,
    hidden: false,
    featured: false,
  },
  {
    name: 'Premium Oud Attar',
    description: 'Authentic Arabic Oud attar — rich, deep, and long-lasting. Perfect for any occasion.',
    price: 499,
    type: 'Individual Item',
    category: 'Perfume & Attar',
    image: '',
    inclusions: [],
    badge: 'Best Seller',
    gender: 'all',
    best_seller: true,
    hidden: false,
    featured: false,
  },
  {
    name: 'Handcrafted Tasbeeh',
    description: 'Beautiful handcrafted 99-bead tasbeeh made from premium materials. A perfect companion for dhikr.',
    price: 299,
    type: 'Individual Item',
    category: 'Tasbeeh',
    image: '',
    inclusions: [],
    badge: '',
    gender: 'all',
    best_seller: false,
    hidden: false,
    featured: false,
  },
];

// ─── Main Seed Function ──────────────────────────────────────────────────────
const seed = async () => {
  try {
    await connectDB();

    // ── Admin User ──────────────────────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || 'yasirsabdullah02@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'yasir9695@';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`⚠️  Admin user already exists: ${adminEmail}`);
    } else {
      const admin = await User.create({
        email: adminEmail,
        password: adminPassword,
        name: 'Yasir Abdullah',
        role: 'admin',
      });
      console.log(`✅ Admin user bana diya: ${admin.email}`);
      console.log(`   Password: ${adminPassword}`);
    }

    // ── Products ────────────────────────────────────────────────────────────
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} products already hain — seed skip kar rahe hain`);
      console.log(`   Agar fresh seed chahiye toh pehle DB clear karo`);
    } else {
      const products = await Product.insertMany(sampleProducts);
      console.log(`✅ ${products.length} sample products bana diye`);
    }

    console.log(`\n🎉 Seed complete!`);
    console.log(`\n📋 Next Steps:`);
    console.log(`   1. backend/ mein jaake: npm install`);
    console.log(`   2. .env.example ko .env mein copy karo aur fill karo`);
    console.log(`   3. npm run dev se server start karo`);
    console.log(`   4. Frontend mein src/api/apiClient.js ka BACKEND_URL set karo\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
