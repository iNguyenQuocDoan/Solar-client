import { useEffect } from 'react'
import { useLocation } from 'react-router'
import {
  BenefitsSection,
  CtaSection,
  HeroSection,
  ProjectsSection,
  StatementSection,
  TrackingSection,
  TrustSection,
  VoicesSection,
} from '@/features/landing/components'
import { pageTitle } from '@/data/landing'

// Trang chủ công khai, website bán hàng cho doanh nghiệp
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
      <StatementSection />
      <ProjectsSection />
      <VoicesSection />
      <TrustSection />
      <BenefitsSection />
      <TrackingSection />
      <CtaSection />
    </>
  )
}
