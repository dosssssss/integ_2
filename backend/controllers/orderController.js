const Order = require('../models/Orders');
const { calculateOrderTotal } = require('../utils/OrderUtils');
const { validateOrderItems } = require('../utils/orderValidation');
const { findById } = require('../models/customer');

async function createOrder(req, res) {
  try {
    const { customer, items } = req.body;

    const customerExists = findById(customer);

    if (!customerExists) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const validationError = validateOrderItems(items);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const total = calculateOrderTotal(items);

    const order = Order.createOrder({
      customer,
      items,
      total
    });

    return res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
}

module.exports = { createOrder };
