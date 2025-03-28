// app.js
document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const cart = [];

    // Render Products
    function renderProducts() {
        productContainer.innerHTML = products.map(product => `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl duration-300 product-card">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    class="w-full h-64 object-cover"
                />
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2 text-gray-800">${product.name}</h3>
                    <p class="text-gray-600 mb-4">${product.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-semibold text-blue-600">$${product.price}</span>
                        <button 
                            onclick="addToCart(${product.id})" 
                            class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Add to Cart Functionality
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push(product);
            updateCartDisplay();
            showCartNotification(product);
        }
    }

    // Update Cart Display
    function updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }

    // Cart Notification
    function showCartNotification(product) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
        notification.textContent = `Added ${product.name} to cart`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initialize Products
    renderProducts();
});
