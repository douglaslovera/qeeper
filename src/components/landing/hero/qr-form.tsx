import { useTranslations } from '@/i18n/provider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { API_BASE_URL } from '@/constants/app'
/* actions */
import { createDynamicQR } from '@/data/actions/dynamic-code-actions'
/* components */
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Qr } from '@/components/icons/qr'
import { Link } from '@/components/icons/link'
import { LoadingDots } from '@/components/shared/loading-dots'
import { generateQr } from '@/utils/generate-qr'

const DEFAULT_SCHEME = 'https://'

// Splits off a leading http(s):// so it can be shown as a separate prefix.
const splitScheme = (value: string) => {
  const match = value.match(/^\s*(https?:\/\/)/i)
  return match
    ? { scheme: match[1].toLowerCase(), rest: value.slice(match[0].length) }
    : { scheme: DEFAULT_SCHEME, rest: value }
}

const isValidUrl = (value: string) => {
  try {
    return Boolean(new URL(value).hostname)
  } catch {
    return false
  }
}

interface Props {
  setSvg: (svg: string | null) => void
  isUserLogged: boolean
  isDynamic: boolean
  setIsDynamic: (isDynamic: boolean) => void
}

export function QrGenerationForm({
  setSvg,
  isUserLogged,
  isDynamic,
  setIsDynamic,
}: Props) {
  const t = useTranslations()
  const router = useRouter()
  const isDynamicQrDisabled = !isUserLogged
  // Always the full URL. In dynamic mode the scheme is shown as a gray prefix.
  const [url, setUrl] = useState('')
  const { scheme, rest } = splitScheme(url)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleUrlChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.target.setCustomValidity('')
    if (!isDynamic) return setUrl(evt.target.value)

    // A typed or pasted scheme replaces the prefix instead of duplicating it.
    // Otherwise the current prefix is kept, falling back to https:// once empty.
    const { value } = evt.target
    const typed = splitScheme(value)
    if (typed.rest !== value) return setUrl(`${typed.scheme}${typed.rest}`)
    setUrl(value ? `${scheme}${value}` : '')
  }

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    if (isGenerating) return

    const input = evt.currentTarget.url as HTMLInputElement
    const value = isDynamic ? `${scheme}${rest.trim()}` : url

    if (!url) return

    if (isDynamic && !isValidUrl(value)) {
      input.setCustomValidity(t('invalidUrl'))
      input.reportValidity()
      return
    }

    setIsGenerating(true)
    try {
      if (!isDynamic) {
        const svg = await generateQr(value)
        setSvg(svg)
      } else {
        if (!isUserLogged) return
        const data = await createDynamicQR(value)
        if (!data) return
        setSvg(data)
        // Refetch the list so the new QR shows up.
        router.refresh()
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form
      className="flex flex-1 flex-col gap-5"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-2" htmlFor="landing-url">
          <span className="text-sm font-black uppercase sm:text-base">
            {t('destinationUrl')}
          </span>
          <span className="flex h-14 items-center border-4 border-border bg-secondary-background text-base font-bold text-foreground ring-offset-white focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2">
            <Link className="ml-5 mr-3 size-6 shrink-0" />
            {isDynamic && <span className="text-black/40">{scheme}</span>}
            <input
              id="landing-url"
              name="url"
              type="text"
              inputMode="url"
              autoComplete="url"
              value={isDynamic ? rest : url}
              onChange={handleUrlChange}
              placeholder={
                isDynamic
                  ? splitScheme(t('urlPlaceholder')).rest
                  : t('urlPlaceholder')
              }
              required
              className="h-full min-w-0 flex-1 bg-transparent pr-5 placeholder:text-black/35 focus:outline-none"
            />
          </span>
        </label>

        <div className="flex items-center gap-3 bg-main/20 px-4 py-2.5 text-xs font-bold sm:text-sm">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-black font-black">
            i
          </span>
          <span>{t('urlHelp')}</span>
        </div>

        <div title={isDynamicQrDisabled ? t('loginRequired') : undefined}>
          <p className="mb-2 text-sm font-black uppercase sm:text-base">
            {t('dynamicQr')}
          </p>
          <div className="flex items-start gap-3">
            <Switch
              id="landing-is-dynamic"
              disabled={isDynamicQrDisabled}
              name="is_dynamic"
              checked={isDynamic}
              onCheckedChange={setIsDynamic}
            />
            <label
              htmlFor="landing-is-dynamic"
              className="text-xs font-bold leading-5 sm:text-sm"
            >
              {t('dynamicHelp')}
            </label>
          </div>
        </div>
      </div>
      <div>
        <Button
          type="submit"
          disabled={!API_BASE_URL}
          aria-busy={isGenerating}
          className="h-14 w-full rounded-none border-4 text-2xl font-black uppercase shadow-[8px_8px_0_#000]"
        >
          <Qr className="size-8" />
          <span className="flex flex-1 justify-center px-3">
            {isGenerating ? (
              <>
                <LoadingDots className="h-8 items-center [&>span]:size-2" />
                <span className="sr-only">{t('generate')}</span>
              </>
            ) : (
              t('generate')
            )}
          </span>
          <svg
            viewBox="0 0 24 24"
            className="size-8"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Button>
      </div>
    </form>
  )
}
