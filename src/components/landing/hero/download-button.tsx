import { useTranslations } from '@/i18n/provider'
import { Button } from '@/components/ui/button'
import { downloadPng } from '@/utils/download-image'
import type React from 'react'

interface Props {
  svg: string | null
  disabled?: boolean
  size?: 'small'
  className?: string
  icon?: React.ReactNode
}

export function DownloadButton({ svg, disabled, size, className, icon }: Props) {
  const t = useTranslations()
  const handleSave = () => {
    if (!svg) return
    downloadPng('qr-code', svg, { scale: 5 })
  }

  return (
    <Button
      disabled={!svg || disabled}
      onClick={handleSave}
      size={size || 'default'}
      className={className}
    >
      {icon}
      <span className="flex w-full justify-center text-center">{t('download')}</span>
    </Button>
  )
}
