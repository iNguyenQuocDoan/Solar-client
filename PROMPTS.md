# Bộ prompt cho Claude Code – Smart Solar Web Portal

Cách dùng: làm tuần tự, mỗi prompt là một bước. Xong bước nào thì mở trình duyệt xem, so với `screen.png`, sửa cho ổn rồi mới chuyển bước tiếp. Đừng dồn nhiều màn vào một prompt.

Trước khi bắt đầu:

1. `npx create-next-app@latest smart-solar-web --ts --tailwind --app --eslint --src-dir=false`
2. Copy thư mục `stitch_smart_solar_customer_portal` vào repo, đổi tên thành `design/stitch/stitch_smart_solar_customer_portal/`
3. Copy `CLAUDE.md` vào thư mục gốc repo
4. `cd smart-solar-web && claude`

---

## GIAI ĐOẠN 0 – Khảo sát (1 prompt, không viết code)

```
Đọc CLAUDE.md. Sau đó đọc design/stitch/stitch_smart_solar_customer_portal/solaris_home_design_system/DESIGN.md
và mở 16 file design/stitch/stitch_smart_solar_customer_portal/*/screen.png.
Chưa viết code. Hãy tóm tắt cho tôi:
1. Danh sách 16 màn, gom theo nhóm Admin / Technician, màn nào là biến thể
   của nhau (technician_dashboard_1 vs _2, my_tasks_1 vs _2).
2. Các component lặp lại nhiều màn (badge, metric card, table, task card,
   timeline, checklist, photo grid, filter bar, modal…) và màn nào dùng.
3. Đề xuất cấu trúc route trong app/ cho từng màn.
Trình bày ngắn gọn dạng bảng.
```

→ Biến thể đã chốt (ghi sẵn trong CLAUDE.md): dùng `technician_dashboard_1` và `my_tasks_1`; các bản `_2` chỉ để tham khảo, không dựng.

---

## GIAI ĐOẠN 1 – Design tokens

```
Đọc block YAML ở đầu design/stitch/stitch_smart_solar_customer_portal/solaris_home_design_system/DESIGN.md và
block <script id="tailwind-config"> trong design/stitch/stitch_smart_solar_customer_portal/admin_dashboard/code.html.
Chuyển TOÀN BỘ colors, fontSize (kèm lineHeight/letterSpacing/fontWeight),
spacing, borderRadius sang @theme trong app/globals.css (Tailwind v4).
Thêm 3 cấp boxShadow (shadow-level-1/2/3) và biến --card-border theo mục
"Elevation & Depth".
Cài Plus Jakarta Sans qua next/font/google, gán vào <body>.
Nhúng Material Symbols Outlined (link Google Fonts trong app/layout.tsx)
và tạo component <Icon name="grid_view" size={20} />.
Tạo trang /styleguide render: bảng màu, typography scale, 3 cấp shadow,
5 status badge theo bảng "Status & Lifecycle Palette".
Chưa làm màn hình nào. Chạy lint + typecheck.
```

Kiểm tra: mở `/styleguide`, so màu với `screen.png` bất kỳ. Nếu nền không phải `#f8f9ff` hoặc sidebar không trắng thì token sai.

---

## GIAI ĐOẠN 2 – Layout chung (AppShell)

```
So sánh phần <aside> và <header> trong:
- design/stitch/stitch_smart_solar_customer_portal/admin_dashboard/code.html (role Admin)
- design/stitch/stitch_smart_solar_customer_portal/my_tasks_1/code.html (role Technician – logo "Smart Solar",
  subtitle "Field Operations", badge số trên My Tasks, khối user Marcus Vance
  + Alerts/Settings ở cuối)
và xem screen.png của hai màn đó. Không dùng sidebar "SOLARTECH" của các bản _2.
Tạo:
- lib/nav.ts: hai mảng menu adminNav / technicianNav (label, icon, href, badge?)
  theo đúng thứ tự trong CLAUDE.md.
- components/layout/Sidebar.tsx: fixed left, w-72, nền surface-container-lowest,
  logo + tiêu đề + subtitle, nhóm menu, item active dùng
  bg-primary-container text-on-primary; cuối sidebar là khối user + Alerts/Settings
  (technician) hoặc chỉ menu (admin). Dùng usePathname để highlight active.
- components/layout/TopHeader.tsx: breadcrumb/title, ô search, nút thông báo,
  avatar – bám theo header trong hai file trên.
- components/layout/AppShell.tsx ghép lại, <main> có padding và max-width
  như thiết kế.
- app/(admin)/layout.tsx và app/(technician)/layout.tsx dùng AppShell với
  menu tương ứng.
Tạo 2 trang trống /admin và /tech để nhìn shell. Đối chiếu với screen.png.
```

---

## GIAI ĐOẠN 3 – Component dùng chung

