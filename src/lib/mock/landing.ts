/*
 * Nội dung trang chủ công khai – lấy nguyên văn tiếng Việt từ
 * design/stitch/stitch_smart_solar_customer_portal/landing_home/code.html.
 */

export type LandingLink = { label: string; href: string }

/** Khối 1 – Hero */
export const heroContent = {
  badge: 'Năng lượng xanh chuẩn châu Âu tại Việt Nam',
  title: 'Giải pháp điện mặt trời phù hợp cho ngôi nhà của bạn',
  description:
    'Cung cấp thông tin mái nhà cơ bản, nhận đánh giá sơ bộ tự động, xem các giải pháp công suất ước tính và kết nối đội ngũ chuyên viên khảo sát thực tế tận nơi.',
  primaryCta: 'Khảo sát mái nhà ngay',
  secondaryCta: 'Xem giải pháp',
  stats: [
    { value: '25+ Năm', label: 'Bảo hành hiệu suất' },
    { value: '4.200+', label: 'Mái nhà đã vận hành' },
    { value: '100%', label: 'Hợp chuẩn EVN' },
  ],
  image: {
    src: '/placeholders/villa-solar.svg',
    alt: 'Biệt thự hiện đại tại Việt Nam lắp tấm pin mặt trời đen trên mái dưới nắng sớm',
  },
  savingsOverlay: {
    icon: 'savings',
    label: 'Hiệu quả hóa đơn',
    value: 'Tiết kiệm 40% - 60%',
  },
  monitorOverlay: {
    title: 'Giám sát thông minh 24/7',
    realtimeLabel: 'Thời gian thực',
    metric: '4.8',
    metricUnit: 'kW hiện tại',
    dailyLabel: 'Sản lượng ngày',
    dailyValue: '28.4 kWh',
    progress: 78,
  },
} as const

/** Khối 2 – Khảo sát sơ bộ 3 bước */
export const surveySteps = {
  eyebrow: 'Trực tuyến tiện lợi',
  title: 'Khảo sát sơ bộ mái nhà trong 3 bước nhanh chóng',
  description:
    'Chỉ mất 2 phút để hoàn thiện thông tin và nhận gợi ý thông số kỹ thuật thích ứng tốt nhất với kết cấu mái của gia đình.',
  cta: 'Bắt đầu khảo sát',
  steps: [
    {
      number: '01',
      title: 'Cung cấp thông tin mái nhà',
      description:
        'Địa chỉ công trình, diện tích ước tính (~m²), hướng đón nắng, góc nghiêng và tải lên ảnh chụp hiện trạng mái tôn, ngói hoặc bê tông.',
    },
    {
      number: '02',
      title: 'Nhận đánh giá sơ bộ',
      description:
        'Thuật toán phân tích bức xạ mặt trời địa phương tính toán độ che phủ, khả năng lắp đặt và cấu hình công suất kWp tối ưu tham khảo.',
    },
    {
      number: '03',
      title: 'Nhận tư vấn & báo giá',
      description:
        'Kỹ sư Smart Solar liên hệ xác nhận, tiến hành đo đạc thực địa và gửi phương án thiết kế 3D kèm bảng kê chi phí trọn gói rõ ràng.',
    },
  ],
} as const

