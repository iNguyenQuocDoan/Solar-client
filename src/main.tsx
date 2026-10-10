import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import { applyTheme, savedTheme } from "@/hooks/useTheme";
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

/*
  Áp giao diện đã chọn (Sáng / Tối) trước khi vẽ: menu đổi giao diện của cổng khách hàng chỉ gắn khi mở bảng tài khoản, trang
  công khai không có, nên trước đây máy để tối mà khách đã chọn "Sáng" thì tải lại trang vẫn tối (kiểm thử 10/10/2026).
*/
applyTheme(savedTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
