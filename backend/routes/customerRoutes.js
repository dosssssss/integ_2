const express = require('express');
const customerController = require('../controllers/customerController');
const { validateRegister, validateLogin } = require('../validators/customerValidator');

const router = express.Router();

router.post('/register', validateRegister, customerController.register);
router.post('/login', validateLogin, customerController.login);

module.exports = router;
