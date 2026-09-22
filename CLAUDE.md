# Smart Solar – Web Portal

## Git rules

- Never add `Co-Authored-By` or any AI-attribution trailer to commits or PRs. Applies to every agent and contributor. Enforced by `.githooks/commit-msg`.
- Conventional Commits: `type(scope): summary`.

## Hai bộ component, MỘT hệ token

Repo có hai thư mục component vì hai nhánh việc dựng song song, nhưng từ 22/09/2026 cả
hai ăn chung một hệ token trong `src/styles/globals.css`:

- `src/components/ui` (file kebab-case, token `canvas/fg/accent…`): portal khách hàng
  `/customer`, kinh doanh `/ops`, kỹ thuật `/field`, quản lý `/manage`. Lịch sử audit ở `UI_AUDIT.md`.
- `src/components/stitch-ui` (file PascalCase, token `surface/on-surface/primary…`,
  Material Symbols): admin `/admin`, kỹ thuật viên `/tech`, `/styleguide`.
- Token của bộ Stitch nay chỉ là bí danh trỏ vào token của portal kit (màu nền/chữ/đường
  kẻ, bán kính, bóng, họ chữ, thang chữ). Sửa giá trị ở block portal kit là cả hai đổi theo;
  ĐỪNG đặt lại hex hay px trong block Stitch.
- Bộ Stitch đặt style body trên root riêng của nó (`AppShell`, `StyleguidePage`), không đặt trên `<body>`.

## Quy tắc giao diện dùng chung (bắt buộc)

Rút ra từ 4 lượt audit trong `UI_AUDIT.md`; áp cho CẢ HAI bộ component.

1. **Bán kính: đúng 2 giá trị** – `--radius-control` 3px cho control (nút, ô nhập, chip)
   và `--radius-container` 6px cho khối (thẻ, panel, dialog). `rounded-full` chỉ cho
   hình tròn thật (avatar, chấm trạng thái). Trong bộ Stitch, `rounded-lg`… đã được ánh xạ
   sẵn về hai giá trị này.
2. **Bóng chỉ cho lớp nổi** – dialog, drawer, menu (`--shadow-pop`). Thẻ tĩnh phân tách
   bằng nền và viền. `shadow-sm`/`shadow-md` trong bộ Stitch đã bị tắt.
3. **Thang chữ 5 bậc**: 13 / 15 / 18 / 24 / 32 px. Không dùng `text-[Npx]` cho chữ; cỡ icon
   giữ trong nhóm 16/20/24.
4. **Một màu nhấn** (`--accent`, xanh lá) + màu ngữ nghĩa `ok/warn/danger/info`. Không
   thêm màu nhấn mới, không tô màu cho nhãn chỉ để trang trí.
5. **Nhãn trạng thái**: chỉ trạng thái cần chú ý (lỗi, cảnh báo, chờ duyệt) mới có nền màu;
   còn lại là chấm màu + chữ (`StatusBadge`).
6. **Không có chrome trang trí**: nhãn IN HOA giãn chữ, chip "badge" không mang thông tin,
   ô icon trang trí cạnh tiêu đề, mũi tên "→" dán sau nhãn link, dấu "•" nối chuỗi meta,
   chấm nhấp nháy `animate-pulse`. Chuyển động chỉ dùng cho trạng thái tải.
7. **Khoảng cách** theo thang 4/8/12/16/24/32/48/64 (`space-*` của bộ Stitch đã theo thang này).
8. **Chạm**: control cao tối thiểu 44px dưới `lg`.

# Admin + Technician portal (Stitch kit)

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

## Quy tắc thiết kế của bộ Stitch (đã lệch khỏi DESIGN.md ở 4 điểm)

DESIGN.md trong thư mục `design/stitch/…` vẫn là nguồn tham chiếu về bố cục và tên token,
nhưng GIÁ TRỊ token nay lấy theo hệ chung ở trên. Những chỗ cố ý lệch:

| Hạng mục | DESIGN.md | Trong code hiện tại |
| --- | --- | --- |
| Màu nền / chữ | `surface=#f8f9ff`, `on-surface=#0d1c2e` (ngả xanh) | trỏ vào `--canvas`, `--fg` của portal kit (trung tính) |
| Màu nhấn | `primary=#004328`, `primary-container=#0d5c3a` | cả hai trỏ vào `--accent` |
| Bán kính | `rounded-lg/xl/2xl` (8–16px) | ánh xạ về 3px / 6px |
| Bóng | 3 cấp elevation | chỉ một bóng cho lớp nổi, thẻ tĩnh không bóng |
| Badge | pill `rounded-full` tô nền theo trạng thái | chỉ trạng thái cần chú ý mới tô nền |

1. Dùng đúng tên token Tailwind như file gốc: `bg-surface`, `bg-surface-container-lowest`,
   `text-on-surface-variant`, `bg-primary-container text-on-primary`, `text-headline-md`,
   `text-label-sm`, `px-space-md`, `gap-space-sm`, `rounded-xl`… Không bịa hex mới, không dùng
   `gray-500`/`slate-*` mặc định của Tailwind.
2. Tên bậc chữ giữ nguyên (`display-lg`, `headline-xl/lg/md`, `body-xl/lg/md/sm`,
   `label-lg/md/sm`, `data-metric`) nhưng tất cả đã ánh xạ về thang 5 bậc 13/15/18/24/32.
