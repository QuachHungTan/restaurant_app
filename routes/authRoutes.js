const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const renderLoginPage = require('../views/login');

// GET /auth/login
router.get('/login', (req, res) => {
  res.send(renderLoginPage());
});

// POST /auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send(renderLoginPage('Vui lòng nhập đầy đủ tài khoản và mật khẩu!'));
  }

  // Tìm tài khoản theo Name
  db.query('SELECT * FROM Account WHERE Name = ?', [username.trim()], async (err, results) => {
    if (err || results.length === 0) {
      return res.send(renderLoginPage('Tài khoản hoặc mật khẩu không chính xác!'));
    }

    const user = results[0];

    // Chỉ cần 1 dòng duy nhất để kiểm tra mật khẩu băm Bcrypt
    const isMatch = await bcrypt.compare(password.trim(), user.Pass);

    if (!isMatch) {
      return res.send(renderLoginPage('Tài khoản hoặc mật khẩu không chính xác!'));
    }

    // Đăng nhập thành công -> Lưu Session
    req.session.user = {
      id: user.ID || user.id,
      Username: user.Name,
      Role: user.ChucVu
    };

    // Chuyển hướng theo vai trò
    const role = (user.ChucVu || '').toLowerCase();
    if (role === 'admin') return res.redirect('/admin');
    if (role === 'bep') return res.redirect('/bep');
    if (role === 'boiban') return res.redirect('/boiban');

    res.redirect('/auth/login');
  });
});

// GET /auth/logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
