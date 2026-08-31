const nodemailer = require('nodemailer');
const Order = require('../models/Order');

// ─── Email Transporter ──────────────────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ─── Email Body Builder ─────────────────────────────────────────────────────
const buildOrderEmailBody = (order) => {
  const lines = [
    `New order received from ${order.customer_name}.`,
    '',
    'Product Details:',
    `  Product: ${order.product_name}`,
  ];
  if (order.product_type) lines.push(`  Type: ${order.product_type}`);
  if (order.product_category) lines.push(`  Category: ${order.product_category}`);
  lines.push(`  Quantity: ${order.quantity}`);
  lines.push(`  Total: ₹${order.total}`);
  lines.push('');
  lines.push('Customer Details:');
  lines.push(`  Name: ${order.customer_name}`);
  if (order.customer_email) lines.push(`  Email: ${order.customer_email}`);
  lines.push(`  Phone: ${order.phone}`);
  lines.push(`  Address: ${order.address}`);
  if (order.notes) lines.push(`  Notes: ${order.notes}`);
  return lines.join('\n');
};

// ─── Send Order Notification Email ─────────────────────────────────────────
const sendOrderEmail = async (order) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('⚠️  Email credentials nahi hain — email skip kar rahe hain');
    return;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Hadiya House" <${process.env.SMTP_USER}>`,
      to: process.env.ORDER_NOTIFICATION_EMAIL || process.env.SMTP_USER,
      subject: `🛍️ New Order: ${order.product_name} — ${order.customer_name}`,
      text: buildOrderEmailBody(order),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1F2C;">
          <div style="background: #1A1F2C; padding: 24px; text-align: center;">
            <h1 style="color: #D4C3A5; margin: 0; font-size: 22px; letter-spacing: 3px;">HADIYA HOUSE</h1>
            <p style="color: #F9F7F2; margin: 4px 0 0; font-size: 11px; letter-spacing: 2px;">NEW ORDER REQUEST</p>
          </div>
          <div style="padding: 24px; background: #F9F7F2;">
            <h2 style="color: #1A1F2C; font-size: 18px; margin-top: 0;">${order.product_name}</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              ${order.product_type ? `<tr><td style="padding: 6px 0; color: #666; width: 140px;">Type</td><td>${order.product_type}</td></tr>` : ''}
              ${order.product_category ? `<tr><td style="padding: 6px 0; color: #666;">Category</td><td>${order.product_category}</td></tr>` : ''}
              <tr><td style="padding: 6px 0; color: #666;">Quantity</td><td>${order.quantity}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Total</td><td style="font-weight: bold; font-size: 16px;">₹${order.total?.toLocaleString('en-IN')}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #D4C3A5; margin: 16px 0;" />
            <h3 style="color: #1A1F2C; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #666; width: 140px;">Name</td><td>${order.customer_name}</td></tr>
              ${order.customer_email ? `<tr><td style="padding: 6px 0; color: #666;">Email</td><td>${order.customer_email}</td></tr>` : ''}
              <tr><td style="padding: 6px 0; color: #666;">Phone</td><td><a href="https://wa.me/${order.phone?.replace(/[^0-9]/g, '')}" style="color: #4A5D4E;">${order.phone}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Address</td><td>${order.address}</td></tr>
              ${order.notes ? `<tr><td style="padding: 6px 0; color: #666;">Notes</td><td>${order.notes}</td></tr>` : ''}
            </table>
          </div>
          <div style="background: #F0EDE5; padding: 16px 24px; text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0;">Hadiya House Admin Dashboard pe jaake status update karo</p>
          </div>
        </div>
      `,
    });
    console.log('✅ Order notification email bhej diya');
  } catch (err) {
    // Email fail hone se order fail nahi hoga
    console.error('❌ Email bhejne mein error:', err.message);
  }
};

// ─── Controllers ────────────────────────────────────────────────────────────

/**
 * GET /api/orders
 * Saare orders return karo (Admin only)
 * Sort by newest first
 */
const getOrders = async (req, res, next) => {
  try {
    const { status, limit = 200 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id
 * Single order by ID (Admin only)
 */
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order nahi mila',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/orders
 * Customer ka new order create karo (Public)
 * Automatically email notification bhejta hai
 */
const createOrder = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      status: 'pending', // Hamesha pending se shuru
    };

    const order = await Order.create(orderData);

    // Background mein email bhejo — response block mat karo
    sendOrderEmail(order).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Order successfully place ho gaya!',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/orders/:id
 * Order update karo — mostly status change (Admin only)
 */
const updateOrder = async (req, res, next) => {
  try {
    // Sirf certain fields update karne denge
    const allowedUpdates = ['status', 'notes'];
    const update = {};
    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order nahi mila',
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status "${order.status}" ho gaya`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/orders/:id
 * Order delete karo (Admin only)
 */
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order nahi mila',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order delete ho gaya',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Dashboard stats ke liye
const getOrderStats = async (req, res, next) => {
  try {
    const [total, pending, confirmed, delivered, cancelled] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const revenue = revenueResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: { total, pending, confirmed, delivered, cancelled, revenue },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats,
};
