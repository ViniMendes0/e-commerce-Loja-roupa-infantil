let navbar = document.querySelector('.navbar');
let cartItem = document.querySelector('.cart-items-container');
let searchForm = document.querySelector('.search-form');
let cartItemsContainer = document.querySelector('.cart-items-container');
let totalPriceElement = document.createElement('div');
totalPriceElement.classList.add('total-price');
cartItemsContainer.appendChild(totalPriceElement);

// Código existente para alternar visibilidade de menus
document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    cartItem.classList.remove('active');
    searchForm.classList.remove('active');
}

document.querySelector('#cart-btn').onclick = () => {
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
    searchForm.classList.remove('active');
}

// Função para atualizar o preço total
function updateTotalPrice() {
    let total = 0;
    let prices = document.querySelectorAll('.cart-item .price');
    prices.forEach(priceElement => {
        let quantity = parseInt(priceElement.nextElementSibling.nextElementSibling.textContent.replace('Quantidade: ', ''));
        let price = parseFloat(priceElement.textContent.replace('R$', '').replace(',', '.'));
        total += price * quantity;
    });
    totalPriceElement.textContent = `Total: R$${total.toFixed(2).replace('.', ',')}`;
}

// Função para remover item do carrinho
function removeCartItem(event) {
    let cartItem = event.target.closest('.cart-item');
    let size = cartItem.querySelector('.size').textContent.split(': ')[1];
    let productTitle = cartItem.querySelector('h3').textContent;
    let productBox = [...document.querySelectorAll('.box')].find(box => box.querySelector('h3').textContent === productTitle);
    let stockElement = productBox.querySelector(`.stock span[data-size="${size}"]`);
    stockElement.textContent = parseInt(stockElement.textContent) + parseInt(cartItem.querySelector('.quantity').textContent.replace('Quantidade: ', ''));
    cartItem.remove();
    updateTotalPrice();
}

// Adicionar evento de clique para remover itens do carrinho
document.querySelectorAll('.cart-item .fa-times').forEach(button => {
    button.onclick = removeCartItem;
});

// Função para adicionar item ao carrinho
function addToCart(event) {
    event.preventDefault(); // Prevenir comportamento padrão do link
    let button = event.target;
    let product = button.closest('.box');
    let title = product.querySelector('h3').textContent;
    let price = product.querySelector('.price').textContent;
    let imgSrc = product.querySelector('img').src;
    let sizeSelect = product.querySelector('.size');
    let size = sizeSelect.value;
    let stockElement = product.querySelector(`.stock span[data-size="${size}"]`);
    let stock = parseInt(stockElement.textContent);

    if (stock <= 0) {
        alert("Este tamanho está fora de estoque!");
        return;
    }

    stockElement.textContent = stock - 1;

    let existingCartItem = [...document.querySelectorAll('.cart-item')].find(cartItem => {
        return cartItem.querySelector('h3').textContent === title && cartItem.querySelector('.size').textContent === `Tamanho: ${size}`;
    });

    if (existingCartItem) {
        let quantityElement = existingCartItem.querySelector('.quantity');
        let quantity = parseInt(quantityElement.textContent.replace('Quantidade: ', ''));
        quantityElement.textContent = `Quantidade: ${quantity + 1}`;
    } else {
        let cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <span class="fas fa-times"></span>
            <img src="${imgSrc}" alt="">
            <div class="content">
                <h3>${title}</h3>
                <div class="price">${price}</div>
                <div class="size">Tamanho: ${size}</div>
                <div class="quantity">Quantidade: 1</div>
            </div>
        `;
        cartItem.querySelector('.fa-times').onclick = removeCartItem;
        cartItemsContainer.insertBefore(cartItem, totalPriceElement);
    }
    updateTotalPrice(); // Chame a função para atualizar o preço total
}

// Adicionar evento de clique para adicionar itens ao carrinho
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.onclick = addToCart;
});

// Função para enviar dados da compra via WhatsApp
function sendOrder() {
    let orderItems = [];
    document.querySelectorAll('.cart-item').forEach(cartItem => {
        let title = cartItem.querySelector('h3').textContent;
        let price = cartItem.querySelector('.price').textContent;
        let size = cartItem.querySelector('.size').textContent;
        let quantity = cartItem.querySelector('.quantity').textContent;
        orderItems.push(`${title} - ${price} - ${size} - ${quantity}`);
    });
    let total = totalPriceElement.textContent;
    let message = `Pedido:\n${orderItems.join('\n')}\n\n${total}`;
    let phoneNumber = 'seu-numero-de-whatsapp';
    let whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Adicionar botão de finalizar compra
let checkoutButton = document.createElement('a');
checkoutButton.classList.add('btn');
checkoutButton.textContent = 'Finalizar Compra';
checkoutButton.onclick = sendOrder;
cartItemsContainer.appendChild(checkoutButton);

// Função de busca para filtrar os itens
document.querySelector('#search-box').oninput = () => {
    let searchQuery = document.querySelector('#search-box').value.toLowerCase();
    document.querySelectorAll('.box').forEach(product => {
        let title = product.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchQuery)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}
