const express = require('express');
const router = express.Router();
const db = require('./db');

// Проверка user существует и не заблокирован
router.use(async (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const result = await db.query('SELECT * FROM users WHERE id = $1 AND status != $2', [userId, 'blocked']);
    if (result.rows.length === 0) {
        return res.status(403).json({ error: 'Blocked or unauthenticated' });
    }
    next();
});

// Получить всех пользователей
router.get('/', async (req, res) => {
    const users = await db.query(
        'SELECT id, email, name, last_login, status FROM users ORDER BY last_login DESC'
    );
    res.json(users.rows);
});

// Bulk action
router.post('/bulk-action', async (req, res) => {
    const { action, ids } = req.body;

    if (action === 'block') {
        await db.query('UPDATE users SET status = $1 WHERE id = ANY($2)', ['blocked', ids]);
    } else if (action === 'unblock') {
        await db.query('UPDATE users SET status = $1 WHERE id = ANY($2)', ['active', ids]);
    } else if (action === 'delete') {
        await db.query('DELETE FROM users WHERE id = ANY($1)', [ids]);
    }

    res.json({ success: true });
});

module.exports = router;
