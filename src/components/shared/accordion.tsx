import { useState } from 'react'

interface AccordionProps {
  children: React.ReactNode
  title: string
  defaultOpen?: boolean
  /** Replaces the default container classes */
  containerClassName?: string
  /** Replaces the default title classes */
  titleClassName?: string
}

export function Accordion({
  children,
  title,
  defaultOpen = false,
  containerClassName,
  titleClassName,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <div
      className={
        containerClassName ??
        'rounded-base border-base bg-white border-base-400 text-md font-base shadow-dark'
      }
    >
      <div
        className="flex justify-between items-center w-full cursor-pointer p-4"
        onClick={toggle}
        onKeyDown={(e) => e.key === 'Enter' && toggle()}
        tabIndex={0}
        // biome-ignore lint/a11y/useSemanticElements: can't be a button because of its children
        role="button"
        aria-expanded={isOpen}
      >
        <p className={titleClassName ?? 'font-bold text-lg'}>{title}</p>
        <span
          className={`text-black text-xl transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </div>
      <div
        className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div
            className={`p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100 transform-none' : 'opacity-0 '}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
