module.exports = function bepView(user, hoadon) {
  let cardsHtml = hoadon.map(hd => {
    // Tach danh sach mon an thanh tung dong
    let itemsList = hd.DanhSachMon.split(', ').map(item => `
      <li style="padding: 6px 0; border-bottom: 1px dashed #eee; font-size: 16px; font-weight: 600; color: #212529;">
        <i class="fa-solid fa-utensils" style="color: #d32f2f; margin-right: 8px;"></i>${item}
      </li>
    `).join('');

    let isDone = hd.TrangThai === 1;

    return `
      <div class="ticket-card ${isDone ? 'done' : 'pending'}" id="ticket-${hd.ID}">
        <div class="ticket-header">
          <div>
            <span class="table-badge"><i class="fa-solid fa-chair"></i> ${hd.SoBan}</span>
            <span class="order-id">#${hd.ID}</span>
          </div>
          <span class="status-badge ${isDone ? 'status-done' : 'status-pending'}">
            ${isDone ? '<i class="fa-solid fa-circle-check"></i> HOÀN THÀNH' : '<i class="fa-solid fa-fire"></i> ĐANG CHỜ'}
          </span>
        </div>

        <div class="ticket-body">
          <p class="staff-info"><i class="fa-solid fa-user-ninja"></i> NV Order: <b>${hd.TenNhanVienOrder}</b></p>
          <ul class="item-list">
            ${itemsList}
          </ul>
        </div>

        <div class="ticket-footer">
          <button onclick="toggleStatus(${hd.ID}, ${isDone ? 0 : 1})" class="btn-action ${isDone ? 'btn-undo' : 'btn-complete'}">
            ${isDone ? '<i class="fa-solid fa-rotate-left"></i> Làm lại món' : '<i class="fa-solid fa-check"></i> ĐÃ NẤU XONG'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Màn Hình Bếp - KDS System</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #121212; color: #fff; }

.header { background: #1e1e1e; border-bottom: 2px solid #333; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
.header-title { display: flex; align-items: center; gap: 15px; }
.header-title i { font-size: 28px; color: #ff9800; }
.header-title h1 { margin: 0; font-size: 22px; color: #fff; }

.header-right { display: flex; align-items: center; gap: 20px; }
.bep-user { background: #2a2a2a; padding: 6px 16px; border-radius: 20px; font-size: 14px; border: 1px solid #444; }
.btn-logout { background: #d32f2f; color: white; border: none; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 13px; }

.kds-container { padding: 25px; max-width: 1400px; margin: 0 auto; }
.kds-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

/* Ticket Card Design */
.ticket-card { background: #ffffff; color: #333; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s ease; border-top: 6px solid #ff9800; }
.ticket-card.done { border-top-color: #4caf50; opacity: 0.7; }
.ticket-card:hover { transform: translateY(-4px); }

.ticket-header { background: #f8f9fa; padding: 12px 16px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.table-badge { background: #d32f2f; color: white; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 15px; }
.order-id { color: #666; font-size: 13px; font-weight: 600; margin-left: 6px; }

.status-badge { font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 12px; text-transform: uppercase; }
.status-pending { background: #fff3e0; color: #e65100; }
.status-done { background: #e8f5e9; color: #2e7d32; }

.ticket-body { padding: 16px; flex: 1; }
.staff-info { margin: 0 0 12px 0; font-size: 13px; color: #666; }
.item-list { list-style: none; padding: 0; margin: 0; }

.ticket-footer { padding: 12px 16px; background: #fafafa; border-top: 1px solid #eee; }
.btn-action { width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; }
.btn-complete { background: #2e7d32; color: white; }
.btn-complete:hover { background: #1b5e20; }
.btn-undo { background: #616161; color: white; }
.btn-undo:hover { background: #424242; }

.empty-kds { text-align: center; grid-column: 1 / -1; padding: 60px 0; color: #888; }
.empty-kds i { font-size: 50px; margin-bottom: 15px; color: #555; }
</style>
</head>
<body>

<div class="header">
  <div class="header-title">
    <i class="fa-solid fa-fire-burner"></i>
    <div>
      <h1>MÀN HÌNH CHẾ BIẾN (KDS)</h1>
      <small style="color: #aaa;">Tự động cập nhật món mới theo thời gian thực</small>
    </div>
  </div>
  <div class="header-right">
    <div class="bep-user"><i class="fa-solid fa-user-chef"></i> Đầu Bếp: <b>${user.name}</b></div>
    <a href="/logout" class="btn-logout"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</a>
  </div>
</div>

<div class="kds-container">
  <div class="kds-grid">
    ${cardsHtml.length > 0 ? cardsHtml : `
      <div class="empty-kds">
        <i class="fa-solid fa-circle-check"></i>
        <h2>Hiện tại không có món ăn nào cần chế biến!</h2>
      </div>
    `}
  </div>
</div>

<script>
// Tự động làm mới trang mỗi 5 giây để nhận Order mới từ Bồi bàn
setInterval(() => {
  location.reload();
}, 5000);

async function toggleStatus(id, newStatus) {
  try {
    const res = await fetch('/api/bep/status', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id, status: newStatus })
    });
    const data = await res.json();
    if(data.success) {
      location.reload();
    }
  } catch(err) {
    alert('Lỗi cập nhật trạng thái món!');
  }
}
</script>
</body>
</html>`;
};
