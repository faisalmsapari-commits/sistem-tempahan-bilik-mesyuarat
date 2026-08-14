export type BookingStatus = 
  | 'DRAF'
  | 'MENUNGGU_KELULUSAN'
  | 'DILULUSKAN'
  | 'DITOLAK'
  | 'DIPULANGKAN'
  | 'DIBATALKAN'
  | 'SEDANG_DIGUNAKAN'
  | 'SELESAI'
  | 'TIDAK_HADIR';

export type RecurringType = 'SEKALI' | 'HARIAN' | 'MINGGUAN' | 'BULANAN' | 'PILIHAN';

export interface EquipmentRequirement {
  projektor: boolean;
  sistemAudio: boolean;
  mikrofonKuantiti: number;
  persidanganVideo: boolean;
  komputerLanjutan: boolean;
  papanPutih: boolean;
  catatanPeralatan?: string;
}

export interface ServiceRequirement {
  susunanMeja: 'BENTUK_U' | 'TEATER' | 'BILIK_DARJAH' | 'MEJA_BULAT' | 'BENTUK_V' | 'LAIN_LAIN';
  bilanganKerusi: number;
  minuman: boolean;
  jamuanRingan: boolean;
  kebersihanKhas: boolean;
  catatanKhidmat?: string;
}

export interface Booking {
  bookingId: string;
  noRujukan: string; // e.g. MB-2026-000101
  tajukMesyuarat: string;
  tujuan: string;
  tarikh: string; // YYYY-MM-DD
  tarikhTamat?: string; // For multi-day or recurring
  masaMula: string; // HH:mm
  masaTamat: string; // HH:mm
  roomId: string;
  roomName?: string;
  roomColor?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  jabatanId: string;
  jabatanNama: string;
  unit: string;
  bilanganPeserta: number;
  pengerusi: string;
  urusSetia: string;
  peralatan: EquipmentRequirement;
  perkhidmatan: ServiceRequirement;
  catatan?: string;
  lampiranUrl?: string;
  lampiranNama?: string;
  
  // Recurring
  jenisTempahan: RecurringType;
  tarikhBerulang?: string[]; // Array of YYYY-MM-DD if recurring
  indukBookingId?: string; // Parent ID if part of recurring series

  // Status & Approval
  status: BookingStatus;
  approvalNotes?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectedReason?: string;
  returnFeedback?: string;
  cancellationReason?: string;
  cancelledAt?: string;

  // Check-In / Check-Out
  qrCodeData?: string;
  checkInAt?: string;
  checkOutAt?: string;
  checkedInBy?: string;

  // Urus Setia Service Tracking
  serviceStatus?: 'MENUNGGU' | 'DALAM_PROSES' | 'SELESAI';

  createdAt: string;
  updatedAt: string;
}

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; text: string; border: string }> = {
  DRAF: { label: 'Draf', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  MENUNGGU_KELULUSAN: { label: 'Menunggu Kelulusan', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
  DILULUSKAN: { label: 'Diluluskan', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  DITOLAK: { label: 'Ditolak', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' },
  DIPULANGKAN: { label: 'Dipulangkan', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' },
  DIBATALKAN: { label: 'Dibatalkan', bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-300' },
  SEDANG_DIGUNAKAN: { label: 'Sedang Digunakan', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  SELESAI: { label: 'Selesai', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-300' },
  TIDAK_HADIR: { label: 'Tidak Hadir', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' }
};

export const LAYOUT_LABELS: Record<string, string> = {
  BENTUK_U: 'Bentuk U (U-Shape)',
  TEATER: 'Susunan Teater (Theater)',
  BILIK_DARJAH: 'Bilik Darjah (Classroom)',
  MEJA_BULAT: 'Meja Bulat (Round Table / Banquet)',
  BENTUK_V: 'Bentuk V (V-Shape)',
  LAIN_LAIN: 'Susunan Standard'
};
