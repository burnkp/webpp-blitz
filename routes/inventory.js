const router = require('express').Router();
const Inventory = require('../models/Inventory');

router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('product');
    res.json(inventory);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.post('/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    await Inventory.findOneAndUpdate(
      { product: productId },
      { quantity, lastUpdated: Date.now() },
      { upsert: true }
    );
    res.json('Inventory updated!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;