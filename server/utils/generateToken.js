import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SEC, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 24 * 64 * 64 * 1000,
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateTokenAndSetCookie;
