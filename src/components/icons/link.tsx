import type { SVGProps } from 'react'

const Link = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      d="M10.5 13.5 13.5 10.5M8.5 12.5 6.9 14.1a3.6 3.6 0 1 0 5.1 5.1l2.2-2.2a3.6 3.6 0 0 0 0-5.1M15.5 11.5l1.6-1.6A3.6 3.6 0 1 0 12 4.8L9.8 7a3.6 3.6 0 0 0 0 5.1"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
    />
  </svg>
)

export { Link }
