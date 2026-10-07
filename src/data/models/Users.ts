import type { IQRs } from "./IQRs"
import type { IUser } from "./IUsers"

import { _db } from "@/lib/firebase/admin"
import { QR_COLLECTION, USER_COLLECTION } from "@/constants/collections"
import { DEFAULT_PLAN, isPlan, type Plan } from "@/constants/plans"

export class User implements IUser {
  userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  static collection() {
    return _db.collection(USER_COLLECTION)
  }

  static async getById(userId: string): Promise<IUser | null> {
    const doc = await User.collection().doc(userId).get()
    return doc.exists ? ({ userId: doc.id, ...doc.data() } as IUser) : null
  }

  static async getPlan(userId: string): Promise<Plan> {
    const user = await User.getById(userId)
    return isPlan(user?.plan) ? user.plan : DEFAULT_PLAN
  }

  async getLinks(): Promise<IQRs[]> {
    const qrsSnapshot = await User.collection()
      .doc(this.userId)
      .collection(QR_COLLECTION)
      .get()
    /// @ts-ignore
    return qrsSnapshot.docs.map((doc) => ({ alias: doc.id, ...doc.data() } as IQRs))
  }
}
