function renderLoginPage(errorMsg = '') {
  const cleanError = typeof errorMsg === 'string' ? errorMsg : '';

  return `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng Nhập - RESTAURANT System</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
      
      body {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }

      .login-card {
        background: #ffffff;
        width: 100%;
        max-width: 400px;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        animation: fadeIn 0.4s ease-in-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-15px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .login-header {
        background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
        color: white;
        padding: 30px 20px;
        text-align: center;
      }

      .brand-icon {
        font-size: 42px;
        margin-bottom: 8px;
        display: inline-block;
      }

      .brand-title {
        font-size: 22px;
        font-weight: 800;
        letter-spacing: 1.5px;
      }

      .brand-sub {
        font-size: 12px;
        opacity: 0.85;
        margin-top: 4px;
      }

      .login-body {
        padding: 30px 25px;
      }

      .error-box {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
        color: #991b1b;
        padding: 12px;
        border-radius: 6px;
        font-size: 13px;
        margin-bottom: 20px;
        font-weight: 600;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        font-size: 13px;
        font-weight: 700;
        color: #475569;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .input-wrapper {
        position: relative;
      }

      .input-wrapper input {
        width: 100%;
        padding: 12px 14px;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        font-size: 15px;
        color: #1e293b;
        transition: all 0.2s ease-in-out;
        outline: none;
      }

      .input-wrapper input:focus {
        border-color: #d32f2f;
        box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.15);
      }

      .btn-submit {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
      }

      .btn-submit:hover {
        background: linear-gradient(135deg, #b71c1c 0%, #9a0007 100%);
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(211, 47, 47, 0.4);
      }

      .btn-submit:active {
        transform: translateY(0);
      }

      .account-hint {
        margin-top: 25px;
        padding-top: 15px;
        border-top: 1px dashed #e2e8f0;
        font-size: 12px;
        color: #64748b;
        text-align: center;
        line-height: 1.6;
      }

      .account-hint strong {
        color: #0f172a;
      }
    </style>
  </head>
  <body>
    <div class="login-card">
      <div class="login-header">
        <span class="brand-icon">🍴</span>
        <div class="brand-title">RESTAURANT</div>
        <div class="brand-sub">Hệ Thống Quản Lý & Đặt Món Nhà Hàng</div>
      </div>

      <div class="login-body">
        ${cleanError ? `<div class="error-box">⚠️ ${cleanError}</div>` : ''}

        <form action="/auth/login" method="POST">
          <div class="form-group">
            <label>Tài Khoản Nhân Viên</label>
            <div class="input-wrapper">
              <input type="text" name="username" placeholder="Nhập tên đăng nhập..." required autocomplete="off">
            </div>
          </div>

          <div class="form-group">
            <label>Mật Khẩu</label>
            <div class="input-wrapper">
              <input type="password" name="password" placeholder="Nhập mật khẩu..." required>
            </div>
          </div>

          <button type="submit" class="btn-submit">ĐĂNG NHẬP HỆ THỐNG</button>
        </form>

        <div class="account-hint">
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

module.exports = renderLoginPage;
