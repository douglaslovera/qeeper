'use server'

import { generateQr } from '@/utils/generate-qr'
import { transformTimestamp } from '@/utils/transform-timestamp'
import { getWorkerUrl } from '@/utils/get-worker-url'

import { getUserMe } from '@/data/services/get-user-me-service'
import {
  addQR,
  deleteQRInDB,
  updateDisableQRInDB,
  listUserQrs,
  updateQRUrlInDB,
  getOneQRInDB,
} from '@/data/services/qr-db-service'
import {
  createWorkerQR,
  deleteWorkerQR,
  updateUrlWorkerQR,
} from '@/data/services/qr-object-service'
import {
  checkCanCreateQR,
  checkCanEnableQR,
  getPlanLimits,
  type QuotaError,
} from '@/data/services/quota-service'

export type QuotaResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: QuotaError; limit: number }
  | { ok: false; error: 'failed' }

/**
 * Returns the QR only if it belongs to the given user, so one account
 * can't read or change another account's QRs by guessing a key.
 */
async function getOwnedQR(key: string, uid: string) {
  const qr = await getOneQRInDB(key)

  if (!qr || qr.userId !== uid) {
    throw new Error('Unauthorized')
  }

  return qr
}

export async function createDynamicQR(
  url: string,
): Promise<QuotaResult<string>> {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Check before touching the worker so a rejected QR leaves nothing in KV.
    const quota = await checkCanCreateQR(user.uid)
    if (!quota.ok) return quota

    const workerQR = await createWorkerQR(url)

    if (!workerQR) {
      throw new Error('Failed to create QR')
    }

    await addQR(workerQR.key, { url, uid: user.uid })

    const svg = await generateQr(workerQR.url)

    return { ok: true, data: svg }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'failed' }
  }
}

/**
 * Only the active limit is exposed; the extra room for disabled QRs is
 * shown to the user when they hit it. `null` means unlimited.
 */
export async function getActiveQrLimit() {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { enabled } = await getPlanLimits(user.uid)
    return Number.isFinite(enabled) ? enabled : null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateUrlDynamicQR(key: string, url: string) {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    await getOwnedQR(key, user.uid)

    // Be careful with a mismatch between both DBs services
    const workerResponse = await updateUrlWorkerQR(key, url)
    const dbResponse = await updateQRUrlInDB(key, url)

    if (!workerResponse || !dbResponse) {
      throw new Error('Failed to update QR')
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function listDynamicQRs() {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const response = await listUserQrs(user.uid)

    if (!response || !response.length) {
      return []
    }

    const mapped = response.map(async (item) => {
      const shortUrl = getWorkerUrl(item.alias)
      return {
        ...item,
        createdAt: transformTimestamp(item?.createdAt),
        shortUrl,
        svg: await generateQr(shortUrl),
      }
    })

    const result = await Promise.all(mapped)

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteDynamicQR(key: string) {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    await getOwnedQR(key, user.uid)

    const workerResponse = await deleteWorkerQR(key)
    const dbResponse = await deleteQRInDB(key)

    if (!workerResponse || !dbResponse) {
      throw new Error('Failed to delete QR')
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function disableDynamicQR(key: string) {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    await getOwnedQR(key, user.uid)

    const dbResponse = await updateDisableQRInDB(key, true)
    const workerResponse = await deleteWorkerQR(key)

    if (!workerResponse || !dbResponse) {
      throw new Error('Failed to disable QR')
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function enableDynamicQR(key: string): Promise<QuotaResult<null>> {
  try {
    const user = await getUserMe()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const qr = await getOwnedQR(key, user.uid)

    const quota = await checkCanEnableQR(user.uid)
    if (!quota.ok) return quota

    const dbResponse = await updateDisableQRInDB(key, false)
    const workerResponse = await createWorkerQR(qr.destinationUrl, { key })

    if (!workerResponse || !dbResponse) {
      throw new Error('Failed to enable QR')
    }

    return { ok: true, data: null }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'failed' }
  }
}
