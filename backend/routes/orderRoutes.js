const express = require('express');
const { createOrder, getCustomerOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/customer/:customerId', getCustomerOrders);
router.get('/customer/:customerId', getCustomerOrders);

module.exports = router;
