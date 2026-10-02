import { useTranslations } from '@/i18n/provider'
import type { ClientIQRS } from '@/data/models/IQRs'
import { cn } from '@/lib'
import { QrImage } from '../shared/qr-image'
import { Accordion } from '../shared/accordion'
import { EditForm } from './form/edit-form'
import { DownloadButton } from '../landing/hero/download-button'
import { Download } from '../icons/download'
import { Eye } from '../icons/eye'
import { Link } from '../icons/link'

type Props = ClientIQRS

export function Item({
  alias,
  createdAt,
  destinationUrl,
  disabled,
  userId,
  views,
  shortUrl,
  svg,
}: Props) {
  const t = useTranslations()
  return (
    <article className="border-4 border-black bg-white shadow-[12px_12px_0_#000]">
      <header className="flex items-center justify-between gap-3 bg-black px-5 py-2 text-white sm:px-8">
        <p className="min-w-0 truncate font-mono text-sm font-bold">
          <span className="text-white/60">{t('alias')}</span>{' '}
          {disabled ? (
            alias
          ) : (
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="decoration-2 underline-offset-2 hover:text-main hover:underline"
            >
              {alias}
            </a>
          )}
        </p>
        <span
          className={cn(
            'shrink-0 border-2 border-white px-2 py-0.5 text-xs font-black uppercase',
            disabled ? 'bg-rose-500 text-white' : 'bg-main text-black',
          )}
        >
          {t(disabled ? 'disabled' : 'active')}
        </span>
      </header>

      <div className="px-5 py-6 sm:px-8">
        <div
          className={cn(
            'grid grid-cols-1 gap-6 sm:grid-cols-[1fr_11rem]',
            disabled && 'opacity-60',
          )}
        >
          <div className="flex min-w-0 flex-col gap-4">
            <div>
              <p className="mb-2 text-sm font-black uppercase sm:text-base">
                {t('destinationUrl')}
              </p>
              <a
                href={destinationUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-14 items-center gap-3 border-4 border-black px-5 font-bold transition-colors hover:bg-main/20"
              >
                <Link className="size-6 shrink-0" />
                <span className="truncate">{destinationUrl}</span>
              </a>
            </div>

            <div className="flex w-fit items-center gap-3 border-2 border-dashed border-black px-4 py-2">
              <span className="flex size-9 shrink-0 items-center justify-center bg-main">
                <Eye className="size-5" />
              </span>
              <p className="flex items-baseline gap-2">
                <span className="text-sm font-black uppercase">{t('views')}</span>
                <span className="text-2xl font-black leading-none">
                  {views ?? 0}
                </span>
              </p>
            </div>
          </div>

          <div className="mx-auto flex w-44 flex-col gap-4 sm:mx-0">
            <div className="overflow-hidden border-4 border-black">
              <QrImage svg={svg} className="rounded-none border-0 p-0" />
            </div>

            <DownloadButton
              svg={svg}
              disabled={disabled}
              className="h-12 rounded-none border-4 text-base font-black uppercase shadow-[6px_6px_0_#000]"
              icon={<Download className="size-6" />}
            />
          </div>
        </div>

        <Accordion
          title={t('manageQr')}
          containerClassName="mt-8 border-4 border-black bg-white"
          titleClassName="text-base font-black uppercase sm:text-lg"
        >
          <EditForm
            id={alias}
            destinationUrl={destinationUrl}
            disabled={disabled}
          />
        </Accordion>
      </div>
    </article>
  )
}
