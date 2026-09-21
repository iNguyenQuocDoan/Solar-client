import type { Crumb } from '@/components/stitch-ui/Breadcrumb'
import type { SelectOption } from '@/components/stitch-ui/FilterBar'
import type { MetricCardProps } from '@/components/stitch-ui/MetricCard'

/* Dữ liệu giả cho /admin/products, nội dung lấy từ product_catalogue/screen.png. */

export const productsPageHeader = {
  breadcrumb: [
    { label: 'Administration' },
    { label: 'Catalogue Management' },
    { label: 'Hardware Products' },
  ] satisfies Crumb[],
  title: 'Solar Hardware Product Catalogue',
  description:
    'Manage certified PV modules, string & microinverters, battery storage systems, and mounting hardware.',
  actions: { batch: 'Batch Price Update', add: 'Add New Hardware Product' },
}

export const productsKpis: MetricCardProps[] = [
  {
    label: 'Total Products',
    value: '214',
    description: 'Active Catalogue SKUs',
    icon: 'inventory_2',
    tone: 'primary',
  },
  {
    label: 'Active & Quoting',
    value: '188',
    delta: { text: 'Live in CPQ Engine', live: true },
    icon: 'price_check',
    tone: 'tertiary',
    labelTone: 'tertiary',
    valueTone: 'tertiary',
  },
  {
    label: 'Low Stock Alert',
    value: '9',
    description: '< 14 Days Lead Time',
    icon: 'warning',
    tone: 'secondary',
    labelTone: 'secondary',
    valueTone: 'secondary',
  },
  {
    label: 'Archived / Deprecated',
    value: '17',
    description: 'Historical Warranty Only',
    descriptionTone: 'muted',
    icon: 'archive',
    tone: 'muted',
    valueTone: 'muted',
  },
]

export type ProductCategory = 'solar-panels' | 'inverters' | 'batteries' | 'racking' | 'electrical'
export type ProductStatus = 'active' | 'draft' | 'discontinued'

export const productCategoryOptions: SelectOption[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'solar-panels', label: 'Solar Panels (PV)' },
  { value: 'inverters', label: 'Inverters' },
  { value: 'batteries', label: 'Battery Storage (BESS)' },
  { value: 'racking', label: 'Mounting & Racking' },
  { value: 'electrical', label: 'Electrical & BOS' },
]

export const productOemOptions: SelectOption[] = [
  { value: 'all', label: 'All OEMs' },
  { value: 'rec', label: 'REC Solar' },
  { value: 'enphase', label: 'Enphase Energy' },
  { value: 'tesla', label: 'Tesla Energy' },
  { value: 'solaredge', label: 'SolarEdge' },
  { value: 'ironridge', label: 'IronRidge' },
  { value: 'qcells', label: 'Qcells' },
]

