const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth, requireBep } = require('../middlewares/auth');
const bepView = require('../views/bep');

// Trang KDS dành riêng cho Bếp (Không hiển thị TongTien)
router.get('/bep', requireAuth, requireBep, async (req, res) => {
  try {
    // Sắp xếp: Đơn chưa hoàn thành (0) lên trước, đơn hoàn thành (1) xuống dưới
    const [hoadon] = await db.query(
      'SELECT ID, SoBan, TenNhanVienOrder, DanhSachMon, TrangThai FROM HoaDon ORDER BY TrangThai ASC, ID DESC'
    );
    res.send(bepView(req.session.user, hoadon));
  } catch (err) {
    res.status(500).send('Lỗi CSDL Bếp: ' + err.message);
  }
});

// API Cập nhật trạng thái chế biến món ăn
router.post('/api/bep/status', requireAuth, requireBep, async (req, res) => {
  const { id, status } = req.body;
  try {
    await db.query('UPDATE HoaDon SET TrangThai = ? WHERE ID = ?', [status, id]);
    res.json({ success: true, message: 'Cập nhật trạng thái thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật!' });
  }
});

module.exports = router;
