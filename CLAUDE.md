# Smart Solar – Web Portal

## Git rules

- Never add `Co-Authored-By` or any AI-attribution trailer to commits or PRs. Applies to every agent and contributor.
- Conventional Commits: `type(scope): summary`.

## Hai bộ component, MỘT hệ token

Repo có hai thư mục component vì hai nhánh việc dựng song song, nhưng từ 22/09/2026 cả
hai ăn chung một hệ token trong `src/styles/globals.css`:

- `src/components/common/ui` (file kebab-case, token `canvas/fg/accent…`): portal khách hàng
  `/customer`, kinh doanh `/ops`, kỹ thuật `/field`, quản lý `/manage`. Lịch sử audit ở `UI_AUDIT.md`.
- `src/components/common/stitch-ui` (file PascalCase, token `surface/on-surface/primary…`,
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
- Font: portal dùng Schibsted Grotesk (`globals.css`, thiếu dấu tiếng Việt U+1EA0–1EF1 – xem `docs/design/landing-brief.md`); trang công khai dùng Be Vietnam Pro (`@fontsource/be-vietnam-pro`, nạp trong `PublicLayout`). Plus Jakarta Sans đã bỏ.
- Icon: Material Symbols Outlined – link Google Fonts trong `index.html`; giữ đúng tên icon như trong file thiết kế (`grid_view`, `solar_power`, `manage_accounts`…)
- State/data: mock data trong `src/data/*.ts` cho phần UI; riêng auth đã gọi API thật (xem "Auth API")

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
index.html                     # lang="vi", meta/OG tiếng Việt, link Material Symbols
src/
  main.tsx                     # createRoot + <App/> + globals.css
  App.tsx                      # <AppProviders><RouterProvider router={router}/></AppProviders>
  styles/globals.css           # @import "tailwindcss" + @theme tokens; landing.css cho trang chủ
  routes/
    router.tsx                 # createBrowserRouter: RootLayout + publicRoutes + protectedRoutes + 404
    publicRoutes.tsx           # route không cần đăng nhập: /, /coming-soon, màn xác thực, /403, /styleguide
    protectedRoutes.tsx        # 6 portal, mỗi portal bọc <RequireRole role="…"> (children lazy)
    paths.ts                   # ROUTES, withId, techTaskPath, surveyPath…
    RequireRole.tsx            # route bảo vệ theo vai trò + AuthLoadingScreen
    notFound.ts                # ném Response 404 cho errorElement
  context/
    AppProviders.tsx           # QueryClientProvider + AuthProvider + Toaster (sonner)
    AuthProvider.tsx           # phiên đăng nhập, useAuth
  components/
    layout/                    # AppShell + Sidebar + TopHeader (Stitch), app-shell (portal kit) và mọi layout route:
                               # AdminLayout, TechLayout, AuthLayout, PublicLayout, RootLayout, customer-/ops-/field-/manage-layout
    common/ui/                 # portal kit (kebab-case) + query-boundary
    common/stitch-ui/          # bộ Stitch (PascalCase, barrel index.ts): StatusBadge, MetricCard, DataTable, TaskCard, Timeline, ChecklistItem, PhotoGrid…
    common/tech/               # khối dùng ở nhiều nghiệp vụ kỹ thuật viên: SectionCard, ActionDock, JobHeaderCard, MeasurementCard…
  features/
    auth/                      # components/ (AuthCard, PasswordRules, ForbiddenCard, SessionExpiredModal, ChangePasswordDialog…),
                               # hooks/useAuthMutations.ts, services/authService.ts + me.ts
    landing/components/        # section trang chủ, classes.ts, photo, reveal
    surveys/ installations/ tasks/ warranty/   # components/ riêng của từng nghiệp vụ kỹ thuật viên
    dashboard/                 # components/ chỉ dùng ở màn tổng quan admin và kỹ thuật viên
    users/ roles/ products/    # components/ riêng của các màn admin
  pages/                       # màn gắn với route: admin/ tech/ customer/ ops/ field/ manage/ auth/ public/ + trang lẻ
  data/                        # dữ liệu tĩnh cho UI: mock từng màn (surveys.ts, tasks.ts, session.ts…, customer.ts, manage.ts…)
                               # và nội dung chữ (auth.ts, landing.ts)
  services/api/                # client.ts (axios, mở wrapper, refresh), errors.ts (ApiError), tokens.ts
  types/                       # sinh bằng `npm run gen:api` (scripts/gen-api-types.mjs), KHÔNG sửa tay
    req/                       # request DTO theo tag swagger: authReq.ts, …
    res/                       # response DTO: apiRes.ts (ApiResponse<T>, ApiErrorBody), authRes.ts, …
  config/                      # nav.ts (menu admin/tech), portals.ts (rail 4 portal), roles.ts, demoAccounts.ts
  hooks/                       # useMockQuery, useTheme
  utils/                       # cn, cx, format, img, jwt
public/placeholders/           # thay cho ảnh lh3.googleusercontent.com
```

Quy tắc đặt file (tái cấu trúc 29/09/2026):

- `pages/` chỉ ghép UI và gọi hook. Component dùng ở MỘT nghiệp vụ nằm trong
  `features/<nghiệp vụ>/components/`; dùng ở nhiều nghiệp vụ thì vào `components/common/`.
- Mỗi feature chỉ có các thư mục con `components/ hooks/ services/` thật sự cần.
  API của nghiệp vụ ở `features/<nghiệp vụ>/services/`; `services/api/` chỉ giữ HTTP client dùng chung.
  Một trách nhiệm chỉ ở một nơi.
- DTO nằm ở `src/types/`: request trong `types/req/<nghiệp vụ>Req.ts`, response trong
  `types/res/<nghiệp vụ>Res.ts`. Các file này sinh từ swagger (không tự đoán field, không sửa tay);
  service và hook import kiểu từ đây.
- Nghiệp vụ chưa có endpoint (mọi thứ trừ auth và sản phẩm) đọc dữ liệu từ `data/*.ts`. Khi backend có
  endpoint: thêm `types/req|res/<nghiệp vụ>*.ts`, rồi `services/` + `hooks/` vào feature đó rồi bỏ file trong `data/`.

## Layout chung

Mọi màn đều dùng 1 shell: `<aside>` cố định bên trái `w-72` nền `surface-container-lowest`, `<header>` trên cùng, `<main>` nền `surface`. Làm 1 lần trong layout route (`AdminLayout` / `TechLayout` với `<Outlet/>`), KHÔNG copy sidebar vào từng page.

Menu Admin (subtitle "Quản trị hệ thống"): Tổng quan, Người dùng, Vai trò & quyền, Sản phẩm,
Danh mục dịch vụ, Nhóm hàng, Kho tri thức AI, Cấu hình kỹ thuật, Báo cáo, Cài đặt hệ thống.

Menu Kỹ thuật viên (subtitle "Kỹ thuật hiện trường"): Tổng quan, Việc của tôi (badge số),
Khảo sát, Lắp đặt, Bảo hành & bảo trì, Lịch làm việc; cuối sidebar là khối user (tên, chức danh)
+ Cảnh báo + Tài khoản + Đổi mật khẩu + Đăng xuất.

## Màn công khai & xác thực

Trang chủ và các màn xác thực KHÔNG dùng `AppShell`/sidebar.

- `PublicLayout` + trang chủ `/`: website bán hàng của công ty thi công điện mặt trời áp mái cho
  **doanh nghiệp** (nhà xưởng, kho, toà nhà) – `docs/design/landing-brief.md`, mục "Bản 4". Ảnh lớn,
  chữ lớn, mỗi section một bố cục; KHÔNG đặt bảng dữ liệu, màn tài khoản, biểu giá hay quy trình theo
  giai đoạn lên trang (giao diện hệ thống chỉ một thẻ ở section theo dõi). Header dính: "Sản phẩm" (→ `/products`), "Công trình",
  "Năng lực thi công", "Đăng nhập", nút "Nhận khảo sát" → `/register`. Nội dung ở
  `src/data/landing.ts`; ảnh thật đặt `src` cho từng `Shot`; lời khách và con số chỉ thêm khi có
  nguồn. Token riêng (`font-vn`, `max-w-landing`, `ld-*`) ở `src/styles/landing.css`.
  Chuyển động chỉ transform/opacity, không thư viện: hero `ld-settle` (ảnh) + `ld-rise` (chữ, nút),
  khối nội dung bọc `<Reveal>` (IntersectionObserver, hiện một lần khi cuộn tới), ảnh công trình phóng
  nhẹ khi hover. `prefers-reduced-motion` tắt hết và hiện nội dung ngay. Favicon sinh từ
  `public/images/Logo.png` (`public/favicon-32/48.png`, `apple-touch-icon.png`).
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
| `/`               | `PublicLayout` | `LandingPage` – brief và direction ở `docs/design/landing-brief.md` |
| `/login`          | `AuthLayout`   | `LoginPage`                                                 |
| `/register`       | `AuthLayout`   | `RegisterPage`                                              |
| `/forgot-password`| `AuthLayout`   | `ForgotPasswordPage`                                        |
| `/reset-password` | `AuthLayout`   | `ResetPasswordPage` (đọc `?token=`)                         |
| `/verify-email`   | `AuthLayout`   | `VerifyEmailPage`                                           |
| `/403`            | `AuthLayout`   | `ForbiddenPage`                                             |
| `/coming-soon`    | `PublicLayout` | Trang tạm cho Kinh doanh, Quản lý, Khách hàng               |
| `/products`, `/products/:id` | `PublicLayout` | Danh mục sản phẩm công khai – GET /api/products(/{id}) |
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
- **Sinh type**: `npm run gen:api` chạy `scripts/gen-api-types.mjs`, đọc `docs/api/swagger.json` và
  ghi request body vào `src/types/req/<tag>Req.ts`, response vào `src/types/res/<tag>Res.ts`
  (bỏ wrapper *ApiResponse, chỉ giữ schema của `data`), `ApiErrorBody` + `ApiResponse<T>` vào
  `src/types/res/apiRes.ts`. KHÔNG sửa các file đó bằng tay; đổi swagger thì chạy lại lệnh.
- **Token**: `AuthTokensResponse` trả token trong body (không phải cookie httpOnly) nên
  KHÔNG dùng `withCredentials`. `accessToken` giữ trong bộ nhớ; `refreshToken` vào
  `localStorage` khi tick "Ghi nhớ đăng nhập", ngược lại `sessionStorage`
  (`src/services/api/tokens.ts`). Hạn token lấy từ `accessTokenExpiresAt` /
  `refreshTokenExpiresAt` chứ không hard-code.
- **Refresh**: interceptor trong `src/services/api/client.ts` gặp 401 thì gọi
  `POST /api/auth/refresh` theo kiểu single-flight (nhiều request cùng 401 chỉ refresh
  một lần, số còn lại xếp hàng chờ rồi retry). Refresh hỏng → xoá phiên + bắn sự kiện
  `session-expired` trên `window`; `SessionExpiredModal` lắng nghe sự kiện này.
  KHÔNG còn bộ đếm 30 phút giả lập.
- **Wrapper & lỗi**: response bọc trong `*ApiResponse { isSuccess, traceId, data, error }`;
  interceptor mở wrapper và trả thẳng `data`. Lỗi ném ra `ApiError`
  (`src/services/api/errors.ts`) có `status`, `code`, `message`, `fieldErrors`, `traceId`.
  Swagger không khai kiểu của `ApiError.details` nên `parseFieldErrors` nhận cả 3 dạng
  (`{field: [msg]}`, `[{field, message}]`, `{errors: {...}}`) và bỏ qua dạng lạ.
  Backend chưa có bảng mã lỗi cố định → ưu tiên hiển thị `message` của server, thiếu thì
  dùng câu tiếng Việt theo HTTP status.
- **Role**: `AuthTokensResponse` không có role → decode claim `role` trong accessToken
  bằng `jwt-decode` (`src/utils/jwt.ts`) rồi map qua `ROLE_ALIASES` trong
  `src/config/roles.ts` về `customer | technician | sales | manager | admin`.
  Không đọc được role thì coi như đăng nhập hỏng, không đoán bừa.
- **Khôi phục phiên**: mở app mà còn `refreshToken` thì gọi refresh trước;
  `status = 'loading'` và `RequireRole` (`src/routes/RequireRole.tsx`) hiện `AuthLoadingScreen` để không đá người dùng
  về `/login` quá sớm.
- **Điều hướng**: `homePathForRole` trong `src/config/roles.ts` đưa từng vai trò về portal
  của nó – `admin` → `/admin`, `technician` → `/tech`, `sales` → `/ops`, `manager` → `/manage`,
  `customer` → `/customer`. `<RequireRole role="…">`: chưa đăng nhập → `/login` (nhớ trang đích),
  sai vai trò → `/403`.
- **API**: 9 hàm trong `src/features/auth/services/authService.ts` (DTO ở `src/types/req/authReq.ts` và `src/types/res/authRes.ts`) (register, verify-email, resend-verification,
  login, refresh, logout, forgot-password, reset-password, change-password); mutation của
  react-query trong `src/features/auth/hooks/useAuthMutations.ts`; login/logout nằm trong `AuthProvider`
  vì còn phải lưu token.
- **Tài khoản mẫu** ở `/login` chỉ hiện khi `import.meta.env.DEV` và lấy từ
  `.env.development.local` (không commit) – xem `src/config/demoAccounts.ts`.
- **CHỜ BACKEND**: swagger chưa có endpoint `/me`, nên tên hiển thị tạm lấy từ claim
  `name`/`fullName` trong JWT, không có thì dùng email. Khi có `/me`, chỉ cần điền thân
  hàm `fetchCurrentUser()` trong `src/features/auth/services/me.ts`.

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
- Mỗi màn = 1 route + 1 file dữ liệu trong `src/data/`. Không hard-code dữ liệu trong JSX.
- Khi dựng xong một màn: chạy dev, chụp màn hình, đặt cạnh `screen.png`, liệt kê khác biệt (spacing, màu, font size, icon) rồi sửa. Chấp nhận sai lệch ≤ 4px.
- Không cài thêm thư viện UI khác (MUI, Ant, Chakra…). Ngoại lệ đã chốt: `sonner` chỉ dùng cho toast.
- Không sửa bất kỳ file nào trong `design/stitch/stitch_smart_solar_customer_portal/`.

## Lệnh

- `npm run dev` – Vite dev server
- `npm run build` – `tsc -b && vite build`; phải pass trước khi coi một màn là xong
- `npm run typecheck` – `tsc -b` (nhanh hơn build, dùng khi lặp)
- `npm run gen:api` – sinh lại `src/types/req` và `src/types/res` từ `docs/api/swagger.json`
- `npm run lint` – oxlint (KHÔNG dùng ESLint: repo dùng `typescript@7`, gói này không còn API JS nên typescript-eslint không chạy được)
  (Nếu package.json dùng tên script khác, dùng theo package.json.)
