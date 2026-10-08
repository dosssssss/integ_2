const catalog = {
  "pancit-canton": { name: "Pancit Canton (Lucky Me)", price: 20 },
  "homi-chicken": { name: "Homi Chicken Noodles", price: 15 },
  "lucky-me-beef": { name: "Lucky Me Beef Noodles", price: 15 },
};

const cart = new Map();
const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutMessage = document.querySelector("#checkout-message");
const placeOrderButton = document.querySelector("#place-order");
const cartSection = document.querySelector("#cart");
const orderConfirmation = document.querySelector("#order-confirmation");
let submitting = false;

function setCheckoutMessage(message, isError = false) {
  checkoutMessage.textContent = message;
  checkoutMessage.classList.toggle("checkout-message--error", isError);
}

function createCartItem(id, item, quantity) {
  const row = document.createElement("div");
  row.className = "cart-item";

  const details = document.createElement("div");
  details.className = "cart-item-details";
  const name = document.createElement("span");
  name.className = "cart-item-name";
  name.textContent = item.name;
  const linePrice = document.createElement("span");
  linePrice.className = "cart-item-price";
  linePrice.textContent = peso.format(item.price * quantity);
  details.append(name, linePrice);

  const controls = document.createElement("div");
  controls.className = "quantity-controls";
  controls.setAttribute("aria-label", `${item.name} quantity`);

  const decrease = document.createElement("button");
  decrease.type = "button";
  decrease.className = "quantity-button";
  decrease.dataset.quantityChange = "-1";
  decrease.dataset.cartItem = id;
  decrease.setAttribute("aria-label", `Remove one ${item.name}`);
  decrease.textContent = "−";

  const count = document.createElement("span");
  count.className = "quantity-value";
  count.textContent = String(quantity);
  count.setAttribute("aria-label", `Quantity ${quantity}`);

  const increase = document.createElement("button");
  increase.type = "button";
  increase.className = "quantity-button";
  increase.dataset.quantityChange = "1";
  increase.dataset.cartItem = id;
  increase.setAttribute("aria-label", `Add one ${item.name}`);
  increase.textContent = "+";

  controls.append(decrease, count, increase);
  row.append(details, controls);
  return row;
}

function renderCart() {
  const entries = [...cart.entries()];
  const itemCount = entries.reduce((total, [, quantity]) => total + quantity, 0);
  const total = entries.reduce(
    (sum, [id, quantity]) => sum + catalog[id].price * quantity,
    0,
  );

  cartCount.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  cartTotal.textContent = peso.format(total);
  placeOrderButton.disabled = itemCount === 0 || submitting;
  placeOrderButton.textContent = submitting
    ? "Placing order…"
    : itemCount === 0
      ? "Add items to place your order"
      : "Place order";

  if (entries.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "cart-empty";
    emptyMessage.textContent = "Your cart is empty. Add a noodle favorite to get started.";
    cartItems.replaceChildren(emptyMessage);
    return;
  }

  cartItems.replaceChildren(
    ...entries.map(([id, quantity]) => createCartItem(id, catalog[id], quantity)),
  );
}

document.querySelectorAll("[data-add-item]").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.addItem;
    cart.set(id, (cart.get(id) || 0) + 1);
    setCheckoutMessage("");
    orderConfirmation.hidden = true;
    cartSection.hidden = false;
    renderCart();
  });
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity-change]");
  if (!button) return;

  const id = button.dataset.cartItem;
  const quantity = (cart.get(id) || 0) + Number(button.dataset.quantityChange);
  if (quantity <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, quantity);
  }
  renderCart();
});

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (cart.size === 0 || submitting) return;

  submitting = true;
  setCheckoutMessage("");
  renderCart();

  try {
    const items = [...cart.entries()].map(([id, quantity]) => ({
      food: catalog[id].name,
      price: catalog[id].price,
      quantity,
    }));

    const orderResponse = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const orderResult = await orderResponse.json();
    if (!orderResponse.ok || !orderResult.success) {
      throw new Error(orderResult.message || "Could not place your order.");
    }
    cart.clear();
    cart.clear();
    cartSection.hidden = true;
    orderConfirmation.hidden = false;
  } catch (error) {
    setCheckoutMessage(
      error instanceof Error ? error.message : "Something went wrong while placing your order.",
      true,
    );
  } finally {
    submitting = false;
    renderCart();
  }
});

document.querySelector("#new-order").addEventListener("click", () => {
  orderConfirmation.hidden = true;
  cartSection.hidden = false;
  setCheckoutMessage("");
  renderCart();
});

renderCart();
