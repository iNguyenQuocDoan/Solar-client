# Landing "/" – báo cáo dựng và kiểm tra (Pha 6)

## Bản 2 (29/09/2026, sau phản hồi "giống quy trình")

Xương sống, signature và nguồn: `landing-brief.md`, mục "Bản 2". Các mục 1–10 bên dưới là của bản H1;
những gì còn đúng cho bản 2 được ghi lại ở đây.

**File:** thêm `src/lib/electricity-tariff.ts`, `components/landing/{tariff-ladder,offer-section,fit-section,proof-section}.tsx`;
viết lại `hero-section`, `start-section`, `mock/landing.ts`; xoá `survey/quote/build/warranty-section.tsx`;
`lib/format.ts` thêm `fmt.vnNum`, `fmt.vnd` (khoảng trắng không ngắt trước "đ"); header thêm link "Trọn gói",
nút đổi thành "Đăng ký khảo sát".

**Đã xác minh bằng render** (ảnh trong scratchpad của phiên, bản cuối chép vào `ui-audit-shots/landing/v2/`):
- 360, 390, 768, 1024, 1440, 1920 và dark 1440: không vỡ; 1440 và 390 nút chính trong màn đầu.
- Đọc riêng tiêu đề section: lời giới thiệu sản phẩm, không có tên giai đoạn; khối trình tự duy nhất ở cuối.
- Blur: tiêu đề → cột xanh của biểu đồ → nút. Grayscale: xám và xanh vẫn tách được bằng độ sáng.
- Bàn phím: 27 điểm dừng (gồm 2 thanh kéo, 6 cột biểu đồ có nhãn đầy đủ cho trình đọc màn hình), đều có
  outline, không bị header che; heading H1 → H2 → H3 đúng thứ tự; FAQ mở bằng Enter. Vùng bấm < 24px chỉ
  còn hai link "Đăng nhập" nằm trong câu (ngoại lệ inline của WCAG 2.5.8).
- Typecheck, lint (không cảnh báo mới), build đạt; chunk `LandingPage` 17,5 KB (5,1 KB gzip).

**Chưa kiểm cho bản 2:** Lighthouse và trace hiệu năng (bản H1: a11y 100, LCP lab 2.421 ms), so pixel các
trang dùng chung (bản 2 không sửa token hay `PublicLayout` ngoài header), Safari, trình đọc màn hình thật.

**Placeholder mới/giữ:** tấm pin, inverter (hãng, model, công suất); quy cách khung, chân đế, dây, tủ; Mẫu 01
có làm hộ không; thời hạn bảo hành thiết bị và thi công; điều khoản chi phí bảo hành; loại mái nhận lắp và
diện tích tối thiểu; cách tính hoàn vốn trong báo giá; đơn giá tham khảo; pháp nhân và liên hệ; ảnh hệ thống
đã lắp; ảnh OG; logo thật.

---

## Bản H1 (lịch sử)

Ngày 29/09/2026. Brief, direction và quyết định đã chốt: `landing-brief.md`.
Ảnh bằng chứng (ngoài repo): `D:\Solar-capstone\ui-audit-shots\landing\` (`before/`, `after/`, `lighthouse-mobile.html`).

## 1. Concept, nguồn bản sắc, signature

- **Concept:** mọi bằng chứng trên trang là một cặp giá trị của cùng một đại lượng – trái là điều chủ nhà khai hoặc được báo trước, phải là điều kỹ thuật viên đo hoặc ghi lại.
- **Nguồn:** hình dạng dữ liệu của sản phẩm (bảng "bạn khai / đo tại mái / chênh lệch / xử lý" trong `src/data/manage.ts:219-227`, `field/survey-page.tsx`); quy ước đường ghi kích thước trên bản vẽ (TCVN 5705:1993); khoảng trống ngành (0/5 trang cùng ngành cho thấy một con số được kiểm lại).
- **Signature:** `ReconcilePair` – hai số cùng cỡ khác weight (300 / 600), nối bằng đường ghi kích thước 1,5px màu `--accent` có hai vạch xiên 45° và số chênh ở giữa, kèm câu xử lý. Xuất hiện 7 lần (màn đầu, 3 lần ở section số đo, báo giá, thi công, cặp ảnh bảo hành, cặp rỗng ở cuối).

## 2. Xương sống kiến trúc thông tin

| Section | Câu chủ nhà hỏi | Tiêu đề |
|---|---|---|
| Màn đầu | Đây là gì, cho ai? | Điện mặt trời áp mái cho nhà ở, lắp theo số đo được kiểm lại trên mái |
| `#so-do` | Mái tôi lắp được bao nhiêu? | Mỗi số bạn khai về mái được đo lại tại chỗ, ghi chênh lệch và cách xử lý |
| `#bao-gia` | Tiền đi vào đâu? | Báo giá ghi tên từng thiết bị, số lượng và tiền công, lập theo số đo tại mái |
| `#thi-cong` | Họ làm gì trên mái nhà tôi? | Ngày thợ lên mái nào, tài khoản có nhật ký và ảnh của ngày đó |
| `#bao-hanh` | Hỏng thì ai lo? | Hỏng hóc thì gửi phiếu trong tài khoản; phiếu giữ ảnh trước, ảnh sau khi sửa và ghi ai chịu chi phí |
| `#cau-hoi` | Thủ tục, bán điện dư? | Thủ tục, bán điện dư và loại mái nhận lắp |
| `#bat-dau` | Cần chuẩn bị gì? | Chuẩn bị bốn nhóm thông tin là gửi được khảo sát sơ bộ |

