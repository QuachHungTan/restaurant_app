const express = require('express');
const router = express.Router();
const db = require('../config/db');
const renderBepPage = require('../views/bep');

function queryAsync(sql, params = []) {
  return new Promise((resolve) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('Lỗi SQL Bep:', err.message);
        return resolve([]);
      }
      resolve(results || []);
    });
  });
}

router.use((req, res, next) => {
  if (!req.session.user || (req.session.user.Role || '').toLowerCase() !== 'bep') {
    return res.redirect('/auth/login');
  }
  next();
});

router.get('/', async (req, res) => {
  // Lấy các đơn chưa làm xong (TrangThai = 0), ẨN GIÁ TIỀN & TỔNG TIỀN
  const orders = await queryAsync(
    'SELECT ID, SoBan, TenNhanVienOrder, DanhSachMon, TrangThai, NgayTao FROM HoaDon WHERE TrangThai = 0 ORDER BY ID ASC'
  );
  res.send(renderBepPage(req.session.user, orders));
});

// Chuyển trạng thái nấu xong (TrangThai = 1)
router.post('/complete/:id', async (req, res) => {
  await queryAsync('UPDATE HoaDon SET TrangThai = 1 WHERE ID = ?', [req.params.id]);
  res.redirect('/bep');
});

module.exports = router;
