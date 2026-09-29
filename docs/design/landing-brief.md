# Landing "/" – Design brief

Trạng thái: **bản 4 – website bán hàng cho doanh nghiệp (29/09/2026)**, xem mục ngay dưới. Các bản 2, H1 phía sau là lịch sử.
Ngày: 28/09/2026. Nguồn khảo sát Pha 0: bốn báo cáo trong scratchpad của phiên (kiểm kê nội dung,
product moment, trang cùng ngành, ảnh chụp portal). Mọi đường dẫn tính từ `Solar-Client/`.

---

# Bản 4 – website bán hàng cho doanh nghiệp (29/09/2026)

**Người dùng chỉnh ba lần trong ngày:**
1. Bản H1 và bản 2 "giống quy trình / dashboard": đặt màn tài khoản, bảng báo giá, phiếu bảo hành, nhật
   ký thi công lên trang. Người mua không cần xem giao diện quản trị.
2. Brief marketing: website của một **công ty thi công** – ảnh công trình lớn, chữ lớn, bố cục editorial,
   mỗi section trả lời một câu hỏi (bạn là ai, làm gì, vì sao tin, công trình trông thế nào, tôi nhận
   được gì, theo dõi ra sao, bắt đầu thế nào), giao diện hệ thống tối đa 1–2 section.
3. **Đối tượng là doanh nghiệp** (nhà xưởng, kho bãi, toà nhà), không phải chủ nhà – giả định G3 bên
   dưới là sai và chưa từng được xác nhận. Và **không cần giá, biểu giá hay quy định**, chỉ bán hàng.

**Trang hiện tại** (`src/pages/public/LandingPage.tsx`, nội dung ở `src/lib/mock/landing.ts`):

| Section | Câu hỏi | Bố cục |
|---|---|---|
| Hero | Bạn là ai, làm gì | Ảnh mái nhà xưởng tràn màn; khối chữ nền trang cắt vào góc dưới trái, chữ 64px |
| Tuyên bố | Vì sao nên lắp | Chỉ chữ 44px, lệch vào cột 3 |
| Công trình | Công trình trông thế nào | 1 ảnh lớn + 2 ảnh nhỏ, cặp ảnh trước/sau |
| (Khách hàng nói gì) | Tin được không | Chỉ hiện khi có lời khách hoặc con số thật (`testimonials`, `stats` đang rỗng) |
| Năng lực thi công | Vì sao tin | Split: ảnh kỹ thuật viên 6 cột + 3 điểm |
| Doanh nghiệp nhận được gì | Tôi nhận được gì | Chỉ chữ: 3 lợi ích lớn, trọn gói bên dưới |
| Theo dõi công trình | Theo dõi ra sao | Split: 3 dòng + **một** thẻ giao diện (visual hệ thống duy nhất) |
| CTA | Bắt đầu thế nào | Dải xanh thương hiệu tràn màn, nút đảo màu |

**Đã bỏ:** biểu đồ giá điện và `electricity-tariff.ts`, FAQ pháp lý, cặp số đối chiếu, khung màn tài khoản.

**Ảnh cần người dùng cung cấp** (đang là khung "Ảnh cần bổ sung"): công trình nhà xưởng (flycam),
mái kho, mái toà nhà, cặp trước/sau cùng góc, kỹ thuật viên thi công trên mái, ảnh thi công trong ngày.
**Ảnh hero** dùng `public/images/Hero.png` (người dùng thả vào; bản WebP 960/1672 sinh từ đó). Ảnh là nhà
kho kiểu Mỹ, trông như ảnh dựng hoặc ảnh stock – trang KHÔNG chú thích nó là công trình của Smart Solar;
cần thay bằng ảnh công trình thật trước khi công bố.

**Còn thiếu để bán hàng mạnh hơn** (không bịa): lời khách hàng doanh nghiệp, số công trình / tổng công suất
đã lắp có nguồn, logo khách hàng được phép dùng, chứng chỉ thật.

---

# Bản 2 – lời giới thiệu sản phẩm (29/09/2026)

**Vì sao làm lại.** Người dùng xem bản H1 và nhận xét trang "giống một cái quy trình, không phải landing
page bán hàng giới thiệu sản phẩm". Đúng: section 2–5 chạy theo vòng đời dự án (khảo sát → báo giá → thi
công → bảo hành); tiêu đề mô tả cách vận hành; signature "bạn khai → đo lại" là một quy trình thu nhỏ lặp 7
lần; màn đầu bán một bước khảo sát chứ không bán sản phẩm. Bản H1 chỉ gỡ ký hiệu trình tự (số, đường nối)
mà giữ xương sống quy trình.

**Xương sống mới** (người dùng duyệt):

| # | Câu người mua hỏi | Section | Hình thức |
|---|---|---|---|
| 1 | Đây là gì, tôi được gì? | Màn đầu: "Điện mặt trời áp mái cho nhà ở, bớt đúng phần điện đắt nhất trên hoá đơn" | H1 + đoạn dẫn + nút + bậc thang giá điện tương tác |
| 2 | Tôi mua được những gì? | Trọn gói gồm thiết bị, thi công, thủ tục và bảo hành | Ảnh `[CẦN]` + bảng thông số 8 mục song song |
| 3 | Có hợp với nhà tôi không? | Nhà dùng trên 200 kWh mỗi tháng đang trả từ 2.998 đ cho mỗi kWh vượt mức | 3 đoạn: tiền điện, giờ dùng điện, mái nhà |
| 4 | Sao chọn Smart Solar? | Những thứ Smart Solar cho bạn xem, thay vì chỉ nói qua điện thoại | 4 điểm song song xếp theo mức quan trọng (tiền → hỏng hóc → thi công → số đo), mỗi điểm một khối màn thật |
| 5 | Thủ tục, bán điện dư, hoàn vốn? | Câu hỏi thường gặp (5 câu, có nguồn) | `<details>` |
| 6 | Bắt đầu thế nào? | Để khảo sát sơ bộ, bạn cần địa chỉ, kích thước mái và một ảnh mái | Danh sách 4 thứ + nút; chỗ duy nhất nói trình tự |

