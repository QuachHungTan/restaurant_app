function renderBoiBanPage(user, dishes = [], categories = [], selectedCategory = '') {
  const categoryTabs = categories.map(c => `
    <a href="/boiban?category=${c.ID}" class="category-btn ${selectedCategory == c.ID ? 'active' : ''}">
      🏷️ ${c.Name}
    </a>
  `).join('');

  const dishCards = dishes.map(d => `
    <div class="dish-card">
      <div class="dish-icon">🍜</div>
      <div class="dish-info">
        <h3 class="dish-title">${d.Name}</h3>
        <span class="dish-category">🏷️ ${d.CategoryName || 'Món ăn'}</span>
        <div class="dish-price">${Number(d.Price).toLocaleString('vi-VN')} VND</div>
        <button type="button" class="btn-add-dish" onclick="addDishToSummary(${d.ID}, '${d.Name.replace(/'/g, "\\'")}', ${d.Price})">
           Gọi món
        </button>
      </div>
    </div>
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RESTAURANT - Đặt Món Trực Tuyến</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
      body { background-color: #f4f6f8; color: #333; }
      
      .app-header { background: #d32f2f; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
      .brand { display: flex; align-items: center; gap: 10px; }
      .brand-icon { font-size: 28px; }
      .brand-title { font-size: 20px; font-weight: bold; letter-spacing: 1px; }
      .brand-sub { font-size: 11px; opacity: 0.9; }
      
      .cart-badge { background: #b71c1c; padding: 8px 16px; border-radius: 20px; display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 14px; border: 1px solid rgba(255,255,255,0.2); }
      .cart-count { background: #fff; color: #d32f2f; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 12px; }

      .main-layout { display: flex; gap: 20px; max-width: 1300px; margin: 20px auto; padding: 0 15px; }
      .menu-section { flex: 1; }
      .summary-section { width: 380px; }

      .category-bar { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 15px; }
      .category-btn { background: white; color: #555; text-decoration: none; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; white-space: nowrap; border: 1px solid #e0e0e0; transition: all 0.2s; }
      .category-btn.active, .category-btn:hover { background: #d32f2f; color: white; border-color: #d32f2f; }

      .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }

      .dish-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; }
      .dish-card { background: white; border-radius: 12px; padding: 15px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); text-align: center; border: 1px solid #eee; display: flex; flex-direction: column; align-items: center; }
      .dish-icon { font-size: 45px; background: #fff5f5; width: 80px; height: 80px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
      .dish-title { font-size: 16px; font-weight: bold; color: #222; margin-bottom: 4px; }
      .dish-category { font-size: 12px; color: #888; display: block; margin-bottom: 8px; }
      .dish-price { font-size: 16px; font-weight: bold; color: #d32f2f; margin-bottom: 12px; }
      .btn-add-dish { background: #d32f2f; color: white; border: none; width: 100%; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s; }
      .btn-add-dish:hover { background: #b71c1c; }

      .summary-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 20px; border: 1px solid #eaeaea; }
      .summary-header { border-bottom: 2px solid #f4f6f8; padding-bottom: 12px; margin-bottom: 15px; }
      
      .table-select-group { margin-bottom: 15px; }
      .table-select-group label { display: block; font-size: 13px; font-weight: bold; color: #555; margin-bottom: 5px; }
      .table-select-group select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ccc; font-weight: bold; font-size: 14px; }

      .summary-list { max-height: 280px; overflow-y: auto; margin-bottom: 15px; padding-right: 5px; }
      .summary-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed #eee; }
      .item-name { font-weight: bold; font-size: 14px; }
      .item-price { font-size: 12px; color: #888; }
      
      .qty-control { display: flex; align-items: center; gap: 8px; }
      .btn-qty { background: #f0f0f0; border: none; width: 24px; height: 24px; border-radius: 4px; font-weight: bold; cursor: pointer; }
      .btn-qty:hover { background: #e0e0e0; }

      .total-box { border-top: 2px solid #eee; padding-top: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; }
      .total-price { color: #d32f2f; font-size: 18px; }

      .btn-submit-order { background: #2e7d32; color: white; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; transition: 0.2s; }
      .btn-submit-order:hover { background: #1b5e20; }

      .user-link { color: white; text-decoration: none; font-size: 12px; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <header class="app-header">
      <div class="brand">
        <span class="brand-icon">🍴</span>
        <div>
          <div class="brand-title">RESTAURANT</div>
          <div class="brand-sub">Thực Đơn & Đặt Món Trực Tuyến</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 15px;">
        <div class="cart-badge">
          Món đã thêm: <span class="cart-count" id="cart-count">0</span>
        </div>
        <div style="text-align: right; font-size: 13px;">
          NV: <strong>${user.Username}</strong> <br>
          <a href="/auth/logout" class="user-link">Thoát</a>
        </div>
      </div>
    </header>

    <div class="main-layout">
      <div class="menu-section">
        <div class="category-bar">
          <a href="/boiban" class="category-btn ${!selectedCategory ? 'active' : ''}">🏷️ Tất cả</a>
          ${categoryTabs}
        </div>

        <div class="section-title">Danh Sách Món Ăn</div>

        <div class="dish-grid">
          ${dishCards || '<p style="grid-column: 1/-1; text-align:center; padding: 20px;">Không có món ăn nào trong danh mục này.</p>'}
        </div>
      </div>

      <div class="summary-section">
        <div class="summary-card">
          <div class="summary-header">
            <h3 style="font-size: 16px; color: #d32f2f;">Món Đã Chọn</h3>
          </div>

          <form action="/boiban/order" method="POST" id="orderForm">
            <div class="table-select-group">
              <label>Chọn Số Bàn Đặt Món:</label>
              <select name="SoBan" required>
                <option value="Bàn 1">Bàn 01</option>
                <option value="Bàn 2">Bàn 02</option>
                <option value="Bàn 3">Bàn 03</option>
                <option value="Bàn 4">Bàn 04</option>
                <option value="Bàn 5">Bàn 05</option>
              </select>
            </div>

            <div class="summary-list" id="summary-list">
              <p style="text-align: center; color: #999; font-size: 13px; padding: 20px 0;">
                Chưa có món nào được chọn. Hãy bấm "Gọi món" bên danh sách!
              </p>
            </div>

            <div class="total-box">
              <span>Tổng Tiền:</span>
              <span class="total-price" id="total-price">0 VND</span>
            </div>

            <!-- Dữ liệu ẩn đồng bộ ID cart_data_input -->
            <input type="hidden" name="cart_data" id="cart_data_input">

            <button type="submit" class="btn-submit-order" id="btn-submit" disabled>
              Xác Nhận
            </button>
          </form>
        </div>
      </div>
    </div>

    <script>
      let selectedDishes = {};

      function addDishToSummary(id, name, price) {
        if (selectedDishes[id]) {
          selectedDishes[id].qty += 1;
        } else {
          selectedDishes[id] = { id, name, price, qty: 1 };
        }
        renderSummary();
      }

      function updateQty(id, delta) {
        if (selectedDishes[id]) {
          selectedDishes[id].qty += delta;
          if (selectedDishes[id].qty <= 0) {
            delete selectedDishes[id];
          }
        }
        renderSummary();
      }

      function renderSummary() {
        const summaryList = document.getElementById('summary-list');
        const totalPriceEl = document.getElementById('total-price');
        const cartCountEl = document.getElementById('cart-count');
        const submitBtn = document.getElementById('btn-submit');
        const cartDataInput = document.getElementById('cart_data_input');

        summaryList.innerHTML = '';

        let total = 0;
        let count = 0;
        const keys = Object.keys(selectedDishes);

        if (keys.length === 0) {
          summaryList.innerHTML = '<p style="text-align: center; color: #999; font-size: 13px; padding: 20px 0;">Chưa có món nào được chọn. Hãy bấm "Gọi món"!</p>';
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.5';
          cartDataInput.value = '';
        } else {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';

          keys.forEach(key => {
            const item = selectedDishes[key];
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            count += item.qty;

            const itemEl = document.createElement('div');
            itemEl.className = 'summary-item';
            itemEl.innerHTML = \`
              <div>
                <div class="item-name">\${item.name}</div>
                <div class="item-price">\${Number(item.price).toLocaleString('vi-VN')} VND</div>
              </div>
              <div class="qty-control">
                <button type="button" class="btn-qty" onclick="updateQty(\${item.id}, -1)">-</button>
                <span style="font-weight: bold; font-size: 14px;">\${item.qty}</span>
                <button type="button" class="btn-qty" onclick="updateQty(\${item.id}, 1)">+</button>
              </div>
            \`;
            summaryList.appendChild(itemEl);
          });

          cartDataInput.value = JSON.stringify(Object.values(selectedDishes));
        }

        totalPriceEl.innerText = Number(total).toLocaleString('vi-VN') + ' VND';
        cartCountEl.innerText = count;
      }
    </script>
  </body>
  </html>
  `;
}

module.exports = renderBoiBanPage;
