import { useCallback, useEffect, useState } from "react";

export type Theme = "system" | "light" | "dark";
const KEY = "solar-theme";

/** Ba lựa chọn giao diện, dùng chung cho rail nhân viên và menu tài khoản của khách hàng. */
export const THEME_OPTIONS: { value: Theme; label: string; icon: string }[] = [
  { value: "system", label: "Tự động", icon: "contrast" },
  { value: "light", label: "Sáng", icon: "light_mode" },
  { value: "dark", label: "Tối", icon: "dark_mode" },
];

/** Lựa chọn đã lưu; chưa chọn (hoặc trình duyệt chặn storage) thì theo hệ thống. */
export function savedTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.dataset.theme = theme;
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>(savedTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      if (t === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, t);
    } catch {
      /* storage unavailable: theme still applies for this session */
    }
  }, []);

  return [theme, setTheme];
}
