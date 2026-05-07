const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Sample product database
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 342,
    description: "High-quality sound with noise cancellation"
  },
  {
    id: 2,
    name: "Leather Crossbody Bag",
    price: 89.99,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 128,
    description: "Premium Italian leather bag"
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    price: 299.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 256,
    description: "Advanced health monitoring features"
  },
  {
    id: 4,
    name: "Minimalist Sneakers",
    price: 124.99,
    category: "footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 189,
    description: "Comfortable and stylish everyday shoes"
  },
  {
    id: 5,
    name: "Wool Winter Coat",
    price: 249.99,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1539533057440-7276acad91e3?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 401,
    description: "Premium wool blend jacket"
  },
  {
    id: 6,
    name: "Vintage Sunglasses",
    price: 159.99,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 95,
    description: "Classic UV protection sunglasses"
  },
  {
    id: 7,
    name: "Ceramic Coffee Mug Set",
    price: 45.99,
    category: "home",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 212,
    description: "Set of 4 premium ceramic mugs"
  },
  {
    id: 8,
    name: "Portable Phone Charger",
    price: 34.99,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 567,
    description: "Fast charging 20000mAh power bank"
  }
];

// Routes
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let filtered = products;

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/checkout', (req, res) => {
  const { items, total } = req.body;
  const orderId = 'ORD-' + Date.now();
  res.json({
    success: true,
    orderId,
    message: 'Order placed successfully!',
    total
  });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Shopping app running on http://localhost:${PORT}`);
});
