export type UserRole = 
  | 'PENTADBIR_SISTEM' 
  | 'PENTADBIR_JABATAN' 
  | 'PELULUS' 
  | 'URUS_SETIA' 
  | 'KAKITANGAN';

export type UserStatus = 'AKTIF' | 'TIDAK_AKTIF';

export interface UserProfile {
  uid: string;
  nama: string;
  emel: string;
  noTelefon: string;
  noStaf: string;
  jawatan: string;
  jabatanId: string;
  jabatanNama?: string;
  unit: string;
  role: UserRole;
  status: UserStatus;
  gambarProfil?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  PENTADBIR_SISTEM: 'Pentadbir Sistem',
  PENTADBIR_JABATAN: 'Pentadbir Jabatan',
  PELULUS: 'Pegawai Pelulus',
  URUS_SETIA: 'Urus Setia Fasiliti',
  KAKITANGAN: 'Kakitangan'
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  AKTIF: 'Aktif',
  TIDAK_AKTIF: 'Tidak Aktif'
};
