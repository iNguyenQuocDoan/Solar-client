import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { Notice, Photo } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui/panel'
import { Stat, StatRow } from '@/components/ui/stat'
import { ROUTES } from '@/constants/routes'
import { estimate, property } from '@/data/customer'
import { fmt } from '@/lib/format'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function EstimatePage() {
  const query = useMockQuery(['customer', 'estimate'], estimate)
  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            back={{ to: ROUTES.customer.assessment, label: 'Preliminary assessment' }}
            title={`Preliminary estimate for ${property.name}`}
            meta={<Badge tone="ok">Viability score {data.viabilityScore} / 100</Badge>}
            actions={
              <>
                <Button>Download summary</Button>
                <ButtonLink to={ROUTES.customer.consultations} variant="primary">
                  Request on-site survey
                </ButtonLink>
              </>
            }
          />

          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <Panel>
                <PanelHeader title="Estimated investment" />
                <PanelBody>
                  <p className="tnum text-figure font-semibold md:text-display">
                    {fmt.usd(data.grossRange[0])} to {fmt.usd(data.grossRange[1])}
                  </p>
                  <p className="mt-1 text-meta text-fg-3">Gross range before incentives</p>
                  <p className="tnum mt-4 text-title font-semibold">
                    {fmt.usd(data.netRange[0])} to {fmt.usd(data.netRange[1])}{' '}
                    <span className="text-body font-normal text-fg-2">net after the 30% federal solar tax credit</span>
                  </p>
                  <StatRow className="mt-6 border-t border-line pt-6 md:grid-cols-3">
                    <Stat label="Estimated payback" value={data.paybackYears} unit="years" />
                    <Stat label="Year 1 net savings" value={`~${fmt.usd(data.year1Savings)}`} unit="/ yr" />
                    <Stat label="Lifetime CO₂ reduction" value={data.lifetimeCo2Tons} unit="metric tons" />
                  </StatRow>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title={data.system.name} description={data.system.summary} />
                <PanelBody className="space-y-6">
                  <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {data.system.parts.map((p) => (
                      <div key={p.name}>
                        <dt className="font-medium">{p.name}</dt>
                        <dd className="text-meta text-fg-3">{p.detail}</dd>
                      </div>
                    ))}
                  </dl>
                  <Photo
                    src={data.system.render}
                    alt="Rendered rooftop placement simulation"
                    ratio="aspect-[3/2]"
                    caption="Rendered rooftop placement simulation"
                    meta={`${data.system.panelsMapped} panels mapped`}
                  />
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-8 lg:border-l lg:border-line lg:pl-8">
              <Panel>
                <PanelHeader title="System assumptions" />
                <PanelBody>
                  <dl className="divide-y divide-line">
                    {data.assumptions.map((a) => (
                      <div key={a.k} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div>
                          <dt className="text-body">{a.k}</dt>
                          <dd className="text-meta text-fg-3">{a.note}</dd>
                        </div>
                        <dd className="tnum shrink-0 text-right text-body font-semibold">{a.v}</dd>
                      </div>
                    ))}
                  </dl>
                </PanelBody>
              </Panel>
              <Notice title="Estimation disclaimer">{data.disclaimer}</Notice>
              <p className="text-body text-fg-2">
                Numbers look off?{' '}
                <Link to={ROUTES.customer.assessment} className="text-accent-fg hover:underline">
                  Recalculate with different inputs
                </Link>
              </p>
            </div>
          </div>
        </>
      )}
    </QueryBoundary>
  )
}
