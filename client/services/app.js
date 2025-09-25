import { Products } from "./data.js";
import { renderCatalog } from "./catalog.js";
import { productModal } from "../components/modal/modals.js";

let currentProducts = [...Products];

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar o slider
 
  
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
      console.log("Adicionado ao carrinho:", product);
      // Aqui futuramente entra o Cart.add(product)
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

  // Event listener para adicionar ao carrinho via modal
  document.addEventListener('addToCart', (e) => {
    const product = Products.find(p => p.id === e.detail.productId);
    console.log("Adicionado ao carrinho via modal:", product);
    // Aqui futuramente entra o Cart.add(product)
  });
});