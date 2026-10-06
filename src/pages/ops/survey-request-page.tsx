import { Fragment } from 'react'
import { useParams } from 'react-router'
import { Badge } from '@/components/common/ui/badge'
import { buttonClass } from '@/components/common/ui/button'
import { ActivityList } from '@/components/common/ui/lists'
import { PageHeader } from '@/components/common/ui/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/common/ui/panel'
import { QueryBoundary } from '@/components/common/ui/query-boundary'
import { Stat, StatRow } from '@/components/common/ui/stat'
import {
  directionLabel,
  formatAddress,
  formatDateTime,
  shortCode,
  surfaceTypeLabel,
  surveyStatusMeta,
} from '@/features/pre-surveys/components/preSurveyDisplay'
import { Facts } from '@/features/pre-surveys/components/Facts'
import { RoofSimulation } from '@/features/pre-surveys/components/RoofSimulation'
import { useSurveyRequestQuery } from '@/features/pre-surveys/hooks/useSurveyRequests'
import { ROUTES } from '@/routes/paths'
import type { SurveyRequestDetail } from '@/types/res/surveyRequestsRes'

const link = 'text-accent-fg hover:underline'
const num = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })

/** Có toạ độ thì ghim đúng điểm, không thì tìm theo địa chỉ. */
function mapUrl(r: SurveyRequestDetail) {
  if (r.latitude != null && r.longitude != null) return `https://www.google.com/maps?q=${r.latitude},${r.longitude}`
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

  return (
    <QueryBoundary query={query}>
      {(r) => {
        const status = surveyStatusMeta(r.status)
        const map = mapUrl(r)
        return (
          <>
            <PageHeader
              back={{ to: ROUTES.ops.surveys, label: 'Yêu cầu khảo sát' }}
              meta={
                <>
                  <Badge tone={status.tone}>{status.label}</Badge>
                  <span className="tnum">Mã {shortCode(r.surveyRequestId)}</span>
                </>
              }
              title={r.propertyName || 'Công trình chưa đặt tên'}
              description={formatAddress(r)}
              actions={
                <>
                  {r.customerPhone && (
                    <a className={buttonClass('primary')} href={`tel:${r.customerPhone}`}>
                      Gọi {r.customerPhone}
                    </a>
                  )}
                  {r.customerEmail && (
                    <a className={buttonClass('secondary')} href={`mailto:${r.customerEmail}`}>
                      Gửi email
                    </a>
                  )}
                  {map && (
                    <a className={buttonClass('secondary')} href={map} target="_blank" rel="noreferrer">
                      Xem bản đồ
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
                        ...(r.latitude != null && r.longitude != null
                          ? [
                              {
                                k: 'Toạ độ',
                                v: (
                                  <a className={`tnum ${link}`} href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`} target="_blank" rel="noreferrer">
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

              <div className="space-y-4 lg:border-l lg:border-line lg:pl-6">
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
                            <a className={`tnum ${link}`} href={`tel:${r.customerPhone}`}>
                              {r.customerPhone}
                            </a>
                          ) : (
                            '—'
                          ),
                        },
                        {
                          k: 'Email',
                          v: r.customerEmail ? (
                            <a className={`wrap-anywhere ${link}`} href={`mailto:${r.customerEmail}`}>
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
                        { time: formatDateTime(r.submittedAt), title: 'Khách gửi yêu cầu' },
                        ...(r.assignedAt ? [{ time: formatDateTime(r.assignedAt), title: 'Bạn nhận yêu cầu' }] : []),
                        {
                          time: r.scheduledAt ? formatDateTime(r.scheduledAt) : 'Chưa hẹn',
                          title: 'Khảo sát tại công trình',
                          body: r.salesNote ?? undefined,
                        },
                      ]}
                    />
                  </PanelBody>
                </Panel>
              </div>
            </div>
          </>
        )
      }}
    </QueryBoundary>
  )
}
