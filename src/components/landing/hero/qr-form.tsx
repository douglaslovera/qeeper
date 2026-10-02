import { useTranslations } from '@/i18n/provider'
import { useState } from 'react'
import { API_BASE_URL } from '@/constants/app'
/* actions */
import { createDynamicQR } from '@/data/actions/dynamic-code-actions'
/* components */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { LightningBolt } from '@/components/icons/lightning-bolt'
import { Qr } from '@/components/icons/qr'
import { Link } from '@/components/icons/link'
import { generateQr } from '@/utils/generate-qr'

interface Props {
  setSvg: (svg: string | null) => void
  isUserLogged: boolean
  defaultDynamicSwitch?: boolean
}

export function QrGenerationForm({
  setSvg,
  isUserLogged,
  defaultDynamicSwitch,
}: Props) {
  const t = useTranslations()
  const isDynamicQrDisabled = !isUserLogged

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const form = evt.currentTarget
    const { value } = form.url
    const { checked: isDynamic } = form.is_dynamic

    if (!value) return
    // TODO: Check the value is a valid URL

    if (!isDynamic) {
      const svg = await generateQr(value)
      setSvg(svg)
    } else {
      if (!isUserLogged) return
      const data = await createDynamicQR(value)
      if (!data) return
      setSvg(data)
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
          <span className="relative">
            <Input
              id="landing-url"
              name="url"
              placeholder={t('urlPlaceholder')}
              required
              className="h-14 rounded-none border-4 px-5 pl-14 text-base font-bold shadow-none placeholder:text-black/35"
            />
            <span className="pointer-events-none absolute left-5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center text-black">
              <Link className="size-6" />
            </span>
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
          <Switch
            label={t('dynamicQr')}
            aria-label={t('dynamicQr')}
            disabled={isDynamicQrDisabled}
            name="is_dynamic"
            checked={defaultDynamicSwitch}
          />
        </div>

        <div className="flex items-center gap-3 border-2 border-dashed border-black px-4 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center bg-main">
            <LightningBolt className="size-5" />
          </span>
          <p className="text-xs font-bold leading-5 sm:text-sm">
            {t('dynamicHelp')}
          </p>
        </div>
      </div>
      <div>
        <Button
          type="submit"
          disabled={!API_BASE_URL}
          className="h-14 w-full rounded-none border-4 text-2xl font-black uppercase shadow-[8px_8px_0_#000]"
        >
          <Qr className="size-8" />
          <span className="flex flex-1 justify-center px-3">{t('generate')}</span>
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
