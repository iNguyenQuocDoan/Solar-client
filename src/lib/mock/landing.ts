/*
 * Nội dung trang chủ công khai "/" (brief: docs/design/landing-brief.md).
 *
 * Mọi con số là dữ liệu minh hoạ của MỘT căn nhà mẫu dùng xuyên trang: nhà phố mái tôn,
 * 85,4 m² đo lại, 21 tấm xếp hai dàn, khảo sát 10/06/2026, thi công 14–16/07/2026,
 * phiếu bảo hành 22/09/2026. Không có tên, địa chỉ hay số điện thoại của người thật.
 *
 * `{ need }` đánh dấu chỗ chưa có dữ kiện thật; trang hiện nó dạng [CẦN: …] cho tới khi có nguồn.
 */

export type Need = { need: string }
export type Copy = string | Need
export type Rich = Copy | Copy[]

export const SAMPLE_LABEL = 'Dữ liệu minh hoạ'

export type Reading = { value: string; unit?: string; by: string }
export type PendingReading = { pending: string; by: string }

export type PairContent = {
  quantity: string
  declared: Reading
  measured: Reading | PendingReading
  delta?: string
  note?: Rich
}

export type PhotoReading = { photo: string; by: string }

export const pageTitle = 'Smart Solar | Điện mặt trời áp mái cho nhà ở'

export const header = {
  faq: 'Câu hỏi thường gặp',
  login: 'Đăng nhập',
  register: 'Tạo tài khoản',
  skip: 'Bỏ qua, tới nội dung chính',
}

export const hero = {
  title: 'Điện mặt trời áp mái cho nhà ở, lắp theo số đo được kiểm lại trên mái',
  lede: 'Bạn khai kích thước mái khi đăng ký. Trước khi báo giá, kỹ thuật viên lên mái đo lại, ghi chênh lệch và cách xử lý.',
  pair: {
    quantity: 'Diện tích mái lắp được',
    declared: { value: '90', unit: 'm²', by: 'Bạn khai khi đăng ký' },
    measured: { value: '85,4', unit: 'm²', by: 'Kỹ thuật viên đo tại mái, 10/06/2026' },
    delta: '−4,6 m² (−5,1%)',
    note: 'Chừa lối đi và 0,6 m quanh chân bồn nước, nên 21 tấm được xếp thành hai dàn.',
  } satisfies PairContent,
  cta: 'Tạo tài khoản để khảo sát mái nhà',
  hasAccount: 'Đã có tài khoản?',
  login: 'Đăng nhập',
}

export const survey = {
  title: 'Mỗi số bạn khai về mái được đo lại tại chỗ, ghi chênh lệch và cách xử lý',
  pairs: [
    {
      quantity: 'Độ nghiêng mái',
      declared: { value: '15', unit: '°', by: 'Bạn ước lượng' },
      measured: { value: '11', unit: '°', by: 'Đo bằng máy đo nghiêng' },
      delta: '−4°',
      note: 'Giữ theo độ dốc của mái tôn, không làm khung nâng góc.',
    },
    {
      quantity: 'Hướng mặt mái',
      declared: { value: 'Nam', by: 'Bạn khai' },
      measured: { value: 'Nam lệch Đông 21°', by: 'Đo bằng la bàn tại mái' },
      delta: 'Lệch 21°',
      note: 'Không đổi cách bố trí tấm.',
    },
    {
      quantity: 'Vật cản trên mái',
      declared: { value: 'Không có', by: 'Bạn khai' },
      measured: { value: 'Bồn nước inox, ống thông hơi', by: 'Kỹ thuật viên ghi tại mái' },
      delta: 'Thêm 2 vật cản',
      note: 'Chừa 0,6 m quanh chân bồn nước; ống thông hơi nằm trong phần chừa mép mái.',
    },
  ] satisfies PairContent[],
  photo: 'kỹ thuật viên đặt thước đo góc trên mặt mái tôn, thấy rõ số đọc; ảnh công trình thật, có đồng ý của chủ nhà',
  record: 'Phiếu khảo sát do kỹ thuật viên lập tại mái, 10/06/2026.',
}

