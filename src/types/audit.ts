export type AuditAction =
  | 'LOG_MASUK'
  | 'LOG_KELUAR'
  | 'CIPTA_TEMPAHAN'
  | 'KEMASKINI_TEMPAHAN'
  | 'BATAL_TEMPAHAN'
  | 'LULUS_TEMPAHAN'
  | 'TOLAK_TEMPAHAN'
  | 'PULANG_TEMPAHAN'
  | 'CHECK_IN'
  | 'CHECK_OUT'
  | 'CIPTA_BILIK'
  | 'KEMASKINI_BILIK'
  | 'PADAM_BILIK'
  | 'PENYELENGGARAAN_BILIK'
  | 'CIPTA_PENGGUNA'
  | 'KEMASKINI_PENGGUNA'
  | 'NYAHAKTIF_PENGGUNA'
  | 'TUKAR_PERANAN'
  | 'RESET_KATA_LALUAN'
  | 'KEMASKINI_TETAPAN';

export type AuditModule =
  | 'AUTH'
  | 'TEMPAHAN'
  | 'KELULUSAN'
  | 'BILIK'
  | 'PENGGUNA'
  | 'JABATAN'
  | 'PENYELENGGARAAN'
  | 'PERKHIDMATAN'
  | 'TETAPAN';

export interface AuditLog {
  logId: string;
  userId: string;
  namaPengguna: string;
  emelPengguna: string;
  perananPengguna: string;
  tindakan: AuditAction;
  modul: AuditModule;
  rekodId: string;
  keterangan: string;
  ipAddress?: string;
  tarikhMasa: string; // ISO String
  maklumatTambahan?: Record<string, any>;
}
