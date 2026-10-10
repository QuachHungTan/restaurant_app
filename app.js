const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bepRoutes = require('./routes/bepRoutes');
const boiBanRoutes = require('./routes/boiBanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: 'restaurant_secret_key_2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 }
}));

// Route chuyển hướng trang chủ
app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  if (req.session.user.role === 'Admin') return res.redirect('/admin');
  if (req.session.user.role === 'Bep') return res.redirect('/bep');
  return res.redirect('/boiban');
});

// Dang ky cac Route chuc nang
app.use(authRoutes);
app.use(adminRoutes);
app.use(bepRoutes);
app.use(boiBanRoutes);

// Launch Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server dang chay tai: http://0.0.0.0:${PORT}`);
});
