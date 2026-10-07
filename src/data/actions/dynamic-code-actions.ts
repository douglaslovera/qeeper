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

    const saved = await addQR(workerQR.key, { url, uid: user.uid })

    if (!saved) {
      // Remove the link so it can't work without counting toward the limit.
      await deleteWorkerQR(workerQR.key)
      throw new Error('Failed to save QR')
    }

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

    const qr = await getOwnedQR(key, user.uid)

    // Disabled QRs have no worker link, so only Firestore is updated.
    if (!qr.disabled && !(await updateUrlWorkerQR(key, url))) {
      throw new Error('Failed to update QR')
    }

    if (!(await updateQRUrlInDB(key, url))) {
      // Restore the old URL so both services stay in sync.
      if (!qr.disabled) await updateUrlWorkerQR(key, qr.destinationUrl)
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

    const qr = await getOwnedQR(key, user.uid)

    // Disabled QRs have no worker link left to delete.
    if (!qr.disabled && !(await deleteWorkerQR(key))) {
      throw new Error('Failed to delete QR')
    }

    if (!(await deleteQRInDB(key))) {
      if (!qr.disabled) await createWorkerQR(qr.destinationUrl, { key })
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

    const qr = await getOwnedQR(key, user.uid)

    // Remove the link first so a failure never frees an active slot while
    // the link still works.
    if (!(await deleteWorkerQR(key))) {
      throw new Error('Failed to disable QR')
    }

    if (!(await updateDisableQRInDB(key, true))) {
      await createWorkerQR(qr.destinationUrl, { key })
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

    // An already enabled QR holds its slot; just make sure the link exists.
    if (qr.disabled) {
      const quota = await checkCanEnableQR(user.uid)
      if (!quota.ok) return quota
    }

    // Create the link first so a failure never takes up an active slot.
    if (!(await createWorkerQR(qr.destinationUrl, { key }))) {
      throw new Error('Failed to enable QR')
    }

    if (!(await updateDisableQRInDB(key, false))) {
      if (qr.disabled) await deleteWorkerQR(key)
      throw new Error('Failed to enable QR')
    }

    return { ok: true, data: null }
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'failed' }
  }
}
