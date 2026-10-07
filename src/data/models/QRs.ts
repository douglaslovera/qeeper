import type { IQRs } from './IQRs'

import { firestore } from 'firebase-admin'
import { _db } from '@/lib/firebase/admin'
import { QR_COLLECTION, USER_COLLECTION } from '@/constants/collections'

const IN_QUERY_LIMIT = 30

export class QRs implements IQRs {
  alias: string
  destinationUrl: string
  userId: string
  disabled: boolean
  views: number | null
  createdAt: FirebaseFirestore.Timestamp

  constructor(alias: string, destinationUrl: string, userId: string) {
    this.alias = alias
    this.destinationUrl = destinationUrl
    this.userId = userId
    this.disabled = false
    this.views = null
    this.createdAt = firestore.Timestamp.now()
  }

  static collection() {
    return _db.collection(QR_COLLECTION)
  }

  async save(): Promise<void> {
    const batch = _db.batch()

    const linkRef = QRs.collection().doc(this.alias)
    batch.set(linkRef, {
      destinationUrl: this.destinationUrl,
      userId: this.userId,
      disabled: this.disabled,
      views: this.views,
      createdAt: this.createdAt,
    })

    const userLinkRef = QRs.userLinksCollection(this.userId).doc(this.alias)
    batch.set(userLinkRef, { alias: this.alias })

    await batch.commit()
  }

  async update(
    fields: Partial<Pick<IQRs, 'destinationUrl' | 'disabled' | 'views'>>,
  ): Promise<void> {
    const linkRef = QRs.collection().doc(this.alias)
    await linkRef.update(fields)
  }

  static userLinksCollection(userId: string) {
    return _db.collection(USER_COLLECTION).doc(userId).collection(QR_COLLECTION)
  }

  static async getByAlias(alias: string): Promise<IQRs | null> {
    const doc = await QRs.collection().doc(alias).get()
    /// @ts-ignore
    return doc.exists ? ({ alias: doc.id, ...doc.data() } as IQRs) : null
  }

  static async getLinksByUser(userId: string): Promise<IQRs[]> {
    const userLinksSnapshot = await QRs.userLinksCollection(userId).get()
    const aliases = userLinksSnapshot.docs.map((doc) => doc.id)

    // Firestore `in` queries accept at most 30 values, so fetch in chunks.
    const chunks: string[][] = []
    for (let i = 0; i < aliases.length; i += IN_QUERY_LIMIT) {
      chunks.push(aliases.slice(i, i + IN_QUERY_LIMIT))
    }

    const snapshots = await Promise.all(
      chunks.map((chunk) =>
        QRs.collection()
          .where(firestore.FieldPath.documentId(), 'in', chunk)
          .get(),
      ),
    )
    return snapshots.flatMap((snapshot) =>
      snapshot.docs.map((doc) => ({ alias: doc.id, ...doc.data() }) as IQRs),
    )
  }

  static async countByUser(
    userId: string,
  ): Promise<{ enabled: number; total: number }> {
    const links = await QRs.getLinksByUser(userId)
    const enabled = links.filter((link) => !link.disabled).length
    return { enabled, total: links.length }
  }

  static async deleteByAlias(alias: string, userId: string): Promise<void> {
    const batch = _db.batch()

    const linkRef = QRs.collection().doc(alias)
    batch.delete(linkRef)

    const userLinkRef = QRs.userLinksCollection(userId).doc(alias)
    batch.delete(userLinkRef)

    await batch.commit()
  }

  static async updateDisabledByAlias(
    alias: string,
    value: boolean,
  ): Promise<void> {
    const qr = await QRs.getByAlias(alias)
    if (!qr) {
      throw new Error('QR code not found')
    }

    const qrInstance = new QRs(alias, qr.destinationUrl, qr.userId)
    await qrInstance.update({ disabled: value })
  }
}
