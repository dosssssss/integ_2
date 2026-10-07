// CUS-BE-05: Validate customer credentials
// Express middleware that checks request bodies before they reach the controller.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_PATTERN.test(email.trim());
}

function sendErrors(res, errors) {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors,
  });
}

function validateRegister(req, res, next) {
  const { name, email, password } = req.body || {};
  const errors = [];

  if (typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required');
  }
  if (!email) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Email format is invalid');
  }
  if (!password) {
    errors.push('Password is required');
  } else if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  if (errors.length) return sendErrors(res, errors);
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Email format is invalid');
  }
  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length) return sendErrors(res, errors);
  next();
}

module.exports = { validateRegister, validateLogin };
