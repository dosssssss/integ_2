// CUS-BE-02: Registration API
// CUS-BE-03: Login API

const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const { hashPassword, comparePassword } = require('../utils/password');
const { successResponse, errorResponse } = require('../utils/errorResponse');

function register(req, res) {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return errorResponse(res, 400, 'Name, email and password are required');
  }

  if (Customer.findByEmail(email)) {
    return errorResponse(res, 409, 'Email is already registered');
  }

  const customer = Customer.createCustomer({
    name,
    email,
    password: hashPassword(password),
  });

  return successResponse(
    res,
    201,
    'Customer registered successfully',
    Customer.toPublic(customer)
  );
}

function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return errorResponse(res, 400, 'Email and password are required');
  }

  const customer = Customer.findByEmail(email);

  if (!customer || !comparePassword(password, customer.password)) {
    return errorResponse(res, 401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { id: customer.id, email: customer.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return successResponse(res, 200, 'Login successful', {
    customer: Customer.toPublic(customer),
    token,
  });
}

module.exports = { register, login };