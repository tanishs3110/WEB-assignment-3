module.exports = function ensureLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
};
