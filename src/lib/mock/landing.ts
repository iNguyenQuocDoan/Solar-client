/*
 * Nội dung trang chủ công khai "/" – bản "Điện nhà làm".
 *
 * Trang chia theo chủ đề chủ nhà quan tâm (thương hiệu, điện ban ngày, luật, thiết bị, giấy tờ,
 * nguyên tắc), KHÔNG theo khâu dịch vụ: đảo thứ tự các section thì trang vẫn đọc được.
 * Số duy nhất không phải minh hoạ là hai con số của luật, có dòng nguồn. Khối màn tài khoản và cặp
 * số đo dùng dữ liệu minh hoạ của MỘT căn nhà mẫu (21 tấm, hai dàn, năm 2026); không có tên, địa
 * chỉ, SĐT thật.
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

export type Source = { label: string; host: string; href: string }

/*
  Ảnh thật của trang: đặt file tên `<file>.jpg` (hoặc .png, .webp) vào public/images/landing/ là
  ảnh hiện lên, không phải sửa code. Chưa có file thì khung hiện [CẦN ẢNH: need].
*/
export type Photo = { file: string; alt: string; need: string }

export const pageTitle = 'Smart Solar | Điện nhà làm – điện mặt trời áp mái cho nhà ở'

export const header = {
  equipment: 'Thiết bị',
  faq: 'Câu hỏi thường gặp',
  login: 'Đăng nhập',
  register: 'Đăng ký khảo sát',
  skip: 'Bỏ qua, tới nội dung chính',
}

export const hero = {
  // Hai dòng cố ý: "Điện" / "nhà làm." – ngắt đúng cụm "nhà làm" (như "cơm nhà nấu").
  title: ['Điện', 'nhà làm.'] as const,
  lede: 'Điện mặt trời áp mái cho nhà ở. Nắng trên mái nhà bạn thành điện cho chính nhà bạn dùng.',
  cta: 'Đăng ký khảo sát mái nhà',
  hasAccount: 'Đã có tài khoản?',
  login: 'Đăng nhập',
  drawing:
    'Bản vẽ mặt cắt một căn nhà ống bốn tầng: trên sân thượng có mái tôn lắp tấm pin quay về phía nắng, bồn nước inox trên tum thang, dây điện từ tấm pin xuống inverter rồi tới tủ điện ở tầng trệt.',
}

export const daytime = {
  id: 'ban-ngay',
  statement: 'Điện làm ra lúc trời nắng được dùng ngay trong nhà: máy lạnh buổi trưa, tủ lạnh, máy bơm nước.',
  note: 'Tấm pin chỉ làm ra điện ban ngày. Tối đến, nhà dùng điện lưới như bình thường.',
  photo: {
    file: 'ban-ngay',
    alt: 'Sân thượng một nhà phố lúc trưa, dàn pin trên mái tôn, bồn nước và mái các nhà xung quanh',
    need: 'sân thượng một nhà phố lúc trưa, dàn pin trên mái tôn, thấy bồn nước và mái các nhà xung quanh; chụp tại công trình thật',
  } satisfies Photo,
}

/* Hai con số có văn bản gốc. Không nêu giá bán điện dư: văn bản không cho một con số cố định. */
export const law = {
  id: 'luat',
  title: 'Hai con số trong luật nên biết trước khi lắp',
  items: [
    {
      figure: '50',
      unit: '%',
      text: 'Phần điện dư tối đa hộ gia đình ở nhà riêng lẻ được bán lại cho điện lực, tính trên sản lượng đo ở đầu ra inverter, theo giá điện năng thị trường bình quân của năm trước.',
      source: {
        label: 'Nghị định 243/2026/NĐ-CP ngày 26/06/2026, theo Báo Điện tử Chính phủ',
        host: 'baochinhphu.vn',
        href: 'https://baochinhphu.vn/dien-mat-troi-mai-nha-nang-ty-le-san-luong-dien-du-duoc-phep-ban-len-toi-50-102260627163140525.htm',
      },
    },
    {
      figure: '100',
      unit: 'kW',
      text: 'Nhà ở riêng lẻ lắp dưới mức công suất này và không bán điện dư thì chỉ gửi thông báo theo Mẫu 01, không phải xin phép.',
      source: {
        label: 'Nghị định 58/2025/NĐ-CP; hướng dẫn thông báo lắp đặt của Cục Điện lực',
        host: 'eav.gov.vn',
        href: 'https://www.eav.gov.vn/d/vi-VN/news-o/Huong-dan-thong-bao-lap-dat-dien-mat-troi-mai-nha-tu-san-tu-tieu-60-94-58705',
      },
    },
  ] satisfies { figure: string; unit: string; text: string; source: Source }[],
  sourcePrefix: 'Nguồn:',
}