```
Quét 16 file design/stitch/stitch_smart_solar_customer_portal/*/code.html. Trích các pattern lặp lại và tạo
component trong components/ui/ (dùng shadcn làm nền nếu phù hợp):
- StatusBadge (variant: submitted | review | scheduled | in-progress | complete
  | error…) đúng spec pill + chấm 6px trong DESIGN.md
- MetricCard (label, giá trị data-metric, delta, icon)
- DataTable (header, hàng, cột action, phân trang) – theo bảng trong
  user_management và product_catalogue
- TaskCard – theo my_tasks_*
- TimelineStep / Timeline – theo task_detail_timeline
- ChecklistItem – theo installation_task_checklist
- PhotoGrid / PhotoCard – theo survey_image_documentation
- FilterBar (search + select + chips)
- PageHeader (h1 headline-xl + mô tả + action buttons)
- Button variants primary / secondary / accent theo mục "Buttons"
Mỗi component có props rõ ràng, không hard-code text. Thêm tất cả vào
/styleguide để xem. Lint + typecheck pass.
```

---

## GIAI ĐOẠN 4 – Dựng từng màn (16 prompt, dùng chung 1 khuôn)

Khuôn prompt – thay `<screen>`, `<route>`, `<mock>`:

```
Dựng trang <route> từ design/stitch/stitch_smart_solar_customer_portal/<screen>/code.html.
Mở design/stitch/stitch_smart_solar_customer_portal/<screen>/screen.png trước khi code và bám theo ảnh.
Yêu cầu:
- Dùng AppShell + component sẵn có trong components/ui; chỉ tạo component
  mới nếu pattern chưa có, đặt trong components/<nhóm>/.
- Dữ liệu giả để trong lib/mock/<mock>.ts, page chỉ render từ mock.
- Giữ đúng tên icon Material Symbols trong code.html.
- Thay ảnh lh3.googleusercontent.com bằng /placeholders.
- Responsive: desktop như ảnh; dưới lg sidebar ẩn thành drawer.
Xong thì liệt kê những chỗ bạn làm khác ảnh và lý do. Lint + typecheck pass.
```

### Nhóm Admin

| #   | `<screen>`          | `<route>`         | `<mock>`         | Ghi chú                          |
| --- | ------------------- | ----------------- | ---------------- | -------------------------------- |
| 1   | `admin_dashboard`   | `/admin`          | `adminDashboard` | Metric cards + bảng + nav phụ    |
| 2   | `user_management`   | `/admin/users`    | `users`          | Có bảng + form (modal thêm user) |
| 3   | `roles_permissions` | `/admin/roles`    | `roles`          | Ma trận RBAC (checkbox grid)     |
| 4   | `product_catalogue` | `/admin/products` | `products`       | Bảng sản phẩm + filter           |

### Nhóm Technician

| #   | `<screen>`                    | `<route>`                            | `<mock>`        | Ghi chú                         |
| --- | ----------------------------- | ------------------------------------ | --------------- | ------------------------------- |
| 5   | `technician_dashboard_1`      | `/tech`                              | `techDashboard` | Bỏ qua `_2`                     |
| 6   | `my_tasks_1`                  | `/tech/tasks`                        | `tasks`         | Dạng bảng; bỏ qua `_2`          |
| 7   | `task_detail_timeline`        | `/tech/tasks/[id]`                   | `taskDetail`    | Timeline dọc                    |
| 8   | `site_survey_task`            | `/tech/surveys/[id]`                 | `surveys`       | 2 cột, có aside phụ bên phải    |
| 9   | `site_survey_verification`    | `/tech/surveys/[id]/verify`          | `surveys`       | Form xác minh                   |
| 10  | `survey_image_documentation`  | `/tech/surveys/[id]/photos`          | `surveyPhotos`  | Step 2/2, photo grid, aside phụ |
| 11  | `installation_task`           | `/tech/installations/[id]`           | `installations` |                                 |
| 12  | `installation_task_checklist` | `/tech/installations/[id]/checklist` | `installations` | Checklist theo phase            |
| 13  | `maintenance_task`            | `/tech/maintenance/[id]`             | `maintenance`   |                                 |
| 14  | `warranty_request`            | `/tech/warranty/[id]`                | `warranty`      |                                 |

Tổng cộng 14 màn cần dựng (16 file trừ 2 biến thể `_2`).

Ví dụ prompt đã điền cho màn 2:

```
Dựng trang /admin/users từ design/stitch/stitch_smart_solar_customer_portal/user_management/code.html.
Mở design/stitch/stitch_smart_solar_customer_portal/user_management/screen.png trước khi code và bám theo ảnh.
Yêu cầu:
- Dùng AppShell + component sẵn có trong components/ui; chỉ tạo component
  mới nếu pattern chưa có, đặt trong components/admin/.
- Dữ liệu giả để trong lib/mock/users.ts, page chỉ render từ mock.
- Form thêm/sửa user trong code.html chuyển thành Dialog (shadcn), validate
  bằng zod + react-hook-form.
- Giữ đúng tên icon Material Symbols trong code.html.
- Thay ảnh lh3.googleusercontent.com bằng /placeholders.
- Responsive: desktop như ảnh; dưới lg sidebar ẩn thành drawer.
Xong thì liệt kê những chỗ bạn làm khác ảnh và lý do. Lint + typecheck pass.
```

