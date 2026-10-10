const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const adminView = require('../views/admin');

// Trang Dashboard Admin
router.get('/admin', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, ChucVu, Name, Level FROM Account ORDER BY id DESC');
    const [categories] = await db.query('SELECT * FROM categories ORDER BY ID DESC');
    const [menu] = await db.query('SELECT menu.*, categories.Name as CategoryName FROM menu LEFT JOIN categories ON menu.Category_ID = categories.ID ORDER BY menu.ID DESC');
    const [hoadon] = await db.query('SELECT * FROM HoaDon ORDER BY ID DESC');
    
    res.send(adminView(req.session.user, users, categories, menu, hoadon));
  } catch (err) {
    res.status(500).send('Lỗi CSDL Admin: ' + err.message);
  }
});

// --- API QUẢN LÝ DANH MỤC (CATEGORIES) ---
router.post('/api/admin/categories', requireAuth, requireAdmin, async (req, res) => {
  const { Name } = req.body;
  if (!Name) return res.status(400).json({ success: false, message: 'Tên danh mục không được để trống!' });
  try {
    await db.query('INSERT INTO categories (Name) VALUES (?)', [Name]);
    res.json({ success: true, message: 'Thêm danh mục thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm danh mục!' });
  }
});

router.put('/api/admin/categories/:id', requireAuth, requireAdmin, async (req, res) => {
  const { Name } = req.body;
  try {
    await db.query('UPDATE categories SET Name = ? WHERE ID = ?', [Name, req.params.id]);
    res.json({ success: true, message: 'Sửa danh mục thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi sửa danh mục!' });
  }
});

router.delete('/api/admin/categories/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE ID = ?', [req.params.id]);
    res.json({ success: true, message: 'Xóa danh mục thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa danh mục (Danh mục có thể đang chứa món ăn)!' });
  }
});

// --- API QUẢN LÝ USER ---
router.post('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
  const { Name, Pass, ChucVu, Level } = req.body;
  try {
    await db.query('INSERT INTO Account (ChucVu, Name, Level, Pass) VALUES (?, ?, ?, ?)', [ChucVu, Name, Level, Pass]);
    res.json({ success: true, message: 'Thêm user thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi thêm user!' });
  }
});

router.delete('/api/admin/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM Account WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Xóa user thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa user!' });
  }
});

// --- API QUẢN LÝ MENU (MÓN ĂN) ---
router.post('/api/admin/menu', requireAuth, requireAdmin, async (req, res) => {
  const { Name, Price, Category_ID, Image } = req.body;
  try {
    await db.query('INSERT INTO menu (Name, Price, Category_ID, Image) VALUES (?, ?, ?, ?)', [Name, Price, Category_ID, Image || 'default.jpg']);
    res.json({ success: true, message: 'Thêm món thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Loi khi them mon!' });
  }
});

router.delete('/api/admin/menu/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM menu WHERE ID = ?', [req.params.id]);
    res.json({ success: true, message: 'Xóa món thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa món!' });
  }
});

module.exports = router;
