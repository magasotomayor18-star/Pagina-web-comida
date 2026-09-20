"use strict";

const productCards = document.querySelectorAll(".product-card");
const filterButtons = document.querySelectorAll(".filter-button");
const addButtons = document.querySelectorAll(".add-button, .add-promo");
const orderItems = document.querySelector("#order-items");
const orderTotal = document.querySelector("#order-total");
const orderCount = document.querySelector("#order-count");
const navCount = document.querySelector("#nav-count");
const confirmOrder = document.querySelector("#confirm-order");
const orderMessage = document.querySelector("#order-message");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

const cart = new Map();

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function filterProducts(category) {
  productCards.forEach((card) => {
    const shouldShow = category === "todos" || card.dataset.category === category;
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

function addToCart(name, price) {
  const currentItem = cart.get(name);
  if (currentItem) {
    currentItem.quantity += 1;
  } else {
    cart.set(name, { price, quantity: 1 });
  }
  renderCart();
  orderMessage.textContent = `${name} se agregó a tu pedido.`;
}

function changeQuantity(name, amount) {
  const item = cart.get(name);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) {
    cart.delete(name);
  }
  renderCart();
}

function renderCart() {
  const entries = [...cart.entries()];
  const totalProducts = entries.reduce((total, [, item]) => total + item.quantity, 0);
  const totalPrice = entries.reduce((total, [, item]) => total + item.price * item.quantity, 0);

  navCount.textContent = totalProducts;
  orderCount.textContent = `${totalProducts} ${totalProducts === 1 ? "producto" : "productos"}`;
  orderTotal.textContent = formatPrice(totalPrice);
  confirmOrder.disabled = entries.length === 0;

  if (entries.length === 0) {
    orderItems.innerHTML = '<p class="empty-order">Todavía no has elegido nada.<br><a href="#menu">Explora el menú para comenzar.</a></p>';
    return;
  }

  orderItems.innerHTML = entries.map(([name, item]) => `
    <div class="order-item">
      <span class="order-item-name">${name}</span>
      <span class="order-item-price">${formatPrice(item.price * item.quantity)}</span>
      <span class="quantity-controls" aria-label="Cantidad de ${name}">
        <button type="button" data-action="decrease" data-name="${name}" aria-label="Quitar una unidad de ${name}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-action="increase" data-name="${name}" aria-label="Agregar una unidad de ${name}">+</button>
      </span>
    </div>
  `).join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterProducts(button.dataset.filter);
  });
});

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addToCart(button.dataset.name, Number(button.dataset.price));
  });
});

orderItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const amount = button.dataset.action === "increase" ? 1 : -1;
  changeQuantity(button.dataset.name, amount);
});

confirmOrder.addEventListener("click", () => {
  orderMessage.textContent = "¡Listo! Tu pedido de prueba fue recibido. Gracias por elegir Brasa Urbana.";
  confirmOrder.disabled = true;
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("is-open");
  }
});

renderCart();
