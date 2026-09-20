# UI Audit — Smart Solar client

Ngày audit: 2026-09-20. Trạng thái: **Phase 1–3 hoàn tất cùng ngày — 36 commit sau baseline `35778cf`, xem bảng trạng thái cuối file. Chưa push (theo yêu cầu).**

## Bối cảnh đã xác định

| Mục | Giá trị |
|---|---|
| Stack | React 19.3 + Vite 8 + TypeScript 7, react-router 7, TanStack Query 5, zod 4 |
| Styling | Tailwind CSS v4 (`@theme inline`), font Schibsted Grotesk Variable |
| Thư mục UI | `src/components/ui/*` (12 primitive), `src/components/layout/app-shell.tsx`, `src/pages/**` (26 màn hình, 4 portal) |
| Design token | Có: `src/styles/globals.css` — màu semantic (canvas/surface/line/fg/accent/ok/warn/danger/info), radius 2/3/4px, 1 shadow (`--shadow-pop`). Không có token cho typography scale và spacing. |
| Màn hình quan trọng nhất | Customer overview `/`, Customer quotation `/quotations/:id`, Ops consultations `/ops/consultations`, Manage portfolio `/manage/projects`, Manage approvals `/manage/approvals` |
| Lệnh | dev `npm run dev`, build `npm run build` (= `tsc -b && vite build`). **Không có script lint/test.** |
| Baseline build | Pass (2.15s), console không có lỗi app |
| Git | Toàn bộ `src/pages`, `src/components`, `src/data` **chưa commit** (untracked). Cần 1 commit baseline trước Phase 2 để mỗi nhóm sửa là 1 commit sạch. CLAUDE.md của project: Conventional Commits, **không** thêm `Co-Authored-By`. |

