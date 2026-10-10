module.exports = function boiBanView(user, categories, menu, myOrders) {
  // Tạo thanh danh mục Tabs
  let categoryTabs = `<button class="category-btn active" onclick="filterCategory('all', this)"><i class="fa-solid fa-layer-group"></i> Tất cả</button>`;
  categoryTabs += categories.map(cat => `<button class="category-btn" onclick="filterCategory('${cat.ID}', this)"><i class="fa-solid fa-utensils"></i> ${cat.Name}</button>`).join('');

  // Tạo danh sách thẻ món ăn (Food Cards)
  let foods = menu.map(item => `
    <div class="food-card" data-category-id="${item.Category_ID}">
      <div class="food-icon">
        <img src="/images/${item.Image}" alt="${item.Name}" onerror="this.onerror=null;this.parentElement.innerHTML='<i class=\\'fa-solid fa-bowl-food placeholder-icon\\'></i>';">
      </div>
      <div class="food-info">
        <h3>${item.Name}</h3>
        <p class="category"><i class="fa-solid fa-tag"></i> ${item.CategoryName}</p>
        <p class="price">${Number(item.Price).toLocaleString('en-US')} VND</p>
        <button class="add-btn" data-id="${item.ID}" data-name="${item.Name.replace(/"/g, '&quot;')}" data-price="${item.Price}" onclick="handleAddToCart(this)">
          <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
        </button>
      </div>
    </div>
  `).join('');

  // Tạo lịch sử order cá nhân
  let historyRows = myOrders.map(o => `
    <tr>
      <td><b>#${o.ID}</b></td>
      <td><b style="color:#d32f2f;">${o.SoBan}</b></td>
      <td>${o.DanhSachMon}</td>
      <td><b>${Number(o.TongTien).toLocaleString('en-US')} VND</b></td>
      <td>
        <span class="status-badge ${o.TrangThai === 1 ? 'status-done' : 'status-pending'}">
          ${o.TrangThai === 1 ? '✓ Bếp xong' : '⌛ Đang làm'}
        </span>
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bồi Bàn - POS Restaurant</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; color: #333; }

/* Header sang trọng */
.header { background: linear-gradient(135deg, #d32f2f, #b71c1c); color: white; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.header-brand { display: flex; align-items: center; gap: 12px; }
.header-brand i { font-size: 28px; }
.header h1 { margin: 0; font-size: 22px; font-weight: 700; }
.header p { margin: 2px 0 0; opacity: 0.85; font-size: 12px; }
.header-right { display: flex; align-items: center; gap: 15px; }
.user-profile { background: rgba(255, 255, 255, 0.15); padding: 6px 14px; border-radius: 20px; display: flex; align-items: center; gap: 10px; }
.user-role-badge { background: #ffeb3b; color: #b71c1c; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; }
.btn-logout { background: #ffffff; color: #d32f2f; border: none; padding: 6px 12px; border-radius: 15px; font-weight: bold; cursor: pointer; text-decoration: none; font-size: 12px; }
.cart-badge { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-weight: 600; display: flex; align-items: center; gap: 8px; }

/* Category Navigation Tabs */
.category-nav-wrapper { background: #ffffff; border-bottom: 1px solid #e0e0e0; position: sticky; top: 62px; z-index: 90; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.category-nav { max-width: 1300px; margin: 0 auto; padding: 12px 20px; display: flex; gap: 10px; overflow-x: auto; }
.category-btn { background: #f1f3f5; border: none; padding: 8px 18px; border-radius: 20px; color: #495057; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap; transition: 0.2s; }
.category-btn.active, .category-btn:hover { background: #d32f2f; color: white; }

/* Container Bố cục */
.container { display: flex; gap: 25px; max-width: 1300px; margin: 25px auto; padding: 0 20px; }
.menu-section { flex: 1; }
.food-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

/* Food Card */
.food-card { background: white; border-radius: 14px; padding: 16px; display: flex; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #eee; }
.food-icon { width: 100px; height: 100px; background: #fff5f5; border-radius: 10px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.food-icon img { width: 100%; height: 100%; object-fit: cover; }
.placeholder-icon { font-size: 40px; color: #d32f2f; }
.food-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.food-info h3 { margin: 0 0 4px; font-size: 16px; font-weight: 700; color: #212529; }
.category { color: #868e96; margin: 0; font-size: 12px; }
.price { color: #d32f2f; font-size: 16px; font-weight: 700; margin: 6px 0; }
.add-btn { background: #d32f2f; color: white; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px; width: fit-content; }
.add-btn:hover { background: #b71c1c; }

/* Giỏ hàng POS bên phải */
.cart-section { width: 380px; background: white; border-radius: 14px; padding: 20px; height: fit-content; position: sticky; top: 130px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #eee; }
.cart-section h2 { margin-top: 0; font-size: 18px; color: #212529; border-bottom: 2px solid #f1f3f5; padding-bottom: 10px; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; }
.form-control { width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 8px; outline: none; }
.cart-item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #eee; padding: 10px 0; font-size: 14px; }
.cart-item-qty { background: #f1f3f5; padding: 2px 8px; border-radius: 6px; font-weight: bold; margin-left: 5px; }
.total { display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 10px; border-top: 2px solid #f1f3f5; }
.order-btn { width: 100%; margin-top: 18px; padding: 14px; background: #2e7d32; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s; }
.order-btn:hover { background: #1b5e20; }
.empty { text-align: center; color: #adb5bd; padding: 30px 0; }

/* Lịch sử đơn hàng */
.history-section { max-width: 1300px; margin: 30px auto; padding: 0 20px; }
.history-card { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; font-size: 14px; }
th { background: #f8f9fa; color: #495057; font-weight: 700; }
.status-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight:bold; }
.status-pending { background: #fff3e0; color: #e65100; }
.status-done { background: #e8f5e9; color: #2e7d32; }
</style>
</head>
<body>

<!-- Header -->
<div class="header">
  <div class="header-brand">
    <i class="fa-solid fa-utensils"></i>
    <div>
      <h1>RESTAURANT POS</h1>
      <p>Hệ Thống Phục Vụ & Đặt Món</p>
    </div>
  </div>

  <div class="header-right">
    <div class="user-profile">
      <i class="fa-solid fa-user-circle" style="font-size: 22px;"></i>
      <div>
        <span style="font-weight: bold;">${user.name}</span>
        <span class="user-role-badge">${user.role}</span>
      </div>
      <a href="/logout" class="btn-logout"><i class="fa-solid fa-right-from-bracket"></i> Thoát</a>
    </div>

    <div class="cart-badge">
      <i class="fa-solid fa-cart-shopping"></i> Giỏ: <span id="cartCount">0</span>
    </div>
  </div>
</div>

<!-- Thanh Danh Mục Categories -->
<div class="category-nav-wrapper">
  <div class="category-nav">${categoryTabs}</div>
</div>

<!-- Thực Đơn & Giỏ Hàng -->
<div class="container">
  <div class="menu-section">
    <h2 style="margin-top: 0;"><i class="fa-solid fa-book-open"></i> Thực Đơn Nhà Hàng</h2>
    <div class="food-list" id="foodList">${foods}</div>
  </div>

  <div class="cart-section">
    <h2><i class="fa-solid fa-receipt"></i> Đơn Hàng Cần Đặt</h2>
    <div class="form-group">
      <label><i class="fa-solid fa-chair"></i> Chọn Bàn Phục Vụ:</label>
      <select id="tableNumber" class="form-control">
        <option value="">-- Chọn Bàn --</option>
        <option value="Bàn 01">Bàn 01</option>
        <option value="Bàn 02">Bàn 02</option>
        <option value="Bàn 03">Bàn 03</option>
        <option value="Bàn VIP 01">Bàn VIP 01</option>
        <option value="Bàn VIP 02">Bàn VIP 02</option>
      </select>
    </div>

    <div id="cartItems"><div class="empty">Chưa có món ăn nào trong giỏ</div></div>
    <div class="total"><span>Tổng cộng:</span><span style="color:#d32f2f" id="totalPrice">0 VND</span></div>
    <button class="order-btn" onclick="orderFood()"><i class="fa-solid fa-paper-plane"></i> GỬI ĐƠN CHO BẾP</button>
  </div>
</div>

<!-- Lịch Sử Order Cá Nhân -->
<div class="history-section">
  <div class="history-card">
    <h3 style="margin-top:0;"><i class="fa-solid fa-clock-rotate-left"></i> Lịch Sử Đặt Món Của Tôi (${user.name})</h3>
    <table>
      <thead>
        <tr><th>Mã Đơn</th><th>Số Bàn</th><th>Danh Sách Món</th><th>Tổng Tiền</th><th>Trạng Thái Bếp</th></tr>
      </thead>
      <tbody>
        ${historyRows.length > 0 ? historyRows : '<tr><td colspan="5" style="text-align:center; color:#888;">Chưa có đơn hàng nào do bạn đặt</td></tr>'}
      </tbody>
    </table>
  </div>
</div>

<script>
let cart = [];

// Lọc món ăn theo Danh mục
function filterCategory(catId, btn) {
  document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.food-card').forEach(card => {
    card.style.display = (catId === 'all' || card.dataset.categoryId === String(catId)) ? 'flex' : 'none';
  });
}

// Thêm vào giỏ
function handleAddToCart(btn) {
  const food = { id: btn.dataset.id, name: btn.dataset.name, price: Number(btn.dataset.price) };
  const exist = cart.find(i => i.id === food.id);
  if (exist) exist.quantity++; else cart.push({ ...food, quantity: 1 });
  updateCart();
}

// Cập nhật giao diện Giỏ hàng
function updateCart() {
  const cartItems = document.getElementById('cartItems');
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty">Chưa có món ăn nào trong giỏ</div>';
    document.getElementById('cartCount').innerText = 0;
    document.getElementById('totalPrice').innerText = '0 VND';
    return;
  }
  let total = 0, count = 0, html = '';
  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;
    html += \`
      <div class="cart-item">
        <div><b>\${item.name}</b><br><span style="color:#d32f2f;">\${item.price.toLocaleString('en-US')} VND</span> x \${item.quantity}</div>
        <div>
          <button onclick="changeQty('\${item.id}', -1)" style="padding:2px 8px; cursor:pointer;">-</button>
          <span class="cart-item-qty">\${item.quantity}</span>
          <button onclick="changeQty('\${item.id}', 1)" style="padding:2px 8px; cursor:pointer;">+</button>
        </div>
      </div>
    \`;
  });
  cartItems.innerHTML = html;
  document.getElementById('cartCount').innerText = count;
  document.getElementById('totalPrice').innerText = total.toLocaleString('en-US') + ' VND';
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    updateCart();
  }
}

// Gửi Đơn Hàng đến Bếp
async function orderFood() {
  const tableNumber = document.getElementById('tableNumber').value;
  if (!tableNumber) return alert('Vui lòng chọn số bàn!');
  if (cart.length === 0) return alert('Vui lòng chọn ít nhất 1 món ăn!');

  try {
    const res = await fetch('/api/boiban/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableNumber, cart })
    });
    const data = await res.json();
    if (data.success) {
      alert('ĐẶT MÓN THÀNH CÔNG! Đơn hàng đã được chuyển tới Bếp.');
      cart = [];
      updateCart();
      location.reload();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Lỗi kết nối máy chủ!');
  }
}
</script>
</body>
</html>`;
};
