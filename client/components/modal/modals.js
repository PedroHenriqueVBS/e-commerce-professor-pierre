// Funcionalidade do Modal de Produto

export class ProductModal {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    // Criar estrutura do modal
    this.createModal();
    // Adicionar event listeners
    this.addEventListeners();
  }

  createModal() {
    const modalHTML = `
      <div class="modal-overlay" id="product-modal">
        <div class="modal-container">
          <button class="modal-close" aria-label="Fechar modal">x</button>
          <div class="modal-content">
            <div class="modal-image">
              <img src="" alt="" id="modal-product-image">
            </div>
            <div class="modal-info">
              <h2 id="modal-product-name"></h2>
              <div class="modal-price" id="modal-product-price"></div>
              <div class="modal-category" id="modal-product-category"></div>
              <p class="modal-description" id="modal-product-description"></p>
              <div class="modal-actions">
                <button class="modal-add-to-cart" id="modal-add-to-cart">
                  Adicionar ao Carrinho
                </button>
                <button class="modal-continue-shopping">
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('product-modal');
  }

  addEventListeners() {
    // Fechar modal ao clicar no X
    const closeBtn = this.modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => this.close());

    // Fechar modal ao clicar no overlay
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });

    // Continuar comprando
    const continueBtn = this.modal.querySelector('.modal-continue-shopping');
    continueBtn.addEventListener('click', () => this.close());

    // Adicionar ao carrinho do modal
    const addToCartBtn = this.modal.querySelector('#modal-add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      const productId = addToCartBtn.dataset.id;
      // Disparar evento customizado para adicionar ao carrinho
      const event = new CustomEvent('addToCart', { 
        detail: { productId: Number(productId) } 
      });
      document.dispatchEvent(event);
      this.close();
    });
  }

  open(product) {
    if (!product || !this.modal) return;

    // Preencher dados do produto
    this.fillProductData(product);

    // Mostrar modal
    this.modal.classList.add('active');
    document.body.classList.add('modal-open');

    // Focar no modal para acessibilidade
    this.modal.focus();
  }

  close() {
    if (!this.modal) return;

    this.modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  fillProductData(product) {
    const elements = {
      image: this.modal.querySelector('#modal-product-image'),
      name: this.modal.querySelector('#modal-product-name'),
      price: this.modal.querySelector('#modal-product-price'),
      category: this.modal.querySelector('#modal-product-category'),
      description: this.modal.querySelector('#modal-product-description'),
      addToCartBtn: this.modal.querySelector('#modal-add-to-cart')
    };

    // Preencher elementos
    elements.image.src = product.image;
    elements.image.alt = product.name;
    elements.name.textContent = product.name;
    elements.price.textContent = `R$ ${product.price.toFixed(2)}`;
    elements.category.textContent = this.formatCategory(product.category);
    elements.description.textContent = product.description;
    elements.addToCartBtn.dataset.id = product.id;
  }

  formatCategory(category) {
    const categoryMap = {
      'smartphones': 'Smartphones',
      'notebooks': 'Notebooks',
      'tablets': 'Tablets',
      'audio': 'Áudio',
      'tvs': 'TVs',
      'games': 'Games',
      'wearables': 'Wearables',
      'cameras': 'Câmeras',
      'e-readers': 'E-readers',
      'perifericos': 'Periféricos',
      'armazenamento': 'Armazenamento',
      'acessorios': 'Acessórios'
    };

    return categoryMap[category] || category;
  }
}

// Instância global do modal
export const productModal = new ProductModal();