import { useTranslations } from '@/i18n/provider'
import type { FetchStatus } from '@/types/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Delete } from '@/components/icons/delete'
import {
  deleteDynamicQR,
  disableDynamicQR,
  enableDynamicQR,
} from '@/data/actions/dynamic-code-actions'

export const EditForm = ({
  id,
  disabled,
}: {
  id: string
  disabled: boolean
}) => {
  const t = useTranslations()
  const router = useRouter()
  const fieldNames = {
    disabled: 'disabled',
    disableViews: 'disableViews',
  }

  const [status, setStatus] = useState<Record<string, FetchStatus>>({})

  const handleUpdateSwitch = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.checked
    const name = event.target.name

    // use a modal here
    const userResponse = confirm(
      t(value ? 'confirmDisable' : 'confirmEnable'),
    )
    if (!userResponse) return

    setStatus({ ...status, [name]: 'FETCHING' })
    let response = false

    // disable QR
    if (value) {
      response = await disableDynamicQR(id)
    }

    // enable QR
    if (!value) {
      response = await enableDynamicQR(id)
    }

    setStatus({
      ...status,
      [name]: response ? 'SUCCESS' : 'FAILED',
    })

    // Refetch the list so the card reflects its new status.
    if (response) router.refresh()
  }

  const handleDelete = async () => {
    // use a modal here
    const userResponse = confirm(t('confirmDelete'))
    if (!userResponse) return

    setStatus({ ...status, delete: 'FETCHING' })
    const response = await deleteDynamicQR(id)

    if (response) {
      setStatus({ ...status, delete: 'SUCCESS' })
      // Refetch the list so the deleted card goes away.
      router.refresh()
    } else {
      setStatus({ ...status, delete: 'FAILED' })
    }

    return response
  }

  return (
    <section className="flex flex-col gap-6 mb-2">
      <div className="hidden justify-between gap-20">
        <Input placeholder={t('backgroundColor')} disabled />
        <Input placeholder={t('squaresColor')} disabled />
      </div>

      <div className="justify-between items-center gap-20 border-2 border-dashed border-black px-4 py-3">
        <Switch
          name={fieldNames.disabled}
          label={t('disableLink')}
          aria-label={t('disableLink')}
          description={t('disableHelp')}
          checked={disabled}
          disabled={status.disabled === 'FETCHING'}
          onChange={handleUpdateSwitch}
        />
        <div className="hidden">
          <Switch
            name={fieldNames.disableViews}
            label={t('visitorsCount')}
            aria-label={t('visitorsCount')}
            description={t('visitorsHelp')}
            disabled
          />
        </div>
      </div>

      <div className="flex justify-start gap-4 mt-2">
        <Button
          className="h-12 w-full rounded-none border-4 px-6 text-base font-black uppercase shadow-[6px_6px_0_#000] sm:w-auto"
          variant="destructive"
          onClick={handleDelete}
          disabled={status.delete === 'FETCHING'}
        >
          <Delete className="size-6" color="currentColor" />
          {t('delete')}
        </Button>
      </div>
    </section>
  )
}
