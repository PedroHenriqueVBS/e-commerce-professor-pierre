import Cart from './cart.js';

const BRL = new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' });

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
  requestAnimationFrame(() => modal.classList.add('open'));
  document.body.classList.add('cart-open');
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'cart-modal') hideCartModal();
  }, { once:true });
}

export function hideCartModal() {
  const modal = document.getElementById('cart-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.classList.remove('cart-open');
  setTimeout(() => modal.style.display = 'none', 280);
}

function subtotal(items){
  return items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
}

function renderCartModal(modal) {
  const items = Cart.getItems();
  const total = subtotal(items);

  modal.innerHTML = `
    <div class="cart-modal-content">
      <div class="cart-header">
        <h2>Seu carrinho ${items.length ? `<small style="color:var(--muted)">(${items.length} item${items.length>1?'s':''})</small>` : ''}</h2>
        <button class="close-cart" id="close-cart" aria-label="Fechar">&times;</button>
      </div>
      <ul class="cart-list">
        ${items.length === 0 ? `
          <li class="cart-empty">Carrinho vazio</li>
        ` : items.map(item => `
          <li class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-img" />
            <div class="cart-info">
              <strong>${item.name}</strong>
              <span>${BRL.format(item.price)}</span>
              <div class="cart-qty-controls">
                <button class="qty-btn decrease-qty" aria-label="Diminuir">−</button>
                <span class="cart-qty">${item.quantity}</span>
                <button class="qty-btn increase-qty" aria-label="Aumentar">+</button>
              </div>
            </div>
            <button class="item-remove" title="Remover">🗑</button>
          </li>
        `).join('')}
      </ul>
      <div class="cart-footer">
        <div class="cart-row">
          <span>Total:</span>
          <strong>${BRL.format(total)}</strong>
        </div>
        <div class="actions">
          <button class="btn btn-primary" id="checkout">Finalizar compra</button>
          <button class="btn btn-ghost" id="clear-cart">Limpar carrinho</button>
        </div>
      </div>
    </div>
  `;

  modal.querySelector('#close-cart').onclick = hideCartModal;

  const clearBtn = modal.querySelector('#clear-cart');
  if (clearBtn){
    clearBtn.onclick = () => { Cart.clear(); renderCartModal(modal); };
  }

  modal.querySelectorAll('.item-remove').forEach(btn => {
    btn.onclick = () => {
      const li = btn.closest('.cart-item');
      const id = Number(li.dataset.id);
      Cart.remove(id);
      renderCartModal(modal);
    };
  });

  modal.querySelectorAll('.increase-qty').forEach(btn => {
    btn.onclick = () => {
      const li = btn.closest('.cart-item');
      const id = Number(li.dataset.id);
      const item = Cart.items.find(i => i.id === id);
      if (item) { Cart.add(item); renderCartModal(modal); }
    };
  });

  modal.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.onclick = () => {
      const li = btn.closest('.cart-item');
      const id = Number(li.dataset.id);
      const item = Cart.items.find(i => i.id === id);
      if (!item) return;
      if (item.quantity > 1) {
        item.quantity -= 1;
        Cart.save();
      } else {
        Cart.remove(id);
      }
      renderCartModal(modal);
    };
  });

  const checkout = modal.querySelector('#checkout');
  if (checkout){
    checkout.onclick = () => {
      alert(`Total: ${BRL.format(subtotal(Cart.getItems()))}`);
    };
  }
}
