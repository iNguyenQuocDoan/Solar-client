# Smart Solar – Web Portal (Admin + Technician)

## Stack

- Vite + React + TypeScript, react-router (giữ nguyên như package.json hiện tại – KHÔNG chuyển sang Next.js)
- Tailwind CSS v4 qua `@tailwindcss/vite` (`@theme` trong `src/styles/globals.css`)
- shadcn/ui cho primitives (dialog, dropdown, tabs, checkbox…) – restyle theo token bên dưới
- Font: Plus Jakarta Sans qua `@fontsource-variable/plus-jakarta-sans` (hoặc link Google Fonts trong `index.html`)
- Icon: Material Symbols Outlined – link Google Fonts trong `index.html`; giữ đúng tên icon như trong file thiết kế (`grid_view`, `solar_power`, `manage_accounts`…)
- State/data: mock data trong `src/lib/mock/*.ts` cho phần UI; riêng auth đã gọi API thật (xem "Auth API")

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
    PublicLayout.tsx           # header menu + footer (landing_home) – KHÔNG có sidebar
    AuthLayout.tsx             # 2 cột (auth_portal): panel xanh trái + <Outlet/> phải + footer nhỏ
  pages/
    admin/                     # 4 màn admin (AdminDashboardPage, UsersPage, RolesPage, ProductsPage)
    tech/                      # 10 màn technician
    public/LandingPage.tsx     # trang chủ "/"
    auth/                      # LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage
    ForbiddenPage.tsx  ComingSoonPage.tsx
    StyleguidePage.tsx
  components/
    layout/AppShell.tsx        # Sidebar + TopHeader + <main>
    layout/Sidebar.tsx         # nhận `items` theo role, NavLink để highlight active
    layout/TopHeader.tsx
    ui/                        # shadcn + component dùng chung (StatusBadge, MetricCard, DataTable, TaskCard, TimelineStep, ChecklistItem, PhotoGrid…)
    admin/  tech/              # component riêng theo nhóm màn
    landing/                   # khối của trang chủ (Hero, PackageCards, Faq…)
    auth/                      # PasswordRules, ForbiddenCard, SessionExpiredModal, ChangePasswordDialog
  lib/mock/                    # dữ liệu giả cho từng màn (UI), KHÔNG còn mock auth
  lib/api/                     # schema.d.ts (sinh tự động), client.ts, auth.ts, errors.ts, tokens.ts, me.ts
  lib/auth/                    # AuthProvider.tsx (useAuth, RequireRole), roles.ts, jwt.ts
  features/auth/hooks.ts       # mutation react-query cho các endpoint auth
  lib/nav.ts                   # menu admin / technician / public
