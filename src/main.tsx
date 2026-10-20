import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import { applyTheme, savedTheme } from '@/hooks/useTheme'
import '@/styles/globals.css'

// Chỉ hiện icon khi font đã tải xong, để mạng chậm không lộ chữ tên icon
document.fonts
  ?.load('24px "Material Symbols Outlined"')
  .then((faces) => {
    if (faces.length > 0) document.documentElement.classList.add('icons-ready')
  })
  .catch(() => {})

// Áp giao diện đã chọn trước khi render để không bị nháy
applyTheme(savedTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
