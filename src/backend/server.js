require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const socialEnterpriseRoutes = require('./src/routes/socialEnterprises');
const productRoutes = require('./src/routes/products');
const matchRoutes = require('./src/routes/matches');
const reportRoutes = require('./src/routes/reports');
const reportPdfRoutes = require('./src/routes/reports_pdf');
const impactRoutes = require('./src/routes/impact');

const errorHandler = require('./src/middleware/errorHandler');
const { initializeDatabase } = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB (async)
initializeDatabase().then(() => {
  console.log('Database ready');
}).catch(err => {
  console.error('Database init failed:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/social-enterprises', socialEnterpriseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/reports', reportPdfRoutes);
app.use('/api/impact', impactRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`IMPACT MATCH API running on port ${PORT}`);
});

module.exports = app;
