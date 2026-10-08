const express = require('express');
const { createOrder, getCustomerOrders } = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/customer/:customerId', authenticate, getCustomerOrders);

module.exports = router;
