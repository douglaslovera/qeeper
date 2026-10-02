export interface IQRs {
  alias: string
  destinationUrl: string
  userId: string
  disabled: boolean
  views: number | null
  createdAt: FirebaseFirestore.Timestamp
}

export interface ClientIQRS extends Omit<IQRs, 'createdAt'> {
  createdAt: string
  shortUrl: string
  svg: string
}
