# Smart Solar – Web Portal (Admin + Technician)

## Stack

- Vite + React + TypeScript, react-router (giữ nguyên như package.json hiện tại – KHÔNG chuyển sang Next.js)
- Tailwind CSS v4 qua `@tailwindcss/vite` (`@theme` trong `src/styles/globals.css`)
- shadcn/ui cho primitives (dialog, dropdown, tabs, checkbox…) – restyle theo token bên dưới
- Font: Plus Jakarta Sans qua `@fontsource-variable/plus-jakarta-sans` (hoặc link Google Fonts trong `index.html`)
- Icon: Material Symbols Outlined – link Google Fonts trong `index.html`; giữ đúng tên icon như trong file thiết kế (`grid_view`, `solar_power`, `manage_accounts`…)
- State/data: mock data trong `src/lib/mock/*.ts`; chưa gọi API thật

## Nguồn thiết kế (KHÔNG sửa thư mục này)

`design/stitch/stitch_smart_solar_customer_portal/` là bản export từ Google Stitch. Mỗi màn hình có:

- `design/stitch/stitch_smart_solar_customer_portal/<screen>/code.html` – markup tham chiếu (Tailwind CDN)
- `design/stitch/stitch_smart_solar_customer_portal/<screen>/screen.png` – ảnh kết quả mong đợi. LUÔN mở ảnh này để đối chiếu, không chỉ đọc HTML.
- `design/stitch/stitch_smart_solar_customer_portal/solaris_home_design_system/DESIGN.md` – nguồn sự thật cho màu, typography, spacing, radius, shadow, spec component.

## Quy tắc thiết kế

1. Token màu lấy từ block YAML đầu `DESIGN.md` (trùng với `tailwind.config` trong mỗi `code.html`).
   Ví dụ: `primary=#004328`, `primary-container=#0d5c3a`, `surface=#f8f9ff`, `surface-container-lowest=#ffffff`, `on-surface=#0d1c2e`, `on-surface-variant=#404942`, `secondary-container=#fe932c`, `error=#ba1a1a`.
   Phần mô tả bằng chữ trong DESIGN.md (ví dụ "Primary #0D5C3A") chỉ để hiểu ý đồ – KHÔNG lấy hex từ đó.
2. Dùng đúng tên token Tailwind như file gốc: `bg-surface`, `bg-surface-container-lowest`, `text-on-surface-variant`, `bg-primary-container text-on-primary`, `text-headline-md`, `text-label-sm`, `px-space-md`, `gap-space-sm`, `rounded-xl`… Không bịa màu hex mới, không dùng `gray-500`/`slate-*` của Tailwind mặc định.
3. Typography scale: `display-lg`, `headline-xl`, `headline-lg`, `headline-md`, `body-xl/lg/md/sm`, `label-lg/md/sm`, `data-metric` – cấu hình trong `@theme` với đủ fontSize/lineHeight/letterSpacing/fontWeight.
4. Shadow 3 cấp và border card `1px solid rgba(13,92,58,0.06)` theo mục "Elevation & Depth" trong DESIGN.md.
5. Badge trạng thái: dạng pill `rounded-full py-1 px-3 label-sm` + chấm 6px, màu theo bảng "Status & Lifecycle Palette".

## Kiến trúc thư mục