**Signature mới: bậc thang giá điện** (`src/components/landing/tariff-ladder.tsx`). Nguồn: thứ chủ nhà nào
cũng cầm trên tay – hoá đơn tiền điện 6 bậc. 6 cột cao theo đơn giá; trong cột, xám là điện mua từ lưới,
xanh là điện tấm pin thay; hai thanh kéo là số của người xem (mặc định 450 kWh dùng, 200 kWh thay). Câu kết
quả bằng HTML: "Tiền điện mỗi tháng từ 1.247.500 đ còn 589.600 đ, bớt 657.900 đ. Mỗi kWh tấm pin thay đáng
3.290 đ, cao hơn giá trung bình 2.772 đ của cả hoá đơn." Chỉ là phép tính trên biểu giá – không % tiết
kiệm, không sản lượng cam kết.

**Dữ kiện có nguồn mới:** biểu giá bán lẻ điện sinh hoạt 6 bậc 1.984 / 2.050 / 2.380 / 2.998 / 3.350 /
3.460 đ/kWh (chưa VAT), Quyết định 1279/QĐ-BCT ngày 09/05/2025, áp dụng từ 10/05/2025. Đến 29/09/2026 mục
"Giá điện" của EVN chỉ có văn bản về cơ chế điều chỉnh (NĐ 278/2026, VBHN 68/2026), chưa có biểu giá mới.
Số liệu nằm ở `src/lib/electricity-tariff.ts`.

**Giữ từ bản H1:** token, font Be Vietnam Pro, khung tài khoản, cặp đối chiếu (chỉ còn là bằng chứng của
một điểm trong section 4), FAQ, header không có menu theo giai đoạn.

**Kiểm màu biểu đồ** (skill dataviz, `validate_palette.js`): xám `--line-2` / xanh `--accent` tách nhau ΔE
CVD 17,7 (light) và 22,1 (dark), mắt thường 21,5 / 25,5, contrast ≥ 3:1. Hai cảnh báo "chroma thấp" và "độ
sáng accent" là cố ý (xám là nền; accent là màu thương hiệu) → có nhãn trực tiếp và chú thích 3 mục để màu
không phải kênh duy nhất.

---

## 0. Giả định cần xác nhận

| # | Giả định | Vì sao phải giả định |
|---|---|---|
| G1 | "Smart Solar" là doanh nghiệp giả lập của đồ án. Mọi dữ kiện về công ty (số công trình, hotline, email, địa chỉ, khu vực phục vụ, điều khoản bảo hành, khảo sát miễn phí hay không) đều là `[CẦN: …]`. | Không có nguồn nào; backend chỉ có Auth (`docs/api/swagger.json`). Landing cũ chứa 49 tuyên bố không có nguồn (xem mục 8). |
| G2 | Landing mô tả những gì **giao diện portal khách hàng đang có** (chạy dữ liệu mẫu), không tuyên bố hệ thống đã vận hành với khách thật. | Tính năng khảo sát, báo giá, dự án, bảo hành chỉ là UI trên `src/data/*.ts`. |
| G3 | Đối tượng duy nhất là chủ nhà ở riêng lẻ. Không nói tới doanh nghiệp, C&I, pin lưu trữ BESS. | `src/lib/auth/roles.ts`: vai trò `customer`; không có sản phẩm C&I. |
| G4 | Nhân viên (kinh doanh, kỹ thuật, quản lý, quản trị) vào qua nút "Đăng nhập" trên header; landing không nói với họ. | Năm vai trò dùng chung `/login`. |

## 1. Người dùng chính

**Chủ nhà ở riêng lẻ tại Việt Nam** đang cân nhắc lắp điện mặt trời áp mái tự dùng.

- **Đến từ đâu:** `[CẦN: kênh thu hút thật – tìm kiếm, quảng cáo, giới thiệu]`. Giả định: tìm kiếm hoặc được người quen gửi link, mở trên điện thoại trước.
- **Cần gì:** biết mái nhà mình lắp được không và được bao nhiêu; biết tốn bao nhiêu và tiền đi vào đâu; biết ai chịu trách nhiệm khi có chuyện.
- **Lo ngại** (nguồn: khảo sát 5 trang cùng ngành, FAQ landing cũ, Tuổi Trẻ 05/04/2026):
  - thấm dột, kết cấu mái – **0/5 trang cùng ngành nhắc tới**;
  - báo giá mập mờ, thiết bị kém chất lượng;
  - không biết thợ làm gì trên mái nhà mình;
  - hỏng thì ai chịu (hãng hay đơn vị lắp), công ty đóng cửa thì sao – 0/5 trả lời;
  - thủ tục (thông báo theo Mẫu 01), bán điện dư – 1/5 nhắc, và đã lỗi thời.

## 2. Hành động

- **Chính:** tạo tài khoản khách hàng để làm khảo sát sơ bộ mái nhà.
  - Sự thật về luồng: `/customer/assessment` nằm sau `RequireRole` (`src/app/router.tsx:66`) → khách mới bị đẩy về `/login`; muốn khảo sát phải **đăng ký → xác minh email → đăng nhập** (`RegisterPage.tsx:79` chuyển sang `/verify-email`, không giữ trang đích).
  - Vì vậy nhãn CTA phải nói đúng việc sẽ xảy ra, ví dụ "Tạo tài khoản để khảo sát mái nhà" trỏ `/register`, không phải "Khảo sát ngay".
- **Phụ:** "Đăng nhập" (khách cũ và nhân viên). Kênh liên hệ trực tiếp là `[CẦN: hotline/Zalo thật]` – chưa có thì không đặt nút.

## 3. Chuỗi câu hỏi của chủ nhà và xương sống trang

**Trang thuyết phục bằng cách cho chủ nhà xem trước chính những thứ họ sẽ thấy trong tài khoản – số đo mái được kiểm lại, báo giá bóc tách, nhật ký thi công, sổ bảo hành – thay cho lời tự xưng "số 1" và dãy số đếm mà 5/5 trang cùng ngành dùng.**

