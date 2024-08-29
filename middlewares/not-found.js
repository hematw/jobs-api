function notFound(req, res) {
  res.status(404).json({
    msg: `Resource not found for ${req.method + " " + req.protocol}://${
      req.hostname + req.originalUrl
    }`,
  });
}

module.exports = notFound;
