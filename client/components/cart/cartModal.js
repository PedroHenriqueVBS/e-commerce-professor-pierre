import Cart from './cart.js';

export function showCartModal() {
  let modal = document.getElementById('cart-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.className = 'cart-modal';
    document.body.appendChild(modal);
  }
  renderCartModal(modal);
  modal.style.display = 'block';
}

export function hideCartModal() {
  const modal = document.getElementById('cart-modal');
  if (modal) modal.style.display = 'none';
}

function renderCartModal(modal) {
  const items = Cart.getItems();
  modal.innerHTML = `
    <div class="cart-modal-content">
      <h2>Carrinho</h2>
      <button class="close-cart" id="close-cart">&times;</button>
      <ul class="cart-list">
        ${items.length === 0 ? '<li>Carrinho vazio</li>' : items.map(item => `
          <li>
            <img src="${item.image}" alt="${item.name}" class="cart-img" />
            <span>${item.name}</span>
            <div class="cart-qty-controls">
              <button class="decrease-qty" data-id="${item.id}">−</button>
              <span class="cart-qty">${item.quantity}</span>
              <button class="increase-qty" data-id="${item.id}">+</button>
            </div>
          </li>
        `).join('')}
      </ul>
      <button class="clear-cart" id="clear-cart">Limpar Carrinho</button>
    </div>
  `;
  modal.querySelector('#close-cart').onclick = hideCartModal;
  modal.querySelector('#clear-cart').onclick = () => {
    Cart.clear();
    renderCartModal(modal);
  };
  modal.querySelectorAll('.increase-qty').forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      const item = Cart.items.find(i => i.id === id);
      if (item) {
        Cart.add(item);
        renderCartModal(modal);
      }
    };
  });
  modal.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      const item = Cart.items.find(i => i.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          Cart.save();
        } else {
          Cart.remove(id);
        }
        renderCartModal(modal);
      }
    };
  });
}