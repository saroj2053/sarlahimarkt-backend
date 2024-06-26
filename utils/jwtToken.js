const sendToken = (user, statusCode, res, msg) => {
  const token = user.getJWTToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("jwt", token, cookieOptions).json({
    status: "success",
    data: { user, token },
    message: msg,
  });
};

module.exports = sendToken;
