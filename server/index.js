const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// In-memory database for products
let products = [
  {
    id: 1,
    name: 'Chronos Elite',
    price: 2999,
    description: 'Premium digital sports watch with advanced metrics',
    image: '/images/watch-1.png',
    features: ['GPS Tracking', 'Heart Rate Monitor', '50m Water Resistant', '7-day Battery']
  },
  {
    id: 2,
    name: 'Chronos Pro',
    price: 1999,
    description: 'Professional grade sports watch for athletes',
    image: '/images/watch-2.png',
    features: ['Multi-Sport Modes', 'Sleep Tracking', 'Smart Notifications', '5-day Battery']
  },
  {
    id: 3,
    name: 'Chronos Sport',
    price: 1499,
    description: 'Essential sports watch for everyday fitness',
    image: '/images/watch-3.png',
    features: ['Step Counter', 'Calorie Tracking', 'Water Resistant', '3-day Battery']
  }
];

let inquiries = [];

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Submit inquiry
app.post('/api/inquiry', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const inquiry = {
    id: inquiries.length + 1,
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };
  
  inquiries.push(inquiry);
  res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
});

// Get inquiries (admin)
app.get('/api/inquiries', (req, res) => {
  res.json(inquiries);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend for all other routes - use catch-all with named param
app.all('/*path', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
