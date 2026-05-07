const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory product data
const products = [
    { id: 1, name: 'Premium Wireless Headphones', price: 99.99, category: 'Electronics', image: '🎧', description: 'High-quality wireless headphones with noise cancellation', rating: 4.5 },
    { id: 2, name: 'Smart Fitness Watch', price: 149.99, category: 'Electronics', image: '⌚', description: 'Track your fitness goals with this smart watch', rating: 4.3 },
    { id: 3, name: 'Organic Cotton T-Shirt', price: 29.99, category: 'Clothing', image: '👕', description: 'Comfortable 100% organic cotton t-shirt', rating: 4.7 },
    { id: 4, name: 'Classic Denim Jeans', price: 59.99, category: 'Clothing', image: '👖', description: 'Stylish and durable denim jeans', rating: 4.4 },
    { id: 5, name: 'Home Coffee Maker', price: 79.99, category: 'Home', image: '☕', description: 'Brew perfect coffee at home', rating: 4.6 },
    { id: 6, name: 'Stainless Steel Cookware Set', price: 199.99, category: 'Home', image: '🍳', description: 'Professional grade cookware set', rating: 4.8 },
    { id: 7, name: 'Wireless Gaming Mouse', price: 49.99, category: 'Electronics', image: '🖱️', description: 'High-precision gaming mouse', rating: 4.5 },
    { id: 8, name: 'Yoga Mat Premium', price: 39.99, category: 'Sports', image: '🧘', description: 'Eco-friendly non-slip yoga mat', rating: 4.6 }
];

// In-memory cart storage (in real app, use database)
let cart = [];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.post('/api/cart', (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    const cartItem = cart.find(item => item.productId === productId);
    
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        });
    }
    
    res.json(cart);
});

app.put('/api/cart/:productId', (req, res) => {
    const { quantity } = req.body;
    const productId = parseInt(req.params.productId);
    const cartItem = cart.find(item => item.productId === productId);
    
    if (cartItem) {
        if (quantity <= 0) {
            cart = cart.filter(item => item.productId !== productId);
        } else {
            cartItem.quantity = quantity;
        }
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Item not found in cart' });
    }
});

app.delete('/api/cart/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    cart = cart.filter(item => item.productId !== productId);
    res.json(cart);
});

app.delete('/api/cart', (req, res) => {
    cart = [];
    res.json(cart);
});

app.post('/api/checkout', (req, res) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = {
        orderId: Date.now(),
        items: [...cart],
        total: total,
        date: new Date().toISOString()
    };
    cart = [];
    res.json({ success: true, order: order });
});

// Serve static files from public directory
app.use(express.static('public'));

