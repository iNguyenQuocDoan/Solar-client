import { useEffect } from 'react'
import { useLocation } from 'react-router'
import {
  AfterSales,
  Benefits,
  CtaBanner,
  Faq,
  FeaturedProducts,
  Hero,
  JourneySteps,
  PackageCards,
  SurveySteps,
  WhyUs,
} from '@/components/landing'

/** Trang chủ công khai "/" – dựng theo landing_home, mỗi khối là 1 component. */
export function LandingPage() {
  const { hash } = useLocation()

  // Vào "/" kèm hash (ví dụ từ footer của một route khác) thì cuộn tới section đó.
  useEffect(() => {
    if (!hash) return
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  const scrollToSolutions = () =>
    document.querySelector('#solutions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="flex w-full flex-col">
      <Hero onViewSolutions={scrollToSolutions} />
      <SurveySteps />
      <Benefits />
      <PackageCards />
      <JourneySteps />
      <WhyUs />
      <FeaturedProducts />
      <AfterSales />
      <Faq />
      <CtaBanner />
    </div>
  )
}
