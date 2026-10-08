# Smart Solar – Web Portal

## Git rules

- Never add `Co-Authored-By` or any AI-attribution trailer to commits or PRs. Applies to every agent and contributor.
- Conventional Commits: `type(scope): summary`.

## Hai bộ component, MỘT hệ token

Repo có hai thư mục component vì hai nhánh việc dựng song song, nhưng từ 22/09/2026 cả
hai ăn chung một hệ token trong `src/styles/globals.css`:

- `src/components/common/ui` (file kebab-case, token `canvas/fg/accent…`): MỌI portal đăng nhập —
  khách hàng `/customer`, kinh doanh `/ops`, quản trị `/admin`, kỹ thuật viên `/tech` (`/field` chuyển về `/tech`), quản lý
  `/manage` — dùng chung shell `components/layout/app-shell.tsx` (từ 08/10/2026, theo yêu cầu "admin phải đồng bộ").
  Nhật ký audit `UI_AUDIT.md` chỉ giữ ở máy, không có trên git.
- `src/components/common/stitch-ui` (file PascalCase, token `surface/on-surface/primary…`,
  Material Symbols): trang công khai/xác thực, hộp thoại đổi mật khẩu, `/styleguide` (chỉ chạy ở dev) và các màn
  mock đã ẩn của admin/kỹ thuật viên. Shell Stitch (`AppShell`, `Sidebar`, `TopHeader`) và `config/nav.ts` đã xoá.
- Token của bộ Stitch nay chỉ là bí danh trỏ vào token của portal kit (màu nền/chữ/đường
  kẻ, bán kính, bóng, họ chữ, thang chữ). Sửa giá trị ở block portal kit là cả hai đổi theo;
  ĐỪNG đặt lại hex hay px trong block Stitch.
- Bộ Stitch đặt style body trên root riêng của nó (`AppShell`, `StyleguidePage`), không đặt trên `<body>`.

## Quy tắc giao diện dùng chung (bắt buộc)

Rút ra từ 4 lượt audit giao diện; áp cho CẢ HAI bộ component.

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
   còn lại là chấm màu + chữ. Portal kit: `Badge` (`warn`/`danger` nền nhạt; `ok`/`info`/`accent` chấm màu;
   `neutral` chấm xám) và `Count` (số đếm cạnh mục menu/tab: `attention` = việc đang chờ người xem, nền accent;
   còn lại nền xám). Việc cần làm ngay hiện thành Badge cảnh báo ở mô tả đầu trang (vd. "2 yêu cầu chờ hơn 1 ngày").
6. **Không có chrome trang trí**: nhãn IN HOA giãn chữ, chip "badge" không mang thông tin,
   ô icon trang trí cạnh tiêu đề, mũi tên "→" dán sau nhãn link, dấu "•" nối chuỗi meta,
   chấm nhấp nháy `animate-pulse`. Chuyển động chỉ dùng cho trạng thái tải.
7. **Khoảng cách** theo thang 4/8/12/16/24/32/48/64 (`space-*` của bộ Stitch đã theo thang này).
8. **Chạm**: control cao tối thiểu 44px dưới `lg`.

# Web portal (Stitch kit cho trang công khai, portal kit cho mọi portal đăng nhập)

## Stack

- Vite + React + TypeScript, react-router (giữ nguyên như package.json hiện tại – KHÔNG chuyển sang Next.js)
- Tailwind CSS v4 qua `@tailwindcss/vite` (`@theme` trong `src/styles/globals.css`)
- shadcn/ui cho primitives (dialog, dropdown, tabs, checkbox…) – restyle theo token bên dưới
- Font: portal dùng Schibsted Grotesk (`globals.css`, thiếu dấu tiếng Việt U+1EA0–1EF1 – xem `docs/design/landing-brief.md`); trang công khai dùng Be Vietnam Pro (`@fontsource/be-vietnam-pro`, nạp trong `PublicLayout`). Plus Jakarta Sans đã bỏ.
- Icon: Material Symbols Outlined – link Google Fonts trong `index.html`; giữ đúng tên icon như trong file thiết kế (`grid_view`, `solar_power`, `manage_accounts`…)
- State/data: màn đang hiện đều gọi API thật (auth, sản phẩm, đánh giá sơ bộ, yêu cầu khảo sát); mock trong `src/data/*.ts` chỉ còn phục vụ các màn đã ẩn (xem "Chỉ hiện màn có dữ liệu thật")

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
    layout/                    # app-shell (shell chung của mọi portal) và mọi layout route:
                               # AdminLayout, TechLayout, AuthLayout, PublicLayout, RootLayout, customer-/ops-/manage-layout
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
  config/                      # portals.ts (menu của mọi portal), roles.ts, demoAccounts.ts
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
  service và hook import kiểu từ đây. Ngoại lệ: swagger của tag Customers, PreSurveys, SurveyRequests chỉ khai
  "200 OK" nên `customersRes.ts`, `preSurveysRes.ts`, `surveyRequestsRes.ts` viết tay theo contract backend
  (không có header tự sinh nên `gen:api` không xoá); backend khai response thì `gen:api` ghi đè.
