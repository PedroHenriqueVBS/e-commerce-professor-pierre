// Carrinho - lógica principal
const Cart = {
  items: [],

  add(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.save();
  },

  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  getItems() {
    return this.items;
  },

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  },

  load() {
    const data = localStorage.getItem('cart');
    this.items = data ? JSON.parse(data) : [];
  }
};

Cart.load();

export default Cart;
