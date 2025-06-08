const express = require('express');
const router = express.Router();
const db = require('./db');

// registration
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        await db.query(
            'INSERT INTO users (email, password, name, last_login, status) VALUES ($1, $2, $3, NOW(), $4)',
            [email, password, name, 'active']
        );
        res.json({ success: true });
    } catch (err) {
        if (err.code === '23505') {
            // 23505 — unique_violation (email уже есть)
            res.status(400).json({ error: 'User already exists' });
        } else {
            console.error('Registration error:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await db.query(
        'SELECT * FROM users WHERE email = $1 AND password = $2 AND status != $3',
        [email, password, 'blocked']
    );

    if (result.rows.length > 0) {
        await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [result.rows[0].id]);
        res.json({ success: true, userId: result.rows[0].id, name: result.rows[0].name });
    } else {
        res.status(401).json({ error: 'Invalid credentials or blocked' });
    }
});

module.exports = router;
