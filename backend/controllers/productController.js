const Product = require('../models/Product');

/**
 * GET /api/products
 * Saare visible products return karo (public)
 * Query params:
 *   - sort: field name (default: -createdAt newest first)
 *   - limit: number of results
 *   - hidden: 'true' | 'false' (admin ke liye)
 *   - type: 'Gift Box' | 'Individual Item'
 *   - category: string
 *   - gender: 'all' | 'him' | 'her'
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      sort = '-createdAt',
      limit = 200,
      hidden,
      type,
      category,
      gender,
    } = req.query;

    const filter = {};

    // Public users ke liye hidden products nahi dikhate
    // Admin ke liye ?hidden=true query se dikha sakte
    if (hidden === 'true') {
      // kuch filter nahi — sab dikha
    } else {
      filter.hidden = false;
    }

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (gender && gender !== 'all') filter.gender = { $in: [gender, 'all'] };

    const products = await Product.find(filter)
      .sort(sort)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Single product by ID (public)
 */
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product nahi mila',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Naya product banao (Admin only)
 */
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product successfully bana diya!',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id
 * Product update karo (Admin only)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,         // updated document return karo
        runValidators: true, // schema validators chalao
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product nahi mila update karne ke liye',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product update ho gaya!',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 * Product delete karo (Admin only)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product nahi mila delete karne ke liye',
      });
    }

    res.status(200).json({
      success: true,
      message: `"${product.name}" successfully delete ho gaya`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