| Thứ tự | Câu chủ nhà tự hỏi | Section trả lời (tiêu đề nháp) | Bằng chứng |
|---|---|---|---|
| 1 | Đây là ai, làm gì, có dành cho nhà tôi không? | Màn đầu | Tiêu đề + product moment (tùy direction) |
| 2 | Mái nhà tôi lắp được không, được bao nhiêu? | "Số đo mái bạn khai được kiểm lại ngay trên mái" | PM1 |
| 3 | Tốn bao nhiêu, tiền đi vào đâu? | "Báo giá ghi tên từng thiết bị và từng khoản công" | PM2 |
| 4 | Họ làm gì trên mái nhà tôi, có làm hỏng không? | "Mỗi ngày thi công có nhật ký và ảnh trong tài khoản" | PM3 |
| 5 | Sau này hỏng thì ai lo? | "Giấy bảo hành và phiếu sửa chữa nằm trong tài khoản" | PM4 |
| 6 | Thủ tục, bán điện dư, loại mái nào lắp được? | Câu hỏi thường gặp (4–5 câu, có nguồn) | FAQ |
| 7 | Bắt đầu cần chuẩn bị gì? | "Khảo sát sơ bộ hỏi bốn nhóm thông tin" + CTA | Nội dung form thật |

- Câu 2–5 trùng thứ tự vòng đời dự án. Để trang **không đọc thành quy trình**: không đánh số, không đường nối, không tên giai đoạn làm tiêu đề; mỗi section là một lời hứa kèm bằng chứng, đứng độc lập.
- Đọc riêng cột tiêu đề nháp: một lời giới thiệu đơn vị lắp đặt "cho xem hồ sơ", không phải mục lục hướng dẫn.
- Bỏ các section của landing cũ không trả lời câu nào hoặc chỉ sống nhờ nội dung bịa: dãy số liệu hero, "Tại sao hàng nghìn mái nhà…", catalogue REC/Enphase/Tesla, 3 gói giá, hành trình 8 bước, khảo sát 3 bước, banner CTA gradient.

## 4. Điều Smart Solar nói được mà đối thủ không nói được

> "Số đo mái bạn tự khai được kỹ thuật viên đo lại và ghi chênh lệch; báo giá bóc tách từng dòng;
> mỗi ngày thi công có nhật ký và ảnh; yêu cầu bảo hành có trạng thái – tất cả trong tài khoản của bạn."

Swap test: thay "Smart Solar" bằng Intech, Saigon Solar, DHC, SolarBK, DAT → câu sai, vì 0/5 có portal cho hộ gia đình.

**Giới hạn phải giữ trong copy:** bảng "bạn khai / đo thực tế" hiện chỉ có ở portal kỹ thuật (`src/pages/field/survey-page.tsx:74-118`) và quản lý (`src/pages/manage/project-page.tsx:144-168`); **chủ nhà chưa thấy nó trong `/customer`**. Copy chỉ được nói "kỹ thuật viên đo lại và ghi chênh lệch", không được nói "bạn xem chênh lệch trong tài khoản" – trừ khi thêm tính năng đó vào portal khách hàng.

## 5. Product moment

Cả bốn đều chạy dữ liệu mẫu, không gọi API. Dữ liệu hiện tại là tiếng Anh, bối cảnh Mỹ, USD, ảnh picsum ngẫu nhiên, và số liệu giữa các màn không khớp – **không chụp màn portal nguyên trạng được**. Cách trình bày: dựng lại khối bằng chính primitive của portal (`Table`, `Stepper`, `Progress`, `KeyValueList`, `Stat` trong `src/components/ui`) với **một bộ dữ liệu mẫu tiếng Việt nhất quán** (một căn nhà, một con số công suất xuyên suốt), gắn nhãn "Dữ liệu minh hoạ". Chữ là HTML nên đọc được bằng trình đọc màn hình và crop lại được cho mobile.

| # | Khoảnh khắc | Trả lời câu | Nguồn trong code |
|---|---|---|---|
| PM1 | Số chủ nhà khai đặt cạnh số kỹ thuật viên đo (diện tích, độ nghiêng, hướng, vật cản) + chênh lệch + cách xử lý | 2 | `field/survey-page.tsx:74-118,184-206`; `manage/project-page.tsx:144-168` |
| PM2 | Báo giá bóc tách: hạng mục, số lượng, đơn giá, thành tiền → tổng | 3 | `customer/quotation-page.tsx:63-153` |
| PM3 | Nhật ký thi công theo ngày: việc đã xong, đang làm (14/21 tấm), ảnh | 4 | `customer/project-page.tsx:37-123` |
| PM4 | Sổ bảo hành + phiếu yêu cầu có trạng thái và khung giờ kỹ thuật viên đến | 5 | `customer/warranty-page.tsx:35-106`; `customer/warranty-request-page.tsx:75-90` |

**Không dùng:** trợ lý AI (mọi câu hỏi nhận cùng một câu trả lời soạn sẵn, `assistant-page.tsx:30-33`); giám sát sản lượng thời gian thực (không tồn tại); con số ước tính kWp/kWh của form khảo sát (là hằng số, không có công thức – `customer.ts:135-144`); mọi KPI trong `manage.ts:478-483`.

**Việc phải làm cho dữ liệu mẫu:** bỏ tín dụng thuế Mỹ, khoản vay APR, PG&E, NABCEP, số giấy phép C-10, SĐT `(555)`, email `@icloud.com`, mã cổng nhà; đổi sang VND, m², tên và địa chỉ Việt không trỏ tới người thật (không số nhà cụ thể). Đơn giá trong báo giá mẫu: `[CẦN: đơn giá tham khảo có nguồn]` hoặc để dạng khoảng, ghi rõ minh hoạ.

**Ảnh:** không có ảnh thật nào (20 SVG vẽ tay, ảnh picsum). Chỗ nào ảnh thật sự trả lời câu hỏi (ảnh chân đế đã xử lý chống thấm, ảnh nhật ký thi công) thì đặt khung đúng tỷ lệ kèm `[CẦN ẢNH: …]`; không lấp bằng ảnh stock.

## 6. Workflow trên trang

- **Có, một section ngắn ở cuối (câu 7)**, vì chủ nhà cần biết "phải chuẩn bị gì" trước khi bấm CTA.
- Đúng số thật: form khảo sát sơ bộ có **4 phần** (`assessment-page.tsx:16`): vị trí và loại nhà, kích thước mặt mái (dài × rộng, độ nghiêng, hướng), ảnh mái (ít nhất 1), xác nhận là chủ nhà.
- Trình bày như danh sách thứ cần chuẩn bị, không phải stepper; kèm một câu về việc xảy ra sau đó (yêu cầu tư vấn → hẹn khảo sát tại nhà → báo giá, theo `customer.ts:183-188`).
- Không có khối "cách hoạt động" nào khác trên trang.

## 7. Phạm vi và ràng buộc kỹ thuật

