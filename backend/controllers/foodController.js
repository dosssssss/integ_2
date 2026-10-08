const Food = require('../models/food');

async function listFoods(req, res) {
  try {
    const foods = await Food.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: foods
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load foods'
    });
  }
}

async function getFoods(req, res) {
  return listFoods(req, res);
}

async function searchFoods(req, res) {
  try {
    const { name } = req.query;

    const foods = await Food.find({
      name: { $regex: name, $options: 'i' }
    });

    return res.status(200).json({
      success: true,
      data: foods
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to search foods'
    });
  }
}

module.exports = { listFoods, getFoods, searchFoods };