import { KeyValueList, Progress } from '@/components/ui/lists'
import { cx } from '@/lib/cx'
import { build } from '@/lib/mock/landing'
import { AccountFrame } from './account-frame'
import { PhotoSlot } from './photo-slot'
import { ReconcilePair } from './reconcile-pair'
import { PAGE_GRID } from './classes'
import { Section, SectionTitle } from './section'

/*
  Nhật ký của MỘT ngày, không phải dòng thời gian nhiều ngày và không có Stepper giai đoạn:
  trang giới thiệu điều chủ nhà nhận được, không kể lại quy trình (luật 9).
*/
export function BuildSection() {
  const { done, total, label } = build.progress
  const pct = Math.round((done / total) * 100)
  return (
    <Section id="thi-cong" space="far" titleId="build-title">
      <SectionTitle id="build-title">{build.title}</SectionTitle>
      <div className={cx(PAGE_GRID, 'mt-8 gap-y-10 lg:mt-10')}>
        <ReconcilePair {...build.pair} className="col-span-4 lg:col-span-5" />
        <AccountFrame screen={build.screen} className="col-span-4 lg:col-span-7">
          <p className="text-title font-semibold text-fg">{build.logTitle}</p>
          <KeyValueList items={build.log} className="mt-4" />
          <div className="mt-5">
            <div className="flex items-baseline justify-between gap-4 text-meta text-fg-2">
              <span>{label}</span>
              <span className="tnum">{pct}%</span>
            </div>
            <Progress value={pct} label={label} className="mt-2" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PhotoSlot need={build.photos[0]!} />
            <PhotoSlot need={build.photos[1]!} className="hidden sm:flex" />
          </div>
        </AccountFrame>
      </div>
    </Section>
  )
}
