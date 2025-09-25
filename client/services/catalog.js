export function renderCatalog(products) {
  const catalog = document.getElementById("catalog");
  catalog.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" data-id="${product.id}" style="cursor: pointer;">
      <h3>${product.name}</h3>
      <p class="price">R$ ${product.price.toFixed(2)}</p>
      <button data-id="${product.id}" class="add-to-cart">Adicionar</button>
    `;
    catalog.appendChild(card);
  });

  // Inicializar o observer para fade-in no scroll
  initScrollFadeIn();

  // Função para criar o Intersection Observer
  function initScrollFadeIn() {
    const productCards = document.querySelectorAll('.product-card');

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    productCards.forEach(card => {
      observer.observe(card);
    });
  }
}
