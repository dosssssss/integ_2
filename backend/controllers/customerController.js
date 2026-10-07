// CUS-BE-02: Registration API

const Customer = require('../models/customer');
const { hashPassword } = require('../utils/password');

function register(req, res) {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and password are required',
    });
  }

  if (Customer.findByEmail(email)) {
    return res.status(409).json({
      success: false,
      message: 'Email is already registered',
    });
  }

  const customer = Customer.createCustomer({
    name,
    email,
    password: hashPassword(password),
  });

  return res.status(201).json({
    success: true,
    message: 'Customer registered successfully',
    data: Customer.toPublic(customer),
  });
}

module.exports = { register };
