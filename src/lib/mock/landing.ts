/*
 * Nội dung trang chủ công khai "/".
 *
 * Xương sống là lời giới thiệu sản phẩm, không phải quy trình: sản phẩm và lợi ích → trọn gói
 * gồm gì → nhà nào hợp → những thứ Smart Solar cho xem → câu hỏi → đăng ký.
 * Giá điện lấy từ src/lib/electricity-tariff.ts (có nguồn). Các khối màn tài khoản dùng dữ liệu
 * minh hoạ của MỘT căn nhà mẫu (21 tấm, hai dàn, năm 2026); không có tên, địa chỉ, SĐT thật.
 *
 * `{ need }` đánh dấu chỗ chưa có dữ kiện thật; trang hiện nó dạng [CẦN: …] cho tới khi có nguồn.
 */

export type Need = { need: string }
export type Copy = string | Need
export type Rich = Copy | Copy[]

export const SAMPLE_LABEL = 'Dữ liệu minh hoạ'

export type Reading = { value: string; unit?: string; by: string }
export type PendingReading = { pending: string; by: string }
export type PhotoReading = { photo: string; by: string }

export type PairContent = {
  quantity: string
  declared: Reading
  measured: Reading | PendingReading
  delta?: string
  note?: Rich
}

export const pageTitle = 'Smart Solar | Điện mặt trời áp mái cho nhà ở'

export const header = {
  offer: 'Trọn gói',
  faq: 'Câu hỏi thường gặp',
  login: 'Đăng nhập',
  register: 'Đăng ký khảo sát',
  skip: 'Bỏ qua, tới nội dung chính',
}

export const hero = {
  title: 'Điện mặt trời áp mái cho nhà ở, bớt đúng phần điện đắt nhất trên hoá đơn',
  lede: 'Tiền điện sinh hoạt tính theo 6 bậc, dùng càng nhiều thì mỗi kWh càng đắt. Điện tấm pin làm ra được nhà bạn dùng trước, nên phần phải mua từ lưới giảm từ bậc giá cao nhất.',
  cta: 'Đăng ký khảo sát mái nhà',
  hasAccount: 'Đã có tài khoản?',
  login: 'Đăng nhập',
}

/* Bậc thang giá điện ở màn đầu. Hai thanh kéo là số của người xem, không phải cam kết sản lượng. */
export const tariff = {
  useLabel: 'Nhà bạn dùng mỗi tháng',
  useMin: 50,
  useMax: 1000,
  defaultUse: 450,
  solarLabel: 'Điện tấm pin thay mỗi tháng',
  defaultSolar: 200,
  chartTitle: 'Biểu giá điện sinh hoạt, đồng/kWh',
  legend: { grid: 'Mua từ lưới', solar: 'Tấm pin thay', unused: 'Chưa dùng tới' },
  noSolar: 'Kéo thanh thứ hai để xem phần điện nào được thay.',
  caveat:
    'Số kWh tấm pin thay được tuỳ công suất hệ thống, hướng mái và giờ nhà bạn dùng điện; kỹ thuật viên tính con số này sau khảo sát. Tiền điện tính theo biểu giá, chưa gồm VAT.',
  tableToggle: 'Xem biểu giá 6 bậc',
  tableHead: ['Bậc', 'Mức dùng trong tháng', 'đ/kWh'] as const,
  sourcePrefix: 'Nguồn:',
}

export const offer = {
  id: 'tron-goi',
  title: 'Trọn gói gồm thiết bị, thi công, thủ tục và bảo hành',
  photo: 'hệ thống đã lắp trên mái một nhà ở thật, thấy cả dàn tấm và mép mái',
  items: [
    { k: 'Tấm pin', v: { need: 'hãng, model và công suất' } },
    { k: 'Inverter', v: { need: 'hãng và model' } },
    { k: 'Khung, ray, chân đế', v: ['Theo loại mái, kèm vật tư chống thấm. ', { need: 'quy cách' }] },
    { k: 'Dây và tủ điện AC/DC', v: { need: 'quy cách' } },
    { k: 'Thi công', v: 'Kỹ thuật viên đo mái trước khi báo giá; nhật ký và ảnh từng ngày thi công nằm trong tài khoản.' },
    { k: 'Thủ tục', v: ['Hồ sơ thông báo lắp đặt theo Mẫu 01. ', { need: 'xác nhận Smart Solar làm hộ khách' }] },
    { k: 'Bảo hành', v: [{ need: 'thời hạn cho thiết bị và thi công' }, ' Gửi yêu cầu kèm ảnh ngay trong tài khoản.'] },
    { k: 'Tài khoản khách hàng', v: 'Báo giá, tiến độ thi công và sổ bảo hành xem được trên web.' },
  ] satisfies { k: string; v: Rich }[],
}