/** Khối 3 – Lợi ích */
export const benefits = {
  eyebrow: 'Giá trị thực tế',
  title: 'Lợi ích vượt trội cùng Smart Solar',
  description:
    'Được thiết kế để mang lại sự an tâm tuyệt đối từ hiệu suất sản xuất điện đến độ bền vững của cấu trúc ngôi nhà.',
  items: [
    {
      icon: 'account_balance_wallet',
      title: 'Tiết kiệm chi phí điện',
      description:
        'Cắt giảm lũy tiến bậc thang tiền điện sinh hoạt, đặc biệt hiệu quả trong các khung giờ cao điểm ban ngày khi gia đình sử dụng điều hòa.',
    },
    {
      icon: 'architecture',
      title: 'Giải pháp phù hợp từng mái',
      description:
        'Khảo sát hướng gió, góc đổ bóng và khả năng chịu tải trọng để lên kết cấu khung giàn nhôm anodized tiêu chuẩn bền bỉ không dột thấm.',
    },
    {
      icon: 'fact_check',
      title: 'Quy trình minh bạch',
      description:
        'Báo giá rõ ràng từng hạng mục vật tư, phụ kiện đấu nối, thủ tục thỏa thuận đấu nối với Điện lực địa phương không phát sinh chi phí ẩn.',
    },
    {
      icon: 'devices',
      title: 'Theo dõi tiến độ trực tuyến',
      description:
        'Cổng thông tin khách hàng giúp bạn kiểm tra từng mốc: phê duyệt hồ sơ, giao nhận vật tư, tiến độ thi công và biên bản thử nghiệm.',
    },
    {
      icon: 'verified_user',
      title: 'Bảo hành rõ ràng',
      description:
        'Bảo hành vật lý tấm pin 12 - 25 năm, bảo hành hiệu suất tuyến tính 25 năm đạt trên 84.8%, biến tần bảo hành chính hãng từ 5 - 10 năm.',
    },
    {
      icon: 'home_repair_service',
      title: 'Hỗ trợ bảo trì lâu dài',
      description:
        'Dịch vụ vệ sinh tấm quang điện định kỳ, kiểm tra siết bulong giàn đỡ, tầm soát nhiệt điểm nóng (hotspot) định kỳ chống suy hao sản lượng.',
    },
  ],
} as const

/** Khối 4 – Gói giải pháp */
export const packages = {
  eyebrow: 'Cấu hình tiêu biểu',
  title: 'Gói giải pháp điện mặt trời tiêu biểu',
  description:
    'Được phân loại theo nhu cầu chi tiêu tiền điện hàng tháng của hộ gia đình để tối ưu thời gian hoàn vốn.',
  featuredLabel: 'Phổ biến & Khuyên dùng',
  cta: 'Xem chi tiết gói',
  billLabel: 'Tiền điện hiện tại:',
  disclaimer: {
    icon: 'info',
    strong: 'Thông tin tham khảo',
    before: '*Lưu ý: Công suất và sản lượng ước tính dưới đây mang tính chất ',
    after:
      ', không phải báo giá cam kết chính thức. Báo giá chuẩn xác sẽ căn cứ vào khảo sát độ dốc, hướng mái thực tế và chỉ số tiêu thụ theo hóa đơn 12 tháng gần nhất.',
  },
  items: [
    {
      id: 'small',
      tag: 'Hộ gia đình nhỏ',
      title: 'Hệ thống gia đình nhỏ',
      subtitle: 'Phù hợp nhà phố có diện tích mái khiêm tốn',
      bill: '1.000.000 - 1.500.000 đ/tháng',
      featured: false,
      features: [
        { text: 'Công suất: ', strong: '~3.2 kWp', after: ' (8 tấm pin Mono)' },
        { text: 'Sản lượng: ', strong: '450 - 650 kWh/tháng', after: '' },
        { text: 'Diện tích chiếm dụng: ~18 - 22 m² mái', strong: '', after: '' },
        { text: 'Giám sát sản lượng qua ứng dụng', strong: '', after: '' },
      ],
    },
    {
      id: 'standard',
      tag: 'Tiêu chuẩn',
      title: 'Hệ thống gia đình tiêu chuẩn',
      subtitle: 'Lựa chọn lý tưởng cho nhà 4 - 6 thành viên',
      bill: '2.000.000 - 3.500.000 đ/tháng',
      featured: true,
      features: [
        { text: 'Công suất: ', strong: '~6.4 kWp', after: ' (16 tấm pin cao cấp)' },
        { text: 'Sản lượng: ', strong: '900 - 1.200 kWh/tháng', after: '' },
        { text: 'Tích hợp sẵn bộ chuyển đổi Hybrid', strong: '', after: '' },
        { text: 'Sẵn sàng nâng cấp pin lưu trữ bất kỳ lúc nào', strong: '', after: '' },
        { text: 'Diện tích chiếm dụng: ~35 - 40 m² mái', strong: '', after: '' },
      ],
    },
    {
      id: 'premium',
      tag: 'Cao cấp / Biệt thự',
      title: 'Hệ công suất lớn / Biệt thự',
      subtitle: 'Dành cho villa, kết hợp văn phòng hoặc kinh doanh',
      bill: 'Trên 4.000.000 đ/tháng',
      featured: false,
      features: [
        { text: 'Công suất: ', strong: '~10 - 15 kWp', after: '' },
        { text: 'Sản lượng: ', strong: '1.500 - 2.400 kWh/tháng', after: '' },
        { text: 'Tùy chọn trọn gói Pin lưu trữ Lithium (BESS)', strong: '', after: '' },
        { text: 'Độc lập nguồn điện, tự cấp khi lưới mất điện', strong: '', after: '' },
      ],
    },
  ],
} as const