export const quote = {
  title: 'Báo giá ghi tên từng thiết bị, số lượng và tiền công, lập theo số đo tại mái',
  pair: {
    quantity: 'Số tấm pin',
    declared: { value: '24', unit: 'tấm', by: 'Ước tính từ số bạn khai' },
    measured: { value: '21', unit: 'tấm', by: 'Báo giá theo số đo lại' },
    delta: '−3 tấm',
    note: 'Bồn nước và lối đi chiếm chỗ ba tấm; dàn thứ hai có dòng ray và công riêng.',
  } satisfies PairContent,
  screen: 'Màn Báo giá trong tài khoản khách hàng',
  columns: ['Hạng mục', 'Quy cách', 'Số lượng'] as const,
  rows: [
    { item: 'Tấm pin', spec: { need: 'model và công suất tấm' }, qty: '21 tấm' },
    { item: 'Inverter', spec: { need: 'model inverter' }, qty: '1 bộ' },
    { item: 'Khung nhôm và ray', spec: 'Cho 2 dàn', qty: '1 bộ' },
    { item: 'Chân đế và vật tư chống thấm', spec: { need: 'quy cách theo loại mái' }, qty: 'Theo 2 dàn' },
    { item: 'Dây điện, tủ điện AC/DC', spec: { need: 'quy cách dây và tủ' }, qty: '1 bộ' },
    { item: 'Công lắp đặt', spec: '2 dàn, 3 ngày', qty: '1 gói' },
  ] satisfies { item: string; spec: Copy; qty: string }[],
  /** Mobile chỉ hiện số dòng này, phần còn lại gom vào một dòng tóm tắt. */
  mobileRows: 3,
  moreRows: (n: number) => `Và ${n} hạng mục khác trong báo giá`,
  total: { label: 'Tổng', value: { need: 'đơn giá tham khảo có nguồn' } as Need },
  caption: 'Ước tính chỉ để tham khảo. Báo giá lập sau khi kỹ thuật viên đo mái và ghi tên từng thiết bị.',
}

export const build = {
  title: 'Ngày thợ lên mái nào, tài khoản có nhật ký và ảnh của ngày đó',
  pair: {
    quantity: 'Số tấm lắp ngày 15/07/2026',
    declared: { value: '21', unit: 'tấm', by: 'Lịch đã báo bạn' },
    measured: { value: '14', unit: 'tấm', by: 'Nhật ký cuối ngày' },
    delta: '−7 tấm',
    note: 'Mưa từ 15:00; 7 tấm còn lại lắp sáng hôm sau. 14 tấm đã lắp được đo điện áp và che bạt.',
  } satisfies PairContent,
  screen: 'Màn Dự án trong tài khoản khách hàng',
  logTitle: 'Nhật ký thi công, 15/07/2026',
  log: [
    { k: 'Đã xong', v: 'Ray và chân đế cho hai dàn; 14 tấm bắt lên ray' },
    { k: 'Đang làm', v: 'Đi dây DC cho dàn thứ nhất' },
    { k: 'Ghi chú', v: 'Mưa từ 15:00, phần đã lắp được che bạt' },
    { k: 'Người ghi', v: 'Trưởng nhóm thi công' },
  ],
  progress: { done: 14, total: 21, label: '14 trên 21 tấm đã lắp' },
  photos: [
    'chân đế bắt vào xà gồ, đã trám keo chống thấm, chụp cận',
    'hai dàn tấm lúc cuối ngày 15/07/2026',
  ],
}

