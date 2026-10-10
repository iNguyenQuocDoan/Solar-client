import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { Input } from '@/components/common/ui/field'
import { cx } from '@/utils/cx'
import { keepInView } from '@/utils/scroll'

/*
  Ô nhập kèm danh sách để chọn (mẫu "editable combobox, list autocomplete" của WAI-ARIA APG), cho danh sách dài mà
  <select> không tìm được (phường, xã: mọi tên đều bắt đầu bằng "Phường"/"Xã" nên gõ chữ đầu không nhảy tới đâu).
  - Gõ để lọc, không phân biệt hoa thường và dấu: "ben thanh" ra "Phường Bến Thành"; mỗi từ gõ vào phải có trong tên.
  - Mũi tên lên / xuống đi trong danh sách, Enter điền mục đang trỏ, Esc đóng. Danh sách đóng thì Enter vẫn gửi form.
  - Giá trị là chữ trong ô (form giữ chuỗi như mọi ô khác). Rời ô mà chữ khớp đúng một mục thì đổi về đúng tên trong
    danh sách (sửa hoa thường, dấu); có nằm trong danh sách không là việc của trang kiểm tra khi gửi.
*/

export function normalizeSearch(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function Combobox({
  id,
  value,
  onChange,
  options,
  listLabel,
  emptyText = 'Không có mục nào khớp.',
  placeholder,
  invalid,
  disabled,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  options: string[]
  /** Tên của danh sách cho trình đọc màn hình, thường trùng nhãn ô. */
  listLabel: string
  emptyText?: string
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
}) {
  const listId = useId()
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const indexed = useMemo(() => options.map((label) => ({ label, key: normalizeSearch(label) })), [options])
  const query = normalizeSearch(value)
  const exact = query ? indexed.find((o) => o.key === query) : undefined
  // Ô đang chứa đúng một mục (vừa chọn) thì mở ra vẫn thấy đủ danh sách để đổi, không chỉ mỗi mục đó.
  const words = exact ? [] : query.split(' ').filter(Boolean)
  const shown = words.length === 0 ? indexed : indexed.filter((o) => words.every((w) => o.key.includes(w)))
  const optionId = (i: number) => `${listId}-${i}`

  // Mục đang trỏ luôn hiện trong khung danh sách (cuộn khung, không cuộn trang).
  useEffect(() => {
    const list = listRef.current
    const item = active >= 0 ? document.getElementById(`${listId}-${active}`) : null
    if (open && list && item) keepInView(list, item)
  }, [active, open, listId])

  function openList(at: number) {
    setOpen(true)
    // Mở ra trỏ sẵn vào mục đang chọn để Enter giữ nguyên, mũi tên đi tiếp từ đó.
    const current = exact ? shown.indexOf(exact) : -1
    setActive(current >= 0 ? current : at)
  }

  function choose(label: string) {
    onChange(label)
    setOpen(false)
    setActive(-1)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const last = shown.length - 1
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) openList(0)
      else setActive((a) => Math.min(last, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) openList(last)
      else setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      if (open && active >= 0 && shown[active]) {
        e.preventDefault()
        choose(shown[active].label)
      }
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <Input
        id={id}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 && shown[active] ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className="pr-10"
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onClick={() => !open && openList(-1)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          setOpen(false)
          if (exact && exact.label !== value) onChange(exact.label)
        }}
      />
      {/* Nút mở như mũi tên của <select>: chuột bấm được, bàn phím dùng mũi tên xuống nên bỏ khỏi thứ tự Tab. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label={open ? 'Đóng danh sách' : 'Mở danh sách'}
        disabled={disabled}
        onMouseDown={(e) => {
          // Giữ focus ở ô nhập (nếu không, ô mất focus và danh sách đóng ngay khi vừa mở).
          e.preventDefault()
          document.getElementById(id)?.focus()
          if (open) setOpen(false)
          else openList(-1)
        }}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-fg-3 hover:text-fg disabled:pointer-events-none"
      >
        <Icon name={open ? 'expand_less' : 'expand_more'} className="text-[20px]" />
      </button>
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={listLabel}
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 mt-1 max-h-64 overflow-y-auto overscroll-contain rounded-container border border-line bg-canvas p-1 shadow-pop scrollbar-thin"
      >
        {shown.length === 0 ? (
          <li role="presentation" className="px-3 py-2 text-body text-fg-3">
            {emptyText}
          </li>
        ) : (
          shown.map((o, i) => (
            <li
              key={o.label}
              id={optionId(i)}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onMouseMove={() => i !== active && setActive(i)}
              onClick={() => choose(o.label)}
              className={cx(
                'flex cursor-pointer items-center justify-between gap-3 rounded-control px-3 py-2 text-body',
                i === active ? 'bg-hover text-fg' : 'text-fg-2',
              )}
            >
              <span className={cx(o === exact && 'font-semibold text-fg')}>{o.label}</span>
              {o === exact && <Icon name="check" className="shrink-0 text-[20px] text-accent-fg" />}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
