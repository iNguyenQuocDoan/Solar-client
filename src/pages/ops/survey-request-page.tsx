import { Fragment } from 'react'
import { useParams } from 'react-router'
import { Badge } from '@/components/common/ui/badge'
import { buttonClass } from '@/components/common/ui/button'
import { ActivityList } from '@/components/common/ui/lists'
import { PageHeader } from '@/components/common/ui/page-header'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { Panel, PanelAside, PanelBody, PanelHeader } from '@/components/common/ui/panel'
import { QueryBoundary } from '@/components/common/ui/query-boundary'
import { usePageCrumb } from '@/components/layout/page-crumb'
import { Stat, StatRow } from '@/components/common/ui/stat'
import {
  directionLabel,
  formatAddress,
  formatDateTime,
  hasCoordinates,
  needsScheduling,
  shortCode,
  surfaceTypeLabel,
  surveyStatusMeta,
} from '@/features/pre-surveys/components/preSurveyDisplay'
import { Facts } from '@/features/pre-surveys/components/Facts'
import { RoofSimulation } from '@/features/pre-surveys/components/RoofSimulation'
import { useSurveyRequestQuery } from '@/features/pre-surveys/hooks/useSurveyRequests'
import type { SurveyRequestDetail } from '@/types/res/surveyRequestsRes'

const num = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })

/* Mốc "Khảo sát tại công trình": hoàn tất là đã xong, huỷ thì không diễn ra, còn lại là bước đang tới. */
function surveyStepState(status: number): 'done' | 'current' | 'todo' {
  if (status === 5) return 'done'
  if (status === 6) return 'todo'
  return 'current'
}

