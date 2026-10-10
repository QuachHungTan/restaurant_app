// Bắt buộc đăng nhập
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Bắt buộc quyền Admin
function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'Admin') {
    return res.status(403).send('<h1>403 Forbidden - Chi Admin moi co quyen truy cap!</h1>');
  }
  next();
}

// Bắt buộc quyền Bếp
function requireBep(req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'Bep' && req.session.user.role !== 'Admin')) {
    return res.status(403).send('<h1>403 Forbidden - Chi Bep moi co quyen truy cap!</h1>');
  }
  next();
}

// Bắt buộc quyền Bồi Bàn
function requireBoiBan(req, res, next) {
  if (!req.session.user || (req.session.user.role !== 'BoiBan' && req.session.user.role !== 'Admin')) {
    return res.status(403).send('<h1>403 Forbidden - Chi Boi Ban moi co quyen truy cap!</h1>');
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  requireBep,
  requireBoiBan
};