/** Khối 5 – Hành trình 8 bước */
export const journey = {
  eyebrow: 'Lộ trình triển khai',
  title: 'Hành trình trải nghiệm khách hàng tại Smart Solar',
  description:
    '8 bước tinh gọn, được số hóa giúp chủ nhà dễ dàng giám sát từng dấu mốc thực hiện ngay trên điện thoại di động.',
  steps: [
    {
      step: 1,
      icon: 'online_prediction',
      title: 'Khảo sát sơ bộ',
      description: 'Nhập thông tin diện tích mái trực tuyến trong 2 phút.',
    },
    {
      step: 2,
      icon: 'support_agent',
      title: 'Tư vấn cấu hình',
      description: 'Chuyên viên phân tích nhu cầu tiêu thụ và đề xuất phương án.',
    },
    {
      step: 3,
      icon: 'engineering',
      title: 'Khảo sát thực tế',
      description: 'Kỹ sư đo đạc kết cấu giàn khung, hướng nắng và tủ điện.',
    },
    {
      step: 4,
      icon: 'request_quote',
      title: 'Báo giá chi tiết',
      description: 'Bản vẽ 3D mô phỏng cùng dự toán tài chính chuẩn xác 100%.',
    },
    {
      step: 5,
      icon: 'draw',
      title: 'Ký hợp đồng',
      description: 'Hợp đồng điện tử minh bạch điều khoản tiến độ và quyền lợi.',
    },
    {
      step: 6,
      icon: 'solar_power',
      title: 'Thi công an toàn',
      description: 'Đội ngũ kỹ thuật lắp đặt tiêu chuẩn trong 2 - 3 ngày làm việc.',
    },
    {
      step: 7,
      icon: 'assignment_turned_in',
      title: 'Nghiệm thu & Đấu nối',
      description: 'Kiểm định điện áp cách điện, đóng điện và bàn giao ứng dụng.',
    },
    {
      step: 8,
      icon: 'published_with_changes',
      title: 'Bảo dưỡng định kỳ',
      description: 'Chăm sóc trọn đời, kiểm tra hệ thống định kỳ 6 tháng/lần.',
    },
  ],
} as const

