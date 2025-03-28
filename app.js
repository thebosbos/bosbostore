document.addEventListener('DOMContentLoaded', () => {
    class CartManager {
        constructor() {
            this.cart = JSON.parse(localStorage.getItem('cart')) || [];
            this.cartModal = this.createCartModal();
            this.renderProducts();
            this.setupEventListeners();
            this.updateCartIcon();
        }

        renderProducts() {
            const productContainer = document.getElementById('product-container');
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
                            <span class="text-2xl font-semibold text-blue-600">$${product.price.toFixed(2)}</span>
                            <button 
                                data-product-id="${product.id}"
                                class="add-to-cart-btn bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add event listeners to Add to Cart buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', (e) => this.addToCart(e));
            });
        }

        addToCart(e) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
            
            // Check if product is already in cart
            const existingItemIndex = this.cart.findIndex(item => item.id === productId);

            if (existingItemIndex > -1) {
                // Increase quantity if already in cart
                this.cart[existingItemIndex].quantity++;
            } else {
                // Add new item to cart
                this.cart.push({
                    ...product,
                    quantity: 1
                });
            }

            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(this.cart));

            // Update cart icon
            this.updateCartIcon();

            // Show confirmation
            this.showAddToCartConfirmation(product);
        }

        showAddToCartConfirmation(product) {
            const confirmationToast = document.createElement('div');
            confirmationToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
            confirmationToast.textContent = `${product.name} added to cart!`;
            document.body.appendChild(confirmationToast);

            setTimeout(() => {
                confirmationToast.remove();
            }, 3000);
        }

        createCartModal() {
            const modal = document.createElement('div');
            modal.id = 'cart-modal';
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center';
            modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold">Your Cart</h2>
                        <button id="close-cart" class="text-gray-600 hover:text-gray-900">✕</button>
                    </div>
                    <div id="cart-items"></div>
                    <div id="cart-total" class="mt-4 text-right font-bold"></div>
                    <div class="flex justify-between mt-4">
                        <button id="clear-cart" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Clear Cart
                        </button>
                        <button id="checkout-btn" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Checkout
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            return modal;
        }

        showCartModal() {
            const cartItemsContainer = document.getElementById('cart-items');
            const cartTotalElement = document.getElementById('cart-total');

            // Clear previous cart items
            cartItemsContainer.innerHTML = '';

            // Calculate total
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Render cart items
            this.cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'flex justify-between items-center border-b py-2';
                itemElement.innerHTML = `
                    <div class="flex items-center">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover mr-4 rounded">
                        <div>
                            <span class="font-bold">${item.name}</span>
                            <div class="flex items-center mt-1">
                                <button class="quantity-btn decrease px-2 bg-gray-200 rounded-l" data-index="${index}">-</button>
                                <span class="px-4 bg-gray-100">${item.quantity}</span>
                                <button class="quantity-btn increase px-2 bg-gray-200 rounded-r" data-index="${index}">+</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="ml-2 text-red-500 remove-item" data-index="${index}">✕</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            // Set total
            cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;

            // Remove item functionality
            cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    this.cart.splice(index, 1);
                    this.updateCart();
                });
            });

            // Quantity adjustment buttons
            cartItemsContainer.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    if (e.target.classList.contains('increase')) {
                        this.cart[index].quantity++;
                    } else {
                        this.cart[index].quantity = Math.max(1, this.cart[index].quantity - 1);
                    }
                    this.updateCart();
                });
            });

            // Show modal
            this.cartModal.classList.remove('hidden');
        }

        updateCart() {
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(this.cart));
            
            // Update cart modal
            this.showCartModal();
            
            // Update cart icon
            this.updateCartIcon();
        }

        updateCartIcon() {
            // Update cart quantity in navigation
            const cartQuantity = this.cart.reduce((total, item) => total + item.quantity, 0);
            const cartNavItem = document.querySelector('a[href="#"]');
            
            // Remove existing badge if exists
            const existingBadge = cartNavItem.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }

            // Add badge if cart is not empty
            if (cartQuantity > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-2';
                badge.textContent = cartQuantity;
                cartNavItem.appendChild(badge);
            }
        }

        setupEventListeners() {
            // Cart modal close button
            document.getElementById('close-cart').addEventListener('click', () => {
                this.cartModal.classList.add('hidden');
            });

            // Open cart from navigation
            document.querySelector('a[href="#"]').addEventListener('click', (e) => {
                e.preventDefault();
                this.showCartModal();
            });

            // Clear cart button
            document.getElementById('clear-cart').addEventListener('click', () => {
                this.cart = [];
                this.updateCart();
            });

            // Checkout button
            document.getElementById('checkout-btn').addEventListener('click', () => {
                alert('Checkout functionality to be implemented');
            });
        }
    }

    // Initialize cart manager
    new CartManager();
});
