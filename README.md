# 🛒 Projeto Fase — E-commerce

Este projeto é um **e-commerce em HTML, CSS e JavaScript**, desenvolvido como parte da fase do curso.  
O sistema simula um fluxo básico de loja virtual, desde a listagem de produtos até o checkout, aplicando os principais conceitos estudados em programação front-end.

---

## 📌 Objetivo

Construir um e-commerce que:

- Liste produtos em um catálogo;
- Exiba detalhes individuais;
- Permita adicionar itens ao carrinho e realizar checkout;
- Consuma a API de CEP (ViaCEP) para autopreenchimento de endereço;
- Aplique conceitos como:
  - Lógica de programação;
  - Arrays e funções (incluindo HOFs e arrow functions);
  - Manipulação do DOM e eventos;
  - Programação orientada a objetos (classes);
  - Programação assíncrona com `fetch` / `async` / `await`;
  - Tratamento de erros.

---

## 📦 Escopo Obrigatório (Mínimo Viável)

### 1. Catálogo
- Cards com **imagem, nome, preço e categoria**.
- Filtros e busca por nome/categoria.
- Ordenação simples (preço ou nome).

### 2. Detalhe do Produto
- Página ou modal com:
  - Descrição,
  - Mini-galeria de imagens,
  - Botão **Adicionar ao carrinho**.

### 3. Carrinho
- Adicionar/remover produtos.
- Alterar quantidade.
- Cálculo automático de **subtotal** e **total**.
- **Persistência em localStorage** (carrinho e preferências do usuário).

### 4. Checkout + CEP (ViaCEP)
- Formulário com os campos:
  - **CEP (com máscara 00000-000)**,
  - Rua,
  - Número,
  - Bairro,
  - Cidade,
  - UF.
- Ao digitar **8 dígitos do CEP**:
  - Chamada à API ViaCEP,
  - Autopreenchimento dos campos (logradouro, bairro, cidade, UF).

#### Tratamento de erros
- **CEP inválido/incompleto** → mensagem clara ao usuário.
- **Resposta ViaCEP com `{"erro": true}`** → exibir:  
  > "CEP não encontrado. Preencha manualmente."
- **Falha de rede** → manter campos editáveis e mostrar mensagem de falha.
- **Acessibilidade**:
  - Mensagens exibidas com `aria-live`.
  - Foco automático no campo **Número** após sucesso no preenchimento.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**  
- **CSS3**  
- **JavaScript (ES6+)**  
- **API ViaCEP** (consumo com `fetch`)  
- **LocalStorage**  

---

## 🚀 Como executar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
