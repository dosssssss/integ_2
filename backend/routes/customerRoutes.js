const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.post('/register', customerController.register);

module.exports = router;
