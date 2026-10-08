import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import "@/styles/globals.css";

/*
  Icon Material Symbols chỉ hiện khi font đã tải xong (globals.css: html:not(.icons-ready) làm icon trong suốt), để
  mạng chậm không lộ chữ tên icon. Font không tải được (bị chặn, mất mạng) thì icon giữ trong suốt, chữ trên nút vẫn còn.
*/
document.fonts
  ?.load('24px "Material Symbols Outlined"')
  .then((faces) => {
    if (faces.length > 0) document.documentElement.classList.add("icons-ready");
  })
  .catch(() => {});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
