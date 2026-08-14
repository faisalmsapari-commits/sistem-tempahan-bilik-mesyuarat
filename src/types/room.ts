export type RoomStatus = 'AKTIF' | 'TIDAK_AKTIF' | 'PENYELENGGARAAN';

export interface RoomFacility {
  id: string;
  nama: string;
  ikon: string;
}

export interface Room {
  roomId: string;
  nama: string;
  kodBilik: string;
  lokasi: string;
  aras: string;
  kapasiti: number;
  penerangan: string;
  gambar: string;
  kemudahan: string[]; // e.g. ['Projektor', 'Skrin Bermotor', 'Mikrofon & Audio', 'Persidangan Video', 'Wi-Fi', 'Komputer', 'Pendingin Hawa']
  status: RoomStatus;
  warna: string; // Hex color for calendar representation
  createdAt: string;
  updatedAt: string;
}

export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  AKTIF: 'Tersedia / Aktif',
  TIDAK_AKTIF: 'Tidak Aktif',
  PENYELENGGARAAN: 'Dalam Penyelenggaraan'
};

export const STANDARD_FACILITIES = [
  'Projektor Berdefinisi Tinggi (HD)',
  'Skrin Tayangan Bermotor',
  'Sistem Audio & Mikrofon Tanpa Wayar',
  'Sistem Persidangan Video (Polycom / MS Teams)',
  'Wi-Fi Berkelajuan Tinggi MPLBP',
  'Komputer / PC Urus Setia',
  'Pendingin Hawa Berpusat',
  'Papan Putih Pintar / Smart Board',
  'Podium / Rostrum Ucapan'
];