/** Có toạ độ thì ghim đúng điểm, không thì tìm theo địa chỉ. */
function mapUrl(r: SurveyRequestDetail) {
  if (hasCoordinates(r.latitude, r.longitude)) return `https://www.google.com/maps?q=${r.latitude},${r.longitude}`
  const address = formatAddress(r)
  return address === '—' ? null : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

/*
  Chi tiết một yêu cầu khảo sát; backend chỉ trả cho sales đã nhận yêu cầu đó.
  Việc chính của sales ở màn này là liên hệ khách để hẹn khảo sát, nên Gọi / Email / Bản đồ nằm ngay
  dưới tiêu đề; số liệu khách khai đi sau để đối chiếu khi gọi.
*/
export function OpsSurveyRequestPage() {
  const { id } = useParams()
  const query = useSurveyRequestQuery(id)
  usePageCrumb(query.data ? query.data.propertyName || 'Công trình chưa đặt tên' : null)

  return (
    <QueryBoundary query={query}>
      {(r) => {
        const status = surveyStatusMeta(r.status)
        const map = mapUrl(r)
        const unscheduled = !r.scheduledAt && needsScheduling(r.status)
        return (
          <>
            <PageHeader
              meta={
                <>
                  <Badge tone={status.tone}>{status.label}</Badge>
                  {unscheduled && <Badge tone="danger">Chưa hẹn ngày khảo sát</Badge>}
                  <span className="tnum">Mã {shortCode(r.surveyRequestId)}</span>
                </>
              }
              title={r.propertyName || 'Công trình chưa đặt tên'}
              description={formatAddress(r)}
              actions={
                <>
                  {r.customerPhone && (
                    <a className={buttonClass('primary')} href={`tel:${r.customerPhone}`}>
                      <Icon name="call" className="-ml-0.5 text-[20px]" />
                      Gọi {r.customerPhone}
                    </a>
                  )}
                  {r.customerEmail && (
                    <a className={buttonClass('secondary')} href={`mailto:${r.customerEmail}`}>
                      <Icon name="mail" className="-ml-0.5 text-[20px]" />
                      Gửi email
                    </a>
                  )}
                  {map && (
                    <a className={buttonClass('secondary')} href={map} target="_blank" rel="noreferrer">
                      <Icon name="map" className="-ml-0.5 text-[20px]" />
                      Xem bản đồ
                      <span className="sr-only"> (mở tab mới)</span>
                    </a>
                  )}
                </>
              }
            />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <Panel>
                  <PanelHeader title="Số liệu khách khai" description="Đối chiếu khi gọi khách và đo lại khi khảo sát." />
                  <PanelBody className="space-y-6">
                    {/* lg: thay vì md: – StatRow có sẵn md:grid-cols-4 và cx không gộp class, nên chỉ media query muộn hơn mới đè được. */}
                    <StatRow className="lg:grid-cols-3">
                      <Stat label="Diện tích dùng được" value={r.usableAreaM2 == null ? '—' : num.format(r.usableAreaM2)} unit="m²" />
                      <Stat label="Tổng diện tích" value={r.totalAreaM2 == null ? '—' : num.format(r.totalAreaM2)} unit="m²" />
                      <Stat label="Độ dốc mái" value={r.tiltDegree == null ? '—' : num.format(r.tiltDegree)} unit="độ" />
                    </StatRow>
                    <Facts
                      items={[
                        {
                          k: 'Hướng mái',
                          v: r.azimuthDegree == null ? '—' : `${directionLabel(r.azimuthDegree)} (${num.format(r.azimuthDegree)}°)`,
                        },
                        { k: 'Vật cản', v: r.hasObstruction == null ? '—' : r.hasObstruction ? 'Có' : 'Không' },
                        { k: 'Bề mặt', v: surfaceTypeLabel(r.installationSurfaceType) },
                        { k: 'Vật liệu', v: r.surfaceMaterial || '—' },
                        ...(hasCoordinates(r.latitude, r.longitude)
                          ? [
                              {
                                k: 'Toạ độ',
                                v: (
                                  <a className="tnum ui-link" href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`} target="_blank" rel="noreferrer">
                                    {r.latitude}, {r.longitude}
                                  </a>
                                ),
                              },
                            ]
                          : []),
                      ]}
                    />
                  </PanelBody>
                </Panel>
                <Panel>
                  <PanelHeader title="Mô phỏng bố trí" description="Dựng từ số liệu khách khai. Đổi loại tấm để tư vấn khi gọi khách." />
                  <PanelBody>
                    <RoofSimulation
                      totalAreaM2={r.totalAreaM2}
                      usableAreaM2={r.usableAreaM2}
                      tiltDegree={r.tiltDegree}
                      azimuthDegree={r.azimuthDegree}
                      hasObstruction={r.hasObstruction}
                    />
                  </PanelBody>
                </Panel>
              </div>

              <PanelAside aria-label="Khách hàng và tiến độ">
                <Panel>
                  <PanelHeader title="Khách hàng" />
                  <PanelBody>
                    <Facts
                      column
                      items={[
                        { k: 'Họ tên', v: r.customerName || '—' },
                        {
                          k: 'Điện thoại',
                          v: r.customerPhone ? (
                            <a className="tnum ui-link" href={`tel:${r.customerPhone}`}>
                              {r.customerPhone}
                            </a>
                          ) : (
                            '—'
                          ),
                        },
                        {
                          k: 'Email',
                          v: r.customerEmail ? (
                            <a className="ui-link wrap-anywhere" href={`mailto:${r.customerEmail}`}>
                              {/* Cột hẹp: ưu tiên xuống dòng ngay sau "@" thay vì giữa tên miền. */}
                              {r.customerEmail.split('@').map((part, i) => (i === 0 ? part : [<Fragment key={i}>@<wbr /></Fragment>, part]))}
                            </a>
                          ) : (
                            '—'
                          ),
                        },
                      ]}
                    />
                  </PanelBody>
                </Panel>

                <Panel>
                  <PanelHeader title="Tiến độ" />
                  <PanelBody>
                    <ActivityList
                      items={[
                        { time: formatDateTime(r.submittedAt), title: 'Khách gửi yêu cầu', state: 'done' },
                        ...(r.assignedAt ? [{ time: formatDateTime(r.assignedAt), title: 'Bạn nhận yêu cầu', state: 'done' as const }] : []),
                        {
                          // "Chưa hẹn" đã là nhãn đỏ ở đầu trang: ở đây chỉ ghi chữ, không báo đỏ lần hai.
                          time: r.scheduledAt ? formatDateTime(r.scheduledAt) : unscheduled ? 'Chưa hẹn ngày' : '—',
                          title: 'Khảo sát tại công trình',
                          body: r.salesNote ?? undefined,
                          state: surveyStepState(r.status),
                        },
                      ]}
                    />
                  </PanelBody>
                </Panel>
              </PanelAside>
            </div>
          </>
        )
      }}
    </QueryBoundary>
  )
}
