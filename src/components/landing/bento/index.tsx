'use client'

import { useTranslations } from '@/i18n/provider'
import { Card } from '@/components/ui/card'
import theImage from './scanning-qr-illustration.jpeg'
import Image from 'next/image'

export function Bento() {
  const t = useTranslations()
  return (
    <section>
      <div className="flex justify-between mb-5">
        <h2 className="text-4xl font-semibold">{t('editableQrs')}</h2>
      </div>

      <section className="grid gap-4 mb-20 lg:grid-cols-2 lg:auto-rows-fr">
        <Card
          as="article"
          className="flex min-h-[320px] items-center justify-center bg-[#5bbdae] p-6 lg:row-span-2 lg:min-h-[520px]"
        >
          <Image
            src={theImage}
            alt={t('scanningAlt')}
            width={350}
            className="h-auto w-full max-w-[350px] rounded-lg object-cover"
            sizes="(min-width: 1024px) 350px, calc(100vw - 4rem)"
          />
        </Card>

        <div className="grid gap-4 lg:row-span-2 lg:grid-rows-2">
          <Card as="article" className="flex min-h-40 items-center">
            <div className="flex h-full w-full flex-col justify-center p-2 text-center">
              <h3 className="text-2xl">{t('editDestination')}</h3>
            </div>
          </Card>

          <Card as="article" className="flex min-h-40 items-center">
            <div className="flex h-full w-full flex-col justify-center p-2 text-center">
              <h3 className="text-2xl">{t('shareAnyone')}</h3>
            </div>
          </Card>
        </div>
      </section>
    </section>
  )
}
