module.exports = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const status = `${statusCode}`.startsWith("4") ? "fail" : "error";

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "fail",
      message: "Token expired. Please login again.",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token. Please login again.",
    });
  }

  res.status(statusCode).json({
    status,
    message: err.message || "Internal server error",
  });
};
