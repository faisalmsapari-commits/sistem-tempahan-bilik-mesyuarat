export type ServiceStatus = 'MENUNGGU' | 'DALAM_PROSES' | 'SELESAI';

export interface RoomServiceRequest {
  serviceId: string;
  bookingId: string;
  noRujukan: string;
  roomId: string;
  roomName: string;
  tarikh: string;
  masaMula: string;
  masaTamat: string;
  tajukMesyuarat: string;
  pemohonNama: string;
  pemohonTelefon: string;
  jabatanNama: string;
  
  // Checklist
  susunanMeja: string;
  bilanganKerusi: number;
  peralatanAudio: boolean;
  mikrofonQty: number;
  projektor: boolean;
  persidanganVideo: boolean;
  minuman: boolean;
  jamuanRingan: boolean;
  kebersihan: boolean;
  catatan?: string;

  status: ServiceStatus;
  diuruskanOleh?: string;
  diuruskanNama?: string;
  selesaiAt?: string;
  createdAt: string;
  updatedAt: string;
}
