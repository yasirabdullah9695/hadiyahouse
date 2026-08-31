const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/upload — Admin only
// multer middleware 'image' field expect karta hai
router.post('/', protect, adminOnly, upload.single('image'), (err, req, res, next) => {
  // Multer errors handle karo
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
}, uploadFile);

module.exports = router;