**Workflow:** chỉ ở section cuối – danh sách 4 thứ cần chuẩn bị (không số, lấy từ `STEP_SCHEMAS` của form thật) và một câu "Gửi xong, …, rồi báo giá được gửi vào tài khoản". Nằm cuối vì chủ nhà chỉ cần biết điều này khi đã muốn bấm nút.

## 3. Nguồn của từng hình ảnh sản phẩm

| Hình | Nguồn |
|---|---|
| Cặp đối chiếu (màn đầu, số đo) | Dữ liệu phiếu kỹ thuật viên – dựng bằng chữ HTML, **không** giả làm màn tài khoản vì `/customer` chưa có bảng này |
| Khung "Màn Báo giá" | Primitive thật `Table/Th/Td/Tr` của portal, dữ liệu minh hoạ tiếng Việt |
| Khung "Màn Dự án" | `KeyValueList`, `Progress` của portal |
| Khung "Màn Bảo hành" | `KeyValueList` của portal |
| 5 khung ảnh | Placeholder `[CẦN ẢNH: …]` – không có ảnh thật nào |

Không trang nào gọi API; không có tên, địa chỉ, số điện thoại của người thật.

## 4. File đã thay đổi

- **Mới:** `src/styles/landing.css` (token `font-vn`, `max-w-landing`, `max-w-copy`, `ease-ld`; thang chữ `ld-*`; hình học `.pair*`), `src/components/landing/{classes.ts, section.tsx, rich.tsx, photo-slot.tsx, account-frame.tsx, reconcile-pair.tsx, hero-section.tsx, survey-section.tsx, quote-section.tsx, build-section.tsx, warranty-section.tsx, faq-section.tsx, start-section.tsx}`, `docs/design/landing-{brief,report}.md`.
- **Viết lại:** `src/pages/public/LandingPage.tsx`, `src/layouts/PublicLayout.tsx`, `src/lib/mock/landing.ts`, `src/components/landing/index.ts`.
- **Sửa nhỏ:** `src/app/router.tsx` (`/` → `LandingPage`), `src/styles/globals.css` (import `landing.css`), `src/lib/nav.ts` (bỏ `publicNav`), `src/pages/ComingSoonPage.tsx` (đường import `LANDING_CONTAINER`), `index.html` (`lang="vi"`, meta và OG tiếng Việt, bỏ Plus Jakarta Sans không dùng), `package.json` (+ `@fontsource/be-vietnam-pro`), `CLAUDE.md`.
- **Xoá:** `HomeLayoutPage.tsx`, 10 component landing cũ (`Hero`, `Benefits`, `PackageCards`, `JourneySteps`, `WhyUs`, `FeaturedProducts`, `AfterSales`, `SurveySteps`, `Faq`, `CtaBanner`).

## 5. Quyết định chính

- Be Vietnam Pro vì trang viết cho chủ nhà Việt và Schibsted Grotesk thiếu U+1EA0–1EF1 nên mọi chữ có dấu phải cùng một font (người dùng chọn font; khả năng đọc).
- Hai vế cặp chỉ khác weight và độ đậm mực vì số khai là đầu vào hợp lệ chứ không phải lỗi, nên không gạch ngang, không tô đỏ (truyền đạt giá trị sản phẩm).
- Cặp số màn đầu 96px vì blur test ở 120px cho thấy số nổi trước h1, nên hạ cỡ để "là gì" được đọc trước (hierarchy).
- Header không có menu theo giai đoạn vì menu "Khảo sát / Báo giá / Thi công / Bảo hành" đọc thành quy trình, nên chỉ giữ Câu hỏi thường gặp, Đăng nhập, Tạo tài khoản (điều hướng).
- Nút chính ghi "Tạo tài khoản để khảo sát mái nhà" và trỏ `/register` vì `/customer/assessment` đòi đăng nhập và xác minh email, nên nhãn nói đúng việc sẽ xảy ra (chuyển đổi).
- Khoảng cách section 96 / 128 / 160 theo quan hệ nội dung vì bảo hành là bước nhảy thời gian còn số đo là cùng phiếu với màn đầu (nhịp thị giác).
- Mobile: ẩn đoạn dẫn, câu xử lý xuống dòng riêng, bảng báo giá chỉ 3 dòng + dòng tóm tắt, cặp ảnh xếp dọc, nhật ký chỉ 1 ảnh vì nút phải nằm trong màn 390 × 664 và không được thu nhỏ bảng (khả năng đọc).

