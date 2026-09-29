import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { FaqSection, FitSection, HeroSection, OfferSection, ProofSection, StartSection } from '@/components/landing'
import { pageTitle } from '@/lib/mock/landing'

/*
  Trang chủ công khai "/" – lời giới thiệu sản phẩm, không phải quy trình (docs/design/landing-brief.md):
  sản phẩm và lợi ích → trọn gói gồm gì → nhà nào hợp → những thứ Smart Solar cho xem → câu hỏi → đăng ký.
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
      <OfferSection />
      <FitSection />
      <ProofSection />
      <FaqSection />
      <StartSection />
    </>
  )
}
