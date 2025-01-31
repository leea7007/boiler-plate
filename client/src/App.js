import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// 컴포넌트 임포트
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";

function App() {
  return (
    <Router>
      <div>
        {/* React Router 6에 맞는 라우팅 처리 */}
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* 기본 경로 */}
          <Route path="/login" element={<LoginPage />} /> {/* 로그인 페이지 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
