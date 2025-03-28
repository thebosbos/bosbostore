// Products Data
const products = [
    {
        id: 1,
        name: 'Classic White T-Shirt',
        price: 29.99,
        description: 'A timeless white t-shirt made from premium cotton.',
        category: 'T-Shirts',
        sizes: ['S', 'M', 'L', 'XL'],
        imageUrl: 'https://via.placeholder.com/300x400?text=White+T-Shirt'
    },
    {
        id: 2,
        name: 'Black Slim Fit Jeans',
        price: 79.99,
        description: 'Stylish black slim fit jeans for everyday wear.',
        category: 'Jeans',
        sizes: ['30', '32', '34', '36'],
        imageUrl: 'https://via.placeholder.com/300x400?text=Black+Jeans'
    },
    {
        id: 3,
        name: 'Summer Floral Dress',
        price: 89.99,
        description: 'Elegant summer dress with beautiful floral print.',
        category: 'Dresses',
        sizes: ['XS', 'S', 'M', 'L'],
        imageUrl: 'https://via.placeholder.com/300x400?text=Floral+Dress'
    }
];

// Cart Management
let cart = [];

// DOM Elements
const productContainer = document.getElementById('product-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalContainer = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const productModal = document.getElementById('product-modal');
const productDetailContent = document.getElementById('product-detail-content');
const closeModalBtn = document.querySelector('.close-modal');

// Navigation
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = document.querySelector(link.getAttribute('href'));
        
        sections.forEach(section => section.classList.remove('active'));
        targetSection.classList.add('active');
    });
});

// Render Products
function renderProducts() {
    productContainer.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <div class="product-actions">
                <button onclick="viewProductDetails(${product.id})">View Details</button>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// View Product Details
function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    
    productDetailContent.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price.toFixed(2)}</p>
        <p>Category: ${product.category}</p>
        <p>Available Sizes: ${product.sizes.join(', ')}</p>
    `;
    
    productModal.style.display = 'block';
}

// Close Modal
closeModalBtn.addEventListener('click', () => {
    productModal.style.display = 'none';
});

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    const existingCartItem = cart.find(item => item.id === productId);
    
    if (existingCartItem) {
        existingCartItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    renderCart();
}

// Render Cart
function renderCart() {
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <span>Qty: ${item.quantity}</span>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');
    
    cartTotalContainer.innerHTML = `Total: $${cartTotal.toFixed(2)}`;
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert('Thank you for your purchase!');
    cart = [];
    renderCart();
});

// Login Form
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (email && password) {
        alert('Login successful!');
        // In a real app, you'd send this to a backend
    } else {
        alert('Please enter email and password');
    }
});

// Initial Render
renderProducts();
renderCart();
