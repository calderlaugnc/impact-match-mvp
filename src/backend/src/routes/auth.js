const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('company_name').notEmpty().trim(),
  body('contact_name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company_name, contact_name, email, password } = req.body;
    const db = getDb();
    
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) return next(err);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const password_hash = await bcrypt.hash(password, 10);
      db.run(
        'INSERT INTO users (company_name, contact_name, email, password_hash) VALUES (?, ?, ?, ?)',
        [company_name, contact_name, email, password_hash],
        function(err) {
          if (err) return next(err);
          
          const token = jwt.sign(
            { userId: this.lastID, email, role: 'user' },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            token,
            user: { id: this.lastID, company_name, contact_name, email, role: 'user' }
          });
        }
      );
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = getDb();
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: { id: user.id, company_name: user.company_name, contact_name: user.contact_name, email: user.email, role: user.role }
      });
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
