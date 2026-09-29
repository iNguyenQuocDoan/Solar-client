import { useEffect } from 'react'
import { useLocation } from 'react-router'
import {
  ClosingSection,
  DaytimeSection,
  EquipmentSection,
  FaqSection,
  HeroSection,
  LawSection,
  PapersSection,
  PrincipleSection,
} from '@/components/landing'
import { pageTitle } from '@/lib/mock/landing'

/*
  Trang chủ công khai "/" – bản "Điện nhà làm" (docs/design/landing-brief.md). Section chia theo chủ
  đề, không theo khâu dịch vụ: thương hiệu, điện ban ngày, luật, thiết bị, giấy tờ, nguyên tắc, câu
  hỏi, lời mời. Nhịp nền: sáng → ảnh tràn viền → sáng → dải tối → sáng → dải xanh.
*/
export function LandingPage() {
  const { hash } = useLocation()

  // Vào "/" kèm hash (từ header hay footer của route khác) thì cuộn tới section đó.
  useEffect(() => {
    if (!hash) return
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' })
  }, [hash])

  return (
    <>
      <title>{pageTitle}</title>
      <HeroSection />
      <DaytimeSection />
      <LawSection />
      <EquipmentSection />
      <PapersSection />
      <PrincipleSection />
      <FaqSection />
      <ClosingSection />
    </>
  )
}
