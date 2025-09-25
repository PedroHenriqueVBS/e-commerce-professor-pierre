import { Products } from "./data.js";
import { renderCatalog } from "./catalog.js";
import { productModal } from "../components/modal/modals.js";
import Cart from '../components/cart/cart.js';
import { showCartModal } from '../components/cart/cartModal.js';

let currentProducts = [...Products];

document.addEventListener("DOMContentLoaded", () => {
  // Renderiza catálogo inicialmente
 
  
  renderCatalog(currentProducts);

  // Botão do banner - scroll suave para o catálogo
  const bannerCta = document.querySelector('.banner-cta');
  if (bannerCta) {
    bannerCta.addEventListener('click', () => {
      document.querySelector('main').scrollIntoView({
        behavior: 'smooth'
      });
    });
  }

  // Buscar produto
  document.getElementById("search").addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    currentProducts = Products.filter(p => p.name.toLowerCase().includes(term));
    renderCatalog(currentProducts);
  });

  // Ordenação
  document.getElementById("sort").addEventListener("change", e => {
    const value = e.target.value;
    if (value === "price-asc") {
      currentProducts.sort((a, b) => a.price - b.price);
    } else if (value === "price-desc") {
      currentProducts.sort((a, b) => b.price - a.price);
    }
    renderCatalog(currentProducts);
  });

  // Clique no catálogo (event delegation)
  document.getElementById("catalog").addEventListener("click", e => {
    if (e.target.classList.contains("add-to-cart")) {
      const id = Number(e.target.dataset.id);
      const product = Products.find(p => p.id === id);
      if (product) Cart.add(product);
    }
    
    // Clique na imagem do produto para abrir modal
    if (e.target.classList.contains("product-image")) {
      const id = Number(e.target.dataset.id);
      const product = Products.find(p => p.id === id);
      if (product) {
        productModal.open(product);
      }
    }
  });

  
// Atualiza o contador do carrinho
  function updateCartCount() {
    const badge = document.getElementById('cart-count-badge');
    if (!badge) return;
    const items = Cart.getItems();
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
  }

// Sincroniza o contador do carrinho em múltiplas abas
  window.addEventListener('storage', updateCartCount);
  ['add','remove','clear'].forEach(fn => {
    const original = Cart[fn];
    Cart[fn] = function(...args) {
      const result = original.apply(Cart, args);
      updateCartCount();
      return result;
    };
  });

  const floatingBtn = document.getElementById('floating-cart-btn');
  if (floatingBtn) {
    floatingBtn.addEventListener('click', showCartModal);
    updateCartCount();
  }

  document.getElementById('open-cart-modal').addEventListener('click', showCartModal);

  // Event listener para adicionar ao carrinho via modal
  document.addEventListener('addToCart', (e) => {
    const product = Products.find(p => p.id === e.detail.productId);
    if (product) Cart.add(product);
  });
});