/** Khối 6 – Tại sao chọn Smart Solar */
export const whyUs = {
  eyebrow: 'Cam kết chất lượng',
  title: 'Tại sao hàng nghìn mái nhà chọn Smart Solar?',
  description:
    'Chúng tôi không chỉ bán thiết bị, chúng tôi đồng hành cùng sự an tâm của gia chủ trong suốt vòng đời 25 năm của công trình.',
  image: {
    src: '/placeholders/engineers-roof.svg',
    alt: 'Kỹ sư điện mặt trời đội mũ bảo hộ kiểm tra dàn pin trên mái nhà cùng máy tính bảng',
  },
  certBadge: {
    icon: 'workspace_premium',
    title: 'Tiêu chuẩn IEC & TCVN',
    description: 'Cam kết 100% thiết bị có chứng nhận CO/CQ xuất xứ minh bạch.',
  },
  pillars: [
    {
      icon: 'verified',
      title: 'Quy trình chuẩn hóa',
      description:
        'Áp dụng quy chuẩn thi công điện khắt khe, thi công giàn đỡ chống ăn mòn muối biển đạt chuẩn quốc tế.',
    },
    {
      icon: 'inventory_2',
      title: 'Sản phẩm chính hãng',
      description:
        'Đối tác phân phối ủy quyền từ các thương hiệu Tier-1 toàn cầu: REC, Enphase, SolarEdge, Tesla.',
    },
    {
      icon: 'monitoring',
      title: 'Minh bạch qua ứng dụng',
      description:
        'Mọi thông số sản lượng, lịch bảo trì và trạng thái hệ thống đều hiển thị rõ ràng trên cổng dịch vụ.',
    },
    {
      icon: 'handshake',
      title: 'Kỹ thuật tận tâm',
      description:
        'Đội phản ứng kỹ thuật hỗ trợ tại hiện trường trong vòng 24 giờ kể từ khi tiếp nhận yêu cầu.',
    },
  ],
} as const

/** Khối 7 – Sản phẩm tiêu biểu */
export const featuredProducts = {
  eyebrow: 'Trang thiết bị hàng đầu',
  title: 'Công nghệ đạt chuẩn hiệu suất cao',
  allLink: 'Xem tất cả sản phẩm trong danh mục',
  detailLabel: 'Chi tiết',
  items: [
    {
      id: 'rec-alpha-pure',
      category: 'Tấm pin quang điện',
      name: 'REC Alpha Pure 400W',
      description:
        'Tấm pin công nghệ dị thể Heterojunction (HJT) hiệu suất 21.6%, không chì thân thiện môi trường, hệ số nhiệt độ cực thấp phù hợp khí hậu nóng ẩm.',
      badge: 'Bảo hành 25 năm',
      image: { src: '/placeholders/photo-panel.svg', alt: 'Tấm pin quang điện REC Alpha Pure' },
    },
    {
      id: 'enphase-iq8',
      category: 'Bộ biến tần vi mô',
      name: 'Enphase IQ8 Microinverter',
      description:
        'Tối ưu sản lượng độc lập từng tấm pin, loại bỏ rủi ro điện áp DC cao áp trên mái nhà, đảm bảo an toàn phòng cháy chữa cháy tối đa.',
      badge: 'Điện áp thấp an toàn',
      image: { src: '/placeholders/photo-microinverter.svg', alt: 'Bộ biến tần vi mô Enphase IQ8' },
    },
    {
      id: 'powerwall-3',
      category: 'Hệ thống pin lưu trữ',
      name: 'Tesla Powerwall 3 / Dyness',
      description:
        'Dung lượng hữu dụng 13.5 kWh, tự động chuyển mạch nguồn cấp tức thì khi mất điện lưới quốc gia, cấp nguồn liên tục cho tủ lạnh, wifi, máy tính.',
      badge: 'Lưu trữ 13.5 kWh',
      image: { src: '/placeholders/photo-inverter.svg', alt: 'Hệ thống pin lưu trữ gắn tường' },
    },
  ],
} as const