export const fit = {
  id: 'phu-hop',
  title: 'Nhà dùng trên 200 kWh mỗi tháng đang trả từ 2.998 đ cho mỗi kWh vượt mức',
  points: [
    {
      lead: 'Tiền điện',
      text: 'Từ kWh thứ 201 trong tháng, mỗi kWh giá 2.998 đến 3.460 đ. Nhà dùng càng nhiều, phần tấm pin thay càng rơi vào các bậc này.',
    },
    {
      lead: 'Giờ dùng điện',
      text: 'Tấm pin chỉ làm ra điện ban ngày. Nhà chạy điều hoà, bơm nước hay làm việc tại nhà vào ban ngày thì tự dùng được nhiều hơn.',
    },
    {
      lead: 'Mái nhà',
      text: [
        { need: 'loại mái nhận lắp và diện tích mặt mái tối thiểu' },
        ' Mặt mái bị cây hay nhà bên che nhiều giờ trong ngày thì làm ra ít điện hơn.',
      ],
    },
  ] satisfies { lead: string; text: Rich }[],
  more: 'Chưa chắc nhà mình hợp? Khảo sát sơ bộ trả lời câu này cho riêng nhà bạn.',
}

/*
  Điểm khác biệt, xếp theo mức quan trọng với người mua (tiền → hỏng hóc → thi công → số đo),
  không theo thứ tự thời gian của dự án.
*/
export const proof = {
  id: 'khac-biet',
  title: 'Những thứ Smart Solar cho bạn xem, thay vì chỉ nói qua điện thoại',
  quote: {
    title: 'Biết trước từng khoản tiền',
    text: 'Báo giá ghi tên, quy cách và số lượng từng thiết bị, tách riêng tiền công.',
    screen: 'Màn Báo giá trong tài khoản khách hàng',
    columns: ['Hạng mục', 'Quy cách', 'Số lượng'] as const,
    rows: [
      { item: 'Tấm pin', spec: { need: 'model và công suất tấm' }, qty: '21 tấm' },
      { item: 'Inverter', spec: { need: 'model inverter' }, qty: '1 bộ' },
      { item: 'Khung nhôm và ray', spec: 'Cho 2 dàn', qty: '1 bộ' },
      { item: 'Công lắp đặt', spec: '2 dàn, 3 ngày', qty: '1 gói' },
    ] satisfies { item: string; spec: Copy; qty: string }[],
    total: { label: 'Tổng', value: { need: 'đơn giá tham khảo có nguồn' } as Need },
  },
  warranty: {
    title: 'Hỏng hóc có phiếu, có ảnh và ghi rõ ai chịu chi phí',
    text: 'Gửi yêu cầu kèm ảnh trong tài khoản; phiếu lưu ảnh trước và sau khi sửa.',
    screen: 'Màn Bảo hành',
    coverage: [
      { k: 'Phiếu BH-0412', v: 'Kẹp biên lỏng ở mép dàn phía đông' },
      { k: 'Trạng thái', v: 'Đã xử lý ngày 24/09/2026' },
      { k: 'Bảo hành thi công', v: ['Smart Solar, đến ', { need: 'thời hạn' }] },
      { k: 'Chi phí', v: { need: 'điều khoản bảo hành' } },
    ] satisfies { k: string; v: Rich }[],
  },
  build: {
    title: 'Thấy thợ làm gì trên mái mỗi ngày',
    text: 'Mỗi ngày thi công có nhật ký, ảnh và số tấm đã lắp.',
    screen: 'Màn Dự án',
    logTitle: 'Nhật ký thi công, 15/07/2026',
    log: [
      { k: 'Đã xong', v: 'Ray và chân đế cho hai dàn' },
      { k: 'Ghi chú', v: 'Mưa từ 15:00, phần đã lắp được che bạt' },
    ],
    progress: { done: 14, total: 21, label: '14 trên 21 tấm đã lắp' },
  },
  survey: {
    title: 'Số đo mái được kiểm lại trước khi báo giá',
    text: 'Bạn khai kích thước mái khi đăng ký; kỹ thuật viên lên mái đo lại và ghi chênh lệch, nên báo giá tính theo mái thật.',
    pair: {
      quantity: 'Diện tích mái lắp được',
      declared: { value: '90', unit: 'm²', by: 'Bạn khai khi đăng ký' },
      measured: { value: '85,4', unit: 'm²', by: 'Kỹ thuật viên đo tại mái, 10/06/2026' },
      delta: '−4,6 m² (−5,1%)',
      note: 'Chừa lối đi và 0,6 m quanh chân bồn nước, nên 21 tấm được xếp thành hai dàn.',
    } satisfies PairContent,
  },
}

