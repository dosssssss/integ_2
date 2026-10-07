// CUS-BE-02: Registration API
// CUS-BE-03: Login API

const Customer = require('../models/customer');
const { hashPassword, comparePassword } = require('../utils/password');

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

function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  const customer = Customer.findByEmail(email);

  if (!customer || !comparePassword(password, customer.password)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: Customer.toPublic(customer),
  });
}

module.exports = { register, login };
