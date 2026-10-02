import { useTranslations } from '@/i18n/provider'
import { useState } from "react";
import { Save } from "@/components/icons/save";
import { Input } from '@/components/ui/input'
import { updateUrlDynamicQR } from "@/data/actions/dynamic-code-actions";

export const DestinationUrlField = (
  { id, destinationUrl }:
  {
    id: string;
    destinationUrl: string;
  }
) => {
  const t = useTranslations()
  const [destinationUrlValue, setDestinationUrlValue] = useState(destinationUrl)
  const [dbDestinationUrl, setDbDestinationUrl] = useState(destinationUrl)

  const hasChanges = destinationUrlValue !== dbDestinationUrl

  const handleSave = async () => {
    const response = await updateUrlDynamicQR(id, destinationUrlValue)

    if (response) {
      // TODO: add toast notification for success
      alert(t('updateSuccess'))

      setDbDestinationUrl(destinationUrlValue)
    } else {
      // TODO: add toast notification for error
      alert(t('updateError'))
    }
  }

  return (
    <label className="flex flex-col gap-2" htmlFor={`destination-url-${id}`}>
      <span className="text-sm font-black uppercase sm:text-base">
        {t('editDestination')}
      </span>
      <Input
        id={`destination-url-${id}`}
        placeholder={t('urlPlaceholder')}
        value={destinationUrlValue}
        onChange={(event) => setDestinationUrlValue(event.target.value)}
        className="h-14 rounded-none border-4 px-5 text-base font-bold shadow-none placeholder:text-black/35"
      />
    </label>
  )
}