// Carrinho - lógica principal
const Cart = {
  items: [], // Array para armazenar os produtos

  // Adiciona produto ao carrinho
  add(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1; // Incrementa quantidade se já existe
    } else {
      this.items.push({ ...product, quantity: 1 }); // Adiciona novo produto
    }
    this.save(); // Salva no localStorage
  },

  // Remove produto do carrinho
  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  },

  // Limpa todo o carrinho
  clear() {
    this.items = [];
    this.save();
  },

  // Retorna todos os itens do carrinho
  getItems() {
    return this.items;
  },

  // Salva carrinho no localStorage
  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  },

  // Carrega carrinho do localStorage
  load() {
    const data = localStorage.getItem('cart');
    this.items = data ? JSON.parse(data) : [];
  }
};

// Carrega dados salvos ao inicializar
Cart.load();

export default Cart;
