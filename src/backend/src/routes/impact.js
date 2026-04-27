const express = require('express');
const { getDb } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Platform-wide impact summary
router.get('/summary', (req, res, next) => {
  try {
    const db = getDb();
    
    const totalSE = db.prepare('SELECT COUNT(*) as count FROM social_enterprises').get();
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const totalReports = db.prepare('SELECT SUM(total_beneficiaries) as beneficiaries, SUM(total_spending) as spending FROM reports').get();
    
    res.json({
      social_enterprises: totalSE.count,
      products: totalProducts.count,
      registered_companies: totalUsers.count,
      total_beneficiaries: totalReports.beneficiaries || 0,
      total_spending: totalReports.spending || 0
    });
  } catch (err) {
    next(err);
  }
});

// User's impact data
router.get('/user/:userId', authenticateToken, (req, res, next) => {
  try {
    const db = getDb();
    const userId = req.params.userId;
    
    // Verify user can only access their own data
    if (parseInt(userId) !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const reports = db.prepare('SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    const matches = db.prepare('SELECT * FROM matches WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    
    const totalBeneficiaries = reports.reduce((sum, r) => sum + (r.total_beneficiaries || 0), 0);
    const totalSpending = reports.reduce((sum, r) => sum + (r.total_spending || 0), 0);
    
    res.json({
      user_id: parseInt(userId),
      total_beneficiaries: totalBeneficiaries,
      total_spending: totalSpending,
      reports_count: reports.length,
      matches_count: matches.length,
      recent_reports: reports.slice(0, 5).map(r => ({
        ...r,
        data: JSON.parse(r.data || '{}')
      })),
      recent_matches: matches.slice(0, 5).map(m => ({
        ...m,
        request_data: JSON.parse(m.request_data),
        results: JSON.parse(m.results || '[]')
      }))
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
