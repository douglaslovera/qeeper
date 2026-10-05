'use client'

import type { ClientIQRS } from '@/data/models/IQRs'
import { useTranslations } from '@/i18n/provider'
import { useState } from 'react'
import { Item } from './item'
import type { SortOption } from './sort-menu'
import { type StatusFilter, Toolbar } from './toolbar'

// Compare by domain, ignoring the protocol.
const domainOf = (url: string) => url.replace(/^[a-z][a-z\d+.-]*:\/\//i, '')

const compare: Record<SortOption, (a: ClientIQRS, b: ClientIQRS) => number> = {
  status: (a, b) => Number(a.disabled) - Number(b.disabled),
  views: (a, b) => (b.views ?? 0) - (a.views ?? 0),
  az: (a, b) =>
    domainOf(a.destinationUrl).localeCompare(domainOf(b.destinationUrl)),
  za: (a, b) =>
    domainOf(b.destinationUrl).localeCompare(domainOf(a.destinationUrl)),
}

type Props = {
  list: ClientIQRS[] | null
}

export function List({ list }: Props) {
  const t = useTranslations()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortOption | null>(null)

  const normalizedQuery = query.trim().toLowerCase()
  const filtered = (list ?? []).filter((item) => {
    if (status === 'active' && item.disabled) return false
    if (status === 'disabled' && !item.disabled) return false
    return item.destinationUrl.toLowerCase().includes(normalizedQuery)
  })
  if (sort) filtered.sort(compare[sort])

  return (
    <>
      <Toolbar
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />
      <section className="mt-10 flex flex-col gap-10 pr-3">
        {filtered.map((item) => (
          <Item key={item.alias} {...item} />
        ))}
        {filtered.length === 0 && !!list?.length && (
          <p className="border-4 border-dashed border-black bg-white/60 px-5 py-8 text-center font-bold">
            {t('noResults')}
          </p>
        )}
      </section>
    </>
  )
}
