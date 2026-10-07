import { useTranslations } from '@/i18n/provider'
import { cn } from '@/lib'
import { Search } from '../icons/search'
import { SortMenu, type SortOption } from './sort-menu'

export type StatusFilter = 'all' | 'active' | 'disabled'

const FILTERS: StatusFilter[] = ['all', 'active', 'disabled']

type Props = {
  query: string
  onQueryChange: (query: string) => void
  status: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  sort: SortOption | null
  onSortChange: (sort: SortOption | null) => void
  // e.g. "3/5", shown on the Active filter; null for unlimited plans
  activeUsage: string | null
}

export function Toolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  activeUsage,
}: Props) {
  const t = useTranslations()
  return (
    <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-stretch">
      <label className="flex h-14 min-w-0 shrink-0 items-center gap-3 border-4 border-black bg-white px-5 shadow-[6px_6px_0_#000] focus-within:bg-main/20 sm:flex-1">
        <Search className="size-6 shrink-0" />
        <span className="sr-only">{t('searchByUrl')}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t('searchByUrl')}
          className="h-full min-w-0 flex-1 appearance-none rounded-none bg-transparent text-base font-bold placeholder:text-black/50 focus:outline-none"
        />
      </label>

      <SortMenu value={sort} onChange={onSortChange} />

      <fieldset className="flex h-14 border-4 border-black bg-white shadow-[6px_6px_0_#000]">
        <legend className="sr-only">{t('filterByStatus')}</legend>
        {FILTERS.map((filter, i) => (
          <button
            key={filter}
            type="button"
            aria-pressed={status === filter}
            onClick={() => onStatusChange(filter)}
            className={cn(
              'flex-1 border-black px-4 text-sm font-black uppercase transition-colors sm:flex-none',
              i > 0 && 'border-l-4',
              status === filter
                ? filter === 'disabled'
                  ? 'bg-rose-500 text-white'
                  : 'bg-main text-black'
                : 'hover:bg-main/20',
            )}
          >
            {t(filter)}
            {filter === 'active' && activeUsage && ` ${activeUsage}`}
          </button>
        ))}
      </fieldset>
    </div>
  )
}