export const faq = {
  id: 'cau-hoi',
  title: 'Thủ tục, bán điện dư, hoàn vốn và loại mái',
  items: [
    {
      q: 'Điện dư có bán lại cho điện lực được không?',
      a: 'Theo Nghị định 243/2026/NĐ-CP ngày 26/06/2026, hộ gia đình ở nhà riêng lẻ được bán điện dư tối đa 50% sản lượng đo ở đầu ra inverter, theo giá điện năng thị trường bình quân của năm trước. Trang này không nêu con số giá.',
      source: {
        label: 'Báo Điện tử Chính phủ, 27/06/2026',
        host: 'baochinhphu.vn',
        href: 'https://baochinhphu.vn/dien-mat-troi-mai-nha-nang-ty-le-san-luong-dien-du-duoc-phep-ban-len-toi-50-102260627163140525.htm',
      },
    },
    {
      q: 'Bao lâu thì hoàn vốn?',
      a: [
        'Tuỳ giá hệ thống và số kWh tấm pin thay được mỗi tháng; biểu đồ ở đầu trang cho thấy mỗi kWh đó đáng bao nhiêu tiền với nhà bạn. ',
        { need: 'cách Smart Solar tính thời gian hoàn vốn trong báo giá' },
      ],
    },
    {
      q: 'Lắp điện mặt trời trên mái nhà có phải xin phép không?',
      a: [
        'Nhà ở riêng lẻ lắp dưới 100 kW và không bán điện dư thì gửi thông báo theo Mẫu 01 tới Sở Công Thương, đơn vị điện lực, cơ quan quản lý xây dựng và cơ quan phòng cháy chữa cháy. Cục Điện lực hướng dẫn đây là thông báo, không phải xin phép. ',
        { need: 'Smart Solar có lập hồ sơ Mẫu 01 cho khách không' },
      ],
      source: {
        label: 'Nghị định 58/2025/NĐ-CP; hướng dẫn thông báo lắp đặt của Cục Điện lực',
        host: 'eav.gov.vn',
        href: 'https://www.eav.gov.vn/d/vi-VN/news-o/Huong-dan-thong-bao-lap-dat-dien-mat-troi-mai-nha-tu-san-tu-tieu-60-94-58705',
      },
    },
    {
      q: 'Mái tôn, mái ngói hay mái bằng có lắp được không, có bị dột không?',
      a: [
        { need: 'loại mái Smart Solar nhận lắp và cách xử lý chống thấm ở chân đế' },
        ' Khi lên mái đo, kỹ thuật viên ghi kiểu mái, vật cản và tình trạng mái vào phiếu khảo sát.',
      ],
    },
    {
      q: 'Ước tính trên web khác báo giá thế nào?',
      a: 'Ước tính tính từ số bạn khai và chỉ để tham khảo. Báo giá lập sau khi kỹ thuật viên đo lại mái, ghi tên từng thiết bị, số lượng và tiền công.',
    },
  ] satisfies { q: string; a: Rich; source?: { label: string; host: string; href: string } }[],
  sourcePrefix: 'Nguồn:',
}

/* Bốn phần của form khảo sát sơ bộ – theo STEP_SCHEMAS trong src/pages/customer/assessment-page.tsx. */
export const start = {
  id: 'dang-ky',
  title: 'Để khảo sát sơ bộ, bạn cần địa chỉ, kích thước mái và một ảnh mái',
  items: [
    'Địa chỉ, loại nhà và tuổi mái',
    // U+2060 (word joiner) sau dấu gạch nối giữ khoảng số trên một dòng.
    'Kích thước một mặt mái: dài, rộng, độ nghiêng (0–⁠60°) và hướng (0–⁠360°)',
    'Ít nhất một ảnh chụp mái',
    'Xác nhận bạn là chủ nhà hoặc người được chủ nhà uỷ quyền',
  ],
  cta: 'Đăng ký khảo sát mái nhà',
  emailNote: 'Cần xác minh email trước khi mở form khảo sát.',
  after: 'Gửi xong, kỹ thuật viên hẹn ngày lên mái đo và báo giá được gửi vào tài khoản.',
  hasAccount: 'Đã có tài khoản?',
  login: 'Đăng nhập',
}

export const footer = {
  brand: 'Smart Solar',
  legal: { need: 'tên pháp nhân, địa chỉ, hotline hoặc Zalo' } as Need,
  sampleNote: 'Tiền điện tính theo biểu giá EVN; các màn tài khoản trên trang dùng dữ liệu minh hoạ.',
  copyright: '© 2026 Smart Solar',
}
