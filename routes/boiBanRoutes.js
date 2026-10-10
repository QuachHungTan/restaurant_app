const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth, requireBoiBan } = require('../middlewares/auth');
const boiBanView = require('../views/boiban');

// Trang Boi Ban Dat Mon & Xem Hoa Don ca nhan
router.get('/boiban', requireAuth, requireBoiBan, async (req, res) => {
  try {
    const currentUser = req.session.user;
    const [categories] = await db.query('SELECT * FROM categories');
    const [menu] = await db.query('SELECT menu.*, categories.Name as CategoryName FROM menu JOIN categories ON menu.Category_ID = categories.ID');
    
    // Chi lay HoaDon do chinh nhan vien nay order
    const [myOrders] = await db.query('SELECT * FROM HoaDon WHERE TenNhanVienOrder = ? ORDER BY ID DESC', [currentUser.name]);

    res.send(boiBanView(currentUser, categories, menu, myOrders));
  } catch (err) {
    res.status(500).send('Loi CSDL: ' + err.message);
  }
});

// API Boi Ban Dat Mon
router.post('/api/boiban/order', requireAuth, requireBoiBan, async (req, res) => {
  const { tableNumber, cart } = req.body;
  if (!tableNumber || !cart || cart.length === 0) {
    return res.status(400).json({ success: false, message: 'Du lieu khong hop le!' });
  }

  const danhSachMonText = cart.map(i => `${i.name} x ${i.quantity}`).join(', ');
  const tongTien = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const tenNV = req.session.user.name;

  try {
    await db.query(
      'INSERT INTO HoaDon (SoBan, TenNhanVienOrder, DanhSachMon, TongTien, TrangThai) VALUES (?, ?, ?, ?, 0)',
      [tableNumber, tenNV, danhSachMonText, tongTien]
    );
    res.json({ success: true, message: 'Dat mon thanh cong!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Loi luu don hang!' });
  }
});

module.exports = router;