## 6. Cố ý không làm

Số liệu công ty, bộ đếm, "số 1", logo hãng hay đối tác, testimonial, bảng giá theo gói, ảnh stock hoặc picsum, trợ lý AI, giám sát sản lượng, số kWp/kWh tính từ form, `Stepper`, số thứ tự, mũi tên, hiệu ứng khi cuộn, gradient, bóng thẻ tĩnh, nhãn in hoa, font mono. Không đổi font của portal. Không sửa `robots.txt`.

## 7. Placeholder cần người dùng cung cấp

| # | Chỗ | Cần |
|---|---|---|
| 1 | Báo giá – tấm pin | Model và công suất tấm |
| 2 | Báo giá – inverter | Model inverter |
| 3 | Báo giá – chân đế | Quy cách chân đế, vật tư chống thấm theo loại mái |
| 4 | Báo giá – dây, tủ | Quy cách dây và tủ điện |
| 5 | Báo giá – tổng | Đơn giá tham khảo có nguồn |
| 6–7 | Bảo hành – tấm pin, inverter | Bên bảo hành (hãng hay Smart Solar) và ngày hết hạn |
| 8 | Bảo hành – thi công | Thời hạn bảo hành thi công và chống thấm |
| 9 | Bảo hành – chi phí | Điều khoản phần nào trong bảo hành, phần nào chủ nhà trả |
| 10 | FAQ xin phép | Smart Solar có lập hồ sơ Mẫu 01 cho khách không |
| 11 | FAQ loại mái | Loại mái nhận lắp, cách xử lý chống thấm ở chân đế |
| 12 | Footer | Tên pháp nhân, địa chỉ, hotline hoặc Zalo |
| 13–17 | Ảnh | Kỹ thuật viên đo góc trên mái tôn; chân đế đã trám keo; hai dàn tấm cuối ngày; khe hở mép dàn khi báo lỗi; cùng vị trí sau khi sửa |
| 18 | `index.html` | Ảnh OG |
| 19 | Header | Logo thật (hiện là `public/placeholders/logo.svg`, có chấm cam ngoài bảng màu) |
| 20 | FAQ | Đối chiếu văn bản gốc NĐ 58/2025 và NĐ 243/2026 (đang dẫn Báo Chính phủ và eav.gov.vn) |

## 8. Kết quả kiểm tra

### Đã xác minh bằng render

| Kiểm | Kết quả | Bằng chứng |
|---|---|---|
| Độ rộng 360, 390, 768, 1024, 1440, 1920 | Không vỡ, không cuộn ngang; 1920 giữ container 1200 canh giữa; nút chính trong màn đầu ở 360 (y≈638), 1024 (y≈750), 1440 (y≈750) | `after/home-*-fold.png`, `home-*.png` |
| Mobile sắp lại, không chỉ xếp chồng | Ẩn đoạn dẫn, header chỉ còn tên + Đăng nhập, bảng 3 dòng, cặp ảnh dọc, 1 ảnh nhật ký | `after/sec-*-390.png` |
| Dấu tiếng Việt | Một font cho mọi chữ, kể cả "Ở Ễ Ỗ Ẳ Ậ Ặ Ợ ự ỵ"; so với Schibsted lẫn font | `font-be-vietnam-pro-test.png`, `font-schibsted-thieu-dau.png` |
| Blur test | Thứ tự nổi: khối h1 → cặp số → nút (sau khi hạ 120 → 96) | `after/blur-gray-1440.png` |
| Grayscale test | Hierarchy giữ; nút chính là khối đặc đậm nhất | `after/blur-gray-1440.png` |
| Dark mode | Token bí danh đổi đúng; đường kích thước và nút đọc được | `after/home-*-dark*.png` |
| Bàn phím | 15 điểm dừng theo thứ tự đọc; mọi điểm có outline; không điểm nào bị header che (có `scroll-padding-top`); link "Bỏ qua" hiện ở top 8px, cao 46px; FAQ mở bằng Enter | script `a11y.mjs` |
| Vùng bấm | Mọi control ≥ 24px, trừ hai link "Đăng nhập" nằm trong câu (ngoại lệ inline của WCAG 2.5.8) | như trên |
| Reduced motion | Chevron FAQ transition 0,01ms | như trên |
| HTML | `lang="vi"`, một `h1`, 6 `h2` đúng thứ tự, không ảnh thiếu alt, `role="img"` đều có nhãn | như trên |
| Lighthouse mobile (bản build, preview) | Accessibility 100, Best Practices 100, SEO 66 | `lighthouse-mobile.html` |
| Hiệu năng lab (build, 390px, Slow 4G, CPU ×4) | LCP 2.421ms, CLS 0,04 | trace Chrome DevTools |
| Không phá trang khác | `/login` 390 và 1440: 0 pixel khác; 3 màn portal (`/customer/quotations`, `/customer/projects` 390, `/tech/installations/.../checklist`): 0 pixel khác; `/coming-soon` dùng header/footer mới, không vỡ | `diff.mjs`, `after/coming-soon-*.png` |
| Typecheck, lint, build | Đạt; lint không có cảnh báo ở file mới (6 cảnh báo cũ còn nguyên) | `npm run typecheck/lint/build` |

