import React, { useEffect, useState } from "react";
import axios from "axios";

function LandingPage() {
  const [message, setMessage] = useState(""); // 응답 데이터를 저장할 상태 변수

  useEffect(() => {
    // GET 요청 후 응답 데이터를 콘솔에 출력하고 상태에 저장
    axios
      .get("/api")
      .then((response) => {
        setMessage(response.data); // 응답 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []); // 빈 배열로 실행하면 컴포넌트가 처음 렌더링 될 때만 실행

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "50vh",
        }}
      ></div>
      <h2> 시작페이지 </h2>
    </>
  );
}

export default LandingPage;