```
index.html                     # link font Plus Jakarta Sans + Material Symbols
src/
  main.tsx                     # RouterProvider
  styles/globals.css           # @import "tailwindcss" + @theme tokens
  app/router.tsx               # createBrowserRouter: 2 layout route (admin / tech) + children
  layouts/
    AdminLayout.tsx            # <AppShell nav={adminNav}><Outlet/></AppShell>
    TechLayout.tsx             # <AppShell nav={technicianNav}><Outlet/></AppShell>
  pages/
    admin/                     # 4 màn admin (AdminDashboardPage, UsersPage, RolesPage, ProductsPage)
    tech/                      # 10 màn technician
    StyleguidePage.tsx
  components/
    layout/AppShell.tsx        # Sidebar + TopHeader + <main>
    layout/Sidebar.tsx         # nhận `items` theo role, NavLink để highlight active
    layout/TopHeader.tsx
    ui/                        # shadcn + component dùng chung (StatusBadge, MetricCard, DataTable, TaskCard, TimelineStep, ChecklistItem, PhotoGrid…)
    admin/  tech/              # component riêng theo nhóm màn
  lib/mock/                    # dữ liệu giả cho từng màn
  lib/nav.ts                   # menu admin / technician
public/placeholders/           # thay cho ảnh lh3.googleusercontent.com
```

Nếu repo đã có sẵn cấu trúc khác (ví dụ `src/features/`), giữ cấu trúc hiện tại và map các thư mục trên vào đó – không tái cấu trúc lại toàn bộ.

## Layout chung

Mọi màn đều dùng 1 shell: `<aside>` cố định bên trái `w-72` nền `surface-container-lowest`, `<header>` trên cùng, `<main>` nền `surface`. Làm 1 lần trong layout route (`AdminLayout` / `TechLayout` với `<Outlet/>`), KHÔNG copy sidebar vào từng page.

Menu Admin (subtitle "SYSTEM ADMINISTRATION"): Admin Dashboard, Users, Roles & Permissions, Product Catalogue, Service Catalogue, Categories, AI Knowledge Base, Technical Configuration, Reports, System Settings.

Menu Technician (subtitle "Field Operations"): Dashboard, My Tasks (badge số), Site Surveys, Installations, Warranty & Maintenance, Schedule; cuối sidebar là khối user (tên, chức danh) + Alerts + Settings.

## Biến thể đã chốt

- Technician dashboard: dùng `technician_dashboard_1`. Bỏ qua `technician_dashboard_2`.
- My Tasks: dùng `my_tasks_1` (dạng bảng). Bỏ qua `my_tasks_2`.
- Sidebar/header technician tham chiếu từ `my_tasks_1/code.html` (logo "Smart Solar", subtitle "Field Operations"); không dùng nhãn "SOLARTECH".
- `installation_task_checklist` và `site_survey_verification` cũng mang nhãn "SOLARTECH" trong sidebar nhưng là màn riêng, VẪN DỰNG thành route riêng (`/tech/installations/:id/checklist`, `/tech/surveys/:id/verify`); chỉ thay sidebar bằng AppShell chung "Smart Solar", phần `<main>` giữ đúng thiết kế.

## Quy ước làm việc với thiết kế

- Ảnh trong `code.html` (`lh3.googleusercontent.com/...`) là link tạm → thay bằng `/placeholders/*.svg` hoặc `<img>` với ảnh cục bộ trong `public/`.
- Text tiếng Anh trong thiết kế giữ nguyên ở giai đoạn dựng UI; i18n làm sau.
- Mỗi màn = 1 route + 1 file mock. Không hard-code dữ liệu trong JSX.
- Khi dựng xong một màn: chạy dev, chụp màn hình, đặt cạnh `screen.png`, liệt kê khác biệt (spacing, màu, font size, icon) rồi sửa. Chấp nhận sai lệch ≤ 4px.
- Không cài thêm thư viện UI khác (MUI, Ant, Chakra…).
- Không sửa bất kỳ file nào trong `design/stitch/stitch_smart_solar_customer_portal/`.

## Lệnh

- `npm run dev` – Vite dev server
- `npm run build` – `tsc -b && vite build`; phải pass trước khi coi một màn là xong
- `npm run typecheck` – `tsc -b` (nhanh hơn build, dùng khi lặp)
- `npm run lint` – oxlint (KHÔNG dùng ESLint: repo dùng `typescript@7`, gói này không còn API JS nên typescript-eslint không chạy được)
  (Nếu package.json dùng tên script khác, dùng theo package.json.)