export const equipment = {
  id: 'thiet-bi',
  title: 'Những gì được lắp trên mái nhà bạn',
  items: [
    {
      name: 'Tấm pin',
      text: 'Biến nắng thành điện một chiều.',
      spec: { need: 'hãng, model và công suất tấm' } as Need,
      photo: {
        file: 'tam-pin',
        alt: 'Dàn tấm pin trên mái tôn một nhà ở, chụp chéo từ mép mái',
        need: 'dàn tấm pin trên mái tôn một nhà ở thật, chụp chéo từ mép mái, thấy khung và khe giữa các tấm',
      } satisfies Photo,
    },
    {
      name: 'Inverter',
      text: 'Đổi điện một chiều từ tấm pin thành điện xoay chiều cho nhà dùng.',
      spec: { need: 'hãng và model' } as Need,
      photo: {
        file: 'inverter',
        alt: 'Inverter treo trên tường tum thang, có ống luồn dây',
        need: 'inverter treo trên tường tum thang hoặc hiên sân thượng, thấy màn hình và đường ống dây',
      } satisfies Photo,
    },
    {
      name: 'Chân đế và vật tư chống thấm',
      text: 'Chỗ khung bắt vào mái, cũng là chỗ phải xử lý chống thấm.',
      spec: { need: 'quy cách theo loại mái' } as Need,
      photo: {
        file: 'chan-de',
        alt: 'Chân đế khung pin bắt vào mái tôn, chụp cận phần chống thấm quanh bu lông',
        need: 'chân đế bắt vào mái tôn, chụp cận, thấy lớp keo hoặc gioăng quanh bu lông',
      } satisfies Photo,
    },
  ],
  also: {
    label: 'Cùng với',
    items: [['Khung nhôm và ray'], ['Dây điện và tủ điện AC/DC, ', { need: 'quy cách' }]] satisfies Copy[][],
  },
}

/*
  Giấy tờ trong tài khoản. Ba ý xếp theo thứ chủ nhà cần lâu nhất (bảo hành trước), không theo
  thời gian của dự án. Hai khung màn dựng bằng primitive thật của portal, dữ liệu minh hoạ.
*/
export const papers = {
  id: 'tai-khoan',
  title: 'Giấy tờ của hệ thống không nằm trong ngăn kéo',
  points: [
    'Sổ bảo hành theo từng thiết bị; hỏng thì gửi phiếu kèm ảnh ngay trong tài khoản.',
    'Báo giá ghi tên, quy cách và số lượng từng thiết bị, tách riêng tiền công.',
    'Mỗi ngày thi công có nhật ký và ảnh.',
  ],
  warranty: {
    screen: 'Màn Bảo hành',
    rows: [
      { k: 'Tấm pin', v: ['Bảo hành bởi ', { need: 'hãng hay Smart Solar' }] },
      { k: 'Inverter', v: ['Bảo hành bởi ', { need: 'hãng hay Smart Solar' }] },
      {
        k: 'Thi công và chống thấm',
        v: ['Smart Solar, đến ', { need: 'thời hạn' }],
      },
      {
        k: 'Phiếu BH-0412',
        v: 'Kẹp biên lỏng ở mép dàn phía đông; đã xử lý ngày 24/09/2026',
      },
    ] satisfies { k: string; v: Rich }[],
  },
  quote: {
    screen: 'Màn Báo giá',
    columns: ['Hạng mục', 'Quy cách', 'Số lượng'] as const,
    rows: [
      { item: 'Tấm pin', spec: { need: 'model và công suất' }, qty: '21 tấm' },
      { item: 'Inverter', spec: { need: 'model' }, qty: '1 bộ' },
      { item: 'Khung nhôm và ray', spec: 'Cho 2 dàn', qty: '1 bộ' },
      { item: 'Công lắp đặt', spec: '2 dàn, 3 ngày', qty: '1 gói' },
    ] satisfies { item: string; spec: Copy; qty: string }[],
    total: {
      label: 'Tổng',
      value: { need: 'đơn giá tham khảo có nguồn' } as Need,
    },
  },
}

