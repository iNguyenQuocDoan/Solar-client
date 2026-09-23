import type { Crumb } from '@/components/stitch-ui/Breadcrumb'
import type { SelectOption } from '@/components/stitch-ui/FilterBar'
import type { MetricCardProps } from '@/components/stitch-ui/MetricCard'

/* Dữ liệu giả cho /admin/products, nội dung lấy từ product_catalogue/screen.png. */

export const productsPageHeader = {
  breadcrumb: [
    { label: 'Quản trị' },
    { label: 'Danh mục' },
    { label: 'Sản phẩm' },
  ] satisfies Crumb[],
  title: 'Danh mục sản phẩm',
  actions: { batch: 'Cập nhật giá hàng loạt', add: 'Thêm sản phẩm' },
}

export const productsKpis: MetricCardProps[] = [
  {
    label: 'Tổng sản phẩm',
    value: '214',
    icon: 'inventory_2',
    tone: 'primary',
  },
  {
    label: 'Đang bán',
    value: '188',
    delta: { text: 'đang dùng để báo giá', live: true },
    icon: 'price_check',
    tone: 'tertiary',
    labelTone: 'tertiary',
    valueTone: 'tertiary',
  },
  {
    label: 'Sắp hết hàng',
    value: '9',
    description: 'Thời gian về hàng dưới 14 ngày',
    icon: 'warning',
    tone: 'secondary',
    labelTone: 'secondary',
    valueTone: 'secondary',
  },
  {
    label: 'Ngừng kinh doanh',
    value: '17',
    description: 'Chỉ còn hỗ trợ bảo hành',
    descriptionTone: 'muted',
    icon: 'archive',
    tone: 'muted',
    valueTone: 'muted',
  },
]

export type ProductCategory = 'solar-panels' | 'inverters' | 'batteries' | 'racking' | 'electrical'
export type ProductStatus = 'active' | 'draft' | 'discontinued'

export const productCategoryOptions: SelectOption[] = [
  { value: 'all', label: 'Tất cả nhóm hàng' },
  { value: 'solar-panels', label: 'Tấm pin mặt trời' },
  { value: 'inverters', label: 'Inverter' },
  { value: 'batteries', label: 'Pin lưu trữ' },
  { value: 'racking', label: 'Khung giá đỡ' },
  { value: 'electrical', label: 'Thiết bị điện' },
]

export const productOemOptions: SelectOption[] = [
  { value: 'all', label: 'Tất cả hãng' },
  { value: 'rec', label: 'REC Solar' },
  { value: 'enphase', label: 'Enphase Energy' },
  { value: 'tesla', label: 'Tesla Energy' },
  { value: 'solaredge', label: 'SolarEdge' },
  { value: 'ironridge', label: 'IronRidge' },
  { value: 'qcells', label: 'Qcells' },
]

export const productStatusOptions: SelectOption[] = [
  { value: 'active', label: 'Đang bán' },
  { value: 'draft', label: 'Nháp' },
  { value: 'discontinued', label: 'Ngừng bán' },
]

export const productSearchPlaceholder = 'Tìm theo mã, hãng, công suất, SKU…'

export type ProductDetail = {
  commercialTitle: string
  manufacturer: string
  ratedOutput: string
  efficiency: string
  tempCoefficient: string
  dimensions: string
  warranty: string
  includeInAi: boolean
  image: string
  imageCaption: string
  electrical: { label: string; value: string }[]
  warrantyPricing: { label: string; value: string }[]
  compatibility: string[]
}

export type ProductRecord = {
  id: string
  sku: string
  name: string
  icon: string
  category: ProductCategory
  categoryLabel: string
  oem: string
  specPrimary: string
  specSecondary: string
  baseCost: number
  salesPrice: number
  status: ProductStatus
  detail: ProductDetail
}

