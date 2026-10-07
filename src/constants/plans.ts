// Dynamic QR limits per plan. `enabled` caps active QRs; `total` caps
// active + disabled. Plans are assigned manually on the `users/{uid}` doc.
export const PLANS = {
  free: { enabled: 5, total: 10 },
  plus: { enabled: 30, total: 40 },
  unlimited: {
    enabled: Number.POSITIVE_INFINITY,
    total: Number.POSITIVE_INFINITY,
  },
} as const

export type Plan = keyof typeof PLANS

export const DEFAULT_PLAN: Plan = 'free'

export const isPlan = (value: unknown): value is Plan =>
  typeof value === 'string' && Object.hasOwn(PLANS, value)
