const Food = require('../models/food');

async function getFoods(req, res) {
  try {
    const foods = await Food.find();

    return res.status(200).json({
      success: true,
      data: foods
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve foods'
    });
  }
}

module.exports = { getFoods };