### Chỉ đọc code hoặc tính bằng script

- Contrast mọi cặp màu: tính từ giá trị token (fg/canvas 17,36; fg-2 7,42; fg-3 5,27; accent 7,74; nút 7,73; line-2 3,49; warn/canvas 5,43; warn/surface-2 4,98) – đều đạt ở light và dark.
- Quét code file mới: 0 mã màu, 0 arbitrary value, 0 class palette gốc, 0 inline style; copy không chứa từ trong danh sách cần tránh, không "—", "·", "→", "Bước".

### Chưa kiểm được

- LCP/INP thực tế (không có field data; đo lab trên máy local, TTFB 3ms).
- Trình đọc màn hình thật (NVDA, VoiceOver).
- Safari (marker của `<details>`, container query).
- Thử 5 giây với chủ nhà thật: cặp số có bị đọc là số liệu công ty không.

## 9. Phản biện: 5 dấu hiệu một designer khó tính sẽ chỉ ra

1. **Cùng một module lặp 7 lần.** Có cơ sở một phần: đó là chủ ý (một từ vựng), bố cục mỗi section khác nhau (8+4, 12 rồi khung, 5+7, 7+5, 6+6). Không sửa thêm.
2. **Nhiều chữ `[CẦN: …]` màu vàng nâu, trông chưa xong.** Có cơ sở: đúng là chưa xong – thiếu dữ kiện thật (mục 7). Giữ để thấy.
3. **Không có ảnh thật, toàn khung đứt nét.** Có cơ sở. Không lấp bằng ảnh stock (luật 1, 10).
4. **Logo có chấm cam lạc bảng màu một accent.** Có cơ sở; logo là tài sản thương hiệu (luật 4) – đề xuất riêng, không tự đổi.
5. **Hai kiểu link và đường kẻ thừa.** Đã sửa: link nguồn FAQ về kiểu link chung; bỏ đường kẻ giữa 4 mục ở section cuối (bỏ đi không mất thông tin).

## 10. Vấn đề tồn đọng

1. **Font toàn app:** portal vẫn Schibsted Grotesk, mọi màn tiếng Việt của portal vẫn lẫn font. Đề xuất đổi `--font-sans` sang Be Vietnam Pro ở một commit riêng, kèm chụp kiểm các bảng dày ở 13/15px.
2. **Render-blocking:** stylesheet Material Symbols (`display=block`) trong `index.html` chặn render trang công khai dù landing không dùng; trace ước tiết kiệm 553ms LCP. Cần tách cho portal admin/tech – ảnh hưởng portal nên chưa làm.
3. **`robots.txt` chặn toàn site** (`Disallow: /`) → SEO 66. Mở hay không là quyết định triển khai.
4. **Lời hứa chính dựa trên bản ghi chủ nhà chưa tự xem được:** bảng "bạn khai / đo tại mái" chỉ có ở `/field`, `/manage`. Đề xuất thêm panel chỉ đọc vào `/customer/quotations/:id`.
5. **Sau khi đăng ký, người dùng không được đưa về form khảo sát** (`from` mất qua bước xác minh email).
6. **Dữ liệu portal khách hàng vẫn tiếng Anh, bối cảnh Mỹ** – khác với dữ liệu minh hoạ tiếng Việt trên landing.
