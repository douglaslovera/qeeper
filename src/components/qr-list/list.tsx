'use client'

import type { ClientIQRS } from '@/data/models/IQRs'
import { Item } from './item'

type Props = {
  list: ClientIQRS[] | null
}

export function List({ list }: Props) {
  return (
    <section className="mt-16 flex flex-col gap-10 pr-3">
      {list?.map((item) => (
        <Item key={item.alias} {...item} />
      ))}
    </section>
  )
}
