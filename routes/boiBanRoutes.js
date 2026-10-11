const express = require('express');
const router = express.Router();
const db = require('../config/db');
const renderBoiBanPage = require('../views/boiban');

function queryAsync(sql, params = []) {
  return new Promise((resolve) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('Lỗi SQL BoiBan:', err.message);
        return resolve(null);
      }
      resolve(results);
    });
  });
}

router.use((req, res, next) => {
  if (!req.session.user || (req.session.user.Role || '').toLowerCase() !== 'boiban') {
    return res.redirect('/auth/login');
  }
  next();
});

router.get('/', async (req, res) => {
  const selectedCategory = req.query.category || '';
  const categories = await queryAsync('SELECT * FROM categories') || [];

  let sql = `
    SELECT m.*, COALESCE(c.Name, 'Món ăn') as CategoryName 
    FROM menu m 
    LEFT JOIN categories c ON m.Category_ID = c.ID
  `;
  let params = [];
  if (selectedCategory) {
    sql += ' WHERE m.Category_ID = ?';
    params.push(selectedCategory);
  }
  const dishes = await queryAsync(sql, params) || [];

  res.send(renderBoiBanPage(req.session.user, dishes, categories, selectedCategory));
});

// Xử lý ghi đơn order vào HoaDon
router.post('/order', async (req, res) => {
  const { SoBan, cart_data } = req.body;
  const staffName = req.session.user.Username;

  console.log('--- NHẬN ORDER MỚI ---');
  console.log('Số bàn:', SoBan);
  console.log('Tên NV:', staffName);
  console.log('Cart Data:', cart_data);

  if (!SoBan || !cart_data) {
    console.log('LỖI: Thiếu SoBan hoặc cart_data');
    return res.redirect('/boiban');
  }

  try {
    const cartItems = JSON.parse(cart_data);
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.redirect('/boiban');
    }

    let totalAmount = 0;
    let dishSummary = [];

    cartItems.forEach(item => {
      const qty = parseInt(item.qty) || 1;
      const price = parseInt(item.price) || 0;
      totalAmount += price * qty;
      dishSummary.push(`${item.name} x ${qty}`);
    });

    const danhSachMonStr = dishSummary.join(', ');

    // Thêm trực tiếp vào bảng HoaDon bao gồm NgayTao
    const result = await queryAsync(
      'INSERT INTO HoaDon (SoBan, TenNhanVienOrder, DanhSachMon, TongTien, TrangThai, NgayTao) VALUES (?, ?, ?, ?, 0, NOW())',
      [SoBan, staffName, danhSachMonStr, totalAmount]
    );

    console.log('KẾT QUẢ INSERT:', result);

  } catch (error) {
    console.error('Lỗi parse JSON giỏ hàng:', error);
  }

  res.redirect('/boiban');
});

module.exports = router;