Cách audit: đọc 100% code UI; grep định lượng; chạy dev server (port 5188, instance riêng vì instance 5173 đang serve cache hỏng của session trước); chụp 25 route × 4 breakpoint (360/768/1280/1440) + dark mode + loading/empty/focus/drawer/dialog; đo bằng `getBoundingClientRect`. Ảnh "before" / "after": `D:\Solar-capstone\ui-audit-shots\{before,after}\` (`{route}-{width}.jpg`, ngoài repo).

## Điểm tốt (giữ nguyên, không redesign)

- Token semantic đầy đủ, dark mode hoạt động đúng, `color-scheme` set đúng.
- Contrast text: fg-2 7.4:1, fg-3 5.3:1 (light), 6.7:1 (dark) — đạt.
- `:focus-visible` ring 2px có trên mọi control (đã kiểm tra bằng Tab).
- Mọi list page có loading (skeleton), empty (EmptyState), error (ErrorState + retry), search-không-kết-quả.
- Form assessment có validation zod inline cạnh field, `aria-invalid`, `role=alert`.
- Skip link, `aria-label` cho nav/progressbar/tablist, `aria-current` cho step/page.
- Ngôn ngữ thiết kế (không box, panel tách bằng hairline, status là chữ màu) nhất quán và có lý do — audit này không đổi hướng đó.

## Số liệu grep (bằng chứng, không cảm nhận)

| Chỉ số | Kết quả |
|---|---|
| Font-size arbitrary | `text-[14px]` 182, `text-[13px]` 169, `text-[15px]` 64, `text-[30px]` 2, `text-[11px]` 2, `text-[36px]` 1, `text-[22px]` 1, `text-[12px]` 1 |
| Font-size named (rem, bị lệch vì root 15px) | `text-lg` 17 (=16.875px), `text-2xl` 17 (=22.5px), `text-xl` 9 (=18.75px), `text-xs` 5 (=11.25px), `text-sm` 3 (=13.125px), `text-3xl` 3 (=28.125px), `text-4xl` 1 (=33.75px) |
| Bậc size thực tế trên `/manage` (computed) | 11.25 / 13 / 14 / 15 / 16.875 / 22.5 / 30 / 36 = **8 bậc trên 1 trang**, toàn app ≈ 13 bậc |
| Font weight | medium 133, semibold 64, normal 13 → 3 weight, đạt |
| Spacing lẻ ngoài scale (0.5/1.5/2.5/3.5) | 70 lần (`mt-0.5` 13, `py-2.5` 12, `mt-1.5` 11, `gap-1.5` 9, `mb-1.5` 8, `gap-2.5` 6, …) |
| Spacing 5/7 (20/28px) | 33 lần |
| Root font-size 15px → mọi rem lẻ | `h-10` = 37.5px, `h-9` = 33.75px, `px-4` = 15px, `gap-3` = 11.25px (đo computed) |
| Radius | `rounded-md` 34, `rounded-full` 10, `rounded-lg` 3, `rounded-sm` 2 → 4 cấp (token khai báo 3 cấp) |
| Shadow | 0 chỗ dùng ngoài token (dialog cũng không dùng `--shadow-pop`) |
| Hex/oklch hard-code ngoài globals.css | 0 — tốt |
| `<input type="search">` viết tay thay vì `Input` | 5 chỗ (h-9, khác `Select` h-10 đứng cạnh) |
| `<a>`/`<Link>` giả button bằng class inline | 3 chỗ (h-9 ≠ Button h-10) |
| `<dialog>` class string lặp | 3 chỗ, không có primitive |
| Dead link `href="#"` / `to="#"` | 14 chỗ (click nhảy lên đầu trang) |
| Table bị cắt cột ở **1440** | quotation 16px, ops consultations 53px, portfolio 166px (đo `scrollWidth - clientWidth`) |
| Touch target < 44px ở 360/768 | 100% control (button md 37.5, sm 30, chips 34, input 34, link 18–21) |
| Contrast viền input `--line-2` | 2.38:1 light / 2.58:1 dark (< 3:1 non-text, WCAG 1.4.11) |

## Bảng vấn đề

Mức độ: P0 = phá khả năng dùng / sai hierarchy nghiêm trọng · P1 = mất consistency nhiều màn hình · P2 = polish cục bộ.
Phạm vi: hệ thống = sửa ở token/primitive lan ra mọi màn hình.

| # | Vấn đề | Mức độ | Phạm vi | File | Hướng sửa |
|---|---|---|---|---|---|
| 1 | **Table cắt cột quan trọng ngay ở desktop.** `Table` ép `min-w-[640px]`, page còn ép thêm `min-w-[1040/1080px]`; container thực chỉ 624–1070px → cột Amount (quotation), Retail line (approval), Resolution (manage project), Health + nút hành động (portfolio, ops consultations) bị cắt, phải cuộn ngang mà không có dấu hiệu. Ở 360 chỉ còn 1–2 cột. | P0 | 8 màn hình | `components/ui/table.tsx:7`, `pages/ops/consultations-page.tsx:153`, `pages/manage/portfolio-page.tsx:98`, `pages/customer/quotation-page.tsx:64`, `pages/manage/approval-page.tsx:126`, `pages/manage/project-page.tsx:145`, `pages/manage/dashboard-page.tsx:100`, `pages/manage/operations-page.tsx:86,155`, `pages/manage/revenue-page.tsx:97` | Bỏ `min-w` mặc định ở primitive; cột số/action `whitespace-nowrap`, cột text được wrap; chỉ page nào thật sự cần mới đặt min-w. Mobile (<768): chiến lược riêng — ẩn cột phụ (`hidden md:table-cell`) hoặc chuyển sang card list; khi vẫn overflow thì thêm gradient/scroll hint ở mép phải. |
| 2 | **List item dính nhau.** Pattern `<ul class="divide-y"><li><Panel>` — `Panel` có `first:pt-0 first:border-t-0` nên li nào cũng mất padding trên; footer nút của item trước chạm tiêu đề item sau (đo: gap = 0px). Item SLA overdue có `border-l-2 danger` nhưng chữ dính vào vạch. Trạng thái "selected" (`border-accent/50`) áp lên border-t đã bị xoá → không nhìn thấy. | P0 | 2 màn hình (approvals, alerts); tasks né được nhờ `py-6` thủ công | `pages/manage/approvals-page.tsx:92-139`, `pages/manage/alerts-page.tsx:135-183`, `pages/field/tasks-page.tsx:127-181`, `components/ui/panel.tsx:9` | Thêm primitive `ListRow`/`Card` cho ngữ cảnh "nhiều item trong 1 list": `py-5`, `pl-4` khi có border-l, state selected bằng `bg-surface-2` hoặc border-l accent. Panel giữ nguyên cho section. |
| 3 | **PanelHeader vỡ khi action dài.** `action` div `shrink-0` + `Badge whitespace-nowrap` → tiêu đề "Lifecycle velocity and pipeline balance" bị ép 1 từ/dòng, badge tràn khỏi trang (360: overflow 7px ở `/manage`; 768: overflow 33px ở `/manage/revenue`). Cùng nguyên nhân: section header "Decisions required" (flex không wrap). | P0 (mobile) / P1 (desktop) | hệ thống — ≥ 8 màn hình dùng `action={<Badge>…dài…}` | `components/ui/panel.tsx:26`, `components/ui/badge.tsx:18`, `pages/manage/dashboard-page.tsx:35-39,54-59`, `pages/manage/revenue-page.tsx:168-171` | PanelHeader: `flex-wrap`, action `min-w-0 shrink`; Badge bỏ `whitespace-nowrap` mặc định (thêm prop khi thật sự cần); section header tự viết tay ở dashboard/alerts → dùng PanelHeader. |
| 4 | **Chat bị cắt ở mobile.** Bubble `inline-block max-w-[720px]` + label `w-16 shrink-0` → câu trả lời bị cắt bên phải ở 360, phải cuộn ngang trong stream. Trang này còn: không có PageHeader/h1 (khác 25 trang còn lại), cột phụ (System profile, Recent conversations) xếp TRƯỚC chat trên mobile — nội dung chính cách đầu trang ~1500px. | P0 (mobile) | 1 màn hình | `pages/customer/assistant-page.tsx:40-41,89,185-204` | Bubble `min-w-0 max-w-full`, label Assistant ẩn `<sm`; thêm `PageHeader`; grid `order` để chat lên trước ở mobile; textarea auto-grow thay `rows=1 min-h-9`. |
| 5 | **Root `font-size: 15px` làm toàn bộ scale rem thành số lẻ.** Mọi `h-*`, `p-*`, `gap-*`, `text-lg/xl/2xl…` đều ×0.9375: nút 37.5px, input 33.75px, padding 15px, text-lg 16.875px. Đây là gốc của "input cao không đồng nhất", baseline lệch sub-pixel, hairline mờ. Vi phạm trực tiếp ràng buộc spacing 4/8/12/16. | P1 (gốc của nhiều P1/P2 khác) | hệ thống | `styles/globals.css:150-151` | `html { font-size: 16px }`, body 15px qua token `--text-body`; đồng thời thay mọi `text-xs/sm/base/lg/xl/2xl/3xl/4xl` bằng scale px cố định (#6). **Cần duyệt: mọi kích thước tăng ~6.7%.** |
| 6 | **Typography 13 bậc, cặp 13/14px chênh 1px.** `text-[13px]` (169) và `text-[14px]` (182) đứng cạnh nhau ở hầu hết panel — mắt không phân biệt được cấp. Số liệu thì 30 / 28.1 / 22.5 / 22 / 18.75 / 16.9px tuỳ trang. | P1 | hệ thống | `globals.css` (không có token), 26 page | Token 6 bậc: `--text-xs 12` (meta), `--text-sm 13`, `--text-body 15`, `--text-lg 18` (h2), `--text-xl 24` (số liệu), `--text-2xl 32` (h1). Bỏ 14px: metadata → 13, body phụ → 15. Chỉ semibold cho heading & số chính. |
| 7 | **Touch target < 44px trên 100% control ở mobile/tablet.** Button md 37.5, sm 30, chips 34, input search 34, link inline 18–21px. | P1 | hệ thống | `components/ui/button.tsx:22-30`, `chips.tsx:27`, `field.tsx:41-53`, 5 input inline | Sau #5: Button md `h-10` = 40px desktop, `h-11` (44) ở `<md`; sm chỉ dùng trong table/pagination desktop; chips + input `h-11` ở mobile; link hành động trong list → `ButtonLink variant=ghost` có `min-h-11`. **Cần duyệt: đổi kích thước nút toàn app.** |
| 8 | **3 chiều cao control trên cùng 1 hàng filter.** `<input type=search>` viết tay `h-9` (34px) cạnh `Select` `h-10` (38px); chỗ khác `Select className="h-8"`. Rail: input `h-9`, select `h-8`. | P1 | 8 màn hình | `pages/ops/consultations-page.tsx:103-109`, `pages/field/tasks-page.tsx:71-77`, `pages/manage/portfolio-page.tsx:66-72`, `pages/manage/revenue-page.tsx:84`, `pages/ops/layout.tsx:15-20`, `pages/manage/approvals-page.tsx:81`, `pages/manage/operations-page.tsx:31-45`, `components/layout/app-shell.tsx:168` | Dùng `Input` primitive cho mọi input; 1 chiều cao control (`h-10`) cho filter/form; `size="sm"` chỉ ở pagination/table. |
| 9 | **Rail overflow ở laptop 1440×732** — `scrollHeight 776 > 732`: khối user / đổi portal / theme bị ẩn dưới, aside hiện thanh cuộn riêng ở mép trái. | P1 | hệ thống (4 portal) | `components/layout/app-shell.tsx:74-79,92-129` | Giảm `py-7→py-5`, `mt-8→mt-6`, group `mt-7→mt-6`; user block gọn (1 dòng tên + role, select + theme cùng hàng); tools tách khỏi `nav flex-1`. |
| 10 | **Sticky action bar lệch mép.** `-mx-4 md:-mx-8` không khớp `px-5 md:px-12` của main → thanh nhô 30px mỗi bên nhưng cách mép main 15px (đo: bar 260–1390, content 290–1360, main 245–1405); inner `max-w-[1320px]` ≠ main 1160. Lặp 3 lần bằng copy-paste. | P1 | 3 màn hình | `pages/customer/assessment-page.tsx:331-332`, `pages/field/survey-page.tsx:247-248`, `pages/field/installation-page.tsx:215-216` | Primitive `ActionBar` (sticky, `-mx-5 md:-mx-12 px-5 md:px-12`, không max-w riêng), bg `canvas`, border-t. |
| 11 | **Quá nhiều primary button trên 1 màn hình** — trái quy ước của chính codebase ("One solid button per view"): alerts 8, approvals 7, field dashboard 3, field tasks 2 + header, portfolio/ops list 1 primary/row. Mắt không biết hành động chính ở đâu. | P1 | 7 màn hình | `pages/manage/alerts-page.tsx:167`, `pages/manage/approvals-page.tsx:134,191`, `pages/field/dashboard-page.tsx:42,89,93`, `pages/field/tasks-page.tsx:166`, `pages/ops/consultations-page.tsx:240`, `pages/manage/portfolio-page.tsx:182`, `pages/ops/dashboard-page.tsx:64` | Row action → `secondary`; chỉ 1 primary/màn hình (header hoặc panel quyết định). Ưu tiên bằng thứ tự + màu chữ (danger/warn), không bằng nút đặc. |
| 12 | **Stat: baseline lệch, giá trị chữ vỡ.** Label 2 dòng → số lệch 19px so với hàng bên (đo 439/439/458 ở quotation; estimate, warranty tương tự). Dùng cho giá trị chữ ("October 2049", "Oakwood Residence") → wrap 2 dòng ở 30px. 6 chỗ tự viết stat tay với text-2xl/xl/lg/3xl thay vì dùng `Stat`. `StatRow` 5–6 cột (`md:grid-cols-5/6`) ở 768 → mỗi cột 130px, note 4–5 dòng. | P1 | 10 màn hình | `components/ui/stat.tsx`, `pages/customer/quotation-page.tsx:52-56`, `warranty-page.tsx:37-41`, `estimate-page.tsx:47-51`, `pages/manage/revenue-page.tsx:34-38`, `dashboard-page.tsx:28-32`, `operations-page.tsx:49-53`; hand-rolled: `overview-page.tsx:94-114`, `ops/dashboard-page.tsx:32-40`, `field/installation-page.tsx:54-62`, `manage/project-page.tsx:47-55` | Stat: label `min-h` 2 dòng hoặc grid `items-end`; thêm `size="sm"` (24px) cho stat trong panel và thay các bản tay; giá trị chữ → `KeyValueList`. StatRow: tối đa 4 cột ở md, 6 chỉ từ xl. |
| 13 | **Filter bar không nhất quán và dính table.** Thứ tự khác nhau: ops = chips → search/selects; portfolio = search/selects → chips; tasks = search → chips có nhãn; approvals = chips + sort. Khoảng cách filter → header table 0–11px (select "Last 7 days" wrap dòng 2 dính header). Chips 8 mục wrap 2 hàng ở portfolio, hàng 2 có gạch riêng. | P1 | 5 màn hình | `pages/ops/consultations-page.tsx:92-132`, `manage/portfolio-page.tsx:61-91`, `field/tasks-page.tsx:66-105`, `manage/approvals-page.tsx:77-87`, `manage/alerts-page.tsx:99-104`, `components/ui/chips.tsx` | Primitive `FilterBar`: hàng 1 = search + selects, hàng 2 = chips; `mb-6` trước table; chips overflow → `overflow-x-auto` không wrap. |
| 14 | **Row table quá cao**: ops 90–110px, portfolio 116–135px vì cell 3–4 dòng ở cột hẹp (Customer & site, Stage & highlights, Sales owner + territory). | P1 | 2 màn hình | `pages/ops/consultations-page.tsx:177-246`, `manage/portfolio-page.tsx:123-187` | Tối đa 2 dòng/cell: gộp metadata (territory, highlights) vào dòng 2 hoặc bỏ; tên `whitespace-nowrap`; `Td py-3`; bỏ cột không có lý do (Property/city đã có trong Customer). |
| 15 | **KeyValueList 2 cột gạch lệch**: `last:border-b-0` chỉ bỏ gạch item cuối → hàng cuối có gạch dưới 1 ô (thấy rõ ở review assessment, survey). | P1 | 6 màn hình dùng `columns={2}` | `components/ui/lists.tsx:62-80` | Gạch `border-t` cho mọi item trừ hàng đầu (`[&>*:nth-child(-n+2)]:border-t-0` khi 2 cột), hoặc `divide-y` theo hàng grid. |
| 16 | **Modal không có primitive**: `<dialog>` class string dài lặp 3 lần, không dùng `--shadow-pop` (lớp nổi duy nhất được phép shadow lại không có), footer khi là `Link` inline `h-9`. | P1 | 3 màn hình | `pages/customer/assessment-page.tsx:358-384`, `quotation-page.tsx:187-229`, `warranty-request-page.tsx:188-211` | Primitive `Dialog` (+ `DialogBody/Footer`), `shadow-pop`, `max-w-md`, padding 24, nút dùng `Button`. |
| 17 | **Button giả bằng `<a>`/`<Link>` class inline** — thấp hơn `Button` 4px, thiếu `press`, thiếu disabled. | P1 | 3 chỗ | `pages/manage/approval-page.tsx:47`, `pages/not-found-page.tsx:19,22`, `pages/customer/assessment-page.tsx:379` | Dùng `ButtonLink` / `buttonClass()`. |
| 18 | **Radius thực tế 4 cấp** (2 / 3 / 4 / full) trong khi ràng buộc 2 cấp; `rounded-full` dùng cho Progress, stage bar, guardrail bar. | P1 | hệ thống | `globals.css:135-138`, `lists.tsx:104,112`, `ops/dashboard-page.tsx:162`, `manage/project-page.tsx:178`, `approval-page.tsx:176-179` | 2 token: `--radius-control 3px` (button/input/badge nền), `--radius-container 6px` (ảnh, dialog, bg-surface block). Progress/bar → radius-control. Avatar giữ full (ngoại lệ đã khai báo). Bỏ `rounded-sm/lg` lẻ. |
| 19 | **Viền input 2.38:1** (< 3:1 non-text contrast); nút disabled `opacity-40` kéo chữ xuống ≈2.9:1 và làm cả viền/nền mờ. | P1 | hệ thống | `globals.css:18,54,90`, `components/ui/button.tsx:9` | `--line-2` L 72%→64% (≈3.2:1 light), dark 45%→50%; disabled dùng `bg-surface-2 text-fg-3 border-line` thay opacity. |
| 20 | **Spacing lẻ ngoài scale** 70 chỗ (`mt-0.5`, `py-2.5`, `gap-1.5`, …) + 33 chỗ 20/28px; sau #5 chúng còn thành 1.9 / 9.4 / 5.6px. | P1 | hệ thống | primitives + 26 page | Map: 0.5→1 (4px), 1.5→2 (8), 2.5→3 (12), 3.5→4 (16), 5→4 hoặc 6, 7→6 hoặc 8. Quy tắc trong-nhóm < giữa-nhóm ≥ 1 bậc: label→value 4, item→item 12, panel→panel 24, section→section 48. |
| 21 | **fg-2 / fg-3 dùng lẫn không theo quy tắc** cho cùng loại text (meta line lúc fg-2 lúc fg-3; caption ảnh fg-3 nhưng activity body fg-2; KeyValue key fg-2 nhưng table sub-line fg-3). | P1 | hệ thống | primitives + pages | Ghi quy ước trong `globals.css`: `fg-2` = secondary body/description; `fg-3` = tertiary meta (timestamp, caption, unit, hint). Sửa primitive trước, page theo sau. |
| 22 | **14 dead link `href="#"`** (View calendar, installation FAQ, 3 unread notifications, Equipment returns, GAAP schedule…) — click cuộn lên đầu trang. RailLink placeholder đã xử lý đúng bằng `button aria-disabled title="Not available in this build"` nhưng page thì không. | P1 | 12 màn hình | grep `href="#"` / `to="#"` | Không đổi hành vi nghiệp vụ được → **cần quyết định**: (a) đổi thành `button aria-disabled` + title như RailLink, hoặc (b) giữ nguyên. Đề xuất (a). |
| 23 | **Empty state placeholder không nói bước tiếp theo** ("Customers is not available in this build" — hết). | P2 | 8 route placeholder | `pages/placeholder-page.tsx` | Thêm `action` = ButtonLink về dashboard của portal đó. |
| 24 | **PageHeader `items-end`**: nút hành động trôi theo dòng mô tả cuối; title 2 dòng + mô tả 2 dòng thì nút lơ lửng giữa. | P2 | hệ thống (mọi trang có actions) | `components/ui/page-header.tsx:22` | `items-start` + actions `pt-1` để canh với baseline dòng 1 của title; mobile xuống dưới. |
| 25 | **Lệch 4px do `px-1`** ở khối "Assigned specialist" và "Numbers look off?" so với cột bên trên. | P2 | 2 màn hình | `pages/customer/assessment-page.tsx:322`, `estimate-page.tsx:95` | Bỏ `px-1`. |
| 26 | **PanelFooter tách text và link thành 2 dòng** ("Questions about permits?" / "Ask the assistant") vì footer là flex-wrap với 2 con. | P2 | 1 chỗ | `pages/customer/overview-page.tsx:199-204` | Bọc trong 1 `<p>`. |
| 27 | **Thời tiết lặp 2 lần** trên field dashboard (description header + Notice cuối cột phải) và installation (Notice) — cùng nội dung. | P2 | 2 màn hình | `pages/field/dashboard-page.tsx:33,145-147`, `installation-page.tsx:209-211` | Xoá Notice, giữ trong description. **Xoá component → cần duyệt.** |
| 28 | **Nhãn "Timeline"/"Type" cạnh chips** không cùng baseline (13px vs 15px, `items-center`); ở 360 nhãn đứng giữa 2 hàng chip. | P2 | 1 màn hình | `pages/field/tasks-page.tsx:94-103` | Nhãn thành `label` của FilterBar, xếp dọc ở mobile. |
| 29 | **Ghost button `px-0` đặt cạnh secondary** với gap-2 → "Back \| Save draft" dính; số trang pagination ghost `min-w-8` (30px) vùng bấm nhỏ. | P2 | 4 màn hình | `pages/customer/assessment-page.tsx:333-336`, pagination ở 3 list page | Ghost giữ px khi đứng trong nhóm nút (`variant=ghost` có `px-3` mặc định, chỉ `px-0` khi `inline`); pagination nút `min-w-9`. |
| 30 | **Khoảng trắng đầu link tel/mail** do JSX xuống dòng (`> {advisor.phone}\n</a>`). | P2 | 2 màn hình | `pages/customer/consultation-page.tsx:55-58`, `field/tasks-page.tsx:149-150` | Xoá khoảng trắng. |
| 31 | **Drawer mobile**: không khoá body scroll; aside luôn hiện scrollbar dọc khi cao hơn viewport. | P2 | hệ thống | `components/layout/app-shell.tsx:76-83` | `overflow:hidden` trên body khi open; `scrollbar-gutter`/`overscroll-contain`. |
| 32 | **Skeleton lúc tải đầu render ngoài shell** (`hydrateFallbackElement` ở root) → rail xuất hiện sau, layout nhảy. | P2 | hệ thống | `app/router.tsx:19,38,52,66` | Fallback bọc trong layout hoặc `Suspense` quanh `Outlet` trong layout. |
| 33 | **Status Badge đặt vào vùng actions** với hack `h-8 px-2.5` ("Safety brief signed"). | P2 | 1 chỗ | `pages/field/installation-page.tsx:44-46` | Chuyển vào `meta` của PageHeader. |
| 34 | **Primary action của list page không thống nhất**: portfolio "Export CSV" primary, ops consultations "Export CSV" secondary. | P2 | 2 màn hình | `pages/manage/portfolio-page.tsx:48`, `ops/consultations-page.tsx:72` | Export luôn secondary. |
| 35 | **Checkbox description `text-xs`** (11.25px) — dưới 12px. | P2 | primitive | `components/ui/field.tsx:65,76` | → token `--text-xs` 12px. |
| 36 | **Mock ảnh picsum ngẫu nhiên** (máy chữ, mây…) trong màn hình khách hàng — không phải lỗi UI nhưng làm audit hierarchy khó; khi ảnh lỗi hiện alt text rời. | P2 | 12 màn hình | `services/mock.tsx:44-46` | Ngoài phạm vi UI; ghi nhận, không sửa. |

## Nhóm sửa đề xuất cho Phase 2 (mỗi nhóm 1 commit, theo thứ tự)

1. `style(tokens)`: root 16px + typography 6 bậc + spacing map + radius 2 cấp + `--line-2` + disabled (#5, #6, #18, #19, #20) — đọc `frontend-design` trước.
2. `refactor(ui): button/field` — kích thước, touch target, ghost padding, Input dùng chung cho search (#7, #8, #17, #29, #35).
3. `refactor(ui): table` — bỏ min-w, chiến lược mobile, row density (#1, #14).
4. `refactor(ui): panel/list-row/filter-bar/action-bar` (#2, #3, #10, #13).
5. `refactor(ui): stat/key-value/page-header/dialog` (#12, #15, #16, #24).
6. `style(shell)`: rail height, drawer, skeleton in shell (#9, #31, #32).

Phase 3 theo màn hình, ưu tiên: ops consultations → manage portfolio → customer quotation → manage approvals/alerts → assistant → dashboards → còn lại.

## Cần anh/chị quyết định trước khi sửa

1. **Commit baseline** toàn bộ working tree hiện tại (`feat(ui): four portals baseline`) để Phase 2/3 có diff sạch — tôi làm hay anh/chị làm?
2. **#5 root font-size 16px**: mọi kích thước tăng ~6.7% (nút 37.5→40px, padding 15→16px). Đồng ý?
3. **#7 touch target 44px** ở mobile: Button md thành 44px dưới `md`. Đồng ý?
4. **#11 giảm primary button**: row action trong list chuyển secondary — thay đổi thị giác hierarchy, không đổi chức năng. Đồng ý?
5. **#22 dead link**: đổi `href="#"` thành `button aria-disabled` (như RailLink) hay giữ nguyên?
6. **#27 xoá Notice thời tiết lặp** ở field dashboard/installation?
7. **Screenshot before/after** lưu ở đâu? Đề xuất `Solar-Client/docs/ui-audit/{before,after}/` (≈10 MB) hoặc thư mục ngoài repo.

## Kết quả đo lại sau khi sửa (cùng script Playwright như Phase 1)

| Chỉ số | Trước | Sau |
|---|---|---|
| Bậc font-size thực tế (computed, toàn app) | ≈13 (11.25 … 36) | **5** — 13 / 15 / 18 / 24 / 32 |
| Root font-size / kích thước rem | 15px → nút 37.5px, padding 15px | 16px → nút 40px, padding 16px (mọi rem nguyên) |
| Table bị cắt cột ở 1280 / 1440 | quotation 16, ops 53, portfolio 166 (1440); nhiều hơn ở 1280 | **0** ở cả 1280 và 1440 (cột phụ theo tầng md / lg / wide=1408 / 2xl) |
| Table ở 360 / 768 | cuộn ngang, 1–2 cột nhìn thấy | 7 bảng danh sách **xếp chồng label/value** dưới lg, đủ mọi cột; bảng item (3–4 cột) vẫn là bảng và vừa màn |
| Dead link `href="#"` | 14 | **0** — 14 `PlaceholderLink` (role=link, aria-disabled, title như RailLink) |
| Tràn ngang trang (25 route × 4 breakpoint) | manage 360: 7px; revenue 768: 33px | **0** |
| Control < 44px ở 360/768 (trừ link inline trong câu) | 100% | **0** (button/input/select/chips/tab/link đứng riêng đều ≥ 44) |
| Primary button trên 1 màn hình | alerts 8, approvals 7, field dashboard 3 | tối đa 1 (chưa kể nút trong dialog đang đóng) |
| Contrast viền control `--line-2` | 2.38:1 | 3.49:1 light / 3.48:1 dark |
| Stat baseline lệch (quotation) | 439 / 439 / 458 | 430 / 430 / 430 |
| Gap giữa 2 item approvals | 0px | 48px + hairline |
| Sticky bar vs mép main (assessment) | lệch 30px / thiếu 15px | trùng mép chính xác (252–1412) |
| Build | pass | pass, không warning |

Screenshot: `D:\Solar-capstone\ui-audit-shots\before\` (110 ảnh) và `…\after\` (106 ảnh), tên `{route}-{width}.jpg`, ngoài repo.

## Trạng thái từng issue

| # | Trạng thái | Commit / ghi chú |
|---|---|---|
| 1 | done | `5e2f68a` primitive; `c293a8e` `2dc4bae` `45cdcc3` `251c2b5` `c98bea9` `437c081` `62ea392` `298b875` từng trang; `dc3e7de` breakpoint `wide` |
| 2 | done | `0469bba` ListRow; `b2c58ef` `7f5d2b9` `e9139df` |
| 3 | done | `0469bba` PanelHeader wrap + Badge wrap; `298b875` `7f5d2b9` |
| 4 | done | `64aa711` |
| 5 | done | `c7a177a` |
| 6 | done | `c7a177a` — 5 bậc thay vì 6: 12 và 13 chỉ chênh 1px nên bỏ 12; body 15 giữ nguyên |
| 7 | done | `c2b2064` `dc3e7de` (`tap` cho link đứng riêng) |
| 8 | done | `c2b2064` Input/Select `size`; các trang list |
| 9 | done | `0707fe9` `dc3e7de` — rail gọn hơn và khối user ghim đáy khi rail vẫn cao hơn 732px (manage: 827px nội dung) |
| 10 | done | `0469bba` ActionBar; `f0510fd` `4d9885c` `2b611c7` |
| 11 | done | row action → secondary trên 7 trang; Approve eligible / Jump to decision / Export CSV → secondary |
| 12 | done | `6ee5fb3` Stat subgrid + size lg; `ad41a41` `2dc4bae` `78c2679`; StatRow 5–6 cột chỉ từ xl |
| 13 | done | `0469bba` FilterBar; `c293a8e` `2dc4bae` `e9139df` `b2c58ef` `62ea392` |
| 14 | done | ops: row đồng nhất 87px ở 1440 (Property chỉ hiện từ 2xl, ô 1 dòng từ `wide`), 89–109 ở 1280; portfolio 95–109. Dưới lg bảng xếp chồng nên không còn khái niệm row cao |
| 15 | done | `6ee5fb3` |
| 16 | done | `6ee5fb3` Dialog; `45cdcc3` `f0510fd` `b0d8738` |
| 17 | done | `c98bea9` `33f044b` `f0510fd` |
| 18 | done | `c7a177a` `7bedcde` — 2 cấp control 3 / container 6, avatar là ngoại lệ duy nhất |
| 19 | done | `c7a177a` `c2b2064` |
| 20 | done | `c7a177a` (map 0.5→1, 1.5→2, 2.5→3, 3.5→4, 5→6, 7→6, 10→8/12) |
| 21 | done | quy ước ghi ở đầu `globals.css`; primitives và các dòng meta trong page đã theo |
| 22 | done | `d6440b5` `4ed3d7c` — 14 link → `PlaceholderLink` (span role=link, aria-disabled, tabIndex, title "Not available in this build"); click không còn nhảy lên đầu trang. Là thay đổi hành vi, làm theo yêu cầu "sửa luôn" |
| 23 | done | `827ec7d` — link về mục nav đầu tiên của portal (copy có sẵn) |
| 24 | done | `6ee5fb3` |
| 25 | done | `f0510fd` `f716506` |
| 26 | done | `ad41a41` |
| 27 | done | `c61ab80` — chỉ xoá bản lặp ở field dashboard; installation giữ vì là nơi duy nhất |
| 28 | done | `e9139df` |
| 29 | done | `c2b2064` ghost `-mx-3 px-3`; `c293a8e` Pagination |
| 30 | done | `009bd84` `e9139df` |
| 31 | done | `0707fe9` |
| 32 | done | `0707fe9` — fallback render trong layout, xác nhận bằng screenshot skeleton có rail |
| 33 | done | `2b611c7` |
| 34 | done | `2dc4bae` |
| 35 | done | `c7a177a` (text-meta 13px) |
| 36 | deferred | ngoài phạm vi UI (mock data) |

## Pass 3 — bớt "template" (`c847484`)

Phản hồi sau pass 2: "vẫn quá AI". Đo lại thì các tell nằm ở *nội dung trình bày*, không phải scale: 84 subtitle dưới tiêu đề section, 26 badge trang trí ở đầu panel, 86 chữ trạng thái có màu (37 xanh "ok"), 13 hàng số kẻ vạch dọc, tiêu đề trang 32px + một câu mô tả ở mọi trang, mọi trang cùng một khung header → stat → 2:1.

| Tell | Trước | Sau |
|---|---|---|
| Chữ trạng thái có màu (ok/info/accent) | 86 badge, 37 xanh | màu chỉ cho warn/danger; ok/info/accent là chữ thường — `Badge`, `Stat` |
| Subtitle filler dưới tiêu đề section | 84 | 30 câu giải thích bị bỏ; giữ cái mang thông tin (giai đoạn, đếm, ngày, giao thức) |
| Badge trang trí ở đầu panel | 26 | 14 bỏ ("Assigned and active", "Logged by homeowner", "2 new"…); giữ số/trạng thái thật |
| Tiêu đề trang | 32px + mô tả | 24px; `display` chỉ cho con số hero; 6 mô tả "trang này để làm gì" bỏ ở ops/manage |
| Số liệu kẻ vạch dọc | 13 hàng | không vạch; pipeline strip hạ xuống 18px dưới KPI |
| Nơi hành động chính | không phân biệt | `Panel raised` cho đúng 5 khối quyết định/nhập liệu |

Còn có thể tiếp: copy mock ("Tier-1 all-black monocrystalline", "Certified energy advisor") là dữ liệu, không sửa; ảnh picsum ngẫu nhiên.

## Còn lại để ai đó tiếp tục

- #36: ảnh mock picsum ngẫu nhiên (dữ liệu, ngoài phạm vi UI).
- Project không có `lint`/`test` script — DoD chỉ kiểm được `build`.
- Chưa push: local `main` đi trước `origin/main` 38 commit.
