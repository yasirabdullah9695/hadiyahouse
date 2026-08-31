const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route — customer order place kar sake
router.post('/', createOrder);

// Admin only routes
router.get('/', protect, adminOnly, getOrders);
router.get('/stats', protect, adminOnly, getOrderStats);
router.get('/:id', protect, adminOnly, getOrder);
router.put('/:id', protect, adminOnly, updateOrder);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;
