import { Room } from '../types/room';
import { UserProfile } from '../types/user';
import { Department } from '../types/department';
import { Booking } from '../types/booking';
import { Holiday, SystemSettings } from '../types/settings';
import { AuditLog } from '../types/audit';

// 12 Jabatan & Bahagian Rasmi Direktori Pekerja MPLBP
export const initialDepartments: Department[] = [
  {
    deptId: 'dept-pydp',
    kod: 'PYDP',
    nama: 'Pejabat Yang Dipertua',
    ketuaJabatan: "Dato' Yang Dipertua MPLBP",
    emel: 'ydp@mplbp.gov.my',
    noTelefon: '04-9666590',
    unitList: [
      'Pejabat Yang Dipertua',
      'Pejabat Setiausaha Perbandaran',
      'Unit Komunikasi Korporat & Perhubungan Awam',
      'Unit Integriti'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-jkp',
    kod: 'JKP',
    nama: 'Jabatan Khidmat Pengurusan',
    ketuaJabatan: 'En. Ahmad Farhan bin Ismail',
    emel: 'jkp@mplbp.gov.my',
    noTelefon: '04-9666001',
    unitList: [
      'Bahagian Pentadbiran & Sumber Manusia',
      'Bahagian Pengurusan Teknologi Maklumat (BPTM)',
      'Bahagian Perolehan & Pengurusan Aset',
      'Unit Khidmat Pelanggan & Kaunter'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-jpb',
    kod: 'JPB',
    nama: 'Jabatan Perbendaharaan',
    ketuaJabatan: 'Pn. Rohani binti Md Isa',
    emel: 'perbendaharaan@mplbp.gov.my',
    noTelefon: '04-9666002',
    unitList: [
      'Bahagian Akaun & Kewangan',
      'Bahagian Hasil, Taksiran & Kutipan',
      'Bahagian Belanjawan & Bayaran'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-jpph',
    kod: 'JPPH',
    nama: 'Jabatan Penilaian Dan Pengurusan Harta',
    ketuaJabatan: 'Sr. Mohd Hisham bin Zakaria',
    emel: 'penilaian@mplbp.gov.my',
    noTelefon: '04-9666003',
    unitList: [
      'Bahagian Penilaian Cukai Taksiran',
      'Bahagian Pengurusan Harta, Sewaan & Pasar',
      'Bahagian Maklumat & Penyelidikan Harta'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-jppl',
    kod: 'JPPL',
    nama: 'Jabatan Perancangan Pembangunan dan Landskap',
    ketuaJabatan: 'Pn. Nurul Huda binti Othman',
    emel: 'perancangan@mplbp.gov.my',
    noTelefon: '04-9666004',
    unitList: [
      'Bahagian Perancangan Pembangunan',
      'Bahagian Landskap dan Rekreasi',
      'Bahagian Geoinformasi (GIS)'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-jkej',
    kod: 'JKEJ',
    nama: 'Jabatan Kejuruteraan',
    ketuaJabatan: 'Ir. Zulkifli bin Hashim',
    emel: 'kejuruteraan@mplbp.gov.my',
    noTelefon: '04-9666005',
    unitList: [
      'Bahagian Infrastruktur, Jalan & Cerun',
      'Bahagian Projek, Saliran & Penyelenggaraan',
      'Bahagian Elektrik & Mekanikal',
      'Bahagian Bengkel & Logistik'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-jkb',
    kod: 'JKB',
    nama: 'Jabatan Kawalan Bangunan',
    ketuaJabatan: 'Sr. Mohd Razif bin Sulaiman',
    emel: 'kawalanbangunan@mplbp.gov.my',
    noTelefon: '04-9666006',
    unitList: [
      'Bahagian Pelan Bangunan',
      'Bahagian Pemeriksaan Tapak & CCC',
      'Bahagian Struktur & Penguatkuasaan Bangunan'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-jkp-kes',
    kod: 'JKP-KES',
    nama: 'Jabatan Kesihatan Persekitaran',
    ketuaJabatan: 'Dr. Norazlina binti Yusof',
    emel: 'kesihatan@mplbp.gov.my',
    noTelefon: '04-9666007',
    unitList: [
      'Bahagian Kesihatan Awam & Kawalan Vektor',
      'Bahagian Pelesenan Perniagaan, Pasar & Iklan',
      'Bahagian Inspektorat & Kebersihan Bandar'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-jpen',
    kod: 'JPEN',
    nama: 'Jabatan Penguatkuasaan',
    ketuaJabatan: 'Tuan Syahrul Nizam bin Abdullah',
    emel: 'penguatkuasaan@mplbp.gov.my',
    noTelefon: '04-9666008',
    unitList: [
      'Bahagian Operasi Penguatkuasaan',
      'Bahagian Kawalan Trafik & Tempat Letak Kereta',
      'Bahagian Pendakwaan & Pengurusan Kompaun'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-osc',
    kod: 'U-OSC',
    nama: 'Unit Pusat Setempat (OSC)',
    ketuaJabatan: 'En. Faisal bin Mohd Sapari',
    emel: 'osc@mplbp.gov.my',
    noTelefon: '04-9666009',
    unitList: [
      'Urus Setia Pusat Setempat (OSC 3.0 Plus)',
      'Kaunter Penerimaan & Semakan Pelan KM'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-audit',
    kod: 'U-AUD',
    nama: 'Unit Audit Dalam',
    ketuaJabatan: 'Pn. Che Asma binti Che Azmi',
    emel: 'audit@mplbp.gov.my',
    noTelefon: '04-9666010',
    unitList: [
      'Pengauditan Pengurusan Kewangan & Hasil',
      'Pengauditan Prestasi Projek & Tadbir Urus'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    deptId: 'dept-uu',
    kod: 'U-UU',
    nama: 'Unit Undang-Undang',
    ketuaJabatan: 'Pn. Wan Azlin binti Wan Harun',
    emel: 'undangundang@mplbp.gov.my',
    noTelefon: '04-9666011',
    unitList: [
      'Unit Guaman, Kontrak & Pendakwaan Mahkamah',
      'Unit Penggubalan Undang-Undang Kecil (UUK)'
    ],
    status: 'AKTIF',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

export const initialUsers: UserProfile[] = [
  {
    uid: 'user-admin',
    nama: 'Haji Mohd Khairul bin Idris',
    emel: 'admin@mplbp.gov.my',
    noTelefon: '012-4567890',
    noStaf: 'MPLBP-0012',
    jawatan: 'Pentadbir Sistem & IT Kanan (F29)',
    jabatanId: 'dept-jkp',
    jabatanNama: 'Jabatan Khidmat Pengurusan',
    unit: 'Bahagian Pengurusan Teknologi Maklumat (BPTM)',
    role: 'PENTADBIR_SISTEM',
    status: 'AKTIF',
    gambarProfil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    lastLoginAt: '2026-08-14T08:30:00Z'
  },
  {
    uid: 'user-approver',
    nama: "Dato' Ir. Wan Azman bin Wan Sulong",
    emel: 'pelulus@mplbp.gov.my',
    noTelefon: '019-3344556',
    noStaf: 'MPLBP-0005',
    jawatan: 'Setiausaha Perbandaran / Pegawai Pelulus Utama (J52)',
    jabatanId: 'dept-pydp',
    jabatanNama: 'Pejabat Yang Dipertua',
    unit: 'Pejabat Setiausaha Perbandaran',
    role: 'PELULUS',
    status: 'AKTIF',
    gambarProfil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    lastLoginAt: '2026-08-14T08:00:00Z'
  },
  {
    uid: 'user-staff',
    nama: 'Cik Aishah binti Kamaruddin',
    emel: 'kakitangan@mplbp.gov.my',
    noTelefon: '011-2233445',
    noStaf: 'MPLBP-0488',
    jawatan: 'Penolong Pegawai Perancang Bandar (JA29)',
    jabatanId: 'dept-jppl',
    jabatanNama: 'Jabatan Perancangan Pembangunan dan Landskap',
    unit: 'Bahagian Perancangan Pembangunan',
    role: 'KAKITANGAN',
    status: 'AKTIF',
    gambarProfil: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
    lastLoginAt: '2026-08-14T09:00:00Z'
  }
];

export const initialRooms: Room[] = [
  {
    roomId: 'room-chenang-utama',
    nama: "Bilik Mesyuarat Utama Che' Nang",
    kodBilik: 'BM-CNG-01',
    lokasi: 'Kompleks Pejabat MPLBP, Kuah',
    aras: 'Aras 3 (Sayap Utama)',
    kapasiti: 40,
    penerangan: "Bilik mesyuarat utama bertaraf eksekutif (40 pax) dilengkapi kemudahan persidangan video definisi tinggi, sistem mikrofon berpusat pengerusi, dan susunan meja rasmi majlis.",
    gambar: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&auto=format&fit=crop&q=80',
    kemudahan: [
      'Projektor Berdefinisi Tinggi (HD)',
      'Skrin Tayangan Bermotor',
      'Sistem Audio & Mikrofon Tanpa Wayar',
      'Sistem Persidangan Video (Polycom / MS Teams)',
      'Wi-Fi Berkelajuan Tinggi MPLBP',
      'Komputer / PC Urus Setia',
      'Pendingin Hawa Berpusat',
      'Podium / Rostrum Ucapan'
    ],
    status: 'AKTIF',
    warna: '#1e3a8a',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    roomId: 'room-rebak',
    nama: 'Bilik Perbincangan Rebak',
    kodBilik: 'BP-RBK-02',
    lokasi: 'Kompleks Pejabat MPLBP, Kuah',
    aras: 'Aras 2',
    kapasiti: 12,
    penerangan: 'Bilik perbincangan (12 pax) kondusif untuk mesyuarat jawatankuasa kerja teknikal, taklimat projek pembangunan dan sesi perbincangan antara jabatan.',
    gambar: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    kemudahan: [
      'Projektor Berdefinisi Tinggi (HD)',
      'Skrin Tayangan Bermotor',
      'Sistem Audio & Mikrofon Tanpa Wayar',
      'Wi-Fi Berkelajuan Tinggi MPLBP',
      'Komputer / PC Urus Setia',
      'Pendingin Hawa Berpusat',
      'Papan Putih Pintar / Smart Board'
    ],
    status: 'AKTIF',
    warna: '#0d9488',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    roomId: 'room-osc',
    nama: 'Bilik Perbincangan OSC',
    kodBilik: 'BP-OSC-03',
    lokasi: 'Kompleks Pejabat MPLBP, Kuah',
    aras: 'Aras 1 (Pusat Setempat OSC)',
    kapasiti: 10,
    penerangan: 'Bilik perbincangan (10 pax) khusus bagi urusan Pusat Setempat (One Stop Centre - OSC), permohonan pelan kebenaran merancang (KM) dan rundingan teknikal agensi luar.',
    gambar: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
    kemudahan: [
      'Skrin Smart TV Interaktif 75 Inci',
      'Sistem Persidangan Video (Polycom / MS Teams)',
      'Wi-Fi Berkelajuan Tinggi MPLBP',
      'Pendingin Hawa Berpusat',
      'Papan Putih Pintar / Smart Board'
    ],
    status: 'AKTIF',
    warna: '#d97706',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

export const initialBookings: Booking[] = [
  {
    bookingId: 'bk-2026-0001',
    noRujukan: 'MB-2026-000101',
    tajukMesyuarat: 'Mesyuarat Jawatankuasa Penuh Majlis Bil. 8/2026',
    tujuan: 'Membentangkan minit mesyuarat terdahulu, kelulusan permohonan pelan kebenaran merancang (KM) dan status kutipan hasil cukai taksiran Langkawi.',
    tarikh: '2026-08-14',
    masaMula: '09:00',
    masaTamat: '12:30',
    roomId: 'room-chenang-utama',
    roomName: "Bilik Mesyuarat Utama Che' Nang",
    roomColor: '#1e3a8a',
    userId: 'user-staff',
    userName: 'Cik Aishah binti Kamaruddin',
    userEmail: 'kakitangan@mplbp.gov.my',
    userPhone: '011-2233445',
    jabatanId: 'dept-jppl',
    jabatanNama: 'Jabatan Perancangan Pembangunan dan Landskap',
    unit: 'Bahagian Perancangan Pembangunan',
    bilanganPeserta: 35,
    pengerusi: 'Yang Dipertua MPLBP',
    urusSetia: 'Cik Aishah binti Kamaruddin',
    peralatan: { projektor: true, sistemAudio: true, mikrofonKuantiti: 8, persidanganVideo: true, komputerLanjutan: true, papanPutih: false },
    perkhidmatan: { susunanMeja: 'BENTUK_U', bilanganKerusi: 35, minuman: true, jamuanRingan: true, kebersihanKhas: true },
    catatan: 'Mesyuarat rasmi bulanan MPLBP bersama Ahli Majlis.',
    jenisTempahan: 'SEKALI',
    status: 'SEDANG_DIGUNAKAN',
    approvedBy: 'user-approver',
    approvedByName: "Dato' Ir. Wan Azman bin Wan Sulong",
    approvedAt: '2026-08-10T10:00:00Z',
    qrCodeData: 'MPLBP-MB-2026-000101-VERIFIED',
    checkInAt: '2026-08-14T08:45:00Z',
    checkedInBy: 'Cik Aishah binti Kamaruddin',
    serviceStatus: 'SELESAI',
    createdAt: '2026-08-08T14:20:00Z',
    updatedAt: '2026-08-14T08:45:00Z'
  }
];

export const initialHolidays: Holiday[] = [
  { tarikh: '2026-08-31', nama: 'Hari Kebangsaan Malaysia', berulang: true },
  { tarikh: '2026-09-16', nama: 'Hari Malaysia', berulang: true }
];

export const initialSettings: SystemSettings = {
  namaSistem: 'MPLBP e-BILIK',
  namaAgensi: 'Majlis Perbandaran Langkawi Bandaraya Pelancongan',
  waktuOperasiMula: '08:00',
  waktuOperasiTamat: '18:00',
  hadMaksimumHariKedepan: 60,
  notifikasiEmelAktif: true,
  notifikasiTelegramAktif: true,
  notifikasiSmsAktif: false,
  autoBatalBilikMinit: 15,
  pemberitahuanAwalMinit: 30,
  logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&auto=format&fit=crop&q=80'
};

export const initialAuditLogs: AuditLog[] = [
  {
    logId: 'aud-1',
    userId: 'user-admin',
    namaPengguna: 'Haji Mohd Khairul bin Idris',
    emelPengguna: 'admin@mplbp.gov.my',
    perananPengguna: 'PENTADBIR_SISTEM',
    tindakan: 'LOG_MASUK',
    modul: 'AUTH',
    rekodId: 'user-admin',
    keterangan: 'Pengguna berjaya log masuk ke sistem MPLBP e-BILIK.',
    ipAddress: '10.20.4.15',
    tarikhMasa: '2026-08-14T08:30:00Z'
  }
];
