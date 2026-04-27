const express = require('express');
const { getDb } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// List all SEs
router.get('/', (req, res, next) => {
  try {
    const db = getDb();
    const { search, tag, page = 1, limit = 20 } = req.query;
    
    let query = 'SELECT * FROM social_enterprises WHERE 1=1';
    const params = [];
    
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    db.all(query, params, (err, rows) => {
      if (err) return next(err);
      
      db.get('SELECT COUNT(*) as total FROM social_enterprises', [], (err, count) => {
        if (err) return next(err);
        res.json({ data: rows, total: count.total, page: parseInt(page), limit: parseInt(limit) });
      });
    });
  } catch (err) {
    next(err);
  }
});

// Get SE by ID
router.get('/:id', (req, res, next) => {
  try {
    const db = getDb();
    db.get('SELECT * FROM social_enterprises WHERE id = ?', [req.params.id], (err, se) => {
      if (err) return next(err);
      if (!se) {
        return res.status(404).json({ message: 'Social enterprise not found' });
      }
      
      db.all('SELECT * FROM products WHERE se_id = ?', [req.params.id], (err, products) => {
        if (err) return next(err);
        res.json({ ...se, products });
      });
    });
  } catch (err) {
    next(err);
  }
});

// Create SE (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res, next) => {
  try {
    const db = getDb();
    const { name, description, logo_url, website, contact_email, contact_phone, address } = req.body;
    
    db.run(
      'INSERT INTO social_enterprises (name, description, logo_url, website, contact_email, contact_phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, logo_url, website, contact_email, contact_phone, address],
      function(err) {
        if (err) return next(err);
        res.status(201).json({ id: this.lastID, ...req.body });
      }
    );
  } catch (err) {
    next(err);
  }
});

// Update SE (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res, next) => {
  try {
    const db = getDb();
    const { name, description, logo_url, website, contact_email, contact_phone, address } = req.body;
    
    db.run(
      'UPDATE social_enterprises SET name = ?, description = ?, logo_url = ?, website = ?, contact_email = ?, contact_phone = ?, address = ? WHERE id = ?',
      [name, description, logo_url, website, contact_email, contact_phone, address, req.params.id],
      (err) => {
        if (err) return next(err);
        res.json({ id: parseInt(req.params.id), ...req.body });
      }
    );
  } catch (err) {
    next(err);
  }
});

// Delete SE (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res, next) => {
  try {
    const db = getDb();
    db.run('DELETE FROM social_enterprises WHERE id = ?', [req.params.id], (err) => {
      if (err) return next(err);
      res.status(204).send();
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
