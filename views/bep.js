function renderBepPage(user, orders = []) {
  const orderCards = orders.map(o => `
    <div style="background:white; border-left:6px solid #eab308; padding:15px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); margin-bottom:15px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3>${o.SoBan} <span style="font-size:13px; color:#64748b;">(NV Order: ${o.TenNhanVienOrder})</span></h3>
        <span style="background:#fef08a; color:#854d0e; padding:4px 10px; border-radius:12px; font-weight:bold; font-size:12px;">Chờ Chế Biến</span>
      </div>

      <p style="font-size:12px; color:#64748b; margin: 4px 0 10px 0;">
        Giờ gọi món: ${o.NgayTao ? new Date(o.NgayTao).toLocaleTimeString('vi-VN') : 'Vừa xong'}
      </p>

      <h4>Món Cần Chế Biến:</h4>
      <p style="font-size:16px; font-weight:bold; color:#1e293b; background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0;">
        ${o.DanhSachMon}
      </p>

      <form action="/bep/complete/${o.ID}" method="POST">
        <button type="submit" style="background:#22c55e; color:white; padding:8px 16px; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">✔ HOÀN THÀNH (NẤU XONG)</button>
      </form>
    </div>
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Nhà Bếp - Chế Biến</title>
    <link rel="stylesheet" href="/css/style.css">
  </head>
  <body style="font-family: Arial, sans-serif; background: #f1f5f9; margin:0; padding:20px;">
    <div style="background:#15803d; color:white; padding:15px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
      <h2> KHU VỰC CHẾ BIẾN CỦA ĐẦU BẾP</h2>
      <div>Đầu bếp: <strong>${user.Username}</strong> | <a href="/auth/logout" style="color:#ef4444; font-weight:bold;">Đăng Xuất</a></div>
    </div>

    <br>
    <h3> Danh Sách Order Cần Nấu </h3>
    <div>
      ${orderCards || '<p style="color:#64748b;">Hiện tại chưa có đơn đặt món nào chờ chế biến.</p>'}
    </div>
  </body>
  </html>
  `;
}

module.exports = renderBepPage;
