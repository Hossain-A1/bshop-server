const { createToken, verifyToken } = require("../helpers/jsonwebtoken");

const verifyUser = (res, user) => {
  //create token
  const token = createToken({
    _id: user._id,
    name: user.name,
    email: user.email,
<<<<<<< HEAD
    role:user.role
=======
role:user.role,
>>>>>>> de912f29dcb2acedad0a21e91c984e28d3572205
  });
  if (!token) {
    throw new Error("Token not found");
  }

  res.cookie("accessToken", token.accessToken, {
    httpOnly: true,
    secure: false,
    path: "/",
  });
  res.cookie("refreshToken", token.refreshToken, {
    httpOnly: true,
    secure: false,
    path: "/",
  });

  const auth = verifyToken(token.accessToken);

  res.cookie("auth", JSON.stringify(auth), {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: false,
  });

  return;
};

module.exports = verifyUser;
