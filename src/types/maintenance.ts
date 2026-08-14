export interface RoomMaintenance {
  maintId: string;
  roomId: string;
  roomName: string;
  tarikhMula: string; // YYYY-MM-DD
  tarikhTamat: string; // YYYY-MM-DD
  masaMula?: string;
  masaTamat?: string;
  sebab: string;
  catatan?: string;
  status: 'BERJADUAL' | 'SEDANG_BERJALAN' | 'SELESAI' | 'DIBATALKAN';
  diciptaOleh: string;
  diciptaNama: string;
  createdAt: string;
  updatedAt: string;
}