export const products: ProductRecord[] = [
  {
    id: 'PV-REC-400A',
    sku: 'PV-REC-400A',
    name: 'REC Alpha Pure 400W',
    icon: 'solar_power',
    category: 'solar-panels',
    categoryLabel: 'Tấm pin',
    oem: 'rec',
    specPrimary: '400W đơn tinh thể',
    specSecondary: 'Hiệu suất 21,6%',
    baseCost: 184,
    salesPrice: 285,
    status: 'active',
    detail: {
      commercialTitle: 'REC Alpha Pure Black Series 400W',
      manufacturer: 'REC Group (Na Uy)',
      ratedOutput: '400 Wp',
      efficiency: '21.6 %',
      tempCoefficient: '-0.26 %/°C',
      dimensions: '1821 x 1016 x 30 mm · 20.5 kg',
      warranty: 'Bảo hành sản lượng 25 năm (còn 92% ở năm thứ 25)',
      includeInAi: true,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Ảnh sản phẩm (chứng nhận IEC 61215)',
      electrical: [
        { label: 'Điện áp hở mạch (Voc)', value: '44,2 V' },
        { label: 'Dòng ngắn mạch (Isc)', value: '11,4 A' },
        { label: 'Điện áp tại Pmax (Vmpp)', value: '36,5 V' },
        { label: 'Dòng tại Pmax (Impp)', value: '10,96 A' },
        { label: 'Điện áp hệ thống tối đa', value: '1000 V DC' },
      ],
      warrantyPricing: [
        { label: 'Bảo hành sản phẩm', value: '25 năm' },
        { label: 'Cam kết sản lượng', value: 'Còn 92% ở năm thứ 25' },
        { label: 'Hạng đại lý', value: 'Vàng' },
        { label: 'Thời gian về hàng', value: '9 ngày' },
      ],
      compatibility: ['Enphase IQ8M', 'SolarEdge S440 Optimizer', 'IronRidge XR100', 'Tesla Powerwall 3'],
    },
  },
  {
    id: 'INV-ENPH-IQ8M',
    sku: 'INV-ENPH-IQ8M',
    name: 'Enphase IQ8M Microinverter',
    icon: 'bolt',
    category: 'inverters',
    categoryLabel: 'Inverter',
    oem: 'enphase',
    specPrimary: 'Công suất đỉnh 330VA',
    specSecondary: 'Hiệu suất CEC 97,5%',
    baseCost: 142.5,
    salesPrice: 219,
    status: 'active',
    detail: {
      commercialTitle: 'Enphase IQ8M Microinverter (IQ8M-72-2-US)',
      manufacturer: 'Enphase Energy (Mỹ)',
      ratedOutput: '330 VA',
      efficiency: '97.5 %',
      tempCoefficient: 'n/a',
      dimensions: '212 x 175 x 30.2 mm · 1.08 kg',
      warranty: 'Bảo hành 25 năm',
      includeInAi: true,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Ảnh sản phẩm (đạt UL 1741)',
      electrical: [
        { label: 'Công suất đỉnh', value: '330 VA' },
        { label: 'Công suất DC tối đa', value: '540 W' },
        { label: 'Dải MPPT', value: '33–45 V' },
        { label: 'Chuẩn hoà lưới', value: 'IEEE 1547-2018' },
      ],
      warrantyPricing: [
        { label: 'Bảo hành sản phẩm', value: '25 năm' },
        { label: 'Hạng đại lý', value: 'Bạc' },
        { label: 'Thời gian về hàng', value: '5 ngày' },
      ],
      compatibility: ['REC Alpha Pure 400W', 'Q.PEAK DUO 410W', 'IQ Combiner 4C'],
    },
  },
  {
    id: 'BATT-TSLA-PW3',
    sku: 'BATT-TSLA-PW3',
    name: 'Tesla Powerwall 3 Storage',
    icon: 'battery_charging_full',
    category: 'batteries',
    categoryLabel: 'Pin lưu trữ',
    oem: 'tesla',
    specPrimary: 'Dung lượng dùng được 13,5 kWh',
    specSecondary: 'Công suất dự phòng 11,5 kW',
    baseCost: 7200,
    salesPrice: 9850,
    status: 'active',
    detail: {
      commercialTitle: 'Tesla Powerwall 3 Home Battery',
      manufacturer: 'Tesla Energy (Mỹ)',
      ratedOutput: '11.5 kW',
      efficiency: '97.5 % round-trip',
      tempCoefficient: 'n/a',
      dimensions: '1105 x 609 x 193 mm · 130 kg',
      warranty: 'Bảo hành 10 năm, không giới hạn số chu kỳ (còn 70% dung lượng)',
      includeInAi: true,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Ảnh sản phẩm (chứng nhận UL 9540)',
      electrical: [
        { label: 'Dung lượng dùng được', value: '13,5 kWh' },
        { label: 'Công suất liên tục', value: '11,5 kW' },
        { label: 'Công suất đỉnh', value: '15,4 kW (10 giây)' },
        { label: 'Ngõ vào pin mặt trời', value: '6 MPPT' },
      ],
      warrantyPricing: [
        { label: 'Bảo hành sản phẩm', value: '10 năm' },
        { label: 'Hạng đại lý', value: 'Vàng' },
        { label: 'Thời gian về hàng', value: '21 ngày' },
      ],
      compatibility: ['Backup Gateway 2', 'REC Alpha Pure 400W', 'SolarEdge Energy Hub'],
    },
  },
  {
    id: 'INV-SE-7600H',
    sku: 'INV-SE-7600H',
    name: 'SolarEdge Energy Hub 7.6kW',
    icon: 'electrical_services',
    category: 'inverters',
    categoryLabel: 'Inverter',
    oem: 'solaredge',
    specPrimary: 'Công suất AC 7.600W',
    specSecondary: 'HD-Wave, sẵn sàng sạc xe điện',
    baseCost: 1680,
    salesPrice: 2340,
    status: 'active',
    detail: {
      commercialTitle: 'SolarEdge Energy Hub Inverter SE7600H-US',
      manufacturer: 'SolarEdge Technologies (Israel)',
      ratedOutput: '7600 W AC',
      efficiency: '99 % CEC',
      tempCoefficient: 'n/a',
      dimensions: '450 x 370 x 174 mm · 12.8 kg',
      warranty: 'Bảo hành 12 năm (gia hạn tối đa 25 năm)',
      includeInAi: false,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Ảnh sản phẩm (đạt UL 1741 SA)',
      electrical: [
        { label: 'Công suất AC', value: '7.600 W' },
        { label: 'Công suất DC tối đa', value: '11.800 W' },
        { label: 'Điện áp DC danh định', value: '380 V' },
        { label: 'Sạc xe điện', value: 'Hỗ trợ mức 2' },
      ],
      warrantyPricing: [
        { label: 'Bảo hành sản phẩm', value: '12 năm' },
        { label: 'Hạng đại lý', value: 'Bạc' },
        { label: 'Thời gian về hàng', value: '12 ngày' },
      ],
      compatibility: ['S440 Optimizer', 'Home Battery 400V', 'REC Alpha Pure 400W'],
    },
  },
  {
    id: 'RACK-IR-XR100',
    sku: 'RACK-IR-XR100',
    name: 'IronRidge XR100 Heavy Rail',
    icon: 'view_agenda',
    category: 'racking',
    categoryLabel: 'Khung giá đỡ',
    oem: 'ironridge',
    specPrimary: 'Thanh ray dài 4,27 m',
    specSecondary: 'Nhôm anodized',
    baseCost: 48.2,
    salesPrice: 74,
    status: 'active',
    detail: {
      commercialTitle: 'IronRidge XR100 Rail 168" Clear',
      manufacturer: 'IronRidge (Mỹ)',
      ratedOutput: 'n/a',
      efficiency: 'n/a',
      tempCoefficient: 'n/a',
      dimensions: '4267 x 44 x 34 mm · 4.6 kg',
      warranty: 'Bảo hành kết cấu 25 năm',
      includeInAi: true,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Ảnh sản phẩm (đạt UL 2703)',
      electrical: [
        { label: 'Tiếp địa', value: 'Tích hợp theo UL 2703' },
        { label: 'Khoảng vượt tối đa', value: '3,6 m (vùng gió 1)' },
      ],
      warrantyPricing: [
        { label: 'Bảo hành sản phẩm', value: '25 năm' },
        { label: 'Hạng đại lý', value: 'Vàng' },
        { label: 'Thời gian về hàng', value: '3 ngày' },
      ],
      compatibility: ['FlashFoot 2', 'UFO Clamps', 'Mọi tấm pin khung 30–40 mm'],
    },
  },
  {
    id: 'PV-QCELL-410',
    sku: 'PV-QCELL-410',
    name: 'Q.PEAK DUO BLK ML-G10+ 410W',
    icon: 'solar_power',
    category: 'solar-panels',
    categoryLabel: 'Tấm pin',
    oem: 'qcells',
    specPrimary: '410W đơn tinh thể',
    specSecondary: 'Toàn khung đen',
    baseCost: 192,
    salesPrice: 296,
    status: 'active',
    detail: {
      commercialTitle: 'Qcells Q.PEAK DUO BLK ML-G10+ 410W',
      manufacturer: 'Hanwha Qcells (Hàn Quốc)',
      ratedOutput: '410 Wp',
      efficiency: '20.9 %',
      tempCoefficient: '-0.34 %/°C',
      dimensions: '1879 x 1045 x 32 mm · 21.7 kg',
      warranty: 'Bảo hành sản phẩm và sản lượng 25 năm (còn 86% ở năm thứ 25)',
      includeInAi: true,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Ảnh sản phẩm (chứng nhận IEC 61215)',
      electrical: [
        { label: 'Điện áp hở mạch (Voc)', value: '45,3 V' },
        { label: 'Dòng ngắn mạch (Isc)', value: '11,4 A' },
        { label: 'Điện áp tại Pmax (Vmpp)', value: '37,6 V' },
        { label: 'Điện áp hệ thống tối đa', value: '1000 V DC' },
      ],
      warrantyPricing: [
        { label: 'Bảo hành sản phẩm', value: '25 năm' },
        { label: 'Cam kết sản lượng', value: 'Còn 86% ở năm thứ 25' },
        { label: 'Hạng đại lý', value: 'Bạc' },
      ],
      compatibility: ['Enphase IQ8M', 'IronRidge XR100', 'SolarEdge S440 Optimizer'],
    },
  },
]

