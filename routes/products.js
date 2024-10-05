const router = require('express').Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.post('/add', async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    await newProduct.save();
    res.json('Product added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;