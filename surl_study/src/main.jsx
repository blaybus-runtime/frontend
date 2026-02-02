// src/main.jsx (또는 src/main.js)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

async function enableMocking() {
  if (import.meta.env.VITE_API_MOCK !== "true") return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
