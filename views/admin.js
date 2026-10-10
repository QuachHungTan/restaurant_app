module.exports = function adminView(user, users, categories, menu, hoadon) {
  // Render danh mục vào thẻ Select chọn danh mục cho món ăn
  let categoryOptions = categories.map(c => `<option value="${c.ID}">${c.Name}</option>`).join('');

  // Render bảng danh mục
  let categoryRows = categories.map(c => `
    <tr>
      <td><b>#${c.ID}</b></td>
      <td><input type="text" id="cat-name-${c.ID}" value="${c.Name}" style="padding:4px 8px; border:1px solid #ccc; border-radius:4px;"></td>
      <td>
        <button onclick="updateCategory(${c.ID})" style="background:#1976d2; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-floppy-disk"></i> Lưu</button>
        <button onclick="deleteCategory(${c.ID})" style="background:#d32f2f; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-trash"></i> Xóa</button>
      </td>
    </tr>
  `).join('');

  // Render bảng User
  let userRows = users.map(u => `
    <tr>
      <td>#${u.id}</td>
      <td><b>${u.Name}</b></td>
      <td><span style="background:#e3f2fd; color:#0d47a1; padding:3px 8px; border-radius:10px; font-weight:bold; font-size:12px;">${u.ChucVu}</span></td>
      <td>Level ${u.Level}</td>
      <td><button onclick="deleteUser(${u.id})" style="background:#d32f2f; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-trash"></i> Xóa</button></td>
    </tr>
  `).join('');

  // Render bảng Menu
  let menuRows = menu.map(m => `
    <tr>
      <td>#${m.ID}</td>
      <td><b>${m.Name}</b></td>
      <td>${m.CategoryName || 'Chưa phân loại'}</td>
      <td><b style="color:#d32f2f;">${Number(m.Price).toLocaleString('en-US')} VND</b></td>
      <td><button onclick="deleteMenu(${m.ID})" style="background:#d32f2f; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-trash"></i> Xóa</button></td>
    </tr>
  `).join('');

  // Render bảng Hóa đơn
  let hoadonRows = hoadon.map(h => `
    <tr>
      <td><b>#${h.ID}</b></td>
      <td><b style="color:#d32f2f;">${h.SoBan}</b></td>
      <td>${h.TenNhanVienOrder}</td>
      <td>${h.DanhSachMon}</td>
      <td><b>${Number(h.TongTien).toLocaleString('en-US')} VND</b></td>
      <td><span style="padding:4px 8px; border-radius:10px; font-size:12px; font-weight:bold; background:${h.TrangThai === 1 ? '#e8f5e9' : '#fff3e0'}; color:${h.TrangThai === 1 ? '#2e7d32' : '#e65100'};">${h.TrangThai === 1 ? 'Hoàn Thành' : 'Đang Làm'}</span></td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Dashboard - POS Restaurant</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Segoe UI', sans-serif; background: #f4f6f9; color: #333; }
.header { background: #1a1a1a; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; }
.header h1 { margin: 0; font-size: 20px; }
.btn-logout { background: #d32f2f; color: white; padding: 6px 14px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; }

.container { max-width: 1300px; margin: 25px auto; padding: 0 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.full-width { grid-column: 1 / -1; }

.card { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.card h3 { margin-top: 0; color: #1a1a1a; border-bottom: 2px solid #f1f3f5; padding-bottom: 10px; }

table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { padding: 10px; border-bottom: 1px solid #eee; text-align: left; font-size: 14px; }
th { background: #f8f9fa; color: #495057; }

.form-inline { display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap; }
.form-inline input, .form-inline select { padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; outline: none; }
.btn-add { background: #2e7d32; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; }
</style>
</head>
<body>

<div class="header">
  <h1><i class="fa-solid fa-user-gear"></i> QUẢN TRỊ HỆ THỐNG (ADMIN: ${user.name})</h1>
  <a href="/logout" class="btn-logout"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</a>
</div>

<div class="container">

  <!-- QUẢN LÝ DANH MỤC -->
  <div class="card">
    <h3><i class="fa-solid fa-layer-group"></i> Quản Lý Danh Mục (Categories)</h3>
    <form onsubmit="addCategory(event)" class="form-inline">
      <input type="text" id="newCatName" placeholder="Tên danh mục mới" required style="flex:1;">
      <button type="submit" class="btn-add"><i class="fa-solid fa-plus"></i> Thêm Danh Mục</button>
    </form>
    <table>
      <thead><tr><th>ID</th><th>Tên Danh Mục</th><th>Hành Động</th></tr></thead>
      <tbody>${categoryRows.length > 0 ? categoryRows : '<tr><td colspan="3">Chưa có danh mục nào</td></tr>'}</tbody>
    </table>
  </div>

  <!-- QUẢN LÝ TÀI KHOẢN -->
  <div class="card">
    <h3><i class="fa-solid fa-users"></i> Quản Lý Tài Khoản Nhân Viên</h3>
    <form onsubmit="addUser(event)" class="form-inline">
      <input type="text" id="uName" placeholder="Tên đăng nhập" required>
      <input type="text" id="uPass" placeholder="Mật khẩu" required>
      <select id="uRole">
        <option value="BoiBan">Bồi Bàn</option>
        <option value="Bep">Bếp</option>
        <option value="Admin">Admin</option>
      </select>
      <input type="number" id="uLevel" placeholder="Level" value="2" style="width:70px;" required>
      <button type="submit" class="btn-add"><i class="fa-solid fa-user-plus"></i> Thêm</button>
    </form>
    <table>
      <thead><tr><th>ID</th><th>Tên</th><th>Chức Vụ</th><th>Level</th><th>Hành Động</th></tr></thead>
      <tbody>${userRows}</tbody>
    </table>
  </div>

  <!-- QUẢN LÝ THỰC ĐƠN (MENU) -->
  <div class="card full-width">
    <h3><i class="fa-solid fa-utensils"></i> Quản Lý Thực Đơn (Menu Món Ăn)</h3>
    <form onsubmit="addMenu(event)" class="form-inline">
      <input type="text" id="mName" placeholder="Tên món ăn" required style="flex:2;">
      <select id="mCat" required style="flex:1;">
        <option value="">-- Chọn Danh Mục --</option>
        ${categoryOptions}
      </select>
      <input type="number" id="mPrice" placeholder="Giá (VND)" required style="flex:1;">
      <input type="text" id="mImage" placeholder="Tên file ảnh (VD: phobo.jpg)" style="flex:1;">
      <button type="submit" class="btn-add"><i class="fa-solid fa-plus"></i> Thêm Món</button>
    </form>
    <table>
      <thead><tr><th>ID</th><th>Tên Món</th><th>Danh Mục</th><th>Giá Bán</th><th>Hành Động</th></tr></thead>
      <tbody>${menuRows}</tbody>
    </table>
  </div>

  <!-- TỔNG HỢP HÓA ĐƠN -->
  <div class="card full-width">
    <h3><i class="fa-solid fa-receipt"></i> Tất Cả Hóa Đơn Nhà Hàng</h3>
    <table>
      <thead><tr><th>ID</th><th>Bàn</th><th>NV Order</th><th>Danh Sách Món</th><th>Tổng Tiền</th><th>Trạng Thái</th></tr></thead>
      <tbody>${hoadonRows}</tbody>
    </table>
  </div>

</div>

<script>
// Quản lý Categories
async function addCategory(e) {
  e.preventDefault();
  const Name = document.getElementById('newCatName').value;
  const res = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ Name })
  });
  const data = await res.json();
  if(data.success) location.reload(); else alert(data.message);
}

async function updateCategory(id) {
  const Name = document.getElementById('cat-name-' + id).value;
  const res = await fetch('/api/admin/categories/' + id, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ Name })
  });
  const data = await res.json();
  if(data.success) alert('Đã cập nhật danh mục!'); else alert(data.message);
}

async function deleteCategory(id) {
  if(confirm('Bạn có chắc muốn xóa danh mục này?')) {
    const res = await fetch('/api/admin/categories/' + id, { method: 'DELETE' });
    const data = await res.json();
    if(data.success) location.reload(); else alert(data.message);
  }
}

// Quản lý Users
async function addUser(e) {
  e.preventDefault();
  await fetch('/api/admin/users', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ Name: uName.value, Pass: uPass.value, ChucVu: uRole.value, Level: uLevel.value })
  }); location.reload();
}
async function deleteUser(id) { if(confirm('Xóa tài khoản này?')) { await fetch('/api/admin/users/'+id, {method:'DELETE'}); location.reload(); } }

// Quản lý Menu
async function addMenu(e) {
  e.preventDefault();
  await fetch('/api/admin/menu', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ Name: mName.value, Price: mPrice.value, Category_ID: mCat.value, Image: mImage.value })
  }); location.reload();
}
async function deleteMenu(id) { if(confirm('Xóa món này?')) { await fetch('/api/admin/menu/'+id, {method:'DELETE'}); location.reload(); } }
</script>
</body>
</html>`;
};
