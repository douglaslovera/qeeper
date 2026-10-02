import { useEffect, useState } from 'react'

import { cn } from '@/lib'

const LINKS = [
  'google.com/maps',
  'x.com/NASA',
  'doulo.dev',
  'github.com/vercel/next.js',
  'youtube.com/watch?v=dQw4w9WgXcQ',
  'en.wikipedia.org/wiki/Steve_Jobs',
  'instagram.com/notionhq',
]

// The first link is repeated at the end so the roll can wrap around seamlessly
const ITEMS = [...LINKS, LINKS[0]]

export function RollingLinks({ className }: { className?: string }) {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setAnimate(true)
      setIndex((i) => (i >= LINKS.length ? 1 : i + 1))
    }, 1800)
    return () => clearInterval(id)
  }, [])

  const handleTransitionEnd = () => {
    if (index !== LINKS.length) return
    setAnimate(false)
    setIndex(0)
  }

  return (
    <span className={cn('block overflow-hidden', className)} aria-hidden="true">
      <span
        className={cn(
          'flex flex-col',
          animate && 'transition-transform duration-500 ease-out motion-reduce:transition-none',
        )}
        style={{ transform: `translateY(-${(index * 100) / ITEMS.length}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {ITEMS.map((link, i) => (
          <span key={`${link}-${i}`} className="block truncate">
            {link}
          </span>
        ))}
      </span>
    </span>
  )
}
