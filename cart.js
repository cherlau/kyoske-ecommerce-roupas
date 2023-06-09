class Produto {
  constructor(title, price, imageSrc) {
    this.title = title;
    this.price = price;
    this.imageSrc = imageSrc;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sectionProdutos = document.querySelector('.produtos');
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titleValue = document.querySelector('#title').value;
    const valorValue = document.querySelector('#valor').value;
    const inputImg = document.querySelector('#foto').files[0];

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const imageSrc = reader.result;
      const produto = new Produto(titleValue, valorValue, imageSrc);
      adicionarProduto(produto);
    });

    if (inputImg) {
      reader.readAsDataURL(inputImg);
    }
  });

  function adicionarProduto(produto) {
    const div = document.createElement('div');
    div.classList.add('produto-container');
    div.classList.add('shop-item');
    const produtoInfos = `
      <span class="shop-item-title">${produto.title}</span>
      <div class="div-img">
        <img class="shop-item-image" src="${produto.imageSrc}" alt="${produto.title}">
      </div>
      <div class="info shop-item-details">
        <span class="shop-item-price">R$ ${produto.price}</span>
        <button type="button" class="shop-item-button">+add Carrinho</button>
      </div>
    `;
    div.innerHTML = produtoInfos;

    sectionProdutos.appendChild(div);

    const addButton = div.querySelector('.shop-item-button');
    addButton.addEventListener('click', () => {
      carrinho.exibirCarrinho();
      salvarCarrinhoLocalStorage();
    });
  }

//___________________________________________________________________________________________________________________

  class Produto {
    constructor(title, price, imageSrc) {
      this.title = title;
      this.price = price;
      this.imageSrc = imageSrc;
    }
  }

  class Carrinho {
    constructor() {
      this.itens = [];
    }

    adicionarItem(produto) {
      for (const item of this.itens) {
        if (item.produto.title === produto.title) {
          alert('O produto já está no carrinho!');
          return;
        }
      }

      const item = {
        produto: produto,
        quantidade: 1
      };
      this.itens.push(item);
    }

    removerItem(produto) {

      for (let i = 0; i < this.itens.length; i++) {
        if (this.itens[i].produto.title === produto.title) {
      
          this.itens.splice(i, 1);
          return;
        }
      }
    }

    atualizarQuantidade(produto, quantidade) {
      for (const item of this.itens) {
        if (item.produto.title === produto.title) {

          item.quantidade = quantidade;
          return;
        }
      }
    }

    calcularTotal() {
      let total = 0;
      for (const item of this.itens) {
        total += item.produto.price * item.quantidade;
      }
      return total;
    }

    exibirCarrinho() {
      const cartItems = document.querySelector('.cart-items');
      cartItems.innerHTML = '';

      for (const item of this.itens) {
        const cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        const cartRowContents = `
          <div class="cart-item cart-column">
            <img class="cart-item-image" src="${item.produto.imageSrc}" alt="" width="100" height="100">
            <span class="cart-item-title">${item.produto.title}</span>
          </div>
          <span class="cart-price cart-column">R$ ${item.produto.price.toFixed(2)}</span>
          <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" name="" id="" value="${item.quantidade}">
            <button class="btn btn-danger cart-quantity-button" type="button">Remover</button>
          </div>
        `;

        cartRow.innerHTML = cartRowContents;
        cartItems.appendChild(cartRow);

        const removeButton = cartRow.querySelector('.btn-danger');
        removeButton.addEventListener('click', () => {
          this.removerItem(item.produto);
          this.exibirCarrinho();
          this.atualizarTotal();
          salvarCarrinhoLocalStorage();
        });

        const quantityInput = cartRow.querySelector('.cart-quantity-input');
        quantityInput.addEventListener('change', () => {
          const newQuantity = parseInt(quantityInput.value);
          this.atualizarQuantidade(item.produto, newQuantity);
          this.atualizarTotal();
          salvarCarrinhoLocalStorage();
        });
      }

      this.atualizarTotal();
    }

    atualizarTotal() {
      const total = this.calcularTotal();
      const cartTotalPrice = document.querySelector('.cart-total-price');
      cartTotalPrice.innerText = `R$ ${total.toFixed(2)}`;
    }
  }

  function salvarCarrinhoLocalStorage() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho.itens));
  }

  function carregarCarrinhoLocalStorage() {
    const carrinhoData = localStorage.getItem('carrinho');
    if (carrinhoData) {
      carrinho.itens = JSON.parse(carrinhoData);

      carrinho.exibirCarrinho();
    }
  }

  const carrinho = new Carrinho();
  carregarCarrinhoLocalStorage();
  carrinho.exibirCarrinho();

  sectionProdutos.addEventListener('click', (event) => {
    if (event.target.classList.contains('shop-item-button')) {
      const shopItem = event.target.parentElement.parentElement;
      const title = shopItem.querySelector('.shop-item-title').innerText;
      const price = parseFloat(shopItem.querySelector('.shop-item-price').innerText.replace('R$', ''));
      const imageSrc = shopItem.querySelector('.shop-item-image').src;
      const produto = new Produto(title, price, imageSrc);
      carrinho.adicionarItem(produto);
      carrinho.exibirCarrinho();
      salvarCarrinhoLocalStorage();
    }
  });

  const purchaseButton = document.querySelector('.btn-purchase');
  purchaseButton.addEventListener('click', () => {
    alert('Obrigado pela sua compra!');
    carrinho.itens = [];
    carrinho.exibirCarrinho();
    salvarCarrinhoLocalStorage();
  });
});
