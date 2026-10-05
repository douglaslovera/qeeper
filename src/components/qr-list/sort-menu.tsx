import type { MessageKey } from '@/i18n/messages'
import { useTranslations } from '@/i18n/provider'
import { cn } from '@/lib'
import { useEffect, useRef, useState } from 'react'
import { Sort } from '../icons/sort'

export type SortOption = 'status' | 'views' | 'az' | 'za'

const OPTIONS: { value: SortOption; label: MessageKey }[] = [
  { value: 'status', label: 'sortStatus' },
  { value: 'views', label: 'views' },
  { value: 'az', label: 'sortAz' },
  { value: 'za', label: 'sortZa' },
]

type Props = {
  value: SortOption | null
  onChange: (value: SortOption | null) => void
}

export function SortMenu({ value, onChange }: Props) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = OPTIONS.find((option) => option.value === value)

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={
          selected ? `${t('sortBy')} ${t(selected.label)}` : t('sort')
        }
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-14 w-full items-center justify-center gap-2 border-4 border-black px-4 text-sm font-black uppercase shadow-[6px_6px_0_#000] transition-colors',
          selected ? 'bg-main' : 'bg-white hover:bg-main/20',
        )}
      >
        <Sort className="size-5 shrink-0" />
        {/* Every label shares one grid cell so the button keeps the width of the longest */}
        <span className="grid whitespace-nowrap">
          {[{ value: null, label: 'sort' as MessageKey }, ...OPTIONS].map(
            (option) => (
              <span
                key={option.label}
                aria-hidden={option.value !== value}
                className={cn(
                  '[grid-area:1/1]',
                  option.value !== value && 'invisible',
                )}
              >
                {t(option.label)}
              </span>
            ),
          )}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-3 flex w-full min-w-48 flex-col border-4 border-black bg-white shadow-[6px_6px_0_#000] sm:w-auto">
          <p className="bg-black px-4 py-2 text-xs font-black uppercase text-white">
            {t('sortBy')}
          </p>
          {OPTIONS.map((option, i) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={value === option.value}
              onClick={() => {
                // Picking the active option again clears the sort.
                onChange(value === option.value ? null : option.value)
                setIsOpen(false)
              }}
              className={cn(
                'px-4 py-3 text-left text-sm font-black uppercase transition-colors',
                i > 0 && 'border-t-2 border-black',
                value === option.value ? 'bg-main' : 'hover:bg-main/20',
              )}
            >
              {t(option.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
