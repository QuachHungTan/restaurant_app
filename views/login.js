module.exports = function loginView() {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dang Nhap - Restaurant POS</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: sans-serif; background: #121212; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; }
.card { background: #1e1e1e; padding: 30px; border-radius: 12px; width: 350px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.card h2 { color: #d32f2f; margin-bottom: 20px; }
input, button { width: 100%; padding: 12px; margin: 8px 0; border-radius: 6px; border: 1px solid #333; }
input { background: #2a2a2a; color: #fff; }
button { background: #d32f2f; color: white; border: none; font-weight: bold; cursor: pointer; }
button:hover { background: #b71c1c; }
.error { color: #ff5252; font-size: 13px; display: none; }
</style>
</head>
<body>
<div class="card">
  <h2><i class="fa-solid fa-utensils"></i> RESTAURANT POS</h2>
  <div id="err" class="error"></div>
  <form onsubmit="handleLogin(event)">
    <input type="text" id="Name" placeholder="Ten dang nhap" required>
    <input type="password" id="Pass" placeholder="Mat khau" required>
    <button type="submit">DANG NHAP</button>
  </form>
</div>
<script>
async function handleLogin(e) {
  e.preventDefault();
  const Name = document.getElementById('Name').value;
  const Pass = document.getElementById('Pass').value;
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ Name, Pass })
  });
  const data = await res.json();
  if (data.success) { window.location.href = data.redirectUrl; }
  else { const err = document.getElementById('err'); err.innerText = data.message; err.style.display = 'block'; }
}
</script>
</body>
</html>`;
};
