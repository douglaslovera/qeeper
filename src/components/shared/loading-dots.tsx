import { cn } from '@/lib'

export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn('flex gap-1', className)} aria-hidden="true">
      <span className="size-1.5 animate-dot bg-current" />
      <span className="size-1.5 animate-dot bg-current [animation-delay:150ms]" />
      <span className="size-1.5 animate-dot bg-current [animation-delay:300ms]" />
    </span>
  )
}
