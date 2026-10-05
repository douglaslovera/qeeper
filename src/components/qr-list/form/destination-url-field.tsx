import { Check } from '@/components/icons/check'
import { Close } from '@/components/icons/close'
import { Edit } from '@/components/icons/edit'
import { ExternalLink } from '@/components/icons/external-link'
import { Link } from '@/components/icons/link'
import { LoadingDots } from '@/components/shared/loading-dots'
import { updateUrlDynamicQR } from '@/data/actions/dynamic-code-actions'
import { useTranslations } from '@/i18n/provider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SCHEME = /^([a-z][a-z\d+.-]*:\/\/)?(.*)$/i

const iconButton =
  'flex w-14 shrink-0 items-center justify-center border-l-4 border-black transition-colors disabled:cursor-not-allowed'

export const DestinationUrlField = ({
  id,
  destinationUrl,
}: {
  id: string
  destinationUrl: string
}) => {
  const t = useTranslations()
  const router = useRouter()
  const [savedUrl, setSavedUrl] = useState(destinationUrl)
  const [draft, setDraft] = useState(destinationUrl)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [, scheme = '', rest] = savedUrl.match(SCHEME) ?? []

  const startEditing = () => {
    setDraft(savedUrl)
    setIsEditing(true)
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const url = draft.trim()
    if (url === savedUrl) return setIsEditing(false)

    setIsSaving(true)
    const response = await updateUrlDynamicQR(id, url)
    setIsSaving(false)

    if (response) {
      setSavedUrl(url)
      setIsEditing(false)
      // Refetch the list so search and sort see the new URL.
      router.refresh()
    } else {
      // TODO: add toast notification for error
      alert(t('updateError'))
    }
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="flex h-14 border-4 border-black bg-main/20"
      >
        <label className="flex min-w-0 flex-1 items-center gap-3 px-5">
          <Link className="size-6 shrink-0" />
          <span className="sr-only">{t('destinationUrl')}</span>
          <input
            type="url"
            required
            // biome-ignore lint/a11y/noAutofocus: focus follows the edit button the user just pressed
            autoFocus
            value={draft}
            disabled={isSaving}
            placeholder={t('urlPlaceholder')}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setIsEditing(false)}
            className="h-full min-w-0 flex-1 bg-transparent font-bold placeholder:text-black/35 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          aria-label={t('save')}
          title={t('save')}
          disabled={isSaving}
          aria-busy={isSaving}
          className={`${iconButton} bg-main enabled:hover:bg-main/80`}
        >
          {isSaving ? <LoadingDots /> : <Check className="size-6" />}
        </button>
        <button
          type="button"
          aria-label={t('cancel')}
          title={t('cancel')}
          disabled={isSaving}
          onClick={() => setIsEditing(false)}
          className={`${iconButton} bg-white enabled:hover:bg-main/20 disabled:opacity-50`}
        >
          <Close className="size-6" />
        </button>
      </form>
    )
  }

  return (
    <div className="flex h-14 border-4 border-black">
      <a
        href={savedUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex min-w-0 flex-1 items-center gap-3 px-5 font-bold transition-colors hover:bg-main/20"
      >
        <Link className="size-6 shrink-0 group-hover:hidden group-focus-visible:hidden" />
        <ExternalLink className="hidden size-6 shrink-0 group-hover:block group-focus-visible:block" />
        <span className="truncate">
          <span className="text-black/40">{scheme}</span>
          {rest}
        </span>
      </a>
      <button
        type="button"
        aria-label={t('editDestination')}
        title={t('editDestination')}
        onClick={startEditing}
        className={`${iconButton} bg-main hover:bg-main/80`}
      >
        <Edit className="size-6" color="currentColor" aria-hidden="true" />
      </button>
    </div>
  )
}