- **Stack giữ nguyên:** React 19, Vite 8, Tailwind v4 (`@theme` trong `src/styles/globals.css`), react-router 7. Không thêm thư viện UI, không thư viện animation.
- **File sẽ đổi:** route `/` trong `src/app/router.tsx`; trang mới trong `src/pages/public/`; component trong `src/components/landing/` (thay bộ cũ); dữ liệu trong `src/lib/mock/landing.ts` (viết lại); `PublicLayout.tsx` (menu, footer – dùng chung với `/coming-soon`); `index.html` (`lang`, meta).
- **Token:** token riêng của landing đặt dưới một lớp gốc `.landing` để portal không đổi (luật 3). Hiện `CLAUDE.md` chốt thang chữ 5 bậc tối đa 32px cho cả app → **landing cần cỡ display lớn hơn, phải được duyệt** (mục 9).
- **Bộ component cũ:** `src/components/landing/*` và `LandingPage.tsx` chứa nội dung bịa; sẽ xoá sau khi landing mới được duyệt. `HomeLayoutPage.tsx` (khung tạm) cũng xoá.
- **Kiểm tra:** `npm run lint`, `npm run typecheck`, `npm run build`; chụp `/`, `/coming-soon`, `/login` trước và sau.

### Phát hiện ảnh hưởng toàn app

1. **Font không có dấu tiếng Việt.** `@fontsource-variable/schibsted-grotesk` chỉ có subset `latin` + `latin-ext` (`metadata.json`); `unicode-range` bỏ qua U+1EA0–1EF1. Các chữ ạ ả ấ ầ ậ ắ ặ ẹ ế ệ ị ọ ố ộ ợ ụ ứ ự ỳ ỵ… rơi về font hệ thống. Ảnh kiểm chứng ở cỡ 56px: "bạn", "lắp", "được", "Nguyễn", "Kỹ thuật", "số liệu" lẫn hai font. **Mọi màn tiếng Việt của app đang bị như vậy.**
2. `index.html` để `lang="en"` và mô tả tiếng Anh trong khi giao diện đã chuyển tiếng Việt.
3. `index.html` vẫn tải Plus Jakarta Sans nhưng không chỗ nào dùng (request thừa).
4. Sau khi đăng ký, người dùng không được đưa về trang đích (`from` mất qua bước xác minh email).

## 8. Nội dung: có / thiếu / cần xác minh

| Mục | Trạng thái | Ghi chú |
|---|---|---|
| Mô tả sản phẩm | Có | `index.html:8`, `landing.ts:13` (câu mô tả hero dùng được) |
| Tính năng portal khách hàng | Có (UI, dữ liệu mẫu) | 9 màn trong `/customer` |
| Số liệu công ty | Thiếu | Không con số nào có nguồn |
| Phản hồi khách hàng | Thiếu | Bỏ hẳn section niềm tin kiểu testimonial |
| Ảnh thật | Thiếu | `[CẦN ẢNH]` |
| Giá | Thiếu | Chỉ có ghi chú "ước tính mang tính tham khảo" (`landing.ts:128-130`) – dùng được |
| Điều khoản bảo hành | Cần xác minh | Landing cũ tự mâu thuẫn (12–25 năm, 84,8% / 85% / 92%) |
| Liên hệ | Cần xác minh | "1900 6868", `lienhe@smartsolar.vn` có thể trùng doanh nghiệp thật → gỡ |
| Chính sách điện mặt trời mái nhà | Có nguồn, cần xác minh bản gốc | NĐ 58/2025, NĐ 243/2026 (bán điện dư tối đa 50%, giá thị trường), hướng dẫn Mẫu 01 của Cục Điện lực. Nếu dùng: ghi ngày văn bản và link |
| FAQ dùng được | Có, phải viết lại | "Ước tính khác báo giá thế nào", "khảo sát sơ bộ cần gì" (khớp form 4 phần), "sau khi gửi thì sao" |
| Logo | Placeholder | `public/placeholders/logo.svg`; favicon là hình khác |
| Màu thương hiệu | Có | `--accent: #0d5c3a` dùng trên mọi màn |
| Giọng văn | Có | `CLAUDE.md`: ngắn, chủ động, không quảng cáo |

Danh sách 49 tuyên bố bịa của landing cũ (kèm dòng) nằm trong báo cáo kiểm kê; không câu nào được chép sang landing mới.

---

# Pha 2 – Design direction

## 9. Nguồn bản sắc (2.1)

| # | Nguồn | Dữ kiện |
|---|---|---|
| N1 | Hình dạng dữ liệu | Sản phẩm lưu **cặp** số: chủ nhà khai ↔ kỹ thuật viên đo, kèm chênh lệch và cách xử lý (`src/data/manage.ts:219-227`, `field/survey-page.tsx:24-26`, `lib/mock/surveys.ts:465`) |
| N2 | Công cụ, giấy tờ của nghề | Bản vẽ ghi kích thước (TCVN 5705:1993: đường gióng, đường kích thước, số ghi trên đường); hồ sơ thông báo Mẫu 01 đòi diện tích mái và bản vẽ lắp đặt; thước, máy đo nghiêng |
| N3 | Khoảng trống ngành | 0/5 trang cho thấy một con số được kiểm lại; 5/5 tự xưng "số 1"; 4/5 in số liệu tự mâu thuẫn; 0/5 nhắc thấm dột |
| N4 | Tài sản thương hiệu | `--accent #0d5c3a` (giữ); tên "Smart Solar"; font hiện tại không dùng được cho tiếng Việt (mục 7) |
| N5 | Bối cảnh dùng | Chủ nhà không lên mái được để xem; mở link trên điện thoại trước |

## 10. Hai hướng đã phát triển (2.2)

Hướng thứ ba (nguồn N5: "mục ghi từ mái nhà" – giờ, người, ảnh, chữ ký) dừng giữa chừng vì hết giới hạn phiên; ý của nó đã nằm trong section nhật ký thi công của cả hai hướng dưới.

### H1 – Hai con số của cùng một mái nhà (nguồn N1 + N3)

