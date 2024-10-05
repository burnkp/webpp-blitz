const router = require('express').Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('products');
    res.json(orders);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.post('/add', async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    await newOrder.save();
    res.json('Order added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;