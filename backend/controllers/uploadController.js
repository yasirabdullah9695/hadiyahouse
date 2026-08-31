const path = require('path');

/**
 * POST /api/upload
 * Image file upload karo
 * Multer middleware pehle image file ko process karta hai
 * then ye controller URL return karta hai
 */
const uploadFile = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Koi file upload nahi ki gayi',
      });
    }

    // Public URL banao — frontend is URL se image access karega
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File successfully upload ho gayi!',
      file_url: fileUrl,           // Base44 API ke saath compatible
      url: fileUrl,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile };
