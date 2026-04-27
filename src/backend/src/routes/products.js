const express = require('express');
const { getDb } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// List products
router.get('/', (req, res, next) => {
  try {
    const db = getDb();
    const { type, se_id, tag, min_price, max_price, page = 1, limit = 20 } = req.query;
    
    let query = 'SELECT p.*, se.name as se_name FROM products p JOIN social_enterprises se ON p.se_id = se.id WHERE 1=1';
    const params = [];
    
    if (type) {
      query += ' AND p.type = ?';
      params.push(type);
    }
    if (se_id) {
      query += ' AND p.se_id = ?';
      params.push(se_id);
    }
    if (min_price) {
      query += ' AND p.price_min >= ?';
      params.push(min_price);
    }
    if (max_price) {
      query += ' AND p.price_max <= ?';
      params.push(max_price);
    }
    
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    db.all(query, params, (err, products) => {
      if (err) return next(err);
      res.json({ 
        data: products.map(p => ({ 
          ...p, 
          tags: JSON.parse(p.tags || '[]'), 
          impact_metrics: JSON.parse(p.impact_metrics || '{}') 
        })) 
      });
    });
  } catch (err) {
    next(err);
  }
});

// Get product by ID
router.get('/:id', (req, res, next) => {
  try {
    const db = getDb();
    db.get(
      'SELECT p.*, se.name as se_name FROM products p JOIN social_enterprises se ON p.se_id = se.id WHERE p.id = ?',
      [req.params.id],
      (err, product) => {
        if (err) return next(err);
        
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({
          ...product,
          tags: JSON.parse(product.tags || '[]'),
          impact_metrics: JSON.parse(product.impact_metrics || '{}')
        });
      }
    );
  } catch (err) {
    next(err);
  }
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res, next) => {
  try {
    const db = getDb();
    const { se_id, name, type, description, price_min, price_max, unit, capacity_min, capacity_max, duration, tags, impact_metrics } = req.body;
    
    db.run(
      'INSERT INTO products (se_id, name, type, description, price_min, price_max, unit, capacity_min, capacity_max, duration, tags, impact_metrics) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [se_id, name, type, description, price_min, price_max, unit, capacity_min, capacity_max, duration, JSON.stringify(tags || []), JSON.stringify(impact_metrics || {})],
      function(err) {
        if (err) return next(err);
        
        res.status(201).json({ id: this.lastID, ...req.body });
      }
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