- Nghiệp vụ chưa có endpoint đọc dữ liệu từ `data/*.ts` và bị ẩn khỏi menu/route (mục dưới). Khi backend có
  endpoint: thêm `types/req|res/<nghiệp vụ>*.ts`, rồi `services/` + `hooks/` vào feature đó, bỏ file trong `data/`,
  rồi mở lại route + mục menu.

## Chỉ hiện màn có dữ liệu thật (05/10/2026)

Menu và route chỉ có màn đổ dữ liệu thật từ backend; màn mock giữ code trong `pages/<portal>/` nhưng không có route,
đường dẫn cũ trong portal rơi vào route `*` và chuyển về trang chủ portal. Đang hiện:

- `/customer` → `/customer/assessment`: đánh giá sơ bộ (hồ sơ → địa điểm → nháp → gửi), `features/pre-surveys`.
- `/ops` → `/ops/surveys` + `/ops/surveys/:id`: yêu cầu khảo sát chờ nhận / của tôi / chi tiết.
- `/customer/products(/:id)`, `/ops/products(/:id)`: catalog sản phẩm (GET /api/products) bản portal kit, `pages/catalog-page.tsx`.

Mô phỏng 3D bố trí tấm pin (`features/pre-surveys/components/RoofSimulation.tsx`) ở bước số liệu + xem lại của
wizard và trang chi tiết yêu cầu của sales. Tính toán ở `roofLayout.ts` (hàm thuần; mái giả định một mặt dốc,
hình chữ nhật 3:2 vì backend chỉ có diện tích), tấm pin lấy từ catalog `ProductType=SOLAR_PANEL` (cần đủ
`ratedPowerW`, `widthMm`, `heightMm`). Phần vẽ `RoofScene.tsx` dùng `three` + `@react-three/fiber` (OrbitControls của
three, không dùng drei), nạp bằng `React.lazy` để three.js chỉ tải khi mở màn có mô phỏng. Không lưu được thiết kế:
backend chưa có API.
- `/admin` → `/admin/products`: quản lý sản phẩm (`pages/admin/products-page.tsx`, bộ portal kit; tấm pin thiếu
  công suất/kích thước được tô cảnh báo vì mô phỏng không dùng được). Backend ẩn sản phẩm INACTIVE khỏi GET danh sách
  và GET chi tiết với mọi vai trò (dò 08/10/2026), nên: tạo mới luôn ACTIVE; "Ngừng bán" hỏi xác nhận, có "Hoàn tác";
  sản phẩm đã ngừng bán được nhớ trong localStorage (`features/products/hiddenProducts.ts`) để "Mở bán lại" — chỉ trên
  trình duyệt đã bấm. Khi backend có cách liệt kê sản phẩm ngừng bán thì bỏ cơ chế này.
- `/tech/products(/:id)`, `/manage/products(/:id)`: kỹ thuật viên và quản lý chưa có API riêng, nên trang chủ của họ là
  danh mục sản phẩm thật (GET /api/products, bản portal kit). Không còn trang giữ chỗ "chưa có chức năng" (08/10/2026);
  `/field/*` chuyển về `/tech`.

Mở lại một màn: thêm route trong `routes/protectedRoutes.tsx` và mục menu trong `config/portals.ts`
(mọi portal). Sidebar/header không đặt số liệu giả (tên người dùng,
thông báo, chip trạng thái): người dùng lấy từ `useAuth`.

## Layout chung

