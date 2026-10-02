'use server'

import { Text } from '@/i18n/provider'

import { getUserMe } from '@/data/services/get-user-me-service'

import { Generate } from './generate'

export async function Hero() {
  const user = await getUserMe()

  return (
    <section className="mb-12 flex flex-col gap-5 sm:mb-20">
      <div className="relative flex flex-col items-center gap-4 pt-2 text-center">
        <h1 className="mx-auto max-w-6xl text-5xl font-black uppercase leading-[0.88] sm:text-7xl lg:text-[6.25rem] xl:text-[6.75rem]">
          <Text id="generateAnd" />{' '}
          <span className="inline-block border-4 border-black bg-main px-4 shadow-[10px_10px_0_#000]">
            <Text id="edit" />
          </span>
        </h1>

        <p className="mx-auto max-w-[52ch] text-base font-bold leading-7 sm:text-lg">
          <Text id="heroDescription" />
        </p>
        <div className="absolute right-10 top-32 hidden -rotate-3 border-4 border-black bg-white px-5 py-3 text-sm font-black uppercase shadow-[8px_8px_0_#000] xl:block">
          <Text id="fastFlexible" />
          <br />
          <Text id="yours" />
        </div>
      </div>
      <Generate isUserLogged={!!user?.uid} />
    </section>
  )
}
