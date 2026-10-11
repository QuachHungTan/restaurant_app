const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const renderAdminPage = require('../views/admin');

function queryAsync(sql, params = []) {
  return new Promise((resolve) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('Lỗi SQL Admin:', err.message);
        return resolve([]);
      }
      resolve(results || []);
    });
  });
}

router.use((req, res, next) => {
  if (!req.session.user || (req.session.user.Role || '').toLowerCase() !== 'admin') {
    return res.redirect('/auth/login');
  }
  next();
});

router.get('/', async (req, res) => {
  const selectedDate = req.query.date || new Date().toISOString().split('T')[0];

  const staff = await queryAsync('SELECT * FROM Account ORDER BY ID DESC');
  const categories = await queryAsync('SELECT * FROM categories');
  
  const dishes = await queryAsync(`
    SELECT m.*, COALESCE(c.Name, 'Chưa phân loại') as CategoryName 
    FROM menu m 
    LEFT JOIN categories c ON m.Category_ID = c.ID 
    ORDER BY m.ID DESC
  `);

  // Lấy danh sách Hóa đơn lọc theo NgayTao
  const orders = await queryAsync(
    'SELECT * FROM HoaDon WHERE DATE(NgayTao) = ? ORDER BY ID DESC',
    [selectedDate]
  );

  res.send(renderAdminPage(req.session.user, staff, dishes, categories, orders, selectedDate));
});

router.post('/staff/add', async (req, res) => {
  const { Name, Pass, ChucVu } = req.body;
  if (Name && Pass && ChucVu) {
    try {
      // Hash mật khẩu với Salt 10
      const hashedPassword = await bcrypt.hash(Pass.trim(), 10);
      
      await queryAsync(
        'INSERT INTO Account (Name, Pass, ChucVu, Level) VALUES (?, ?, ?, 2)', 
        [Name.trim(), hashedPassword, ChucVu]
      );
    } catch (err) {
      console.error('Lỗi mã hóa mật khẩu:', err);
    }
  }
  res.redirect('/admin');
});

// Xóa Nhân Viên
router.post('/staff/delete/:id', async (req, res) => {
  await queryAsync('DELETE FROM Account WHERE ID = ?', [req.params.id]);
  res.redirect('/admin');
});

// Thêm Món Ăn
router.post('/dish/add', async (req, res) => {
  const { Name, Price, Category_ID } = req.body;
  if (Name && Price) {
    await queryAsync('INSERT INTO menu (Name, Price, Category_ID) VALUES (?, ?, ?)', [Name.trim(), Price, Category_ID || 1]);
  }
  res.redirect('/admin');
});

// Xóa Món Ăn
router.post('/dish/delete/:id', async (req, res) => {
  await queryAsync('DELETE FROM menu WHERE ID = ?', [req.params.id]);
  res.redirect('/admin');
});

// ==========================================
// THÊM MỚI: XỬ LÝ DANH MỤC (Category)
// ==========================================

// Thêm Danh Mục
router.post('/category/add', async (req, res) => {
  const { Name } = req.body;
  if (Name && Name.trim()) {
    await queryAsync('INSERT INTO categories (Name) VALUES (?)', [Name.trim()]);
  }
  res.redirect('/admin');
});

// Sửa Danh Mục
router.post('/category/edit', async (req, res) => {
  const { ID, Name } = req.body;
  if (ID && Name && Name.trim()) {
    await queryAsync('UPDATE categories SET Name = ? WHERE ID = ?', [Name.trim(), ID]);
  }
  res.redirect('/admin');
});

// Xóa Danh Mục
router.post('/category/delete', async (req, res) => {
  const { ID } = req.body;
  if (ID) {
    // Đưa món ăn thuộc danh mục này về NULL tránh lỗi ràng buộc
    await queryAsync('UPDATE menu SET Category_ID = NULL WHERE Category_ID = ?', [ID]);
    await queryAsync('DELETE FROM categories WHERE ID = ?', [ID]);
  }
  res.redirect('/admin');
});

module.exports = router;
