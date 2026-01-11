import Product from "../models/Product.js";

// @desc    Add a new product
// @route   POST /api/products
// @access  Private
const addProduct = async (req, res) => {
  try {
    const { productId, name, price, featured, rating, company } = req.body;

    // Check if product already exists
    const productExists = await Product.findOne({ productId });

    if (productExists) {
      return res
        .status(400)
        .json({ message: "Product with this ID already exists" });
    }

    const product = await Product.create({
      productId,
      name,
      price,
      featured: featured || false,
      rating: rating || 0,
      company,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { productId, name, price, featured, rating, company } = req.body;

    // If productId is being changed, check for duplicates
    if (productId && productId !== product.productId) {
      const existingProduct = await Product.findOne({ productId });
      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "Product with this ID already exists" });
      }
    }

    product.productId = productId || product.productId;
    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.featured = featured !== undefined ? featured : product.featured;
    product.rating = rating !== undefined ? rating : product.rating;
    product.company = company || product.company;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Private
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products with price less than a certain value
// @route   GET /api/products/price/:maxPrice
// @access  Private
const getProductsByPrice = async (req, res) => {
  try {
    const maxPrice = parseFloat(req.params.maxPrice);

    if (isNaN(maxPrice)) {
      return res.status(400).json({ message: "Invalid price value" });
    }

    const products = await Product.find({ price: { $lt: maxPrice } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products with rating higher than a certain value
// @route   GET /api/products/rating/:minRating
// @access  Private
const getProductsByRating = async (req, res) => {
  try {
    const minRating = parseFloat(req.params.minRating);

    if (isNaN(minRating)) {
      return res.status(400).json({ message: "Invalid rating value" });
    }

    const products = await Product.find({ rating: { $gt: minRating } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByPrice,
  getProductsByRating,
};