export const principle = {
  id: 'nguyen-tac',
  title: 'Không báo giá theo số ước lượng.',
  text: 'Bạn khai kích thước mái khi đăng ký. Kỹ thuật viên lên mái đo lại và ghi chênh lệch, rồi báo giá mới tính theo mái thật.',
  pair: {
    quantity: 'Diện tích mái lắp được',
    declared: { value: '90', unit: 'm²', by: 'Bạn khai khi đăng ký' },
    measured: { value: '85,4', unit: 'm²', by: 'Kỹ thuật viên đo tại mái' },
    delta: '−4,6 m² (−5,1%)',
    note: 'Chừa lối đi và 0,6 m quanh chân bồn nước, nên 21 tấm được xếp thành hai dàn.',
  } satisfies PairContent,
}

type FaqItem = { q: string; a: Rich; source?: Source }

const faqItems: FaqItem[] = [
  {
    q: 'Mái tôn, mái ngói hay mái bằng có lắp được không, có bị dột không?',
    a: [
      {
        need: 'loại mái Smart Solar nhận lắp và cách xử lý chống thấm ở chân đế',
      },
      ' Khi lên mái đo, kỹ thuật viên ghi kiểu mái, vật cản và tình trạng mái vào phiếu khảo sát.',
    ],
  },
  {
    q: 'Hỏng thì ai lo?',
    a: [
      'Yêu cầu bảo hành gửi kèm ảnh ngay trong tài khoản; phiếu lưu ảnh trước và sau khi sửa. ',
      {
        need: 'điều khoản: thiết bị nào do hãng bảo hành, phần nào Smart Solar chịu, phần nào chủ nhà trả',
      },
    ],
  },
  {
    q: 'Bao lâu thì hoàn vốn?',
    a: [
      'Tuỳ giá hệ thống, lượng điện nhà bạn dùng ban ngày và bậc giá điện nhà bạn đang trả. ',
      { need: 'cách Smart Solar tính thời gian hoàn vốn trong báo giá' },
    ],
  },
  {
    q: 'Ước tính trên web khác báo giá thế nào?',
    a: 'Ước tính tính từ số bạn khai và chỉ để tham khảo. Báo giá lập sau khi kỹ thuật viên đo lại mái, ghi tên từng thiết bị, số lượng và tiền công.',
  },
  {
    // Theo STEP_SCHEMAS của form thật (src/pages/customer/assessment-page.tsx).
    q: 'Đăng ký khảo sát cần chuẩn bị gì?',
    a: 'Địa chỉ, loại nhà và tuổi mái; kích thước một mặt mái (dài, rộng, độ nghiêng, hướng); ít nhất một ảnh chụp mái; và xác nhận bạn là chủ nhà hoặc người được chủ nhà uỷ quyền. Cần xác minh email trước khi mở form.',
  },
]

export const faq = {
  id: 'cau-hoi',
  title: 'Câu hỏi thường gặp',
  items: faqItems,
  sourcePrefix: 'Nguồn:',
}

export const closing = {
  id: 'dang-ky',
  title: 'Mái nhà bạn lắp được bao nhiêu tấm?',
  text: 'Đăng ký, gửi kích thước và ảnh một mặt mái. Kỹ thuật viên lên mái đo rồi mới báo giá.',
  cta: 'Đăng ký khảo sát mái nhà',
  hasAccount: 'Đã có tài khoản?',
  login: 'Đăng nhập',
}

export const footer = {
  brand: 'Smart Solar',
  legal: { need: 'tên pháp nhân, địa chỉ, hotline hoặc Zalo' } as Need,
  sampleNote: 'Các màn tài khoản và số đo trên trang là dữ liệu minh hoạ.',
  copyright: '© 2026 Smart Solar',
}