public/placeholders/           # thay cho ảnh lh3.googleusercontent.com
```

Nếu repo đã có sẵn cấu trúc khác (ví dụ `src/features/`), giữ cấu trúc hiện tại và map các thư mục trên vào đó – không tái cấu trúc lại toàn bộ.

## Layout chung

Mọi màn đều dùng 1 shell: `<aside>` cố định bên trái `w-72` nền `surface-container-lowest`, `<header>` trên cùng, `<main>` nền `surface`. Làm 1 lần trong layout route (`AdminLayout` / `TechLayout` với `<Outlet/>`), KHÔNG copy sidebar vào từng page.

Menu Admin (subtitle "SYSTEM ADMINISTRATION"): Admin Dashboard, Users, Roles & Permissions, Product Catalogue, Service Catalogue, Categories, AI Knowledge Base, Technical Configuration, Reports, System Settings.

Menu Technician (subtitle "Field Operations"): Dashboard, My Tasks (badge số), Site Surveys, Installations, Warranty & Maintenance, Schedule; cuối sidebar là khối user (tên, chức danh) + Alerts + Settings.

## Màn công khai & xác thực

Hai màn `landing_home` và `auth_portal` KHÔNG dùng `AppShell`/sidebar và giữ nguyên chữ tiếng Việt như thiết kế.

- `PublicLayout` – theo `landing_home`: `<header>` sticky cao 80px nền `surface-container-lowest/90` + backdrop blur (logo, menu neo `#solutions`…, nút "Đăng nhập" và "Khảo sát mái nhà"), `<main>` nền `surface`, `<footer>` 5 cột + hàng copyright. Từ `md` trở xuống menu thu thành hamburger.
- `AuthLayout` – theo `auth_portal`: lưới 12 cột, panel `primary-container` bên trái (`lg:col-span-5`: chip "Nền tảng Quản trị Năng lượng Mặt trời Tự động", tiêu đề "Chuyển dịch Năng lượng Xanh cho Ngôi nhà Việt", ảnh nhà, 2 ô số liệu 1,240 kWh / ~3.85 Tr ₫, danh sách chip vai trò), `<Outlet/>` trong card trắng bên phải (`lg:col-span-7`), footer nhỏ (AES-256, sao lưu, hotline). Dưới `lg` ẩn panel trái.
- BỎ thanh tab "Auth Hub" trong `auth_portal/code.html`: đó chỉ là tab demo của Stitch để xem 5 view trong 1 file. Header của `AuthLayout` chỉ giữ logo + link về trang chủ; mỗi view là một route riêng.
- Khối "Phiên làm việc hiện tại" (IP, JWT, thời gian còn lại) trong view "Trạng thái phiên" chỉ để demo – KHÔNG dựng.

## Bảng route

| Route             | Layout         | Trang                                                      |
| ----------------- | -------------- | ---------------------------------------------------------- |
| `/`               | `PublicLayout` | `LandingPage` (trang chủ công khai)                         |
| `/login`          | `AuthLayout`   | `LoginPage`                                                 |
| `/register`       | `AuthLayout`   | `RegisterPage`                                              |
| `/forgot-password`| `AuthLayout`   | `ForgotPasswordPage`                                        |
| `/reset-password` | `AuthLayout`   | `ResetPasswordPage` (đọc `?token=`)                         |
| `/verify-email`   | `AuthLayout`   | `VerifyEmailPage`                                           |
| `/403`            | `AuthLayout`   | `ForbiddenPage`                                             |
| `/coming-soon`    | `PublicLayout` | Trang tạm cho Kinh doanh, Quản lý, Khách hàng               |
| `/admin/*`        | `AdminLayout`  | 4 màn admin – bọc `<RequireRole role="admin">`              |
| `/tech/*`         | `TechLayout`   | 10 màn technician – bọc `<RequireRole role="technician">`   |
| `/styleguide`     | –              | `StyleguidePage`                                            |

`/` trả về trang chủ; KHÔNG còn redirect `/` → `/admin`.

## Auth API

Auth gọi backend .NET thật, KHÔNG còn mock. Nguồn sự thật là `docs/api/swagger.json`
(tải từ `http://localhost:8080/swagger/v1/swagger.json`).

- **Base URL**: `VITE_API_BASE_URL` trong `.env.development` = `/api`. Dev đi qua
  `server.proxy` trong `vite.config.ts` (`/api` → `API_PROXY_TARGET`, mặc định
  `http://localhost:8080`) để tránh CORS. Xem `.env.example` để biết đủ biến.
- **Sinh type**: `npm run gen:api` chạy `openapi-typescript` (qua `npx`, vì gói này
  yêu cầu peer `typescript@^5` còn repo dùng `typescript@7`) và ghi ra
  `src/lib/api/schema.d.ts`. KHÔNG sửa file đó bằng tay; đổi swagger thì chạy lại lệnh.
- **Token**: `AuthTokensResponse` trả token trong body (không phải cookie httpOnly) nên
  KHÔNG dùng `withCredentials`. `accessToken` giữ trong bộ nhớ; `refreshToken` vào
  `localStorage` khi tick "Ghi nhớ đăng nhập", ngược lại `sessionStorage`
  (`src/lib/api/tokens.ts`). Hạn token lấy từ `accessTokenExpiresAt` /
  `refreshTokenExpiresAt` chứ không hard-code.