- **Concept:** mọi bằng chứng trên trang là một cặp giá trị của cùng một đại lượng: trái là điều chủ nhà đã khai hoặc đã được báo trước, phải là điều kỹ thuật viên đo hoặc ghi lại; giữa hai số là một đường ghi kích thước in số chênh lệch; dưới luôn có một câu về cách xử lý.
- **Màn đầu:** tiêu đề nói "là gì, cho ai" + cặp "Diện tích mái lắp được: 90 m² (bạn khai) / 85,4 m² (kỹ thuật viên đo)" + nút chính dưới vế "bạn khai".
- **Font:** Archivo Variable, trục wght; hai vế khác nhau chỉ bằng weight 300 / 720 và mực `--fg-2` / `--fg`.
- **Màu:** accent chỉ cho "nét bút kỹ thuật viên" (đường kích thước, số chênh) và nút chính; chênh âm/dương cùng màu (số khai không phải lỗi).
- **Signature:** cặp đối chiếu có đường ghi kích thước (component + CSS, không SVG).
- **Mock đã dựng:** 1440 × 789 và 390 × 664 (ảnh trong scratchpad của phiên).

```
1440                                                              390
┌──────────────────────────────────────────────────────────┐     ┌──────────────────────────┐
│ Smart Solar        Câu hỏi thường gặp  Đăng nhập [Tạo TK] │     │ Smart Solar    Đăng nhập │
├──────────────────────────────────────────────────────────┤     ├──────────────────────────┤
│ Lắp điện mặt trời áp mái cho nhà ở,     (H1 52/66, 8 cột)│     │ Lắp điện mặt trời áp     │
│ theo số đo kỹ thuật viên kiểm lại trên mái               │     │ mái cho nhà ở, theo số … │ H1 34/44
│ Bạn khai kích thước mái khi đăng ký. Trước khi báo giá…  │     │ Diện tích mái lắp được   │
│                                                          │     │ Dữ liệu minh hoạ         │
│ Diện tích mái lắp được · Dữ liệu minh hoạ                │     │ 90 m²      85,4 m²       │ 60/52
│ 90 m²                       │ 85,4 m²                    │     │ Bạn khai   KTV đo 12/10  │
│ (300, fg-2)                 │ (720, fg)     120/100 tnum │     │ ╱── −4,6 m² (−5,1%) ──╱  │
│ Bạn khai khi đăng ký        │ Kỹ thuật viên đo tại mái   │     │ Chừa lối đi quanh bồn …  │
│ ╱──────── −4,6 m² (−5,1%) ──╱   Chừa lối đi quanh bồn   │     │ [Tạo tài khoản để khảo  ]│ 48px, vùng ngón cái
│ [ Tạo tài khoản để khảo sát mái nhà ]    nước, nên …     │     │ Đã có tài khoản? Đ.nhập  │
└──────────────────────────────────────────────────────────┘     └──────────────────────────┘
```
(Menu header ở wireframe này đã áp sửa S1, mục 12.)

### H2 – Bản vẽ mặt mái có hai lớp kích thước (nguồn N2)

- **Concept:** trang dựng quanh một bản vẽ mặt mái có ghi kích thước; số chủ nhà khai vẽ nét đứt, chỉ thành nét liền khi kỹ thuật viên đo lại; cùng bản vẽ dùng lại để đếm tấm trong báo giá, đánh dấu tấm đã lắp, khoanh chân đế cần sửa khi bảo hành.
- **Màn đầu:** bản vẽ tương tác – sửa dài × rộng → vẽ lại số tấm tối đa theo hình học thuần (kích thước tấm 1722 × 1134 mm, khe 10 mm từ sổ tay lắp đặt JA Solar JAM54S30).
- **Font:** Archivo Variable trục wght + wdth (nhãn kích thước ở wdth 82), 210 KB.
- **Màu:** accent = tấm pin; nét kích thước dùng mực trung tính; chênh lệch và phiếu dùng `--warn`.
- **Signature:** `RoofPlan` (SVG trong React), xuất hiện 4 lần với 4 cách cắt.

```
1440                                                              390
┌──────────────────────────────────────────────────────────┐     ┌──────────────────────────┐
│ Điện mặt trời áp mái cho nhà ở, tính từ chính số đo mái  │     │ H1 32/40 + đoạn + CTA    │
│ Smart Solar khảo sát, lắp đặt và bảo hành … (30em)       │     │┌────────────────────────┐│
│ [ Tạo tài khoản để khảo sát mái nhà ]                    │     ││Dài [9,60] Rộng [6,20]  ││ ô nhập gom một hàng
│┌────────────────────────────────────────┬───────────────┐│     ││Vừa tối đa 21 tấm …     ││
││   ├ ─ ─ [ 9,60 ] m ─ ─┤          (B)   │ Vừa tối đa 21 ││     ││  bản vẽ xoay 90°       ││
││   ┌───────────────────┐  [6,20] m      │ tấm, theo hình││     ││  ┌──────┐ 9,60 m       ││
││   │ ▢▢▢▢▢▢▢  7 × 3    │                │ học. Dốc [15]°││     ││  │▢▢▢   │              ││
││   └───────────────────┘                │ Hướng [180]°  ││     ││  └──────┘              ││
│├──────── khung tên: bản vẽ · tấm dùng để đếm · không lưu ┤│     │└────────────────────────┘│
└──────────────────────────────────────────────────────────┘     └──────────────────────────┘
```

## 11. Phản biện (2.4) – chạy trên cả hai hướng

