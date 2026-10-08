let orders = [];
let nextId = 1;

function createOrder({ customer, items, total }) {
  const order = {
    id: nextId++,
    customer,
    items,
    total,
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  return order;
}

function findByCustomer(customerId) {
  return orders.filter(
    (order) => order.customer === Number(customerId)
  );
}

function getAllOrders() {
  return orders;
}

module.exports = {
  createOrder,
  findByCustomer,
  getAllOrders
};
