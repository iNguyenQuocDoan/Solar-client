import { useEffect } from 'react'
import { useLocation } from 'react-router'
import {
  BuildSection,
  FaqSection,
  HeroSection,
  QuoteSection,
  StartSection,
  SurveySection,
  WarrantySection,
} from '@/components/landing'
import { pageTitle } from '@/lib/mock/landing'

/*
  Trang chủ công khai "/". Thứ tự section theo chuỗi câu hỏi của chủ nhà trong
  docs/design/landing-brief.md: là gì → mái tôi được bao nhiêu → tiền đi vào đâu → họ làm gì trên
  mái → hỏng thì ai lo → thủ tục → cần chuẩn bị gì.
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
      <SurveySection />
      <QuoteSection />
      <BuildSection />
      <WarrantySection />
      <FaqSection />
      <StartSection />
    </>
  )
}