| Phép thử | H1 | H2 |
|---|---|---|
| Độ cụ thể | Đạt: font, cỡ, weight, màu, contrast, grid, hình học đường kích thước, props, bố trí từng section ở 1440/390 | Đạt về giá trị; nhưng hành vi màn đầu phụ thuộc `[CẦN: khoảng lùi mép mái]` – chưa có số thì widget thành hình tĩnh |
| Brief tương tự (một đơn vị khác có app) | Cách sắp chữ chép được sang "dự báo ↔ thực tế". Phần không chép được: **luật vế trái** (vế trái luôn là điều chủ nhà khai hoặc được báo trước sự việc) – đơn vị không lưu số tự khai thì không dựng được cặp nào | "Mái nhà + lưới tấm" là hình mặc định của ngành (công cụ thiết kế solar nào cũng có); phần riêng duy nhất là lớp nét đứt/nét liền – tức chính ý của H1 bọc trong một hình mặc định |
| Hội tụ A1 | Gần "hero số lớn + nhãn nhỏ": cặp 120px có thể bị đọc thành KPI công ty nếu nhãn "Dữ liệu minh hoạ" tách xa (mock hiện nhãn trôi ra mép phải) | Gần "mọi section cùng khuôn tiêu đề + đoạn + khung"; bản vẽ luôn nằm trái |
| Hội tụ A2 | Không trùng | Không trùng |
| Hội tụ A3 | Nguy cơ "tối giản vô cá tính" ở màn đầu (toàn chữ và số) | Nguy cơ "đồ hoạ kỹ thuật" (biến thể chống template); nhãn wdth 82 đóng vai "mono cho nhãn dữ liệu" |
| Trình tự (luật 9) | Section 2–5 trùng vòng đời nhưng mỗi cặp đứng độc lập. **Lỗi trong mock:** menu header "Khảo sát mái / Báo giá / Thi công / Bảo hành" là điều hướng đặt tên theo giai đoạn | Nặng hơn: **cùng một hình** đổi trạng thái nét đứt → nét liền → tấm đặc → phiếu theo đúng vòng đời, đọc được như một câu chuyện từng bước |
| Product-first | Tiêu đề + nhãn "Bạn khai / Kỹ thuật viên đo" + nút trả lời đủ là gì, cho ai, làm gì tiếp trong một màn 390px (đáy nút y≈597 < 664) | Rõ và mời tương tác; nhưng thứ đầu tiên người xem làm là **đếm tấm** – giống công cụ tính của Intech |
| Trung thực (luật 10) | Cặp được trình bày là dữ liệu phiếu kỹ thuật viên, không giả làm màn tài khoản – đúng giới hạn brief §4 | Bản vẽ **không tồn tại trong portal**; hoặc phải làm thêm `RoofPlan` cho `/customer/assessment` và `/field/surveys`, hoặc ghi "hình vẽ theo số bạn nhập trên trang này" – khi đó hình chính của màn đầu không phải sản phẩm |
| Chi phí dựng | Một component + CSS, không SVG | SVG có ô nhập chồng lên, xoay theo container, ResizeObserver, hàm đếm; font 210 KB |
| Font | Archivo wght 80,7 KB; mock 1440/390 cho thấy dấu không lẫn font | Như H1 + trục wdth |

## 12. Đề xuất: H1, kèm sửa bắt buộc

**Chọn H1 vì** brief §4 chỉ cho phép một lời hứa có bằng chứng ("kỹ thuật viên đo lại và ghi chênh lệch") **nên** signature phải là chính lời hứa đó ở dạng thấy được, không phải một hình minh hoạ mà portal không có (truyền đạt giá trị sản phẩm). **Không chọn H2 vì** phần khác biệt của nó trùng ý H1, còn phần còn lại là hình mặc định của ngành và một widget phụ thuộc hằng số chưa có nguồn.

Sửa bắt buộc trước khi dựng:

| # | Sửa | Lý do |
|---|---|---|
| S1 | Header chỉ còn: tên "Smart Solar", "Câu hỏi thường gặp", "Đăng nhập", nút "Tạo tài khoản". Bỏ các mục theo giai đoạn | Điều hướng đặt tên theo giai đoạn là tín hiệu trình tự (luật 9); trang đủ ngắn để cuộn |
| S2 | "Dữ liệu minh hoạ" đứng ngay sau tên đại lượng, cùng dòng, không căn phải xa | Cặp số 120px mà nhãn minh hoạ tách xa sẽ bị đọc thành số liệu công ty (A1) |
| S3 | Câu xử lý lùi 24px khỏi đường gióng vế phải | Mock hiện đường gióng đè chữ đầu câu |
| S4 | Rút gọn H1 khi dựng (hiện 3 dòng, 13 từ), giữ phần qua swap test "số đo … kiểm lại trên mái" | Tiêu đề dài đẩy nút về sát mép màn 789px (dư 8px) |
| S5 | Ghép từ H2: dẫn TCVN 5705:1993 cho quy ước đường ghi kích thước (ghi chú trong code); FAQ thấm dột dẫn yêu cầu bịt kín lỗ xuyên mái trong sổ tay lắp đặt JA Solar như nguồn kỹ thuật chung, không ngụ ý dùng hãng này | Trả lời nỗi lo 0/5 trang nhắc, có nguồn |
| S6 | Không ghép bản vẽ mái và widget đếm tấm của H2 | Hai signature tranh nhau; hằng số lùi mép chưa có |

## 13. Giá trị chốt cho H1 (2.3)

### Typography

Một họ chữ: **Archivo Variable, file `wght.css`** (`@fontsource-variable/archivo` 5.3.0, OFL-1.1, subset `vietnamese` phủ U+1EA0–1EF9 và ₫; ba file 34,9 + 32,6 + 13,2 KB). Đã render thử "Ở Ễ Ỗ Ẳ Ậ Ặ Ợ ự ỵ — Nguyễn Thị Hạnh" ở mọi cỡ dưới đây: một font, dấu không chạm dòng trên.

| Bậc | Dùng cho | 1440 (px/lh) | 390 | Weight | Letter-spacing |
|---|---|---|---|---|---|
| Display-L | Hai số của cặp màn đầu (chỉ chữ số) | 120/100 | 60/52 | 300 khai · 720 đo | −0.03em; đơn vị m² 0.4em, wght 450, `--fg-3` |
| Display-M | Số của cặp trong section | 52/56 | 40/44 | 300 · 720 | −0.02em |
| Heading 1 | H1 | 52/66 | 34/44 | 650 | −0.02em / −0.015em |
| Heading 2 | Tiêu đề section | 36/46 | 28/36 | 650 | −0.015em / −0.01em |
| Subheading | Tên đại lượng, số chênh, câu hỏi FAQ; lede (400, 20/30) | 20/28 | 17/24 | 600 | −0.005em |
| Body | Văn bản, câu xử lý | 17/28 | 16/26 | 400 | 0 |
| Metadata | Nhãn dưới số, "Dữ liệu minh hoạ", nguồn | 14/20 | 13/20 | 450 | +0.005em |
| Action | Nút, link | 16/20 | 16/20 | 600 nút · 450 link | 0 |

- Line-height tiêu đề 1,27–1,28 (cao hơn thói quen 1,1–1,15) là chi phí để dấu chồng không chạm dòng trên; đã đo va chạm từng cỡ.
- Display-L/M chỉ cho chữ số, không cho chữ tiếng Việt.
- Trong khung tài khoản giữ thang portal 13/15/18/24/32 để phân biệt chữ của sản phẩm với chữ của trang.
- Độ rộng dòng: body 31rem (≈ 66 ký tự); lede 6 cột; H1, H2 tối đa 8 cột; mobile 358px.
- Số: `tabular-nums`, dấu thập phân phẩy, dấu chấm ngăn nghìn, dấu trừ U+2212.

