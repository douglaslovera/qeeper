'use client'

import { useTranslations } from '@/i18n/provider'

import { Button } from '@/components/ui/button'
import { logInWithGoogle, logOut } from '@/data/services/auth-service'

type Props = {
  name?: string
}

export function LoginHeader({ name }: Props) {
  const t = useTranslations()
  const handleLogIn = async () => {
    const response = await logInWithGoogle()
    if (response) {
      window.location.reload()
    }
  }

  const handleLogOut = async () => {
    const response = await logOut()
    if (response) {
      window.location.reload()
    }
  }

  if (name) {
    return (
      <div className="flex items-center gap-2">
        <p>{name.split(' ')[0]}</p>
        <Button aria-label={t('logout')} title={t('logout')} onClick={handleLogOut} color="light" size="small">
          ↪
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleLogIn}>
      <span className="px-4">{t('login')}</span>
    </Button>
  )
}