export const inventoryPanel = {
  title: 'Thiết bị đã duyệt',
  showingLabel: (count: number) => `Hiển thị ${count}`,
  /** Tổng SKU trong catalogue thật; bảng mock là trang mẫu đầu tiên */
  total: 214,
  pageSize: 6,
}

export const productDetailTabs = [
  { value: 'general', label: 'Thông tin chung' },
  { value: 'electrical', label: 'Thông số điện' },
  { value: 'warranty', label: 'Bảo hành & giá' },
  { value: 'compatibility', label: 'Tương thích' },
]

export const productDetailLabels = {
  duplicate: 'Nhân bản SKU',
  replaceImage: 'Đổi ảnh',
  commercialTitle: 'Tên thương mại',
  commercialTitleHelp: 'Tên hiển thị trên báo giá và hoá đơn gửi khách',
  manufacturer: 'Hãng sản xuất',
  category: 'Nhóm thiết bị',
  ratedOutput: 'Công suất danh định (STC)',
  efficiency: 'Hiệu suất',
  tempCoefficient: 'Hệ số nhiệt (Pmax)',
  dimensions: 'Kích thước và khối lượng',
  baseCost: 'Giá nhập',
  salesPrice: 'Giá báo khách mặc định',
  warranty: 'Bảo hành của hãng',
  aiTitle: 'Dùng trong công cụ ước tính giá bằng AI',
  archive: 'Ngừng kinh doanh SKU',
  cancel: 'Huỷ',
  save: 'Lưu thay đổi',
}