### Màu

Không thêm giá trị mới; mọi token landing là bí danh dưới `.landing`, dark mode tự theo.

| Vai trò | Token | Light | Dark | Tỷ lệ |
|---|---|---|---|---|
| Nền | `--canvas` | #fafbf8 | #0f100d | ~88% |
| Mực (số đo, tiêu đề) | `--fg` | #141711 | #ecf0ec | ~5% |
| Mực số khai, lede | `--fg-2` | #50544c | #a6ada7 | ~3% |
| Mực phụ (meta, đơn vị) | `--fg-3` | #676a63 | #939a94 | <1% |
| Nét kỹ thuật viên + nút chính | `--accent` | #0d5c3a | #47c58c | ≤2% |
| Nền khung chờ ảnh | `--surface-2` | #f0f1ec | #191b17 | 3–6% |

Trạng thái (`--ok`, `--warn`) chỉ trong khung tài khoản. Contrast đo bằng script (oklch → sRGB, WCAG 2.x):

| Cặp | Light | Dark | Ngưỡng |
|---|---|---|---|
| fg / canvas | 17,36 | 16,54 | 4,5 |
| fg-2 / canvas | 7,42 | 8,32 | 4,5 |
| fg-3 / canvas | 5,27 | 6,67 | 4,5 |
| accent / canvas (số chênh, đường kích thước, link) | 7,74 | 8,80 | 4,5 |
| on-accent / accent (nút) | 7,73 | 8,59 | 4,5 |
| on-accent / accent-hover | 9,92 | 10,57 | 4,5 |
| ring / canvas (focus) | 4,39 | 8,80 | 3 |
| line-2 / canvas (đường gióng, viền nút phụ) | 3,49 | 3,48 | 3 |
| fg-3 / surface-2 | 4,83 | 6,03 | 4,5 |

### Không gian

- Thang: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 (portal) + 96 / 128 / 160 chỉ cho khoảng cách section.
- Trong cặp: tên đại lượng → số 12; số → nhãn 8; nhãn → đường 12; đường → câu xử lý 16–20.
- Trong nhóm: H2 → nội dung 32 (mobile 24); cặp → cặp 48 (32); khung → chú thích 12.
- Giữa section: gần 96 (mobile 64) khi cùng hồ sơ; xa 128 (80) khi đổi chủ đề; rất xa 160 (96) khi nhảy thời gian hoặc đổi người chịu trách nhiệm. Không kẻ đường giữa section.
- Grid: 12 cột, container 1200px (cột 78, gutter 24); mobile 4 cột, gutter 16, lề 16; breakpoint 64rem (trùng `lg` của portal).
- Container: văn bản 31rem; tiêu đề 8 cột; cặp số 12 cột; khung có bảng 12 cột; khung nhật ký, bảo hành, FAQ 8 cột.

### Hình khối, surface, icon, motion

- Radius 3px (nút, ô nhập, focus) và 6px (khung). Viền 1px `--line` (khung), 1px đứt `--line-2` (khung ảnh), 1,5px `--accent` (đường kích thước), 1px `--line-2` (đường gióng). Không bóng trên trang; chỉ menu mobile dùng `--shadow-pop`.
- **Khung tài khoản** (kiểu card duy nhất) cho mọi hình ảnh sản phẩm: nền canvas, viền `--line`, radius 6; dải đầu 40px ghi tên màn ("Màn Báo giá trong tài khoản khách hàng") và "Dữ liệu minh hoạ"; thân là primitive thật (`Table`, `Progress`, `KeyValueList`, `Badge`) ở thang portal; mobile dùng tập dòng khác, không thu nhỏ; chú thích một câu dưới khung. Cặp ở màn đầu và section 2 **không** nằm trong khung (là dữ liệu phiếu kỹ thuật viên, không phải màn khách hàng).
- Ảnh chờ: khung `Photo` 4:3 (section 2: 4:5), nền `--surface-2`, viền đứt, chữ `[CẦN ẢNH: …]`.
- Icon: chỉ Material Symbols đã nạp – `menu`/`close` (menu mobile) và `expand_more` (FAQ). Không icon trong nội dung.
- Motion: 120ms (nhấn, hover – dùng lại `.press`), 200ms (chevron FAQ, menu mobile), một easing `cubic-bezier(0.2, 0, 0, 1)`. Không hiệu ứng khi cuộn, không số đếm chạy. Reduced-motion dùng rule có sẵn trong `globals.css`.
- Dark mode: làm, theo hệ thống như portal (token bí danh nên không tốn thêm việc; `/login` và `/coming-soon` đã đổi theo hệ thống).

### Signature: cặp đối chiếu

- Bốn phần: tên đại lượng · hai giá trị cùng cỡ, cùng baseline (trái 300 `--fg-2`, phải 720 `--fg`) · đường ghi kích thước 1,5px `--accent`, vạch xiên 45° hai đầu, số chênh ở giữa · câu xử lý (bắt buộc khi chênh ≠ 0).
- Luật nội dung: vế trái luôn là điều chủ nhà khai hoặc được báo **trước**; vế phải là điều đo hoặc ghi lại; vế trái không gạch ngang; chênh bằng 0 ghi "Khớp"; chưa đo thì vế phải "Chưa đo", đường nét đứt.
- Markup `figure` > `figcaption` + `dl` (nhãn đọc trước số) + đường `aria-hidden` + số chênh có tiền tố ẩn "Chênh lệch".
- Dọc/ngang theo container query `@container (width < 40rem)`; màn đầu luôn ngang.
- Không chuyển động.
- Xuất hiện: màn đầu (L), section 2 (3 cặp M), section 3 (ước tính / báo giá), section 4 (21 tấm theo lịch / 14 tấm đã lắp), section 5 (ảnh bạn gửi / ảnh sau khi sửa), section 7 (trạng thái rỗng). Không có ở header, footer, FAQ.

### Kiến trúc trang

