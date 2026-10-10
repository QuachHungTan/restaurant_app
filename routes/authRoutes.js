const express = require('express');
const router = express.Router();
const db = require('../config/db');
const loginView = require('../views/login');

// Trang Dang Nhap
router.get('/login', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'Admin') return res.redirect('/admin');
    if (req.session.user.role === 'Bep') return res.redirect('/bep');
    return res.redirect('/boiban');
  }
  res.send(loginView());
});

// API Dang Nhap
router.post('/api/login', async (req, res) => {
  const { Name, Pass } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM Account WHERE LOWER(Name) = LOWER(?)', [Name]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Tai khoan khong ton tai!' });
    }

    const user = rows[0];
    if (Pass !== user.Pass) {
      return res.status(401).json({ success: false, message: 'Mat khau khong chinh xac!' });
    }

    req.session.user = {
      id: user.id,
      name: user.Name,
      role: user.ChucVu,
      level: user.Level
    };

    let redirectUrl = '/boiban';
    if (user.ChucVu === 'Admin') redirectUrl = '/admin';
    else if (user.ChucVu === 'Bep') redirectUrl = '/bep';

    res.json({ success: true, redirectUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Loi CSDL!' });
  }
});

// Dang Xuat
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
