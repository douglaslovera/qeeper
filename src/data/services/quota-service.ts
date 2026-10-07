import { PLANS } from '@/constants/plans'
import { QRs } from '../models/QRs'
import { User } from '../models/Users'

export type QuotaError = 'enabled_limit' | 'total_limit'

export type QuotaCheck =
  | { ok: true }
  | { ok: false; error: QuotaError; limit: number }

export const getPlanLimits = async (uid: string) =>
  PLANS[await User.getPlan(uid)]

/**
 * New QRs start enabled, so creating one needs room under both limits.
 */
export const checkCanCreateQR = async (uid: string): Promise<QuotaCheck> => {
  const limits = await getPlanLimits(uid)
  if (!Number.isFinite(limits.total)) return { ok: true }

  const { enabled, total } = await QRs.countByUser(uid)
  if (enabled >= limits.enabled) {
    return { ok: false, error: 'enabled_limit', limit: limits.enabled }
  }
  if (total >= limits.total) {
    return { ok: false, error: 'total_limit', limit: limits.total }
  }
  return { ok: true }
}

export const checkCanEnableQR = async (uid: string): Promise<QuotaCheck> => {
  const limits = await getPlanLimits(uid)
  if (!Number.isFinite(limits.enabled)) return { ok: true }

  const { enabled } = await QRs.countByUser(uid)
  if (enabled >= limits.enabled) {
    return { ok: false, error: 'enabled_limit', limit: limits.enabled }
  }
  return { ok: true }
}