export const warranty = {
  title: 'Hỏng hóc thì gửi phiếu trong tài khoản; phiếu giữ ảnh trước, ảnh sau khi sửa và ghi ai chịu chi phí',
  pair: {
    quantity: 'Chỗ báo lỗi: mép dàn phía đông',
    declared: { photo: 'khe hở ở mép dàn phía đông, chủ nhà chụp khi gửi phiếu', by: 'Ảnh bạn gửi, 22/09/2026' },
    measured: { photo: 'cùng vị trí sau khi siết lại kẹp biên', by: 'Ảnh kỹ thuật viên chụp sau khi sửa, 24/09/2026' },
    delta: 'Cùng vị trí',
    note: 'Kẹp biên lỏng; đã siết lại và kiểm tra các kẹp còn lại của hàng đó.',
  },
  screen: 'Màn Bảo hành trong tài khoản khách hàng',
  coverage: [
    { k: 'Tấm pin', v: ['Bảo hành bởi ', { need: 'hãng hay Smart Solar' }, ', đến ', { need: 'ngày hết hạn' }] },
    { k: 'Inverter', v: ['Bảo hành bởi ', { need: 'hãng hay Smart Solar' }, ', đến ', { need: 'ngày hết hạn' }] },
    { k: 'Thi công và chống thấm', v: ['Smart Solar, đến ', { need: 'thời hạn bảo hành thi công' }] },
    { k: 'Phiếu BH-0412', v: 'Đã xử lý ngày 24/09/2026' },
    { k: 'Chi phí', v: { need: 'điều khoản: phần nào trong bảo hành, phần nào chủ nhà trả' } },
  ] satisfies { k: string; v: Rich }[],
}

export const faq = {
  id: 'cau-hoi',
  title: 'Thủ tục, bán điện dư và loại mái nhận lắp',
  items: [
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
      q: 'Điện dư có bán lại cho điện lực được không?',
      a: 'Theo Nghị định 243/2026/NĐ-CP ngày 26/06/2026, hộ gia đình ở nhà riêng lẻ được bán điện dư tối đa 50% sản lượng đo ở đầu ra inverter, theo giá điện năng thị trường bình quân của năm trước. Trang này không nêu con số giá.',
      source: {
        label: 'Báo Điện tử Chính phủ, 27/06/2026',
        host: 'baochinhphu.vn',
        href: 'https://baochinhphu.vn/dien-mat-troi-mai-nha-nang-ty-le-san-luong-dien-du-duoc-phep-ban-len-toi-50-102260627163140525.htm',
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
  title: 'Chuẩn bị bốn nhóm thông tin là gửi được khảo sát sơ bộ',
  items: [
    'Địa chỉ, loại nhà và tuổi mái',
    // U+2060 (word joiner) sau dấu gạch nối giữ khoảng số trên một dòng.
    'Kích thước một mặt mái: dài, rộng, độ nghiêng (0–\u206060°) và hướng (0–\u2060360°)',
    'Ít nhất một ảnh chụp mái',
    'Xác nhận bạn là chủ nhà hoặc người được chủ nhà uỷ quyền',
  ],
  pair: {
    quantity: 'Diện tích mái lắp được',
    declared: { value: '…', unit: 'm²', by: 'Số bạn sẽ khai' },
    measured: { pending: 'Chưa đo', by: 'Kỹ thuật viên ghi sau buổi hẹn' },
  } satisfies PairContent,
  cta: 'Tạo tài khoản để khảo sát mái nhà',
  emailNote: 'Cần xác minh email trước khi mở form khảo sát.',
  after: 'Gửi xong, yêu cầu được xem xét, kỹ thuật viên hẹn ngày lên mái đo, rồi báo giá được gửi vào tài khoản.',
  hasAccount: 'Đã có tài khoản?',
  login: 'Đăng nhập',
}

export const footer = {
  brand: 'Smart Solar',
  legal: { need: 'tên pháp nhân, địa chỉ, hotline hoặc Zalo' } as Need,
  sampleNote: 'Số liệu trên trang là dữ liệu minh hoạ của giao diện tài khoản.',
  copyright: '© 2026 Smart Solar',
}
