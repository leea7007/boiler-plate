// auth.js
const { User } = require("../models/User"); // 경로 및 내보내기 확인

let auth = async (req, res, next) => {
  let token = req.cookies.x_auth;

  if (!token) {
    return res.status(401).json({ isAuth: false, error: true });
  }

  try {
    console.log("Token from request:", token);

    // findByToken 메서드가 올바르게 동작하는지 확인
    const user = await User.findByToken(token);
    console.log("User found:", user); // 유저 정보 로그

    if (!user) {
      return res.status(401).json({ isAuth: false, error: true });
    }

    // req.user에 유저 정보 설정
    req.token = token; // 토큰 저장
    req.user = user; // 유저 정보 저장

    console.log("req.user after auth:", req.user); // 유저 정보 로그

    next(); // 다음 미들웨어로 이동
  } catch (err) {
    console.error("Error in auth middleware:", err);
    res.status(500).json({ isAuth: false, error: true });
  }
};

module.exports = { auth };