- **Refresh**: interceptor trong `src/lib/api/client.ts` gặp 401 thì gọi
  `POST /api/auth/refresh` theo kiểu single-flight (nhiều request cùng 401 chỉ refresh
  một lần, số còn lại xếp hàng chờ rồi retry). Refresh hỏng → xoá phiên + bắn sự kiện
  `session-expired` trên `window`; `SessionExpiredModal` lắng nghe sự kiện này.
  KHÔNG còn bộ đếm 30 phút giả lập.
- **Wrapper & lỗi**: response bọc trong `*ApiResponse { isSuccess, traceId, data, error }`;
  interceptor mở wrapper và trả thẳng `data`. Lỗi ném ra `ApiError`
  (`src/lib/api/errors.ts`) có `status`, `code`, `message`, `fieldErrors`, `traceId`.
  Swagger không khai kiểu của `ApiError.details` nên `parseFieldErrors` nhận cả 3 dạng
  (`{field: [msg]}`, `[{field, message}]`, `{errors: {...}}`) và bỏ qua dạng lạ.
  Backend chưa có bảng mã lỗi cố định → ưu tiên hiển thị `message` của server, thiếu thì
  dùng câu tiếng Việt theo HTTP status.
- **Role**: `AuthTokensResponse` không có role → decode claim `role` trong accessToken
  bằng `jwt-decode` (`src/lib/auth/jwt.ts`) rồi map qua `ROLE_ALIASES` trong
  `src/lib/auth/roles.ts` về `customer | technician | sales | manager | admin`.
  Không đọc được role thì coi như đăng nhập hỏng, không đoán bừa.
- **Khôi phục phiên**: mở app mà còn `refreshToken` thì gọi refresh trước;
  `status = 'loading'` và `RequireRole` hiện `AuthLoadingScreen` để không đá người dùng
  về `/login` quá sớm.
- **Điều hướng**: sau đăng nhập `admin` → `/admin`, `technician` → `/tech`, còn lại →
  `/coming-soon`. `<RequireRole role="…">`: chưa đăng nhập → `/login`, sai vai trò → `/403`.
- **API**: 9 hàm trong `src/lib/api/auth.ts` (register, verify-email, resend-verification,
  login, refresh, logout, forgot-password, reset-password, change-password); mutation của
  react-query trong `src/features/auth/hooks.ts`; login/logout nằm trong `AuthProvider`
  vì còn phải lưu token.
- **Tài khoản mẫu** ở `/login` chỉ hiện khi `import.meta.env.DEV` và lấy từ
  `.env.development.local` (không commit) – xem `src/features/auth/demoAccounts.ts`.
- **CHỜ BACKEND**: swagger chưa có endpoint `/me`, nên tên hiển thị tạm lấy từ claim
  `name`/`fullName` trong JWT, không có thì dùng email. Khi có `/me`, chỉ cần điền thân
  hàm `fetchCurrentUser()` trong `src/lib/api/me.ts`.

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
- Không cài thêm thư viện UI khác (MUI, Ant, Chakra…). Ngoại lệ đã chốt: `sonner` chỉ dùng cho toast.
- Không sửa bất kỳ file nào trong `design/stitch/stitch_smart_solar_customer_portal/`.

## Lệnh

- `npm run dev` – Vite dev server
- `npm run build` – `tsc -b && vite build`; phải pass trước khi coi một màn là xong
- `npm run typecheck` – `tsc -b` (nhanh hơn build, dùng khi lặp)
- `npm run gen:api` – sinh lại `src/lib/api/schema.d.ts` từ `docs/api/swagger.json`
- `npm run lint` – oxlint (KHÔNG dùng ESLint: repo dùng `typescript@7`, gói này không còn API JS nên typescript-eslint không chạy được)
  (Nếu package.json dùng tên script khác, dùng theo package.json.)
