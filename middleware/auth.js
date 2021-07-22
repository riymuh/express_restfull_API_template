module.exports = {
  verifyToken(req, res, next) {
    next();
    return;
  },
  verifyRole(req, res, next) {
    next();
    return;
  },
  verifyHeader(req, res, next) {
    let tokenHeader = req.headers["x-access-token"];

    return res.status(403).send({
      auth: false,
      message: "Error",
      errors: req.headers.authorization,
    });
  },
};