3. Viền thẻ dùng `border-outline-card`; không thêm `shadow-*` cho thẻ tĩnh.

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

Menu Admin (subtitle "Quản trị hệ thống"): Tổng quan, Người dùng, Vai trò & quyền, Danh mục
sản phẩm, Danh mục dịch vụ, Nhóm hàng, Kho tri thức AI, Cấu hình kỹ thuật, Báo cáo, Cài đặt hệ thống.

Menu Kỹ thuật viên (subtitle "Kỹ thuật hiện trường"): Tổng quan, Việc của tôi (badge số),
Khảo sát, Lắp đặt, Bảo hành & bảo trì, Lịch làm việc; cuối sidebar là khối user (tên, chức danh)
+ Cảnh báo + Tài khoản + Đổi mật khẩu + Đăng xuất.

## Màn công khai & xác thực

Hai màn `landing_home` và `auth_portal` KHÔNG dùng `AppShell`/sidebar và giữ nguyên chữ tiếng Việt như thiết kế.

- `PublicLayout` – theo `landing_home`: `<header>` sticky cao 80px nền `surface-container-lowest`
  + viền dưới (logo, menu neo `#solutions`…, nút "Đăng nhập" và "Khảo sát mái nhà" trỏ vào
  `/customer/assessment`), `<main>` nền `surface`, `<footer>` 5 cột + hàng copyright. Từ `md` trở
  xuống menu thu thành hamburger.
- `AuthLayout` – theo `auth_portal`: lưới 12 cột, panel `primary-container` bên trái
  (`lg:col-span-5`: tiêu đề "Chuyển dịch Năng lượng Xanh cho Ngôi nhà Việt", ảnh nhà, 2 ô số liệu
  1.240 kWh / ~3,85 Tr ₫), `<Outlet/>` trong card trắng bên phải (`lg:col-span-7`), footer chỉ còn
  dòng bản quyền. Dưới `lg` ẩn panel trái. Các chip trang trí (chip "nền tảng", chip vai trò,
  chip bảo mật) và hai vệt blur đã bỏ theo quy tắc giao diện chung.
- BỎ thanh tab "Auth Hub" trong `auth_portal/code.html`: đó chỉ là tab demo của Stitch để xem 5 view trong 1 file. Header của `AuthLayout` chỉ giữ logo + link về trang chủ; mỗi view là một route riêng.
- Khối "Phiên làm việc hiện tại" (IP, JWT, thời gian còn lại) trong view "Trạng thái phiên" chỉ để demo – KHÔNG dựng.

## Bảng route

| Route             | Layout         | Trang                                                      |
| ----------------- | -------------- | ---------------------------------------------------------- |
| `/`               | `PublicLayout` | `HomeLayoutPage` – khung bố cục tạm theo header. `LandingPage` (bản đầy đủ) vẫn còn trong `src/pages/public`, đổi route khi dùng lại |
| `/login`          | `AuthLayout`   | `LoginPage`                                                 |
| `/register`       | `AuthLayout`   | `RegisterPage`                                              |
| `/forgot-password`| `AuthLayout`   | `ForgotPasswordPage`                                        |
| `/reset-password` | `AuthLayout`   | `ResetPasswordPage` (đọc `?token=`)                         |
| `/verify-email`   | `AuthLayout`   | `VerifyEmailPage`                                           |
| `/403`            | `AuthLayout`   | `ForbiddenPage`                                             |
| `/coming-soon`    | `PublicLayout` | Trang tạm cho Kinh doanh, Quản lý, Khách hàng               |
| `/admin/*`        | `AdminLayout`  | 4 màn admin – bọc `<RequireRole role="admin">`              |
| `/tech/*`         | `TechLayout`   | 10 màn technician – bọc `<RequireRole role="technician">`   |
| `/customer/*`     | `CustomerLayout` | Portal khách hàng – bọc `<RequireRole role="customer">`  |
| `/ops/*`          | `OpsLayout`      | Portal kinh doanh – bọc `<RequireRole role="sales">`     |
| `/field/*`        | `FieldLayout`    | Portal kỹ thuật – bọc `<RequireRole role="technician">`  |
| `/manage/*`       | `ManageLayout`   | Portal quản lý – bọc `<RequireRole role="manager">`      |
| `/styleguide`     | –              | `StyleguidePage`                                            |

`/` trả về trang chủ công khai; KHÔNG còn redirect `/` → `/admin`.

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
- **Điều hướng**: `homePathForRole` trong `src/lib/auth/roles.ts` đưa từng vai trò về portal
  của nó – `admin` → `/admin`, `technician` → `/tech`, `sales` → `/ops`, `manager` → `/manage`,
  `customer` → `/customer`. `<RequireRole role="…">`: chưa đăng nhập → `/login` (nhớ trang đích),
  sai vai trò → `/403`.
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
- **Chữ trên giao diện viết bằng tiếng Việt** (quyết định 22/09/2026). Bản thiết kế Stitch
  là tiếng Anh, khi dựng thì dịch sang tiếng Việt; giữ nguyên tên riêng, mã SKU, mã phiếu,
  tên hãng và thuật ngữ đã quen dùng (inverter, kWh, MPPT, SKU…). Câu chữ viết ngắn, chủ động,
  không quảng cáo: tiêu đề là tên màn hình, mô tả chỉ thêm khi nói được điều gì mới.
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