/** Khối 8 – Hậu mãi & Sổ bảo hành số */
export const afterSales = {
  eyebrow: 'Hậu mãi số hóa',
  title: 'Dịch vụ Hậu mãi & Bảo dưỡng thông minh qua App',
  description:
    'Tất cả các dự án lắp đặt đều được tích hợp tài khoản theo dõi trọn đời trên Cổng khách hàng Smart Solar, giúp bạn quản lý tài sản năng lượng dễ dàng như kiểm tra số dư ngân hàng.',
  cta: 'Tìm hiểu dịch vụ hậu mãi',
  features: [
    {
      icon: 'badge',
      title: 'Bảo hành điện tử',
      description: 'Tra cứu số serial, ngày kích hoạt và thời hạn bảo hành từng thiết bị.',
    },
    {
      icon: 'touch_app',
      title: 'Yêu cầu hỗ trợ 1 chạm',
      description: 'Gửi yêu cầu kiểm tra kỹ thuật trực tiếp kèm ảnh chụp hiện trường.',
    },
    {
      icon: 'calendar_month',
      title: 'Lịch bảo trì báo trước',
      description: 'Tự động nhắc lịch vệ sinh và kiểm tra siết bulong định kỳ 6 tháng.',
    },
    {
      icon: 'history_edu',
      title: 'Nhật ký minh bạch',
      description: 'Lưu trữ toàn bộ biên bản kiểm định và lịch sử xử lý kỹ thuật số.',
    },
  ],
  warrantyCard: {
    title: 'Sổ bảo hành số',
    status: 'Hoạt động',
    systemCodeLabel: 'Mã hệ thống:',
    systemCode: 'SS-HCM-2025-0842',
    rows: [
      { label: 'Tấm pin REC 400W:', value: 'Còn 24 năm 8 tháng' },
      { label: 'Inverter Enphase:', value: 'Còn 9 năm 8 tháng' },
    ],
    nextVisit: { icon: 'event_upcoming', text: 'Lịch bảo trì tới: 15/10/2025' },
  },
} as const

/** Khối 9 – FAQ */
export const faq = {
  eyebrow: 'Giải đáp thắc mắc',
  title: 'Câu hỏi thường gặp về điện mặt trời mái nhà',
  description: 'Những điều các chủ nhà thường quan tâm trước khi tiến hành khảo sát và lắp đặt.',
  items: [
    {
      id: 'faq-roof-type',
      question: 'Mái nhà loại nào thì lắp đặt được điện mặt trời?',
      answer:
        'Hầu hết các loại mái nhà dân dụng hiện nay tại Việt Nam đều có thể lắp đặt, bao gồm: mái tôn, mái bằng bê tông cốt thép, mái ngói khung xà gồ thép. Kỹ sư của Smart Solar sẽ tính toán kết cấu đòn tay và phương án ngàm kẹp chuyên dụng để không phải khoan thủng gây thấm dột.',
    },
    {
      id: 'faq-survey-info',
      question: 'Khảo sát sơ bộ trực tuyến cần cung cấp những thông tin gì?',
      answer:
        'Bạn chỉ cần cung cấp địa chỉ ngôi nhà (để xác định tọa độ bức xạ mặt trời), diện tích mái áng chừng (m²), loại chất liệu mái (ngói, tôn, bê tông), mức tiền điện trung bình hàng tháng và nếu có ảnh chụp từ sân thượng hoặc Flycam thì càng chính xác.',
    },
    {
      id: 'faq-quote',
      question: 'Báo giá trên website khác gì so với báo giá chính thức?',
      answer:
        'Báo giá và công suất trên website là mô phỏng tham khảo theo diện tích chuẩn. Báo giá chính thức sẽ được lập sau khi chuyên viên đo đạc thực tế độ nghiêng mái, hướng bóng râm của các tòa nhà xung quanh, khoảng cách đường dây điện và nhu cầu chọn thiết bị theo thương hiệu của gia chủ.',
    },
    {
      id: 'faq-next-step',
      question: 'Sau khi hoàn thành form khảo sát, bước tiếp theo là gì?',
      answer:
        'Hệ thống sẽ gửi bạn bản tóm tắt đề xuất cấu hình qua Zalo/Email. Trong vòng 2 - 4 giờ làm việc, chuyên viên kỹ thuật Smart Solar sẽ gọi điện để tư vấn sâu hơn và đặt lịch khảo sát thực địa miễn phí tại công trình theo khung giờ thuận tiện nhất cho bạn.',
    },
    {
      id: 'faq-monitoring',
      question: 'Làm thế nào để theo dõi sản lượng điện hàng ngày?',
      answer:
        'Hệ thống inverter thông minh kết nối trực tiếp với mạng Wifi gia đình. Bạn sẽ được cài đặt ứng dụng giám sát trên điện thoại (iOS/Android) hoặc truy cập cổng portal để xem theo thời gian thực: công suất phát, tổng kWh tích lũy, lượng tiền điện đã tiết kiệm và cảnh báo sự cố nếu có.',
    },
    {
      id: 'faq-warranty',
      question: 'Chính sách bảo hành và bảo dưỡng được cam kết như thế nào?',
      answer:
        'Tấm pin được bảo hành vật lý chính hãng 25 năm và bảo hành hiệu suất không tụt quá 15% trong 25 năm. Bộ biến tần bảo hành 5 - 10 năm tùy dòng. Ngoài ra, Smart Solar tặng gói bảo dưỡng, vệ sinh tấm quang điện miễn phí định kỳ trong 2 năm đầu tiên.',
    },
  ],
} as const

