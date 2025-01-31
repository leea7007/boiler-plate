const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // "/api" 경로로 들어오는 요청을
    createProxyMiddleware({
      target: "http://localhost:5000", // 백엔드 서버 주소
      changeOrigin: true, // 도메인 맞추기
    })
  );
};
