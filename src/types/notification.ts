export type NotificationType = 
  | 'TEMPAHAN_BARU'
  | 'TEMPAHAN_DILULUSKAN'
  | 'TEMPAHAN_DITOLAK'
  | 'TEMPAHAN_DIPULANGKAN'
  | 'TEMPAHAN_DIBATALKAN'
  | 'PERINGATAN_MESYUARAT'
  | 'PENYELENGGARAAN_BILIK'
  | 'SISTEM_INFO';

export interface AppNotification {
  notifId: string;
  userId: string;
  tajuk: string;
  mesej: string;
  jenis: NotificationType;
  bookingId?: string;
  noRujukan?: string;
  dibaca: boolean;
  readAt?: string;
  createdAt: string;
}
