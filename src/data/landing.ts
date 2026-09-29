/*
 * Nội dung trang chủ công khai "/" – website bán hàng của một công ty thi công điện mặt trời áp mái
 * cho DOANH NGHIỆP (nhà xưởng, kho bãi, toà nhà) (brief: docs/design/landing-brief.md, mục "Bản 4").
 *
 * Mỗi section trả lời một câu hỏi bán hàng: bạn là ai và làm gì → công trình trông thế nào → vì sao tin
 * → doanh nghiệp nhận được gì → theo dõi công trình ra sao → bắt đầu thế nào. Không bảng giá, không biểu
 * giá điện, không quy định pháp lý, không dashboard; giao diện hệ thống chỉ xuất hiện một lần.
 *
 * Ảnh: `src` có thì hiện ảnh, chưa có thì khung đúng tỷ lệ ghi "Ảnh cần bổ sung". Không chú thích ảnh như
 * công trình của Smart Solar khi chưa có ảnh thật. Lời khách và con số công ty chỉ hiện khi có dữ liệu thật.
 */

export type Shot = {
  src?: string
  srcSet?: string
  width?: number
  height?: number
  alt: string
  /** Mô tả ảnh cần chụp, hiện khi chưa có `src` */
  need: string
}

export const pageTitle = 'Smart Solar | Thi công điện mặt trời áp mái cho nhà xưởng và doanh nghiệp'

export const header = {
  projects: 'Công trình',
  capability: 'Năng lực thi công',
  login: 'Đăng nhập',
  register: 'Nhận khảo sát',
  skip: 'Bỏ qua, tới nội dung chính',
}

/* Bạn là ai, bạn làm gì. */
export const hero = {
  // U+00A0 giữ cụm từ (điện mặt trời, áp mái, nhà xưởng) trên một dòng khi tiêu đề xuống hàng.
  title: 'Thi công điện\u00a0mặt\u00a0trời áp\u00a0mái cho nhà\u00a0xưởng và doanh nghiệp',
  lede: 'Smart Solar khảo sát tận mái, lên phương án riêng cho từng công trình, lắp đặt bằng đội kỹ thuật của mình và bàn giao hệ thống chạy ổn định.',
  cta: 'Nhận khảo sát mái nhà xưởng',
  secondary: 'Xem công trình',
  // Ảnh do người dùng thả vào public/images/Hero.png; bản WebP sinh từ ảnh đó. Chưa xác nhận là công
  // trình của Smart Solar nên không chú thích tên, địa điểm hay công suất.
  photo: {
    src: '/images/hero-1672.webp',
    srcSet: '/images/hero-960.webp 960w, /images/hero-1672.webp 1672w',
    width: 1672,
    height: 941,
    alt: 'Mái nhà xưởng lớn phủ kín tấm pin mặt trời, nhìn từ trên cao',
    need: 'ảnh công trình thật của Smart Solar',
  } satisfies Shot,
}

export const statement = {
  lead: 'Mái nhà xưởng nắng suốt cả ngày làm việc.',
  rest: 'Chúng tôi biến phần mái đang bỏ trống thành nguồn điện cho chính nhà máy của bạn, lắp một lần và chạy nhiều năm.',
}

/* Công trình trông như thế nào. Chú thích chỉ nói loại công trình, không bịa địa điểm hay công suất. */
export const projects = {
  id: 'cong-trinh',
  title: 'Công trình trên mái nhà xưởng, kho bãi và toà nhà',
  // Ảnh tải từ báo và trang bán hàng, không phải công trình của Smart Solar; thay bằng ảnh công trình thật khi có.
  featured: {
    label: 'Nhà xưởng sản xuất',
    shot: {
      src: '/images/project-factory-934.webp',
      srcSet: '/images/project-factory-640.webp 640w, /images/project-factory-934.webp 934w',
      width: 934,
      height: 531,
      alt: 'Công nhân kiểm tra tấm pin mặt trời trên dây chuyền trong nhà xưởng',
      need: 'công trình nhà xưởng, chụp flycam cả mái',
    } satisfies Shot,
  },
  others: [
    {
      label: 'Kho logistics',
      shot: {
        src: '/images/project-warehouse-1280.webp',
        srcSet: '/images/project-warehouse-640.webp 640w, /images/project-warehouse-1280.webp 1280w',
        width: 1280,
        height: 960,
        alt: 'Các pallet tấm pin mặt trời xếp trong nhà kho',
        need: 'mái kho đã lắp, góc chéo thấy cả dàn',
      } satisfies Shot,
    },
    {
      label: 'Toà nhà văn phòng',
      shot: {
        src: '/images/project-office-1200.webp',
        srcSet: '/images/project-office-640.webp 640w, /images/project-office-1200.webp 1200w',
        width: 1200,
        height: 1337,
        alt: 'Toà văn phòng cao tầng mặt kính nhìn từ dưới lên',
        need: 'mái toà nhà đã lắp, chụp từ trên cao',
      } satisfies Shot,
    },
  ],
  beforeAfter: {
    caption: 'Cùng một mái nhà xưởng, trước và sau khi lắp',
    before: {
      src: '/images/roof-before-1672.webp',
      srcSet: '/images/roof-before-960.webp 960w, /images/roof-before-1672.webp 1672w',
      width: 1672,
      height: 941,
      alt: 'Mái tôn nhà xưởng còn trống, nhìn từ trên cao',
      need: 'mái nhà xưởng trước khi lắp',
    } satisfies Shot,
    after: {
      src: '/images/roof-after-1672.webp',
      srcSet: '/images/roof-after-960.webp 960w, /images/roof-after-1672.webp 1672w',
      width: 1672,
      height: 941,
      alt: 'Cùng mái nhà xưởng đã phủ các dãy tấm pin mặt trời',
      need: 'cùng góc chụp, sau khi lắp xong',
    } satisfies Shot,
  },
}

