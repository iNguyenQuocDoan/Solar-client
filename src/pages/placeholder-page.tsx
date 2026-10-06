import { PageHeader } from '@/components/common/ui/page-header'
import { EmptyState } from '@/components/common/ui/states'

/*
  Trang chủ của portal chưa có màn nào đổ dữ liệu thật (kỹ thuật viên, quản lý). Các màn mock của
  portal vẫn nằm trong pages/<portal>/ nhưng đã ẩn khỏi menu và route cho tới khi backend có API.
*/
export function PlaceholderPage({ title = 'Tổng quan' }: { title?: string }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        title="Chưa có chức năng nào dùng dữ liệu thật"
        description="Các màn của vai trò này đang chờ backend có API. Màn nào nối xong sẽ hiện lại trên menu."
      />
    </>
  )
}
