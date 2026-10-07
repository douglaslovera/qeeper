import type { Plan } from '@/constants/plans'

export interface IUser {
  userId: string;
  plan?: Plan;
}