// Create public directory and HTML file
const fs = require('fs');
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Write index.html with modern, attractive UI
fs.writeFileSync('public/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ModernShop - Premium Online Shopping</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }

        /* Navbar */
        .navbar {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .cart-icon {
            position: relative;
            cursor: pointer;
            font-size: 1.5rem;
        }

        .cart-count {
            position: absolute;
            top: -8px;
            right: -12px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 0.7rem;
            font-weight: bold;
        }

        /* Main Container */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 3rem;
            margin-bottom: 2rem;
            color: white;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .hero p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        /* Products Grid */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .product-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }

        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .product-image {
            font-size: 5rem;
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .product-info {
            padding: 1.5rem;
        }

        .product-name {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #333;
        }

        .product-category {
            color: #667eea;
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
        }

        .product-price {
            font-size: 1.3rem;
            font-weight: bold;
            color: #764ba2;
            margin-bottom: 0.5rem;
        }

        .product-rating {
            color: #ffc107;
            margin-bottom: 1rem;
        }

        .add-to-cart-btn {
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.2s ease;
        }

        .add-to-cart-btn:hover {
            transform: scale(1.02);
        }

        /* Cart Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1001;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: white;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            padding: 2rem;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .close-modal {
            font-size: 1.5rem;
            cursor: pointer;
            color: #999;
        }

        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #eee;
        }

        .cart-item-info {
            flex: 1;
        }

        .cart-item-name {
            font-weight: bold;
        }

        .cart-item-price {
            color: #764ba2;
        }

        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .quantity-btn {
            background: #f0f0f0;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
        }

        .remove-item {
            background: #ff4757;
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 1rem;
        }

        .cart-total {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 2px solid #eee;
            font-size: 1.2rem;
            font-weight: bold;
            text-align: right;
        }

        .checkout-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            cursor: pointer;
            margin-top: 1rem;
        }

        /* Toast Notification */
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            animation: slideInRight 0.3s ease;
            z-index: 1002;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        /* Loading Spinner */
        .loading {
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
            color: white;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .hero h1 {
                font-size: 1.5rem;
            }
            
            .products-grid {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1rem;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">🛍️ ModernShop</div>
            <div class="cart-icon" onclick="openCart()">
                🛒
                <span class="cart-count" id="cartCount">0</span>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="hero">
            <h1>Welcome to ModernShop</h1>
            <p>Discover premium products at amazing prices | Free shipping on orders over $50</p>
        </div>
        
        <div id="productsContainer">
            <div class="loading">Loading amazing products...</div>
        </div>
    </div>

    <!-- Cart Modal -->
    <div id="cartModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Your Shopping Cart</h2>
                <span class="close-modal" onclick="closeCart()">&times;</span>
            </div>
            <div id="cartItems"></div>
            <div id="cartTotal" class="cart-total"></div>
            <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
        </div>
    </div>

    <script>
        let currentCart = [];
        
        // Load products on page load
        async function loadProducts() {
            try {
                const response = await fetch('/api/products');
                const products = await response.json();
                displayProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
                document.getElementById('productsContainer').innerHTML = '<div class="loading">Failed to load products. Please refresh.</div>';
            }
        }
        
        function displayProducts(products) {
            const container = document.getElementById('productsContainer');
            container.innerHTML = \`
                <div class="products-grid">
                    \${products.map(product => \`
                        <div class="product-card">
                            <div class="product-image">\${product.image}</div>
                            <div class="product-info">
                                <div class="product-name">\${product.name}</div>
                                <div class="product-category">\${product.category}</div>
                                <div class="product-price">$\${product.price.toFixed(2)}</div>
                                <div class="product-rating">\${'★'.repeat(Math.floor(product.rating))}\${product.rating % 1 ? '½' : ''}\${'☆'.repeat(5 - Math.ceil(product.rating))}</div>
                                <button class="add-to-cart-btn" onclick="addToCart(\${product.id})">Add to Cart 🛒</button>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            \`;
        }
        
        async function addToCart(productId) {
            try {
                const response = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId, quantity: 1 })
                });
                currentCart = await response.json();
                updateCartUI();
                showToast('Product added to cart!');
            } catch (error) {
                console.error('Error adding to cart:', error);
                showToast('Failed to add to cart', 'error');
            }
        }
        
        async function updateCartCount() {
            try {
                const response = await fetch('/api/cart');
                const cart = await response.json();
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                document.getElementById('cartCount').textContent = totalItems;
                currentCart = cart;
            } catch (error) {
                console.error('Error updating cart count:', error);
            }
        }
        
        async function openCart() {
            await updateCartCount();
            const modal = document.getElementById('cartModal');
            modal.style.display = 'flex';
            displayCartItems();
        }
        
        function closeCart() {
            document.getElementById('cartModal').style.display = 'none';
        }
        
        async function displayCartItems() {
            const cartItemsDiv = document.getElementById('cartItems');
            if (currentCart.length === 0) {
                cartItemsDiv.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
                document.getElementById('cartTotal').innerHTML = '';
                return;
            }
            
            cartItemsDiv.innerHTML = currentCart.map(item => \`
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">\${item.name} \${item.image}</div>
                        <div class="cart-item-price">$\${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(\${item.productId}, \${item.quantity - 1})">-</button>
                        <span>\${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(\${item.productId}, \${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="removeFromCart(\${item.productId})">Remove</button>
                    </div>
                </div>
            \`).join('');
            
            const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('cartTotal').innerHTML = \`Total: $\${total.toFixed(2)}\`;
        }
        
        async function updateQuantity(productId, newQuantity) {
            if (newQuantity < 0) return;
            
            try {
                const response = await fetch(\`/api/cart/\${productId}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: newQuantity })
                });
                currentCart = await response.json();
                updateCartUI();
                if (newQuantity === 0) {
                    showToast('Item removed from cart');
                } else {
                    showToast('Cart updated');
                }
            } catch (error) {
                console.error('Error updating quantity:', error);
                showToast('Failed to update cart', 'error');
            }
        }
        
        async function removeFromCart(productId) {
            try {
                const response = await fetch(\`/api/cart/\${productId}\`, {
                    method: 'DELETE'
                });
                currentCart = await response.json();
                updateCartUI();
                showToast('Item removed from cart');
            } catch (error) {
                console.error('Error removing from cart:', error);
                showToast('Failed to remove item', 'error');
            }
        }
        
        async function checkout() {
            try {
                const response = await fetch('/api/checkout', {
                    method: 'POST'
                });
                const result = await response.json();
                if (result.success) {
                    showToast('Order placed successfully! Thank you for shopping!');
                    closeCart();
                    updateCartUI();
                }
            } catch (error) {
                console.error('Error during checkout:', error);
                showToast('Checkout failed. Please try again.', 'error');
            }
        }
        
        async function updateCartUI() {
            await updateCartCount();
            if (document.getElementById('cartModal').style.display === 'flex') {
                await displayCartItems();
            }
        }
        
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.style.background = type === 'success' ? '#28a745' : '#dc3545';
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
        
        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('cartModal');
            if (event.target === modal) {
                closeCart();
            }
        }
        
        // Initialize
        loadProducts();
        updateCartCount();
        
        // Update cart count every 5 seconds
        setInterval(updateCartCount, 5000);
    </script>
</body>
</html>