| # | Tiêu đề nháp | Hình thức | Khoảng cách trước |
|---|---|---|---|
| 1 | Lắp điện mặt trời áp mái cho nhà ở, theo số đo kỹ thuật viên kiểm lại trên mái | H1 + lede + cặp L + nút | – |
| 2 | Mỗi số bạn khai về mái được đo lại tại chỗ, ghi chênh lệch và cách xử lý | 3 cặp M (độ nghiêng, hướng, vật cản) cột 1–8 + ảnh 4:5 `[CẦN ẢNH]` cột 9–12 | Gần 96 |
| 3 | Báo giá ghi tên từng thiết bị, số lượng và tiền công, lập theo số đo tại mái | Cặp ước tính/báo giá + khung "Màn Báo giá" với `Table` 6 dòng; đơn giá `[CẦN]` | Xa 128 |
| 4 | Ngày thợ lên mái nào, tài khoản có nhật ký và ảnh của ngày đó | Cặp dọc cột 1–4 + khung "Màn Dự án" **một ngày** (không Ngày 1/2/3, không `Stepper`) | Xa 128 |
| 5 | Hỏng hóc thì gửi phiếu trong tài khoản; phiếu giữ ảnh trước, ảnh sau khi sửa và ghi ai chịu chi phí | Cặp ảnh + khung "Màn Bảo hành": thiết bị – bên bảo hành – đến ngày `[CẦN]` + một dòng trạng thái | Rất xa 160 |
| 6 | Thủ tục, bán điện dư và loại mái: trả lời kèm văn bản gốc | 4 `<details>` có dòng nguồn: Mẫu 01 (NĐ 58/2025), bán điện dư ≤ 50% giá thị trường (NĐ 243/2026), loại mái và chống thấm `[CẦN]`, ước tính khác báo giá | Xa 128 |
| 7 | Chuẩn bị bốn nhóm thông tin là gửi được khảo sát sơ bộ | Danh sách 4 mục không số + cặp rỗng + nút + "Cần xác minh email trước khi mở form" + một câu về việc sau khi gửi | Gần 96 |
| – | Footer một hàng | "Smart Solar", `[CẦN: pháp nhân, liên hệ]`, Đăng nhập, Câu hỏi thường gặp, câu "số liệu trên trang là dữ liệu minh hoạ" | Xa 128 |

Đọc riêng cột tiêu đề: một lời giới thiệu đơn vị lắp đặt kèm các lời hứa kiểm chứng được; không có tên giai đoạn, không "Bước", không "Cách hoạt động". Khối trình tự duy nhất là section 7, ngắn, ở cuối.

### Dự án này sẽ không dùng

- Ô số liệu công ty, bộ đếm, "số 1", logo hãng/đối tác, testimonial, sao, bảng giá theo gói.
- Mũi tên (kể cả trên nút), 01/02/03, chữ "Bước", `Stepper` trên landing, danh sách Ngày 1/2/3, đường nối giữa section, menu đặt tên theo giai đoạn, section ghim.
- Gạch ngang số khai; đỏ/xanh cho dấu số chênh; gradient, glow, blob, nền lưới/chấm, chữ gradient, glass, icon trong ô, pill "Mới", khung trình duyệt giả, mockup nghiêng, thẻ số nổi, ảnh stock, ảnh picsum, SVG minh hoạ của bộ tech.
- Nhãn in hoa giãn chữ, meta "A · B · C", font mono, serif display, Schibsted Grotesk trên landing, chữ tiếng Việt ở cỡ display.
- Hiệu ứng khi cuộn; trợ lý AI, giám sát sản lượng, số kWp/kWh của form ước tính.

## 14. Rủi ro còn lại

1. Cặp 120px vẫn có thể bị đọc là KPI – cần thử 5 giây với 3–5 người trước khi chốt (sau S2).
2. Màn đầu toàn chữ và số có thể bị thấy là thưa; cách sửa đúng là thêm một dòng thật của phiếu, không thêm trang trí.
3. Lời hứa mạnh nhất dựa trên bản ghi chủ nhà **chưa** tự xem được trong `/customer`. Đề xuất riêng (ngoài phạm vi): thêm panel chỉ đọc "Số bạn khai và số đo tại mái" vào `/customer/quotations/:id`.
4. Section 3 yếu cho tới khi có đơn giá tham khảo có nguồn.
5. `subgrid` và container query cần Chrome 117+ / Safari 16+.

---

# Quyết định đã chốt (29/09/2026)

| # | Câu hỏi | Quyết định |
|---|---|---|
| 1 | Hướng | H1 kèm S1–S6 (người dùng không phản đối đề xuất) |
| 2 | Font | **Be Vietnam Pro** (người dùng chọn), thay cho Archivo trong mục 13. Hiện chỉ áp cho trang công khai (`PublicLayout`); đổi toàn app là việc riêng, chưa làm |
| 3 | Ngôn ngữ | **Toàn bộ tiếng Việt**: chữ, dữ liệu mẫu, nhãn, alt, meta, `lang="vi"` |
| 4 | Năm | **2026** cho mọi mốc thời gian và bản quyền |
| 5 | Thang chữ | Landing dùng thang riêng `ld-*` (lớn hơn 32px), không đổi thang portal |
| 6 | Code cũ | Đã xoá `HomeLayoutPage`, bộ `components/landing` cũ; viết lại `mock/landing.ts` |
| 7 | Placeholder | Hiện nguyên văn `[CẦN: …]` màu `--warn` để thấy chỗ còn thiếu |

## Giá trị đã đổi so với mục 13 khi dựng với Be Vietnam Pro

Be Vietnam Pro chỉ có bản tĩnh (`@fontsource/be-vietnam-pro` 5.3.0, OFL-1.1; bản variable trả 404) và đo
khác Archivo, nên:

- **Weight:** 300 (số khai), 400 (chữ), 600 (tiêu đề, số đo, nút) – ba file thay vì trục biến thiên.
- **Không có chữ số dạng bảng:** `tabular-nums` không đổi độ rộng ("1111" 145,6px, "0000" 263px ở 100px) → cột số căn phải.
- **Dấu chồng cao 1,21em trên baseline** → line-height tiêu đề nâng lên: H1 48/64 (mobile 32/44), H2 34/46 (26/36), Subheading 20/30 (18/26).
- **Cặp số màn đầu 96/88** (mobile 56/56) thay cho 120/100: ở 120 cặp số nổi trước h1 trong blur test; font rộng hơn nên mobile 60px không vừa 358px (đo được 409px).
- **Giá trị chữ trong cặp** (hướng, vật cản) có bậc riêng `ld-num-text` 28/38 (mobile 20/28).
