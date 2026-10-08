// CUS-BE-01: Customer model
// Stores customers in memory for now. Swap the `customers` array for a
// database later without changing the functions other files call.

const customers = [];
let nextId = 1;

/**
 * Create and store a new customer.
 * `password` should already be hashed (see CUS-BE-04).
 */
function createCustomer({ name, email, password }) {
  const customer = {
    id: nextId++,
    name,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };
  customers.push(customer);
  return customer;
}

function findByEmail(email) {
  if (!email) return null;
  return customers.find((c) => c.email === email.toLowerCase()) || null;
}

function findById(id) {
  return customers.find((c) => c.id === Number(id)) || null;
}

function getAllCustomers() {
  return customers.map(toPublic);
}

/** Return a copy of the customer without the password, safe to send to clients. */
function toPublic(customer) {
  if (!customer) return null;
  const { password, ...publicData } = customer;
  return publicData;
}

module.exports = {
  createCustomer,
  findByEmail,
  findById,
  getAllCustomers,
  toPublic,
};