export const productStatusOptions: SelectOption[] = [
  { value: 'active', label: 'Active Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'discontinued', label: 'Discontinued' },
]

export const productSearchPlaceholder = 'Search by model number, manufacturer, capacity, SKU...'

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
    categoryLabel: 'Solar Panels',
    oem: 'rec',
    specPrimary: '400W Monocrystalline',
    specSecondary: '21.6% Module Efficiency',
    baseCost: 184,
    salesPrice: 285,
    status: 'active',
    detail: {
      commercialTitle: 'REC Alpha Pure Black Series 400W',
      manufacturer: 'REC Group (Norway)',
      ratedOutput: '400 Wp',
      efficiency: '21.6 %',
      tempCoefficient: '-0.26 %/°C',
      dimensions: '1821 x 1016 x 30 mm · 20.5 kg',
      warranty: '25-Year ProTrust Linear Output Guarantee (92% at Year 25)',
      includeInAi: true,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Primary Product Graphic (IEC 61215 Certified)',
      electrical: [
        { label: 'Open Circuit Voltage (Voc)', value: '44.2 V' },
        { label: 'Short Circuit Current (Isc)', value: '11.4 A' },
        { label: 'Voltage at Pmax (Vmpp)', value: '36.5 V' },
        { label: 'Current at Pmax (Impp)', value: '10.96 A' },
        { label: 'Max System Voltage', value: '1000 V DC' },
      ],
      warrantyPricing: [
        { label: 'Product Warranty', value: '25 years' },
        { label: 'Performance Guarantee', value: '92% at Year 25' },
        { label: 'Dealer Tier', value: 'Gold' },
        { label: 'Lead Time', value: '9 days' },
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
    categoryLabel: 'Inverters',
    oem: 'enphase',
    specPrimary: '330VA Peak Output',
    specSecondary: '97.5% CEC Weighted',
    baseCost: 142.5,
    salesPrice: 219,
    status: 'active',
    detail: {
      commercialTitle: 'Enphase IQ8M Microinverter (IQ8M-72-2-US)',
      manufacturer: 'Enphase Energy (USA)',
      ratedOutput: '330 VA',
      efficiency: '97.5 %',
      tempCoefficient: 'n/a',
      dimensions: '212 x 175 x 30.2 mm · 1.08 kg',
      warranty: '25-Year Limited Warranty',
      includeInAi: true,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Primary Product Graphic (UL 1741 Listed)',
      electrical: [
        { label: 'Peak Output Power', value: '330 VA' },
        { label: 'Max DC Input', value: '540 W' },
        { label: 'MPPT Range', value: '33–45 V' },
        { label: 'Grid Profile', value: 'IEEE 1547-2018' },
      ],
      warrantyPricing: [
        { label: 'Product Warranty', value: '25 years' },
        { label: 'Dealer Tier', value: 'Silver' },
        { label: 'Lead Time', value: '5 days' },
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
    categoryLabel: 'Batteries',
    oem: 'tesla',
    specPrimary: '13.5 kWh Usable',
    specSecondary: '11.5 kW Continuous Back-up',
    baseCost: 7200,
    salesPrice: 9850,
    status: 'active',
    detail: {
      commercialTitle: 'Tesla Powerwall 3 Home Battery',
      manufacturer: 'Tesla Energy (USA)',
      ratedOutput: '11.5 kW',
      efficiency: '97.5 % round-trip',
      tempCoefficient: 'n/a',
      dimensions: '1105 x 609 x 193 mm · 130 kg',
      warranty: '10-Year Unlimited Cycle Warranty (70% capacity)',
      includeInAi: true,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Primary Product Graphic (UL 9540 Certified)',
      electrical: [
        { label: 'Usable Capacity', value: '13.5 kWh' },
        { label: 'Continuous Power', value: '11.5 kW' },
        { label: 'Peak Power', value: '15.4 kW (10s)' },
        { label: 'Solar Inputs', value: '6 MPPT' },
      ],
      warrantyPricing: [
        { label: 'Product Warranty', value: '10 years' },
        { label: 'Dealer Tier', value: 'Gold' },
        { label: 'Lead Time', value: '21 days' },
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
    categoryLabel: 'Inverters',
    oem: 'solaredge',
    specPrimary: '7600W AC Rated',
    specSecondary: 'HD-Wave EV Charger Ready',
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
      warranty: '12-Year Standard (extendable to 25)',
      includeInAi: false,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Primary Product Graphic (UL 1741 SA Listed)',
      electrical: [
        { label: 'Rated AC Output', value: '7600 W' },
        { label: 'Max DC Input', value: '11,800 W' },
        { label: 'Nominal DC Voltage', value: '380 V' },
        { label: 'EV Charger', value: 'Level 2 ready' },
      ],
      warrantyPricing: [
        { label: 'Product Warranty', value: '12 years' },
        { label: 'Dealer Tier', value: 'Silver' },
        { label: 'Lead Time', value: '12 days' },
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
    categoryLabel: 'Racking',
    oem: 'ironridge',
    specPrimary: '168" Length Span',
    specSecondary: 'Clear Anodized Aluminum',
    baseCost: 48.2,
    salesPrice: 74,
    status: 'active',
    detail: {
      commercialTitle: 'IronRidge XR100 Rail 168" Clear',
      manufacturer: 'IronRidge (USA)',
      ratedOutput: 'n/a',
      efficiency: 'n/a',
      tempCoefficient: 'n/a',
      dimensions: '4267 x 44 x 34 mm · 4.6 kg',
      warranty: '25-Year Structural Warranty',
      includeInAi: true,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Primary Product Graphic (UL 2703 Listed)',
      electrical: [
        { label: 'Bonding', value: 'UL 2703 integrated grounding' },
        { label: 'Max Span', value: '12 ft (wind zone 1)' },
      ],
      warrantyPricing: [
        { label: 'Product Warranty', value: '25 years' },
        { label: 'Dealer Tier', value: 'Gold' },
        { label: 'Lead Time', value: '3 days' },
      ],
      compatibility: ['FlashFoot 2', 'UFO Clamps', 'All 30–40 mm frame modules'],
    },
  },
  {
    id: 'PV-QCELL-410',
    sku: 'PV-QCELL-410',
    name: 'Q.PEAK DUO BLK ML-G10+ 410W',
    icon: 'solar_power',
    category: 'solar-panels',
    categoryLabel: 'Solar Panels',
    oem: 'qcells',
    specPrimary: '410W Monocrystalline',
    specSecondary: 'All-Black Architectural Blend',
    baseCost: 192,
    salesPrice: 296,
    status: 'active',
    detail: {
      commercialTitle: 'Qcells Q.PEAK DUO BLK ML-G10+ 410W',
      manufacturer: 'Hanwha Qcells (Korea)',
      ratedOutput: '410 Wp',
      efficiency: '20.9 %',
      tempCoefficient: '-0.34 %/°C',
      dimensions: '1879 x 1045 x 32 mm · 21.7 kg',
      warranty: '25-Year Product & Performance (86% at Year 25)',
      includeInAi: true,
      image: '/placeholders/photo-panel.svg',
      imageCaption: 'Primary Product Graphic (IEC 61215 Certified)',
      electrical: [
        { label: 'Open Circuit Voltage (Voc)', value: '45.3 V' },
        { label: 'Short Circuit Current (Isc)', value: '11.4 A' },
        { label: 'Voltage at Pmax (Vmpp)', value: '37.6 V' },
        { label: 'Max System Voltage', value: '1000 V DC' },
      ],
      warrantyPricing: [
        { label: 'Product Warranty', value: '25 years' },
        { label: 'Performance Guarantee', value: '86% at Year 25' },
        { label: 'Dealer Tier', value: 'Silver' },
      ],
      compatibility: ['Enphase IQ8M', 'IronRidge XR100', 'SolarEdge S440 Optimizer'],
    },
  },
]

export const inventoryPanel = {
  title: 'Qualified Equipment Inventory',
  showingLabel: (count: number) => `${count} Showing`,
  /** Tổng SKU trong catalogue thật; bảng mock là trang mẫu đầu tiên */
  total: 214,
  pageSize: 6,
}

export const productDetailTabs = [
  { value: 'general', label: 'General Info' },
  { value: 'electrical', label: 'Electrical Specs' },
  { value: 'warranty', label: 'Warranty & Pricing' },
  { value: 'compatibility', label: 'Compatibility' },
]

export const productDetailLabels = {
  duplicate: 'Duplicate SKU',
  replaceImage: 'Replace Image',
  commercialTitle: 'Product Commercial Title',
  commercialTitleHelp: 'Customer-facing invoice and proposal display text',
  manufacturer: 'Manufacturer (OEM)',
  category: 'Equipment Category',
  ratedOutput: 'Rated Output (STC)',
  efficiency: 'Panel Efficiency',
  tempCoefficient: 'Temp Coefficient (Pmax)',
  dimensions: 'Dimensions & Weight',
  baseCost: 'Base Procurement Cost',
  salesPrice: 'Sales Quoting Default',
  warranty: 'Factory Performance Warranty',
  aiTitle: 'Include in AI Price Estimation Calculator',
  aiHelp:
    'Allows the automated residential solar modeling engine to propose this module SKU for optimal roof pitch and azimuth configurations.',
  archive: 'Archive Product SKU',
  cancel: 'Cancel',
  save: 'Save Product Changes',
}
