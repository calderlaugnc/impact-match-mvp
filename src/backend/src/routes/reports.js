const express = require('express');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// List reports
router.get('/', authenticateToken, (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.user.userId;
    
    db.all(
      'SELECT id, title, period_start, period_end, total_beneficiaries, total_spending, created_at FROM reports WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
      (err, reports) => {
        if (err) return next(err);
        res.json(reports);
      }
    );
  } catch (err) {
    next(err);
  }
});

// Get report by ID
router.get('/:id', authenticateToken, (req, res, next) => {
  try {
    const db = getDb();
    db.get(
      'SELECT * FROM reports WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId],
      (err, report) => {
        if (err) return next(err);
        
        if (!report) {
          return res.status(404).json({ message: 'Report not found' });
        }
        
        res.json({
          ...report,
          data: JSON.parse(report.data || '{}')
        });
      }
    );
  } catch (err) {
    next(err);
  }
});

// Create report
router.post('/', authenticateToken, (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.user.userId;
    const { title, period_start, period_end, data, total_beneficiaries, total_spending } = req.body;
    
    db.run(
      'INSERT INTO reports (user_id, title, period_start, period_end, data, total_beneficiaries, total_spending) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, title, period_start, period_end, JSON.stringify(data || {}), total_beneficiaries || 0, total_spending || 0],
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
