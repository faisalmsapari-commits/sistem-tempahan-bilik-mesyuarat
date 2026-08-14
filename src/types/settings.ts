export interface Holiday {
  holidayId: string;
  tarikh: string; // YYYY-MM-DD
  namaCuti: string;
  kategori: 'KEBANGSAAN' | 'NEGERI' | 'PENUTUPAN_KHAS';
  keterangan?: string;
}

export interface SystemSettings {
  id: string;
  namaOrganisasi: string;
  singkatanOrganisasi: string;
  alamat: string;
  noTelefon: string;
  emel: string;
  
  // Waktu Operasi
  waktuMulaOperasi: string; // e.g. "08:00"
  waktuTamatOperasi: string; // e.g. "17:00"
  hariOperasi: number[]; // [1, 2, 3, 4, 5] (Isnin - Jumaat / Ahad - Khamis mengikut Kedah)

  // Polisi Tempahan
  tempohMaksimumTempahanHari: number; // e.g. 60 hari ke hadapan
  tempohMinimumBatalJam: number; // e.g. 2 jam sebelum
  tempohMaksimumMesyuaratJam: number; // e.g. 8 jam
  kelulusanAutomatikKapasitiBawah: number; // e.g. 0 (semua perlu kelulusan) atau 10

  // Peringatan & Notifikasi
  peringatanSebelumMinit: number; // e.g. 30 minit
  benarkanCheckInAwalMinit: number; // e.g. 30 minit
  autoBatalJikaTidakCheckInMinit: number; // e.g. 45 minit

  updatedAt: string;
  updatedBy: string;
}
