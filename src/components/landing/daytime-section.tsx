import { daytime } from '@/lib/mock/landing'
import { LANDING_CONTAINER } from './classes'
import { PhotoSlot } from './photo-slot'

/*
  Giá trị cốt lõi nói bằng một câu lớn, đặt chồng lên mép dưới một ảnh tràn viền (desktop): khối chữ
  nền canvas lấn lên ảnh 160px, lùi 48px khỏi mép container để ảnh còn lộ bên trái.
  Mobile: ảnh 4:3 rồi tới chữ, không chồng.
*/
export function DaytimeSection() {
  return (
    <section id={daytime.id} aria-labelledby="daytime-title" className="pt-16 lg:pt-24">
      <PhotoSlot photo={daytime.photo} bleed className="aspect-4/3 md:aspect-16/9 lg:aspect-21/9" />
      <div className={LANDING_CONTAINER}>
        <div className="relative bg-canvas pt-6 lg:-mt-40 lg:-ml-12 lg:w-3/4 lg:px-12 lg:pt-12">
          <h2 id="daytime-title" className="ld-statement text-fg">
            {daytime.statement}
          </h2>
          <p className="mt-4 max-w-copy ld-body text-fg-2 lg:mt-6">{daytime.note}</p>
        </div>
      </div>
    </section>
  )
}