/* Vì sao tin: năng lực thi công. */
export const trust = {
  id: 'nang-luc',
  title: 'Đội kỹ thuật của Smart Solar tự khảo sát và tự lắp đặt',
  // Ảnh tải từ trang của đơn vị khác, không phải đội của Smart Solar; thay bằng ảnh đội mình khi có.
  photo: {
    // Cắt sẵn phần bên trái ảnh gốc về 4:5 cho khớp khung, giữ đủ nhóm kỹ thuật viên.
    src: '/images/trust-crew-1200.webp',
    srcSet: '/images/trust-crew-640.webp 640w, /images/trust-crew-1200.webp 1200w',
    width: 1200,
    height: 1500,
    alt: 'Kỹ thuật viên mặc áo phản quang, đội mũ bảo hộ đang lắp tấm pin trên mái tôn nhà xưởng',
    need: 'kỹ thuật viên đang thi công trên mái nhà xưởng, có đồ bảo hộ',
  } satisfies Shot,
  points: [
    { title: 'Khảo sát tận mái', text: 'Kỹ thuật viên lên mái đo diện tích, hướng, kết cấu và vật cản trước khi lên phương án cho công trình.' },
    { title: 'Thi công an toàn, gọn gàng', text: 'Đội lắp đặt làm việc có đồ bảo hộ, theo lịch thống nhất trước với doanh nghiệp.' },
    { title: 'Kiểm tra trước khi bàn giao', text: 'Từng phần việc có người ký xác nhận; hệ thống được đo kiểm trước khi đóng điện và bàn giao.' },
  ],
}

/* Doanh nghiệp nhận được gì. Lợi ích nói bằng lời, không kèm con số chưa có nguồn. */
export const benefits = {
  id: 'loi-ich',
  title: 'Doanh nghiệp nhận được gì',
  items: [
    { title: 'Giảm tiền điện ban ngày', text: 'Tấm pin làm ra điện đúng những giờ nhà xưởng chạy máy, nên phần điện phải mua từ lưới giảm xuống.' },
    { title: 'Tận dụng mái đang bỏ trống', text: 'Mái nhà xưởng, kho và toà nhà trở thành tài sản làm ra điện thay vì chỉ che nắng mưa.' },
    { title: 'Thêm nguồn điện sạch', text: 'Một phần điện của doanh nghiệp đến từ năng lượng mặt trời trên chính mái nhà mình.' },
  ],
  offerTitle: 'Trọn gói gồm thiết bị, lắp đặt và bảo hành',
  offer: [
    { title: 'Thiết bị', text: 'Tấm pin, inverter, khung, chân đế, dây và tủ điện, chọn theo quy mô và kết cấu mái.' },
    { title: 'Lắp đặt', text: 'Đội kỹ thuật của Smart Solar lắp, đấu nối và dọn sạch mái khi xong việc.' },
    { title: 'Bảo hành', text: 'Bảo hành thiết bị và phần lắp đặt; có sự cố, doanh nghiệp gửi yêu cầu kèm ảnh ngay trên web.' },
  ],
}

/* Theo dõi công trình: section duy nhất có giao diện hệ thống, và chỉ một thẻ gọn. */
export const tracking = {
  id: 'theo-doi',
  title: 'Theo dõi công trình trên web, không phải gọi điện hỏi',
  points: [
    'Phương án và báo giá xem lại được bất cứ lúc nào',
    'Tiến độ và ảnh công trình cập nhật mỗi ngày thi công',
    'Bảo hành và yêu cầu sửa chữa nằm cùng một chỗ',
  ],
  card: {
    label: 'Minh hoạ giao diện tài khoản',
    project: 'Công trình của bạn',
    stage: 'Đang lắp đặt',
    progress: { done: 14, total: 21, text: 'Đã xong 14 trên 21 hàng tấm' },
    update: { when: 'Hôm nay, 15:10', text: 'Xong khung và ray khu mái phía đông; bắt đầu lắp tấm khu phía tây.' },
    photo: {
      src: '/images/tracking-update-640.webp',
      width: 640,
      height: 426,
      alt: 'Hai kỹ thuật viên đội mũ bảo hộ đang lắp và đấu dây tấm pin trên mái',
      need: 'ảnh thi công trong ngày',
    } satisfies Shot,
    next: 'Đo kiểm và bàn giao dự kiến 17/07/2026',
  },
}

/* Social proof và con số công ty: chỉ render khi có dữ liệu thật. */
export const testimonials: { quote: string; name: string; place: string }[] = []
export const stats: { value: string; label: string; source: string }[] = []

/* Bắt đầu thế nào: một lời mời, không phải quy trình. */
export const cta = {
  id: 'dang-ky',
  title: 'Mái nhà xưởng của bạn lắp được bao nhiêu?',
  lede: 'Đăng ký khảo sát, kỹ thuật viên của Smart Solar hẹn lịch lên mái và gửi phương án riêng cho doanh nghiệp.',
  button: 'Nhận khảo sát mái nhà xưởng',
  hasAccount: 'Đã có tài khoản?',
  login: 'Đăng nhập',
}

export const footer = {
  brand: 'Smart Solar',
  copyright: '© 2026 Smart Solar',
}
