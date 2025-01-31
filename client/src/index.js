import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise";

if (process.env.PORT) {
  console.log(`React 앱이 ${process.env.PORT}번 포트에서 실행 중입니다.`);
} else {
  console.log("React 앱의 포트 번호를 찾을 수 없습니다.");
}

// Redux store 설정
const createStoreWithMiddleware =
  applyMiddleware(promiseMiddleware)(createStore);

// React 앱을 렌더링하는 부분
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider
    store={createStoreWithMiddleware(
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <App />
  </Provider>
);

// 성능 측정을 위한 Web Vitals 설정
reportWebVitals();
