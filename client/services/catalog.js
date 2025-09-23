// ...existing code...
// responsável só por renderizar os cards
// Exporta initCatalog(produtos?) para inicializar no index.html
// Produtos: [{ id, name, price, category, image }]

const produtosPadrao = [
    { id: 1, name: 'Camiseta Básica', price: 49.9, category: 'Roupas', image: 'https://via.placeholder.com/240x160?text=Camiseta' },
    { id: 2, name: 'Tênis Esportivo', price: 199.9, category: 'Calçados', image: 'https://via.placeholder.com/240x160?text=Tênis' },
    { id: 3, name: 'Caneca', price: 29.9, category: 'Acessórios', image: 'https://via.placeholder.com/240x160?text=Caneca' },
    { id: 4, name: 'Jaqueta Jeans', price: 149.0, category: 'Roupas', image: 'https://via.placeholder.com/240x160?text=Jaqueta' },
    { id: 5, name: 'Chinelo', price: 39.0, category: 'Calçados', image: 'https://via.placeholder.com/240x160?text=Chinelo' }
];

let produtos = [];
let filtrados = [];

/* Formata preço para real brasileiro */
function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* Cria um card de produto (imagem, nome, categoria, preço) */
function criarCard(produto) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = produto.image || '';
    img.alt = produto.name;
    img.className = 'product-image';

    const h3 = document.createElement('h3');
    h3.textContent = produto.name;

    const cat = document.createElement('p');
    cat.className = 'product-category';
    cat.textContent = produto.category;

    const preco = document.createElement('p');
    preco.className = 'product-price';
    preco.textContent = formatarPreco(produto.price);

    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(cat);
    card.appendChild(preco);

    return card;
}

/* Renderiza a lista filtrada no container do catálogo */
function renderizar(container) {
    container.innerHTML = '';
    if (!filtrados.length) {
        container.textContent = 'Nenhum produto encontrado.';
        return;
    }
    const frag = document.createDocumentFragment();
    filtrados.forEach(p => frag.appendChild(criarCard(p)));
    container.appendChild(frag);
}

/* Aplica filtros por nome e categoria */
function aplicarFiltros({ nome = '', categoria = '' } = {}) {
    const q = String(nome).trim().toLowerCase();
    filtrados = produtos.filter(p => {
        const casaNome = !q || p.name.toLowerCase().includes(q);
        const casaCategoria = !categoria || p.category.toLowerCase() === categoria.toLowerCase();
        return casaNome && casaCategoria;
    });
}

/* Ordena a lista filtrada por modo (price-asc, price-desc, name-asc) */
function aplicarOrdenacao(modo) {
    if (!modo) return;
    if (modo === 'price-asc') filtrados.sort((a, b) => a.price - b.price);
    else if (modo === 'price-desc') filtrados.sort((a, b) => b.price - a.price);
    else if (modo === 'name-asc') filtrados.sort((a, b) => a.name.localeCompare(b.name));
}

/* Popula o select de categorias com os valores únicos presentes em produtos */
function popularSelectCategorias(selectEl) {
    const categorias = Array.from(new Set(produtos.map(p => p.category))).sort();
    // remove opções dinâmicas anteriores (mantém placeholder com value='')
    for (let i = selectEl.options.length - 1; i >= 0; i--) {
        if (selectEl.options[i].value !== '') selectEl.remove(i);
    }
    categorias.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        selectEl.appendChild(opt);
    });
}

/**
 * Inicializa o catálogo.
 * - productsList opcional: array de produtos [{id,name,price,category,image}]
 * - Procura no DOM pelos controles: #catalog, #search, #sort e opcional #category.
 */
export function initCatalog(productsList) {
    produtos = Array.isArray(productsList) && productsList.length ? productsList.slice() : produtosPadrao.slice();
    filtrados = produtos.slice();

    const catalogEl = document.querySelector('#catalog');
    const searchEl = document.querySelector('#search');
    const sortEl = document.querySelector('#sort');
    let categoryEl = document.querySelector('#category');

    if (!catalogEl) return;

    // Se não existir select de categoria no markup, cria um ao lado dos filtros
    if (!categoryEl) {
        categoryEl = document.createElement('select');
        categoryEl.id = 'category';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Categoria';
        categoryEl.appendChild(placeholder);
        const filtros = document.querySelector('#filters');
        if (filtros) filtros.insertBefore(categoryEl, sortEl || null);
    }

    popularSelectCategorias(categoryEl);

    function atualizar() {
        aplicarFiltros({ nome: searchEl ? searchEl.value : '', categoria: categoryEl ? categoryEl.value : '' });
        aplicarOrdenacao(sortEl ? sortEl.value : '');
        renderizar(catalogEl);
    }

    if (searchEl) searchEl.addEventListener('input', atualizar);
    if (sortEl) sortEl.addEventListener('change', atualizar);
    if (categoryEl) categoryEl.addEventListener('change', atualizar);

    // render inicial
    atualizar();
}

// export padrão por conveniência
export default { initCatalog };
