const express = require('express');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const matchingService = require('../services/matching');

const router = express.Router();

// Create match request
router.post('/', authenticateToken, (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.user.userId;
    const { category, budget_min, budget_max, people_count, preferred_tags, timeframe } = req.body;
    
    const requestData = JSON.stringify({ category, budget_min, budget_max, people_count, preferred_tags, timeframe });
    
    // Run matching algorithm (async)
    matchingService.findMatches({ category, budget_min, budget_max, people_count, preferred_tags }, (err, results) => {
      if (err) return next(err);
      
      db.run(
        'INSERT INTO matches (user_id, request_data, results) VALUES (?, ?, ?)',
        [userId, requestData, JSON.stringify(results)],
        function(err) {
          if (err) return next(err);
          
          res.status(201).json({
            match_id: this.lastID,
            request: { category, budget_min, budget_max, people_count, preferred_tags, timeframe },
            results
          });
        }
      );
    });
  } catch (err) {
    next(err);
  }
});

// Get user's match history
router.get('/', authenticateToken, (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.user.userId;
    
    db.all('SELECT * FROM matches WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, matches) => {
      if (err) return next(err);
      
      res.json(matches.map(m => ({
        ...m,
        request_data: JSON.parse(m.request_data),
        results: JSON.parse(m.results || '[]')
      })));
    });
  } catch (err) {
    next(err);
  }
});

// Get match by ID
router.get('/:id', authenticateToken, (req, res, next) => {
  try {
    const db = getDb();
    db.get('SELECT * FROM matches WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId], (err, match) => {
      if (err) return next(err);
      
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      
      res.json({
        ...match,
        request_data: JSON.parse(match.request_data),
        results: JSON.parse(match.results || '[]')
      });
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
