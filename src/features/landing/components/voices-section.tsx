import { stats, testimonials } from '@/data/landing'
import { Section, SectionTitle } from './section'

/*
  Social proof: lời khách hàng và con số công ty. CHỈ render khi có dữ liệu thật trong
  src/data/landing.ts (testimonials, stats) – không có thì section không tồn tại.
*/
export function VoicesSection() {
  if (testimonials.length === 0 && stats.length === 0) return null
  return (
    <Section id="khach-hang" space="far" titleId="voices-title">
      <SectionTitle id="voices-title">Khách hàng nói gì về công trình của họ</SectionTitle>
      {stats.length > 0 && (
        <dl className="mt-10 flex flex-wrap gap-x-16 gap-y-6">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="ld-meta text-fg-2">{s.label}</dt>
              <dd className="ld-h1 text-fg">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {testimonials.length > 0 && (
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote key={t.name}>
              <p className="ld-lede text-fg">“{t.quote}”</p>
              <footer className="mt-3 ld-meta text-fg-2">
                {t.name}, {t.place}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </Section>
  )
}
