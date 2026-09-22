import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  LANDING_CONTAINER,
  LandingSection,
} from "@/components/landing/section";
import { ROUTES } from "@/constants/routes";
import { publicNav } from "@/lib/nav";
import { cn } from "@/lib/cn";

/*
 * Trang chủ tạm "/" – chỉ là khung bố cục.
 * Mỗi section ứng với một mục trên header (publicNav), cùng id để menu cuộn tới được.
 * Trong section chỉ đặt các ô placeholder có nhãn, chưa có nội dung thật.
 * Khi có nội dung, thay từng ô bằng component trong src/components/landing.
 */

type Box = { label: string; span?: 1 | 2 | 3 | 4; tall?: boolean };

type SectionSpec = {
  /** Số cột của lưới ở màn rộng */
  cols: 2 | 3 | 4;
  /** Ghi chú ngắn dưới tiêu đề: khối này sẽ chứa gì */
  note: string;
  boxes: Box[];
};

/** Bố cục từng section, khoá theo hash trên header. */
const sections: Record<string, SectionSpec> = {
  "#solutions": {
    cols: 3,
    note: "Các nhóm giải pháp: hộ gia đình, thương mại & công nghiệp, lưu trữ pin.",
    boxes: [
      { label: "Giải pháp 1" },
      { label: "Giải pháp 2" },
      { label: "Giải pháp 3" },
    ],
  },
  "#products": {
    cols: 4,
    note: "Tấm pin, inverter, pin lưu trữ, phụ kiện – mỗi ô một sản phẩm nổi bật.",
    boxes: [
      { label: "Sản phẩm 1" },
      { label: "Sản phẩm 2" },
      { label: "Sản phẩm 3" },
      { label: "Sản phẩm 4" },
    ],
  },
  "#process": {
    cols: 4,
    note: "Các bước từ khảo sát sơ bộ đến nghiệm thu, đọc theo hàng ngang.",
    boxes: [
      { label: "Bước 1" },
      { label: "Bước 2" },
      { label: "Bước 3" },
      { label: "Bước 4" },
    ],
  },
  "#after-sales": {
    cols: 2,
    note: "Chính sách bảo hành và lịch bảo trì định kỳ.",
    boxes: [
      { label: "Bảo hành", tall: true },
      { label: "Bảo trì", tall: true },
    ],
  },
  "#about": {
    cols: 3,
    note: "Giới thiệu công ty, số liệu và chứng chỉ.",
    boxes: [
      { label: "Giới thiệu", span: 3, tall: true },
      { label: "Số liệu 1" },
      { label: "Số liệu 2" },
      { label: "Số liệu 3" },
    ],
  },
};

const colClasses = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

const spanClasses = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
} as const;

/** Ô placeholder: viền đứt, nhãn ở giữa. */
function PlaceholderBox({
  label,
  span = 1,
  tall = false,
  className,
}: Box & { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest text-label-lg text-outline",
        tall ? "min-h-56" : "min-h-36",
        spanClasses[span],
        className,
      )}
    >
      {label}
    </div>
  );
}

function Hero() {
  return (
    <LandingSection id="top" tone="low" spacing="2xl">
      <div
        className={cn(LANDING_CONTAINER, "grid gap-space-md lg:grid-cols-12")}
      >
        <div className="flex flex-col gap-space-md lg:col-span-6">
          <span className="text-label-lg text-primary-container">
            Trang chủ
          </span>
          <PlaceholderBox label="Tiêu đề + mô tả" tall />
          <div className="flex flex-wrap gap-space-sm">
            <Link
              to={ROUTES.customer.assessment}
              className="inline-flex items-center justify-center rounded-xl bg-primary-container px-space-lg py-3 text-label-lg text-on-primary transition-colors hover:bg-primary"
            >
              Khảo sát mái nhà
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center justify-center rounded-xl bg-surface-container-lowest px-space-lg py-3 text-label-lg text-primary-container transition-colors hover:bg-surface-container"
            >
              Đăng nhập
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-space-sm">
            <PlaceholderBox label="Số liệu 1" className="min-h-20" />
            <PlaceholderBox label="Số liệu 2" className="min-h-20" />
            <PlaceholderBox label="Số liệu 3" className="min-h-20" />
          </div>
        </div>
        <PlaceholderBox
          label="Hình minh hoạ"
          className="min-h-72 lg:col-span-6 lg:min-h-full"
        />
      </div>
    </LandingSection>
  );
}

export function HomeLayoutPage() {
  const { hash } = useLocation();

  // Vào "/" kèm hash (ví dụ từ footer của một route khác) thì cuộn tới section đó.
  useEffect(() => {
    if (!hash) return;
    document
      .querySelector(hash)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  // Bỏ "Trang chủ" (#top) vì hero đã đảm nhiệm; các mục còn lại đi theo thứ tự header.
  const items = publicNav.flatMap((item) => {
    const spec = sections[item.hash];
    return item.hash !== "#top" && spec ? [{ ...item, spec }] : [];
  });

  return (
    <div className="flex w-full flex-col">
      <Hero />
      {items.map(({ label, hash, spec }, index) => (
        <LandingSection
          key={hash}
          id={hash.slice(1)}
          tone={index % 2 === 1 ? "low" : "surface"}
          spacing="2xl"
        >
          <div className={cn(LANDING_CONTAINER, "flex flex-col gap-space-lg")}>
            <div className="flex flex-col gap-space-2xs">
              <h2 className="text-headline-xl-mobile text-primary md:text-headline-xl">
                {label}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                {spec.note}
              </p>
            </div>
            <div
              className={cn(
                "grid grid-cols-1 gap-space-md",
                colClasses[spec.cols],
              )}
            >
              {spec.boxes.map((box) => (
                <PlaceholderBox key={box.label} {...box} />
              ))}
            </div>
          </div>
        </LandingSection>
      ))}
    </div>
  );
}