Mọi portal đăng nhập dùng 1 shell (`components/layout/app-shell.tsx`): rail chữ cố định bên trái `w-52` (208px), `<main>` lề 24px.
Thanh trên mảnh (`Mở menu`) hiện dưới `lg`, và cả từ `lg` khi người dùng bấm "Thu gọn menu" (nhớ trong localStorage,
`hooks/useSidebarCollapsed.ts`); lúc đó thanh trên hiện thêm gợi ý việc đang chờ (`collapsedHint`). Cuối rail là khối tài khoản:
tên, vai trò, rồi mỗi thao tác một hàng (Đổi mật khẩu, Giao diện, Đăng xuất). Mục đang mở có nền `accent-soft` + vạch
accent 3px, nhóm chứa nó đậm lên; trên cùng nội dung có thanh định vị dính (`LocationBar`): portal / nhóm / mục / trang chi tiết.
Trang chi tiết hoặc wizard đặt mắt xích cuối bằng `usePageCrumb(tên)` (`components/layout/page-crumb.tsx`), không tự làm link "quay lại". Số đếm thật cạnh mục menu truyền qua
`badges` của layout (`ops-layout`: hàng chờ; `AdminLayout`: tổng sản phẩm). Làm 1 lần trong layout route với `<Outlet/>`,
KHÔNG copy rail vào từng page; layout còn được vẽ làm khung chờ (`hydrateFallbackElement`) TRƯỚC `RequireRole` nên
query trong layout phải chờ `useAuth().user` đúng vai trò mới gọi API.

Mật độ (bố cục gọn 05/10/2026, áp cho cả hai bộ component): lề nội dung 24px (`px-6`, bộ Stitch `px-space-lg`), không giới hạn bề rộng `<main>`; rail portal kit `w-52`; khoảng cách tiêu đề trang → nội dung 24px; giữa cột/khối 24px (`gap-6`); giữa các Panel 16px + đường kẻ; `ListRow` `py-4`. Thêm màn mới thì theo đúng các bậc này, đừng quay lại 48px.

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
| `/admin/*`        | `AdminLayout`  | Sản phẩm – bọc `<RequireRole role="admin">`                 |
| `/tech/*`         | `TechLayout`   | Sản phẩm (danh mục) – bọc `<RequireRole role="technician">` |
| `/customer/*`     | `CustomerLayout` | Đánh giá sơ bộ – bọc `<RequireRole role="customer">`     |
| `/ops/*`          | `OpsLayout`      | Yêu cầu khảo sát – bọc `<RequireRole role="sales">`      |
| `/field/*`        | —                | chuyển về `/tech` |
| `/manage/*`       | `ManageLayout`   | Sản phẩm (danh mục) – bọc `<RequireRole role="manager">` |
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
- Không cài thêm thư viện UI khác (MUI, Ant, Chakra…). Ngoại lệ đã chốt: `sonner` chỉ dùng cho toast;
  `three` + `@react-three/fiber` chỉ cho mô phỏng 3D (05/10/2026).
- Không sửa bất kỳ file nào trong `design/stitch/stitch_smart_solar_customer_portal/`.

## Lệnh

- `npm run dev -- --port 3000` – Vite dev server; backend gửi link xác minh email / đặt lại mật khẩu về `http://localhost:3000`.
  Proxy `/api` trỏ `API_PROXY_TARGET` (mặc định `http://localhost:8080`). Máy có dịch vụ khác giữ 8080 (vd. PEMHTTPD đi kèm
  bộ cài PostgreSQL) thì chạy API ở cổng khác: `API_HOST_PORT=8081 docker compose -f docker-compose.pull.yml up -d` trong thư mục
  backend, rồi `API_PROXY_TARGET=http://localhost:8081 npm run dev -- --port 3000`.
- `npm run build` – `tsc -b && vite build`; phải pass trước khi coi một màn là xong
- `npm run typecheck` – `tsc -b` (nhanh hơn build, dùng khi lặp)
- `npm run gen:api` – sinh lại `src/types/req` và `src/types/res` từ `docs/api/swagger.json`
- `npm run lint` – oxlint (KHÔNG dùng ESLint: repo dùng `typescript@7`, gói này không còn API JS nên typescript-eslint không chạy được)
  (Nếu package.json dùng tên script khác, dùng theo package.json.)