/** Khối 10 – Banner chốt đơn */
export const ctaBanner = {
  badge: 'Khảo sát thực địa hoàn toàn miễn phí',
  title: 'Bạn muốn biết mái nhà của mình phù hợp với hệ thống nào?',
  description:
    'Gửi thông tin khảo sát sơ bộ để đội ngũ Smart Solar tư vấn giải pháp tối ưu và chính xác nhất cho ngôi nhà của bạn.',
  primaryCta: 'Khảo sát ngay',
  secondaryCta: 'Liên hệ chuyên gia: 1900 6868',
  assurances: ['Không ràng buộc hợp đồng', 'Đánh giá tự động 2 phút', 'Kỹ sư khảo sát tận nơi'],
} as const

/** Footer của PublicLayout */
export const footerContent = {
  description:
    'Tiên phong cung cấp giải pháp năng lượng mặt trời thông minh và dịch vụ bảo hành toàn diện cho hộ gia đình và doanh nghiệp tại Việt Nam.',
  contacts: [
    { icon: 'call', text: 'Hotline: 1900 6868 (8:00 - 18:00)' },
    { icon: 'mail', text: 'Email: lienhe@smartsolar.vn' },
    { icon: 'schedule', text: 'Giờ làm việc: Thứ Hai - Thứ Bảy' },
  ],
  columns: [
    {
      title: 'Giải pháp',
      links: [
        { label: 'Điện mặt trời áp mái hộ gia đình', href: '#solutions' },
        { label: 'Hệ thống thương mại & công nghiệp', href: '#solutions' },
        { label: 'Hệ thống lưu trữ pin BESS', href: '#products' },
        { label: 'Tính toán sản lượng điện', href: '/coming-soon' },
      ],
    },
    {
      title: 'Dịch vụ & Hỗ trợ',
      links: [
        { label: 'Quy trình triển khai 6 bước', href: '#process' },
        { label: 'Chính sách bảo hành 25 năm', href: '#after-sales' },
        { label: 'Kiểm định & bảo trì định kỳ', href: '#after-sales' },
        { label: 'Tài liệu kỹ thuật tấm pin', href: '#products' },
      ],
    },
    {
      title: 'Pháp lý & Công ty',
      links: [
        { label: 'Về Smart Solar Việt Nam', href: '#about' },
        { label: 'Chính sách bảo mật', href: '/coming-soon' },
        { label: 'Điều khoản sử dụng', href: '/coming-soon' },
        { label: 'Chứng chỉ an toàn EVN', href: '#about' },
      ],
    },
  ],
  copyright: '© 2025 Smart Solar Vietnam. Bảo lưu mọi quyền.',
  legalLinks: [
    { label: 'Chính sách', href: '/coming-soon' },
    { label: 'Điều khoản', href: '/coming-soon' },
    { label: 'Liên hệ', href: '#about' },
  ],
} as const
