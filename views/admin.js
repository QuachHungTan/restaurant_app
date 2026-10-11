function renderAdminPage(user, staff = [], dishes = [], categories = [], orders = [], selectedDate = '') {
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.TongTien || 0), 0);

  const staffRows = staff.map(s => `
    <tr>
      <td>${s.ID || s.id}</td>
      <td><strong>${s.Name}</strong></td>
      <td>${s.ChucVu}</td>
      <td>
        <form action="/admin/staff/delete/${s.ID || s.id}" method="POST" style="display:inline;" onsubmit="return confirm('Xóa nhân viên này?');">
          <button type="submit" style="color:red; cursor:pointer;">Xóa</button>
        </form>
      </td>
    </tr>
  `).join('');

  const dishRows = dishes.map(d => `
    <tr>
      <td>${d.ID}</td>
      <td><strong>${d.Name}</strong></td>
      <td>${d.CategoryName}</td>
      <td>${Number(d.Price).toLocaleString('vi-VN')} VNĐ</td>
      <td>
        <form action="/admin/dish/delete/${d.ID}" method="POST" style="display:inline;" onsubmit="return confirm('Xóa món này?');">
          <button type="submit" style="color:red; cursor:pointer;">Xóa</button>
        </form>
      </td>
    </tr>
  `).join('');

  const categoryRows = categories.map(c => `
    <tr>
      <td>${c.ID}</td>
      <td><strong>${c.Name}</strong></td>
      <td>
        <button type="button" onclick="openEditCategoryModal(${c.ID}, '${c.Name.replace(/'/g, "\\'")}')" style="color:blue; cursor:pointer; margin-right: 5px;">Sửa</button>
        <form action="/admin/category/delete" method="POST" style="display:inline;" onsubmit="return confirm('Xóa danh mục này?');">
          <input type="hidden" name="ID" value="${c.ID}">
          <button type="submit" style="color:red; cursor:pointer;">Xóa</button>
        </form>
      </td>
    </tr>
  `).join('');

  const orderRows = orders.map(o => `
    <tr>
      <td>#${o.ID}</td>
      <td>${o.SoBan}</td>
      <td>${o.TenNhanVienOrder}</td>
      <td>${o.DanhSachMon}</td>
      <td>${Number(o.TongTien).toLocaleString('vi-VN')} VNĐ</td>
      <td>${o.NgayTao ? new Date(o.NgayTao).toLocaleString('vi-VN') : 'N/A'}</td>
      <td>
        <span style="color: ${o.TrangThai ? 'green' : 'orange'}; font-weight: bold;">
          ${o.TrangThai ? 'Hoàn Thành' : 'Đang Xử Lý'}
        </span>
      </td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Quản Lý Admin</title>
    <link rel="stylesheet" href="/css/style.css">
  </head>
  <body style="font-family: Arial, sans-serif; background: #f1f5f9; margin:0; padding:20px;">
    <div style="background:#0f172a; color:white; padding:15px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
      <h2>HỆ THỐNG QUẢN LÝ NHÀ HÀNG - ADMIN</h2>
      <div>Xin chào: <strong>${user.Username}</strong> | <a href="/auth/logout" style="color:#ef4444; font-weight:bold;">Đăng Xuất</a></div>
    </div>

    <br>
    <!-- DOANH THU THỐNG KÊ THEO NGÀY -->
    <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <h3> Quản Lý Hóa Đơn & Doanh Thu</h3>
      
      <form method="GET" action="/admin" style="margin-bottom: 15px;">
        <label><strong>Chọn ngày xem hóa đơn: </strong></label>
        <input type="date" name="date" value="${selectedDate}" required>
        <button type="submit" style="padding: 4px 10px; cursor: pointer;">Lọc Hóa Đơn</button>
      </form>

      <p><strong>Tổng Doanh Thu Ngày (${selectedDate}):</strong> <span style="color:#16a34a; font-size:18px; font-weight:bold;">${totalRevenue.toLocaleString('vi-VN')} VNĐ</span></p>

      <table border="1" cellpadding="8" cellspacing="0" width="100%">
        <thead>
          <tr style="background:#f8fafc;">
            <th>Mã Đơn</th><th>Số Bàn</th><th>NV Order</th><th>Danh Sách Món</th><th>Tổng Tiền</th><th>Ngày Tạo</th><th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          ${orderRows || '<tr><td colspan="7" align="center">Không có hóa đơn nào trong ngày này</td></tr>'}
        </tbody>
      </table>
    </div>

    <br>
    <!-- QUẢN LÝ DANH MỤC -->
    <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">
      <h3>  Quản Lý Danh Mục</h3>
      <form action="/admin/category/add" method="POST" style="margin-bottom:15px; display:flex; gap:10px;">
        <input type="text" name="Name" placeholder="Tên danh mục " required style="flex:1; padding:6px 10px;">
        <button type="submit" style="padding: 6px 15px; cursor:pointer;">Thêm Danh Mục</button>
      </form>

      <table border="1" cellpadding="8" cellspacing="0" width="100%">
        <thead>
          <tr style="background:#f8fafc;"><th>ID</th><th>Tên Danh Mục</th><th>Hành Động</th></tr>
        </thead>
        <tbody>
          ${categoryRows || '<tr><td colspan="3" align="center">Chưa có danh mục nào</td></tr>'}
        </tbody>
      </table>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
      <!-- QUẢN LÝ NHÂN VIÊN -->
      <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <h3> Quản Lý Nhân Viên</h3>
        <form action="/admin/staff/add" method="POST" style="margin-bottom:15px;">
          <input type="text" name="Name" placeholder="Tên nhân viên" required>
          <input type="password" name="Pass" placeholder="Mật khẩu" required>
          <select name="ChucVu" required>
            <option value="BoiBan">Bồi Bàn</option>
            <option value="Bep">Đầu Bếp</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit">Thêm Nhân Viên</button>
        </form>

        <table border="1" cellpadding="8" cellspacing="0" width="100%">
          <thead><tr style="background:#f8fafc;"><th>ID</th><th>Tên</th><th>Chức Vụ</th><th>Hành Động</th></tr></thead>
          <tbody>${staffRows}</tbody>
        </table>
      </div>

      <!-- QUẢN LÝ MÓN ĂN -->
      <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <h3> Quản Lý Thực Đơn (Menu)</h3>
        <form action="/admin/dish/add" method="POST" style="margin-bottom:15px;">
          <input type="text" name="Name" placeholder="Tên món ăn" required>
          <input type="number" name="Price" placeholder="Giá tiền (VNĐ)" required>
          <select name="Category_ID">
            ${categories.map(c => `<option value="${c.ID}">${c.Name}</option>`).join('')}
          </select>
          <button type="submit">Thêm Món</button>
        </form>

        <table border="1" cellpadding="8" cellspacing="0" width="100%">
          <thead><tr style="background:#f8fafc;"><th>ID</th><th>Tên Món</th><th>Danh Mục</th><th>Giá</th><th>Hành Động</th></tr></thead>
          <tbody>${dishRows}</tbody>
        </table>
      </div>
    </div>

    <!-- MODAL SỬA DANH MỤC -->
    <div id="editCategoryModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); justify-content:center; align-items:center;">
      <div style="background:white; padding:20px; border-radius:8px; width:300px;">
        <h4 style="margin-top:0;">Sửa Tên Danh Mục</h4>
        <form action="/admin/category/edit" method="POST">
          <input type="hidden" name="ID" id="edit_category_id">
          <input type="text" name="Name" id="edit_category_name" required style="width:100%; padding:8px; margin-bottom:15px; box-sizing:border-box;">
          <div style="text-align:right;">
            <button type="button" onclick="closeEditCategoryModal()" style="padding:5px 10px; cursor:pointer;">Hủy</button>
            <button type="submit" style="padding:5px 10px; cursor:pointer; background:#16a34a; color:white; border:none;">Lưu</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      function openEditCategoryModal(id, name) {
        document.getElementById('edit_category_id').value = id;
        document.getElementById('edit_category_name').value = name;
        document.getElementById('editCategoryModal').style.display = 'flex';
      }

      function closeEditCategoryModal() {
        document.getElementById('editCategoryModal').style.display = 'none';
      }
    </script>
  </body>
  </html>
  `;
}

module.exports = renderAdminPage;
