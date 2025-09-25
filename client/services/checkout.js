// client/services/checkout.js
import Cart from '../components/cart/cart.js';
import { fetchAddressByCEP } from './apiCEP/apiCep.js';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/* ELEMENTS */
const orderSummary = document.getElementById('order-summary');
const confirmBtn = document.getElementById('confirm-order');
const cancelBtn = document.getElementById('cancel-order');
const formErrors = document.getElementById('form-errors');

const cepInput = document.getElementById('cep');
const cepMsg = document.getElementById('cep-msg');
const street = document.getElementById('street');
const number = document.getElementById('number');
const district = document.getElementById('district');
const city = document.getElementById('city');
const uf = document.getElementById('uf');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

const thanksOverlay = document.getElementById('thanks-overlay');
const thanksMessage = document.getElementById('thanks-message');

function subtotal(items) {
  return items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
}

function shippingCost(sub) {
  // regra simples: frete grátis acima de R$ 3000, senão R$ 49.90
  if (sub >= 3000) return 0;
  return 49.90;
}

function renderSummary() {
  const items = Cart.getItems();
  if (!items.length) {
    orderSummary.innerHTML = `<div class="empty">Carrinho vazio. <a href="index.html">Voltar às compras</a></div>`;
    confirmBtn.disabled = true;
    return;
  }

  confirmBtn.disabled = false;

  const listHtml = items.map(it => `
    <div class="order-item" data-id="${it.id}">
      <img src="${it.image}" alt="${it.name}" />
      <div class="it-info">
        <strong>${it.name}</strong>
        <small>${it.quantity} × ${BRL.format(it.price)}</small>
      </div>
      <div class="it-subtotal">${BRL.format(it.price * it.quantity)}</div>
    </div>
  `).join('');

  const sub = subtotal(items);
  const ship = shippingCost(sub);
  const total = sub + ship;

  orderSummary.innerHTML = `
    <div>${listHtml}</div>
    <div class="totals">
      <div class="row"><span>Subtotal</span><span>${BRL.format(sub)}</span></div>
      <div class="row"><span>Frete</span><span>${ship === 0 ? 'Grátis' : BRL.format(ship)}</span></div>
      <div class="row total"><span>Total</span><span>${BRL.format(total)}</span></div>
    </div>
  `;
}

/* CEP utils */
function formatCEP(value) {
  const nums = value.replace(/\D/g, '').slice(0,8);
  if (nums.length <= 5) return nums;
  return nums.slice(0,5) + '-' + nums.slice(5);
}

/* Event listeners */
cepInput.addEventListener('input', e => {
  const formatted = formatCEP(e.target.value);
  e.target.value = formatted;
  cepMsg.textContent = '';
  if (formatted.replace('-', '').length === 8) {
    // chama ViaCEP
    cepMsg.textContent = 'Consultando CEP...';
    fetchAddressByCEP(formatted).then(res => {
      if (!res.ok) {
        cepMsg.textContent = res.message || 'CEP inválido.';
        cepMsg.style.color = 'var(--danger)';
        // keep fields editable
        street.focus();
        return;
      }
      const d = res.data;
      street.value = d.logradouro || '';
      district.value = d.bairro || '';
      city.value = d.localidade || '';
      uf.value = d.uf || '';
      cepMsg.textContent = 'Endereço preenchido automaticamente.';
      cepMsg.style.color = 'var(--success-color, #218838)';
      // acessibilidade: coloca foco no Número
      setTimeout(() => number.focus(), 50);
      // recalcula totals (frete poderia usar uf etc.) — simple re-render
      renderSummary();
    }).catch(err => {
      cepMsg.textContent = 'Erro ao consultar o CEP. Preencha manualmente.';
      cepMsg.style.color = 'var(--danger)';
      street.focus();
    });
  }
});

/* Form validation simple */
function validateForm() {
  formErrors.textContent = '';
  const errors = [];

  if (!nameInput.value.trim()) errors.push('Nome é obrigatório.');
  if (!emailInput.value.trim()) errors.push('E-mail é obrigatório.');
  if (!phoneInput.value.trim()) errors.push('Telefone é obrigatório.');
  if (!cepInput.value.trim()) errors.push('CEP é obrigatório.');
  if (!street.value.trim()) errors.push('Rua é obrigatória.');
  if (!number.value.trim()) errors.push('Número é obrigatório.');
  if (!district.value.trim()) errors.push('Bairro é obrigatório.');
  if (!city.value.trim()) errors.push('Cidade é obrigatória.');
  if (!uf.value.trim()) errors.push('UF é obrigatória.');

  if (errors.length) {
    formErrors.innerHTML = errors.map(e => `<div>• ${e}</div>`).join('');
    return false;
  }
  return true;
}

confirmBtn.addEventListener('click', async () => {
  const items = Cart.getItems();
  if (!items.length) {
    formErrors.textContent = 'Seu carrinho está vazio.';
    return;
  }

  // valida form
  if (!validateForm()) return;

  // recalcula e "simula" finalização
  const sub = subtotal(items);
  const ship = shippingCost(sub);
  const total = sub + ship;

  // Aqui você colocaria integração com gateway (Stripe, Pagar.me, etc).
  // Como entrega de funcionalidade imediata, vamos simular pedido finalizado.
  confirmBtn.disabled = true;
  confirmBtn.textContent = 'Processando...';

  // Simula delay (pequeno)
  setTimeout(() => {
    // Limpa carrinho
    Cart.clear();
    renderSummary();

    // Mostra overlay de sucesso
    thanksOverlay.setAttribute('aria-hidden', 'false');
    thanksMessage.textContent = `Pedido confirmado — total ${BRL.format(total)}. Enviamos os detalhes para ${emailInput.value.trim()}.`;
    document.getElementById('back-to-store').focus();

    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Confirmar pedido';
  }, 800);
});

cancelBtn.addEventListener('click', () => {
  // voltar à loja
  window.location.href = 'index.html';
});

/* Init */
function init() {
  renderSummary();
  // populate from localStorage (if houver) - já vem pelo Cart
  // accessibility: se não houver itens, foco no link voltar
  const items = Cart.getItems();
  if (!items.length) document.querySelector('.logo').focus();
}

init();