---

## GIAI ĐOẠN 4B – Màn công khai & xác thực

Hai màn bổ sung `landing_home` + `auth_portal`: dùng chung design system nhưng KHÔNG dùng
AppShell/sidebar, giữ nguyên chữ tiếng Việt như thiết kế. Chỉ lấy markup/style, bỏ logic JS
gốc (chuyển tab, querySelector).

| #   | `<screen>`     | `<route>`                                                              | `<mock>`     | Ghi chú                                      |
| --- | -------------- | ---------------------------------------------------------------------- | ------------ | -------------------------------------------- |
| 15  | `landing_home` | `/`                                                                    | `landing`    | `PublicLayout`; 11 khối trong `components/landing/` |
| 16  | `auth_portal`  | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/403` | `users-auth` | `AuthLayout`; bỏ thanh tab "Auth Hub"        |

Đã chốt:

- `PublicLayout` = header sticky + footer theo `landing_home`; `AuthLayout` = panel xanh trái +
  card form phải + footer nhỏ, ẩn panel trái từ `lg` trở xuống.
- Thanh tab "Auth Hub" chỉ là tab demo của Stitch để xem 5 view trong 1 file → bỏ; mỗi view là
  một route riêng, header `AuthLayout` chỉ giữ logo + link về trang chủ.
- Khối "Phiên làm việc hiện tại" (IP, JWT, thời gian còn lại) chỉ để demo → không dựng.
- `/coming-soon` là trang tạm cho các vai trò chưa có màn (Kinh doanh, Quản lý, Khách hàng).

Auth giả lập (xem mục "Auth giả lập" trong CLAUDE.md):

```
Tạo lib/auth/AuthProvider.tsx lưu user {name, email, role} vào localStorage,
role = customer | technician | sales | manager | admin, tài khoản mẫu mỗi role
trong lib/mock/users-auth.ts. Sau đăng nhập: admin → /admin, technician → /tech,
còn lại → /coming-soon. <RequireRole>: chưa đăng nhập → /login, sai role → /403.
Bọc AdminLayout bằng RequireRole role="admin", TechLayout bằng role="technician",
thêm nút Đăng xuất vào khối user của Sidebar.
Form dùng react-hook-form + zod; toast dùng sonner; phiên hết hạn sau 30 phút
không thao tác hiện SessionExpiredModal, có expireSession() để test.
```

Kiểm tra sau khi xong: vào `/admin` khi chưa đăng nhập phải bị đẩy về `/login`; đăng nhập bằng
tài khoản kỹ thuật viên rồi vào `/admin` phải ra `/403`; `/` hiển thị trang chủ.

---

## GIAI ĐOẠN 5 – Đối chiếu & tinh chỉnh (sau mỗi màn)

```
Chạy dev server, dùng Playwright chụp <route> ở 1440x900 lưu vào
tmp/<screen>.png. Mở song song với design/stitch/stitch_smart_solar_customer_portal/<screen>/screen.png.
Liệt kê mọi khác biệt về: khoảng cách, cỡ chữ, màu nền/chữ, bo góc, shadow,
icon, thứ tự phần tử. Sửa hết trừ khi khác biệt là do tôi yêu cầu.
Chụp lại và xác nhận.
```

Nếu chưa cài Playwright: `npm i -D playwright && npx playwright install chromium`.

---

## GIAI ĐOẠN 6 – Nối đường đi giữa các màn

```
Nối điều hướng: sidebar → các route; TaskCard/hàng bảng → trang chi tiết
[id]; nút "Start survey" → /tech/surveys/[id]; "Next: Photos" →
/photos; checklist → /checklist. Tạo lib/mock/index.ts để các mock dùng
chung id. Kiểm tra không có link chết (href="#").
```

---

## Mẹo khi làm việc với Claude Code

- Gõ `/init` lần đầu không cần vì đã có CLAUDE.md; nếu Claude Code đề nghị ghi đè thì từ chối.
- Khi nó làm sai màu: "Lấy lại hex từ block YAML trong DESIGN.md, không lấy từ đoạn mô tả."
- Khi nó lặp sidebar trong page: "Sidebar đã có trong AppShell, xoá khỏi page."
- Khi context dài (sau 3–4 màn): `/compact` hoặc `/clear` rồi bắt đầu phiên mới – CLAUDE.md sẽ được đọc lại tự động.
- Dùng plan mode (`Shift+Tab`) cho Giai đoạn 2 và 3 để duyệt kế hoạch trước khi nó viết code.
- Commit sau mỗi màn: "Commit với message `feat(admin): users page from stitch`".
