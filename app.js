const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'restaurant_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bepRoutes = require('./routes/bepRoutes');
const boiBanRoutes = require('./routes/boiBanRoutes');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/bep', bepRoutes);
app.use('/boiban', boiBanRoutes);

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server restaurant app đang chạy tại http://localhost:${PORT}`);
});
