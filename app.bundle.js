// MPLBP e-BILIK - Standalone Unified Bundle
// Majlis Perbandaran Langkawi Bandaraya Pelancongan
(function() {
  const { useState, useEffect, useMemo, useContext, createContext, useCallback, useRef } = React;

  const ROOMS_DATA_VERSION = 'v6_login_auth_and_admin_delete_powers';

  // --- SEED DATA JABATAN RASMI MENGIKUT DIREKTORI PEKERJA MPLBP (pbt.kedah.gov.my) ---
  const SEED_DEPARTMENTS = [
    {
      deptId: 'dept-pydp',
      kod: 'PYDP',
      nama: 'Pejabat Yang Dipertua',
      ketuaJabatan: 'Dato\' Yang Dipertua MPLBP',
      emel: 'ydp@mplbp.gov.my',
      noTelefon: '04-9666590',
      unitList: [
        'Pejabat Yang Dipertua',
        'Pejabat Setiausaha Perbandaran',
        'Unit Komunikasi Korporat & Perhubungan Awam',
        'Unit Integriti'
      ],
      status: 'AKTIF'
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
      status: 'AKTIF'
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
      status: 'AKTIF'
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
      status: 'AKTIF'
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
      status: 'AKTIF'
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
      status: 'AKTIF'
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
      status: 'AKTIF'
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
      status: 'AKTIF'
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
      status: 'AKTIF'
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
      status: 'AKTIF'
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
      status: 'AKTIF'
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
      status: 'AKTIF'
    }
  ];

  // --- SEED DATA PENGGUNA (ADMIN & KAKITANGAN) ---
  const SEED_USERS = [
    {
      uid: 'user-admin',
      nama: 'Haji Mohd Khairul bin Idris',
      emel: 'admin@mplbp.gov.my',
      kataLaluan: 'admin123',
      noTelefon: '012-4567890',
      noStaf: 'MPLBP-0012',
      jawatan: 'Pentadbir Sistem & IT Kanan (F29)',
      jabatanId: 'dept-jkp',
      jabatanNama: 'Jabatan Khidmat Pengurusan',
      unit: 'Bahagian Pengurusan Teknologi Maklumat (BPTM)',
      role: 'PENTADBIR_SISTEM',
      status: 'AKTIF',
      gambarProfil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      uid: 'user-approver',
      nama: 'Dato\' Ir. Wan Azman bin Wan Sulong',
      emel: 'pelulus@mplbp.gov.my',
      kataLaluan: 'pelulus123',
      noTelefon: '019-3344556',
      noStaf: 'MPLBP-0005',
      jawatan: 'Setiausaha Perbandaran / Pegawai Pelulus (J52)',
      jabatanId: 'dept-pydp',
      jabatanNama: 'Pejabat Yang Dipertua',
      unit: 'Pejabat Setiausaha Perbandaran',
      role: 'PELULUS',
      status: 'AKTIF',
      gambarProfil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      uid: 'user-secretariat',
      nama: 'En. Muhammad Hafiz bin Rosli',
      emel: 'urussetia@mplbp.gov.my',
      kataLaluan: 'urussetia123',
      noTelefon: '017-5566778',
      noStaf: 'MPLBP-0320',
      jawatan: 'Pegawai Urus Setia & Fasiliti (N19)',
      jabatanId: 'dept-jkp',
      jabatanNama: 'Jabatan Khidmat Pengurusan',
      unit: 'Bahagian Pentadbiran & Sumber Manusia',
      role: 'URUS_SETIA',
      status: 'AKTIF',
      gambarProfil: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    {
      uid: 'user-staff',
      nama: 'Cik Aishah binti Kamaruddin',
      emel: 'kakitangan@mplbp.gov.my',
      kataLaluan: 'staf123',
      noTelefon: '011-2233445',
      noStaf: 'MPLBP-0488',
      jawatan: 'Penolong Pegawai Perancang Bandar (JA29)',
      jabatanId: 'dept-jppl',
      jabatanNama: 'Jabatan Perancangan Pembangunan dan Landskap',
      unit: 'Bahagian Perancangan Pembangunan',
      role: 'KAKITANGAN',
      status: 'AKTIF',
      gambarProfil: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    {
      uid: 'user-kej',
      nama: 'Ir. Ahmad Danial bin Mokhtar',
      emel: 'danial.kej@mplbp.gov.my',
      kataLaluan: 'kej123',
      noTelefon: '019-8765432',
      noStaf: 'MPLBP-0205',
      jawatan: 'Jurutera Bangunan Kanan (J44)',
      jabatanId: 'dept-jkej',
      jabatanNama: 'Jabatan Kejuruteraan',
      unit: 'Bahagian Infrastruktur, Jalan & Cerun',
      role: 'KAKITANGAN',
      status: 'AKTIF',
      gambarProfil: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    },
    {
      uid: 'user-osc',
      nama: 'En. Faisal bin Mohd Sapari',
      emel: 'faisal.osc@mplbp.gov.my',
      kataLaluan: 'osc123',
      noTelefon: '019-3322110',
      noStaf: 'MPLBP-0199',
      jawatan: 'Pegawai Perancang OSC (JA41)',
      jabatanId: 'dept-osc',
      jabatanNama: 'Unit Pusat Setempat (OSC)',
      unit: 'Urus Setia Pusat Setempat (OSC 3.0 Plus)',
      role: 'KAKITANGAN',
      status: 'AKTIF',
      gambarProfil: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ];

  // Official 3 Meeting Rooms with exact capacities (40, 12, 10 pax)
  const SEED_ROOMS = [
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
      warna: '#1e3a8a'
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
      warna: '#0d9488'
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
      warna: '#d97706'
    }
  ];

  const todayStr = '2026-08-14';
  const tomorrowStr = '2026-08-15';

  const SEED_BOOKINGS = [
    {
      bookingId: 'bk-2026-0001',
      noRujukan: 'MB-2026-000101',
      tajukMesyuarat: 'Mesyuarat Jawatankuasa Penuh Majlis Bil. 8/2026',
      tujuan: 'Membentangkan minit mesyuarat terdahulu, kelulusan permohonan pelan kebenaran merancang (KM) dan status kutipan hasil cukai taksiran Langkawi.',
      tarikh: todayStr,
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
      approvedByName: 'Dato\' Ir. Wan Azman bin Wan Sulong',
      approvedAt: '2026-08-10T10:00:00Z',
      qrCodeData: 'MPLBP-MB-2026-000101-VERIFIED',
      checkInAt: `${todayStr}T08:45:00Z`,
      checkedInBy: 'Cik Aishah binti Kamaruddin',
      serviceStatus: 'SELESAI',
      createdAt: '2026-08-08T14:20:00Z',
      updatedAt: '2026-08-14T08:45:00Z'
    },
    {
      bookingId: 'bk-2026-0002',
      noRujukan: 'MB-2026-000102',
      tajukMesyuarat: 'Bengkel Transformasi Digital & Smart Tourism Langkawi',
      tujuan: 'Sesi perbincangan teknikal pembinaan papan pemuka pelancongan pintar bersama LADA & TM.',
      tarikh: todayStr,
      masaMula: '14:00',
      masaTamat: '17:00',
      roomId: 'room-rebak',
      roomName: 'Bilik Perbincangan Rebak',
      roomColor: '#0d9488',
      userId: 'user-admin',
      userName: 'Haji Mohd Khairul bin Idris',
      userEmail: 'admin@mplbp.gov.my',
      userPhone: '012-4567890',
      jabatanId: 'dept-jkp',
      jabatanNama: 'Jabatan Khidmat Pengurusan',
      unit: 'Bahagian Pengurusan Teknologi Maklumat (BPTM)',
      bilanganPeserta: 10,
      pengerusi: 'Setiausaha Perbandaran MPLBP',
      urusSetia: 'En. Muhammad Hafiz bin Rosli',
      peralatan: { projektor: true, sistemAudio: true, mikrofonKuantiti: 2, persidanganVideo: false, komputerLanjutan: true, papanPutih: true },
      perkhidmatan: { susunanMeja: 'BILIK_DARJAH', bilanganKerusi: 10, minuman: true, jamuanRingan: true, kebersihanKhas: true },
      jenisTempahan: 'SEKALI',
      status: 'DILULUSKAN',
      approvedBy: 'user-approver',
      approvedByName: 'Dato\' Ir. Wan Azman bin Wan Sulong',
      approvedAt: '2026-08-11T11:30:00Z',
      qrCodeData: 'MPLBP-MB-2026-000102-VERIFIED',
      serviceStatus: 'DALAM_PROSES',
      createdAt: '2026-08-09T09:15:00Z',
      updatedAt: '2026-08-11T11:30:00Z'
    },
    {
      bookingId: 'bk-2026-0003',
      noRujukan: 'MB-2026-000103',
      tajukMesyuarat: 'Mesyuarat Penyelarasan Jawatankuasa Pusat Setempat (OSC) Bil. 15/2026',
      tujuan: 'Meneliti permohonan kebenaran merancang (KM) dan pelan bangunan kompleks pelancongan Teluk Yu.',
      tarikh: tomorrowStr,
      masaMula: '09:30',
      masaTamat: '12:30',
      roomId: 'room-osc',
      roomName: 'Bilik Perbincangan OSC',
      roomColor: '#d97706',
      userId: 'user-osc',
      userName: 'En. Faisal bin Mohd Sapari',
      userEmail: 'faisal.osc@mplbp.gov.my',
      userPhone: '019-3322110',
      jabatanId: 'dept-osc',
      jabatanNama: 'Unit Pusat Setempat (OSC)',
      unit: 'Urus Setia Pusat Setempat (OSC 3.0 Plus)',
      bilanganPeserta: 8,
      pengerusi: 'Pengarah Jabatan Perancangan Pembangunan dan Landskap',
      urusSetia: 'En. Faisal bin Mohd Sapari',
      peralatan: { projektor: true, sistemAudio: false, mikrofonKuantiti: 2, persidanganVideo: true, komputerLanjutan: false, papanPutih: true },
      perkhidmatan: { susunanMeja: 'BENTUK_U', bilanganKerusi: 8, minuman: true, jamuanRingan: false, kebersihanKhas: true },
      jenisTempahan: 'SEKALI',
      status: 'MENUNGGU_KELULUSAN',
      createdAt: '2026-08-13T16:00:00Z',
      updatedAt: '2026-08-13T16:00:00Z'
    },
    {
      bookingId: 'bk-2026-0004',
      noRujukan: 'MB-2026-000104',
      tajukMesyuarat: 'Mesyuarat Tapak & Kemajuan Projek Naik Taraf Jalan Pantai Chenang',
      tujuan: 'Laporan status pembinaan saliran dan turapan jalan pelancongan fasa 2.',
      tarikh: tomorrowStr,
      masaMula: '14:30',
      masaTamat: '16:30',
      roomId: 'room-rebak',
      roomName: 'Bilik Perbincangan Rebak',
      roomColor: '#0d9488',
      userId: 'user-kej',
      userName: 'Ir. Ahmad Danial bin Mokhtar',
      userEmail: 'danial.kej@mplbp.gov.my',
      userPhone: '019-8765432',
      jabatanId: 'dept-jkej',
      jabatanNama: 'Jabatan Kejuruteraan',
      unit: 'Bahagian Infrastruktur, Jalan & Cerun',
      bilanganPeserta: 11,
      pengerusi: 'Ir. Zulkifli bin Hashim (Pengarah Kejuruteraan)',
      urusSetia: 'Ir. Ahmad Danial bin Mokhtar',
      peralatan: { projektor: true, sistemAudio: true, mikrofonKuantiti: 2, persidanganVideo: false, komputerLanjutan: true, papanPutih: true },
      perkhidmatan: { susunanMeja: 'MEJA_BULAT', bilanganKerusi: 11, minuman: true, jamuanRingan: false, kebersihanKhas: true },
      jenisTempahan: 'SEKALI',
      status: 'MENUNGGU_KELULUSAN',
      createdAt: '2026-08-14T10:15:00Z',
      updatedAt: '2026-08-14T10:15:00Z'
    }
  ];

  const SEED_NOTIFICATIONS = [
    {
      notifId: 'notif-1',
      userId: 'user-staff',
      tajuk: 'Tempahan Mesyuarat Telah Diluluskan',
      mesej: "Permohonan tempahan anda bagi Bilik Mesyuarat Utama Che' Nang pada 14 Ogos 2026 telah DILULUSKAN.",
      jenis: 'TEMPAHAN_DILULUSKAN',
      bookingId: 'bk-2026-0001',
      noRujukan: 'MB-2026-000101',
      dibaca: false,
      createdAt: '2026-08-10T10:00:00Z'
    }
  ];

  const SEED_AUDIT_LOGS = [
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

  const MALAY_MONTHS = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
  const MALAY_DAYS = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];

  function formatMalayDate(str) {
    if (!str) return '';
    try {
      const d = new Date(str);
      return `${d.getDate()} ${MALAY_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return str;
    }
  }

  const ROLE_LABELS = {
    PENTADBIR_SISTEM: 'Pentadbir Sistem (Admin)',
    PENTADBIR_JABATAN: 'Pentadbir Jabatan',
    PELULUS: 'Pegawai Pelulus',
    URUS_SETIA: 'Urus Setia Fasiliti',
    KAKITANGAN: 'Kakitangan'
  };

  const BOOKING_STATUS_CONFIG = {
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

  // --- SVG Icons ---
  const Icons = {
    Building: () => React.createElement('svg', { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
    ),
    Calendar: () => React.createElement('svg', { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
    ),
    CalendarPlus: () => React.createElement('svg', { className: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 9v6m3-3H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z' })
    ),
    DoorOpen: () => React.createElement('svg', { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2zm4 7h.01' })
    ),
    QrCode: () => React.createElement('svg', { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' })
    ),
    CheckSquare: () => React.createElement('svg', { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
    ),
    Wrench: () => React.createElement('svg', { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' })
    ),
    Trash: () => React.createElement('svg', { className: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })
    ),
    Lock: () => React.createElement('svg', { className: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' })
    ),
    LogOut: () => React.createElement('svg', { className: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' })
    ),
    BookOpen: () => React.createElement('svg', { className: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })
    ),
    Download: () => React.createElement('svg', { className: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' })
    ),
    Printer: () => React.createElement('svg', { className: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z' })
    ),
    Sparkles: () => React.createElement('svg', { className: 'w-4 h-4 text-amber-400', fill: 'currentColor', viewBox: '0 0 24 24' },
      React.createElement('path', { d: 'M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6-6.3 4.6 2.3-7.4-6-4.6h7.6z' })
    ),
    ChevronLeft: () => React.createElement('svg', { className: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M15 19l-7-7 7-7' })
    ),
    ChevronRight: () => React.createElement('svg', { className: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M9 5l7 7-7 7' })
    )
  };

  function SimpleQRCodeSVG({ value, size = 120 }) {
    const hash = Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return React.createElement('svg', {
      width: size,
      height: size,
      viewBox: '0 0 100 100',
      className: 'bg-white p-2 rounded-xl shadow-xs'
    },
      React.createElement('rect', { width: 100, height: 100, fill: 'white' }),
      React.createElement('rect', { x: 5, y: 5, width: 28, height: 28, fill: '#1e3a8a', rx: 4 }),
      React.createElement('rect', { x: 10, y: 10, width: 18, height: 18, fill: 'white', rx: 2 }),
      React.createElement('rect', { x: 14, y: 14, width: 10, height: 10, fill: '#1e3a8a', rx: 1 }),
      React.createElement('rect', { x: 67, y: 5, width: 28, height: 28, fill: '#1e3a8a', rx: 4 }),
      React.createElement('rect', { x: 72, y: 10, width: 18, height: 18, fill: 'white', rx: 2 }),
      React.createElement('rect', { x: 76, y: 14, width: 10, height: 10, fill: '#1e3a8a', rx: 1 }),
      React.createElement('rect', { x: 5, y: 67, width: 28, height: 28, fill: '#1e3a8a', rx: 4 }),
      React.createElement('rect', { x: 10, y: 72, width: 18, height: 18, fill: 'white', rx: 2 }),
      React.createElement('rect', { x: 14, y: 76, width: 10, height: 10, fill: '#1e3a8a', rx: 1 }),
      [...Array(12)].map((_, i) =>
        [...Array(12)].map((_, j) => {
          const isCorner = (i < 4 && j < 4) || (i > 7 && j < 4) || (i < 4 && j > 7);
          if (isCorner) return null;
          const isDot = ((i * 7 + j * 13 + hash) % 3 === 0);
          if (!isDot) return null;
          return React.createElement('rect', {
            key: `${i}-${j}`,
            x: 10 + j * 7,
            y: 10 + i * 7,
            width: 5,
            height: 5,
            fill: '#1e3a8a',
            rx: 1
          });
        })
      )
    );
  }

  function getStored(key, fallback) {
    try {
      const v = localStorage.getItem('mplbp_ebilik_' + key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  }

  function setStored(key, val) {
    try {
      localStorage.setItem('mplbp_ebilik_' + key, JSON.stringify(val));
    } catch (e) {
      console.warn(e);
    }
  }

  // Auto-migration for updated departments & bookings
  (function initRoomVersion() {
    const currentVer = localStorage.getItem('mplbp_ebilik_rooms_version');
    if (currentVer !== ROOMS_DATA_VERSION) {
      setStored('users', SEED_USERS);
      setStored('departments', SEED_DEPARTMENTS);
      setStored('rooms', SEED_ROOMS);
      setStored('bookings', SEED_BOOKINGS);
      localStorage.setItem('mplbp_ebilik_rooms_version', ROOMS_DATA_VERSION);
    }
  })();

  // --- DEDICATED LOGIN PORTAL COMPONENT ---
  function LoginPage({ users, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFormSubmit = (e) => {
      e.preventDefault();
      setErrorMessage('');
      const foundUser = users.find(u => u.emel.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        setErrorMessage('Emel tidak dijumpai dalam pangkalan data MPLBP.');
        return;
      }
      onLoginSuccess(foundUser);
    };

    const handleQuickLogin = (targetUser) => {
      onLoginSuccess(targetUser);
    };

    return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 font-sans text-slate-800' },
      React.createElement('div', { className: 'max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700/30 grid grid-cols-1 md:grid-cols-12 animate-fade-in' },

        // Left Branding Panel
        React.createElement('div', { className: 'md:col-span-5 bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900 p-8 text-white flex flex-col justify-between space-y-8' },
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', { className: 'w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black text-2xl shadow-inner border border-white/20' },
              React.createElement(Icons.Building, null)
            ),
            React.createElement('div', null,
              React.createElement('div', { className: 'flex items-center gap-1.5' },
                React.createElement('span', { className: 'text-2xl font-black tracking-tight text-white' }, 'MPLBP'),
                React.createElement('span', { className: 'text-2xl font-black text-sky-400' }, 'e-BILIK')
              ),
              React.createElement('p', { className: 'text-xs text-sky-200 uppercase font-bold tracking-wider mt-1' }, 'Majlis Perbandaran Langkawi Bandaraya Pelancongan')
            )
          ),

          React.createElement('div', { className: 'space-y-3 text-xs text-slate-300' },
            React.createElement('p', { className: 'leading-relaxed' }, 'Sistem Pengurusan Tempahan Bilik Mesyuarat Bersepadu untuk kegunaan Pentadbir dan Kakitangan MPLBP.'),
            React.createElement('div', { className: 'p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1.5 text-[11px]' },
              React.createElement('p', { className: 'font-bold text-white' }, '🏛️ 3 Bilik Mesyuarat Rasmi:'),
              React.createElement('p', null, '• Bilik Mesyuarat Utama Che\' Nang (40 Pax)'),
              React.createElement('p', null, '• Bilik Perbincangan Rebak (12 Pax)'),
              React.createElement('p', null, '• Bilik Perbincangan OSC (10 Pax)')
            )
          ),

          React.createElement('div', { className: 'text-[10px] text-slate-400 font-mono' }, 'PORTAL RASMI KERAJAAN TEMPATAN © 2026')
        ),

        // Right Form Panel
        React.createElement('div', { className: 'md:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6' },
          React.createElement('div', { className: 'space-y-2' },
            React.createElement('h2', { className: 'text-2xl font-black text-slate-900 tracking-tight' }, 'Log Masuk Pengguna'),
            React.createElement('p', { className: 'text-xs text-slate-500 font-medium' }, 'Sila masukkan emel rasmi untuk mengakses sistem tempahan bilik mesyuarat.')
          ),

          errorMessage && React.createElement('div', { className: 'p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold' },
            errorMessage
          ),

          // Standard Login Form
          React.createElement('form', { onSubmit: handleFormSubmit, className: 'space-y-4 text-xs' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Emel Rasmi / ID Pengguna *'),
              React.createElement('input', {
                type: 'email',
                required: true,
                value: email,
                onChange: e => setEmail(e.target.value),
                placeholder: 'cth: admin@mplbp.gov.my atau kakitangan@mplbp.gov.my',
                className: 'w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden transition-all'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Kata Laluan *'),
              React.createElement('input', {
                type: 'password',
                required: true,
                value: password,
                onChange: e => setPassword(e.target.value),
                placeholder: '••••••••',
                className: 'w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden transition-all'
              })
            ),
            React.createElement('button', {
              type: 'submit',
              className: 'w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]'
            }, 'Log Masuk ke Sistem')
          ),

          // Quick Login Section (1-Click Role Login)
          React.createElement('div', { className: 'pt-4 border-t border-slate-200 space-y-3' },
            React.createElement('p', { className: 'text-[11px] font-extrabold uppercase tracking-wider text-slate-400 text-center' }, '⚡ Akses Pantas Mengikut Peranan (Demo):'),
            React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs' },
              // Admin Button
              React.createElement('button', {
                onClick: () => handleQuickLogin(users.find(u => u.uid === 'user-admin')),
                className: 'p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left flex items-center gap-2.5 transition-all group'
              },
                React.createElement('div', { className: 'w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs' }, '👑'),
                React.createElement('div', { className: 'truncate' },
                  React.createElement('p', { className: 'font-black text-blue-950 text-[11px]' }, 'Pentadbir Sistem (Admin)'),
                  React.createElement('p', { className: 'text-[10px] text-blue-700 truncate' }, 'Kuasa Penuh: Lulus, Padam, Tambah')
                )
              ),
              // Staff Button
              React.createElement('button', {
                onClick: () => handleQuickLogin(users.find(u => u.uid === 'user-staff')),
                className: 'p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left flex items-center gap-2.5 transition-all group'
              },
                React.createElement('div', { className: 'w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs' }, '👤'),
                React.createElement('div', { className: 'truncate' },
                  React.createElement('p', { className: 'font-black text-emerald-950 text-[11px]' }, 'Kakitangan (JPPL)'),
                  React.createElement('p', { className: 'text-[10px] text-emerald-700 truncate' }, 'Mohon Tempahan Bilik')
                )
              ),
              // Approver Button
              React.createElement('button', {
                onClick: () => handleQuickLogin(users.find(u => u.uid === 'user-approver')),
                className: 'p-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left flex items-center gap-2.5 transition-all group'
              },
                React.createElement('div', { className: 'w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs' }, '✍️'),
                React.createElement('div', { className: 'truncate' },
                  React.createElement('p', { className: 'font-black text-purple-950 text-[11px]' }, 'Pegawai Pelulus (YDP/SU)'),
                  React.createElement('p', { className: 'text-[10px] text-purple-700 truncate' }, 'Kelulusan Permohonan')
                )
              ),
              // Engineering Staff Button
              React.createElement('button', {
                onClick: () => handleQuickLogin(users.find(u => u.uid === 'user-kej')),
                className: 'p-2.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-left flex items-center gap-2.5 transition-all group'
              },
                React.createElement('div', { className: 'w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs' }, '🏗️'),
                React.createElement('div', { className: 'truncate' },
                  React.createElement('p', { className: 'font-black text-teal-950 text-[11px]' }, 'Kakitangan (JKEJ)'),
                  React.createElement('p', { className: 'text-[10px] text-teal-700 truncate' }, 'Jabatan Kejuruteraan')
                )
              )
            )
          )
        )
      )
    );
  }

  // --- CALENDAR VIEW COMPONENT WITH DEPARTMENT FILTER ---
  function CalendarView({ bookings, rooms, departments, onSelectBooking, onNewBookingAtDate }) {
    const [viewMode, setViewMode] = useState('MONTH');
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentMonth, setCurrentMonth] = useState(7);
    const [selectedRoomFilter, setSelectedRoomFilter] = useState('ALL');
    const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

    const handlePrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const handleNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const calendarGrid = [];
    for (let i = 0; i < firstDayIndex; i++) {
      calendarGrid.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = String(d).padStart(2, '0');
      const mStr = String(currentMonth + 1).padStart(2, '0');
      const dateStr = `${currentYear}-${mStr}-${dStr}`;
      calendarGrid.push({ dayNumber: d, dateStr });
    }

    const filteredBookings = useMemo(() => {
      return bookings.filter(b => {
        if (selectedRoomFilter !== 'ALL' && b.roomId !== selectedRoomFilter) return false;
        if (selectedDeptFilter !== 'ALL' && b.jabatanId !== selectedDeptFilter) return false;
        if (b.status === 'DIBATALKAN') return false;
        return true;
      });
    }, [bookings, selectedRoomFilter, selectedDeptFilter]);

    return React.createElement('div', { className: 'space-y-6 animate-fade-in' },
      React.createElement('div', { className: 'p-5 bg-white rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', { className: 'flex items-center gap-3' },
          React.createElement('div', { className: 'flex items-center gap-1 bg-slate-100 p-1 rounded-2xl' },
            React.createElement('button', {
              onClick: handlePrevMonth,
              className: 'p-2 hover:bg-white rounded-xl text-slate-700 transition-colors',
              title: 'Bulan Terdahulu'
            }, React.createElement(Icons.ChevronLeft, null)),
            React.createElement('button', {
              onClick: handleNextMonth,
              className: 'p-2 hover:bg-white rounded-xl text-slate-700 transition-colors',
              title: 'Bulan Seterusnya'
            }, React.createElement(Icons.ChevronRight, null))
          ),
          React.createElement('h2', { className: 'text-lg sm:text-xl font-black text-slate-900' },
            `${MALAY_MONTHS[currentMonth]} ${currentYear}`
          ),
          React.createElement('button', {
            onClick: () => {
              setCurrentYear(2026);
              setCurrentMonth(7);
            },
            className: 'text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors'
          }, 'Hari Ini')
        ),

        React.createElement('div', { className: 'flex items-center gap-2.5 flex-wrap' },
          // Filter Bilik
          React.createElement('select', {
            value: selectedRoomFilter,
            onChange: e => setSelectedRoomFilter(e.target.value),
            className: 'px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-hidden'
          },
            React.createElement('option', { value: 'ALL' }, 'Semua Bilik'),
            rooms.map(r => React.createElement('option', { key: r.roomId, value: r.roomId }, `${r.nama} (${r.kapasiti} Pax)`))
          ),

          // Filter Jabatan (Semua 12 Jabatan / Unit Rasmi)
          React.createElement('select', {
            value: selectedDeptFilter,
            onChange: e => setSelectedDeptFilter(e.target.value),
            className: 'px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-hidden max-w-[200px] truncate'
          },
            React.createElement('option', { value: 'ALL' }, 'Semua Jabatan MPLBP'),
            departments.map(d => React.createElement('option', { key: d.deptId, value: d.deptId }, d.nama))
          ),

          // View Mode Switcher
          React.createElement('div', { className: 'flex bg-slate-100 p-1 rounded-2xl text-xs font-bold' },
            React.createElement('button', {
              onClick: () => setViewMode('MONTH'),
              className: `px-3 py-1.5 rounded-xl transition-all ${viewMode === 'MONTH' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`
            }, 'Bulan'),
            React.createElement('button', {
              onClick: () => setViewMode('WEEK'),
              className: `px-3 py-1.5 rounded-xl transition-all ${viewMode === 'WEEK' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`
            }, 'Minggu'),
            React.createElement('button', {
              onClick: () => setViewMode('DAY'),
              className: `px-3 py-1.5 rounded-xl transition-all ${viewMode === 'DAY' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`
            }, 'Hari')
          )
        )
      ),

      viewMode === 'MONTH' && React.createElement('div', { className: 'bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden' },
        React.createElement('div', { className: 'grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-3' },
          MALAY_DAYS.map((day, idx) =>
            React.createElement('div', { key: idx, className: (idx === 0 || idx === 6) ? 'text-rose-600' : '' }, day)
          )
        ),

        React.createElement('div', { className: 'grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[580px]' },
          calendarGrid.map((item, idx) => {
            if (!item) {
              return React.createElement('div', { key: `empty-${idx}`, className: 'bg-slate-50/50 p-2 min-h-[90px]' });
            }

            const dayBookings = filteredBookings.filter(b => b.tarikh === item.dateStr);
            const isToday = item.dateStr === '2026-08-14';

            return React.createElement('div', {
              key: item.dateStr,
              onClick: () => onNewBookingAtDate && onNewBookingAtDate(item.dateStr),
              className: `p-2.5 min-h-[105px] hover:bg-blue-50/40 transition-colors flex flex-col justify-between cursor-pointer group ${
                isToday ? 'bg-blue-50/60 ring-2 ring-blue-500/20 inset-ring' : 'bg-white'
              }`
            },
              React.createElement('div', { className: 'flex items-center justify-between mb-1.5' },
                React.createElement('span', {
                  className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    isToday ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 group-hover:text-blue-700'
                  }`
                }, item.dayNumber),
                dayBookings.length > 0 && React.createElement('span', { className: 'text-[10px] font-bold text-slate-400 font-mono' },
                  `${dayBookings.length} Slot`
                )
              ),

              React.createElement('div', { className: 'space-y-1 overflow-y-auto max-h-20 custom-scrollbar' },
                dayBookings.map(b =>
                  React.createElement('div', {
                    key: b.bookingId,
                    onClick: (e) => {
                      e.stopPropagation();
                      onSelectBooking(b);
                    },
                    className: 'p-1.5 rounded-lg text-[10px] font-bold leading-tight truncate shadow-xs border cursor-pointer hover:scale-[1.02] transition-transform bg-white/90 text-slate-800 border-l-4',
                    style: { borderLeftColor: b.roomColor || '#1e3a8a' },
                    title: `${b.tajukMesyuarat} (${b.masaMula} - ${b.masaTamat}) • ${b.jabatanNama}`
                  },
                    React.createElement('div', { className: 'font-mono text-[9px] text-slate-500 truncate' }, `${b.masaMula} • ${b.jabatanNama?.replace('Jabatan ', '')}`),
                    React.createElement('div', { className: 'truncate font-bold text-slate-900' }, b.tajukMesyuarat)
                  )
                )
              )
            );
          })
        )
      ),

      (viewMode === 'WEEK' || viewMode === 'DAY') && React.createElement('div', { className: 'bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4' },
        React.createElement('h3', { className: 'text-base font-extrabold text-slate-900' },
          viewMode === 'WEEK' ? 'Jadual Mesyuarat Mingguan (10 - 16 Ogos 2026)' : 'Jadual Penuh Hari Ini (14 Ogos 2026)'
        ),
        React.createElement('div', { className: 'space-y-3' },
          filteredBookings.map(b =>
            React.createElement('div', {
              key: b.bookingId,
              onClick: () => onSelectBooking(b),
              className: 'p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer'
            },
              React.createElement('div', { className: 'space-y-1' },
                React.createElement('div', { className: 'flex items-center gap-2 flex-wrap' },
                  React.createElement('span', { className: 'text-[10px] font-mono font-bold text-slate-500' }, b.noRujukan),
                  React.createElement('span', { className: 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900' }, b.jabatanNama),
                  React.createElement('span', { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${BOOKING_STATUS_CONFIG[b.status]?.bg || 'bg-slate-100'} ${BOOKING_STATUS_CONFIG[b.status]?.text || 'text-slate-700'}` }, BOOKING_STATUS_CONFIG[b.status]?.label || b.status)
                ),
                React.createElement('h4', { className: 'text-sm font-bold text-slate-900' }, b.tajukMesyuarat),
                React.createElement('p', { className: 'text-xs text-slate-600' }, `🏢 ${b.roomName} • 👤 Ditempah oleh: ${b.userName} (${b.unit || b.jabatanNama}) • Pengerusi: ${b.pengerusi}`)
              ),
              React.createElement('span', { className: 'text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200 self-start sm:self-auto' },
                `${b.masaMula} - ${b.masaTamat}`
              )
            )
          )
        )
      )
    );
  }

  // --- MANUAL PENGGUNA IN-APP VIEW ---
  function ManualPenggunaView({ rooms, departments }) {
    const handleDownloadHtml = () => {
      window.open('MANUAL_PENGGUNA_MPLBP_eBILIK.html', '_blank');
    };

    return React.createElement('div', { className: 'space-y-8 animate-fade-in max-w-4xl mx-auto' },
      React.createElement('div', { className: 'p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('span', { className: 'px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-sky-300' }, 'Direktori Rasmi MPLBP'),
          React.createElement('h2', { className: 'text-2xl font-black mt-2' }, 'Manual Pengguna MPLBP e-BILIK'),
          React.createElement('p', { className: 'text-xs text-slate-300' }, 'Langkah demi langkah penggunaan sistem mengikut jabatan dan pemohon.')
        ),
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('button', {
            onClick: () => window.print(),
            className: 'px-4 py-2.5 bg-white hover:bg-slate-100 text-blue-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5'
          },
            React.createElement(Icons.Printer, null),
            React.createElement('span', null, 'Cetak / PDF')
          ),
          React.createElement('button', {
            onClick: handleDownloadHtml,
            className: 'px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5'
          },
            React.createElement(Icons.Download, null),
            React.createElement('span', null, 'Buka Fail HTML')
          )
        )
      ),

      React.createElement('div', { className: 'bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4' },
        React.createElement('h3', { className: 'text-base font-extrabold text-slate-900 border-b pb-2' }, '1. Senarai Jabatan Rasmi MPLBP (Direktori Pekerja PBT Kedah)'),
        React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700' },
          departments.map(d =>
            React.createElement('div', { key: d.deptId, className: 'p-3 bg-slate-50 rounded-xl border' },
              React.createElement('div', { className: 'font-bold text-blue-950' }, d.nama),
              React.createElement('div', { className: 'text-[11px] text-slate-500' }, `Ketua: ${d.ketuaJabatan}`)
            )
          )
        )
      ),

      React.createElement('div', { className: 'bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4' },
        React.createElement('h3', { className: 'text-base font-extrabold text-slate-900 border-b pb-2' }, '2. Senarai Bilik Mesyuarat Rasmi MPLBP'),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
          rooms.map(r =>
            React.createElement('div', { key: r.roomId, className: 'border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-slate-50/50' },
              React.createElement('img', { src: r.gambar, alt: r.nama, className: 'w-full h-32 object-cover' }),
              React.createElement('div', { className: 'p-3.5 space-y-1 text-xs' },
                React.createElement('span', { className: 'px-2 py-0.5 bg-blue-100 text-blue-900 font-mono font-bold rounded text-[10px]' }, r.kodBilik),
                React.createElement('h4', { className: 'font-bold text-slate-900' }, r.nama),
                React.createElement('p', { className: 'text-emerald-700 font-black' }, `Kapasiti: ${r.kapasiti} Orang (Pax)`),
                React.createElement('p', { className: 'text-slate-500 text-[11px]' }, `${r.aras} • ${r.lokasi}`)
              )
            )
          )
        )
      )
    );
  }

  // --- MAIN APP ---
  function App() {
    const [users, setUsers] = useState(() => getStored('users', SEED_USERS));
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
      return localStorage.getItem('mplbp_ebilik_logged_in') === 'true';
    });
    const [currentUser, setCurrentUser] = useState(() => {
      const all = getStored('users', SEED_USERS);
      const uid = localStorage.getItem('mplbp_ebilik_current_uid') || 'user-admin';
      return all.find(u => u.uid === uid) || all[0];
    });
    const [rooms, setRooms] = useState(() => getStored('rooms', SEED_ROOMS));
    const [bookings, setBookings] = useState(() => getStored('bookings', SEED_BOOKINGS));
    const [departments, setDepartments] = useState(() => getStored('departments', SEED_DEPARTMENTS));
    const [notifications, setNotifications] = useState(() => getStored('notifications', SEED_NOTIFICATIONS));
    const [auditLogs, setAuditLogs] = useState(() => getStored('audit_logs', SEED_AUDIT_LOGS));

    const [currentPage, setCurrentPage] = useState('dashboard');
    const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

    // Modals
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [initialDateForBooking, setInitialDateForBooking] = useState('2026-08-14');
    const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
    const [selectedBookingForQR, setSelectedBookingForQR] = useState(null);
    const [selectedBookingForPrint, setSelectedBookingForPrint] = useState(null);
    const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
    const [doorDisplayRoomId, setDoorDisplayRoomId] = useState(null);

    // Dynamic state in Booking Form for selected department units
    const [bookingFormDeptId, setBookingFormDeptId] = useState('dept-jkp');

    const [toast, setToast] = useState(null);

    const showToast = (title, message, type = 'success') => {
      setToast({ title, message, type });
      setTimeout(() => setToast(null), 4000);
    };

    const handleLoginSuccess = (userObj) => {
      setCurrentUser(userObj);
      setIsLoggedIn(true);
      setBookingFormDeptId(userObj.jabatanId || 'dept-jkp');
      localStorage.setItem('mplbp_ebilik_current_uid', userObj.uid);
      localStorage.setItem('mplbp_ebilik_logged_in', 'true');
      showToast('Log Masuk Berjaya', `Selamat datang, ${userObj.nama} (${ROLE_LABELS[userObj.role] || userObj.role})!`);
    };

    const handleLogout = () => {
      setIsLoggedIn(false);
      localStorage.removeItem('mplbp_ebilik_logged_in');
      showToast('Log Keluar', 'Anda telah berjaya log keluar dari sistem.', 'info');
    };

    const handleSwitchRole = (role) => {
      const target = users.find(u => u.role === role && u.status === 'AKTIF');
      if (target) {
        setCurrentUser(target);
        setBookingFormDeptId(target.jabatanId || 'dept-jkp');
        localStorage.setItem('mplbp_ebilik_current_uid', target.uid);
        showToast('Peranan Ditukar', `Kini melihat sistem sebagai: ${target.nama} (${ROLE_LABELS[role]})`, 'info');
      }
    };

    // TAMBAH TEMPAHAN (ADMIN & KAKITANGAN)
    const handleCreateBooking = (bookingData) => {
      const room = rooms.find(r => r.roomId === bookingData.roomId);

      if (room && bookingData.bilanganPeserta > room.kapasiti) {
        showToast('Melebihi Kapasiti Bilik', `Bilangan peserta (${bookingData.bilanganPeserta} orang) melebihi had kapasiti ${room.nama} (${room.kapasiti} pax).`, 'error');
        return false;
      }

      const conflict = bookings.find(b => 
        b.roomId === bookingData.roomId &&
        b.tarikh === bookingData.tarikh &&
        b.status !== 'DIBATALKAN' &&
        bookingData.masaMula < b.masaTamat &&
        bookingData.masaTamat > b.masaMula
      );

      if (conflict) {
        showToast('Pertindihan Dikesan!', `Bilik ini telah ditempah untuk "${conflict.tajukMesyuarat}" (${conflict.masaMula} - ${conflict.masaTamat}). Sila pilih masa atau bilik lain.`, 'error');
        return false;
      }

      const dept = departments.find(d => d.deptId === bookingData.jabatanId);
      const noRujukan = `MB-2026-${String(bookings.length + 101).padStart(6, '0')}`;
      const isAdminCreating = currentUser.role === 'PENTADBIR_SISTEM';

      const newBooking = {
        ...bookingData,
        bookingId: `bk-${Date.now()}`,
        noRujukan,
        jabatanNama: dept?.nama || bookingData.jabatanNama,
        roomName: room?.nama,
        roomColor: room?.warna,
        qrCodeData: `MPLBP-${noRujukan}-VERIFIED`,
        status: isAdminCreating ? 'DILULUSKAN' : 'MENUNGGU_KELULUSAN',
        approvedBy: isAdminCreating ? currentUser.uid : undefined,
        approvedByName: isAdminCreating ? currentUser.nama : undefined,
        approvedAt: isAdminCreating ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updated = [newBooking, ...bookings];
      setBookings(updated);
      setStored('bookings', updated);

      showToast('Tempahan Berjaya Ditambah', `Permohonan bagi ${newBooking.jabatanNama} (${newBooking.userName}) telah didaftarkan.`);
      setIsBookingModalOpen(false);
      return true;
    };

    // LULUSKAN TEMPAHAN (ADMIN & PELULUS)
    const handleApproveBooking = (bookingId) => {
      const updated = bookings.map(b => {
        if (b.bookingId === bookingId) {
          return {
            ...b,
            status: 'DILULUSKAN',
            approvedBy: currentUser.uid,
            approvedByName: currentUser.nama,
            approvedAt: new Date().toISOString()
          };
        }
        return b;
      });
      setBookings(updated);
      setStored('bookings', updated);
      showToast('Permohonan Diluluskan', 'Tempahan telah diluluskan dan pas Kod QR telah dijana.');
      setSelectedBookingForDetails(null);
    };

    // TOLAK TEMPAHAN (ADMIN & PELULUS)
    const handleRejectBooking = (bookingId, reason) => {
      const updated = bookings.map(b => {
        if (b.bookingId === bookingId) {
          return {
            ...b,
            status: 'DITOLAK',
            rejectedReason: reason,
            approvedBy: currentUser.uid,
            approvedByName: currentUser.nama,
            approvedAt: new Date().toISOString()
          };
        }
        return b;
      });
      setBookings(updated);
      setStored('bookings', updated);
      showToast('Permohonan Ditolak', 'Permohonan tempahan telah ditolak.');
      setSelectedBookingForDetails(null);
    };

    // PADAM TEMPAHAN (ADMIN SAHAJA)
    const handleDeleteBooking = (bookingId) => {
      const target = bookings.find(b => b.bookingId === bookingId);
      if (!target) return;
      if (window.confirm(`Adakah anda pasti untuk MEMADAM rekod tempahan ${target.noRujukan} (${target.tajukMesyuarat})? Tindakan ini tidak boleh diundur.`)) {
        const updated = bookings.filter(b => b.bookingId !== bookingId);
        setBookings(updated);
        setStored('bookings', updated);
        showToast('Tempahan Telah Dipadam', `Rekod ${target.noRujukan} berjaya dipadam dari pangkalan data.`, 'info');
        setSelectedBookingForDetails(null);
      }
    };

    const handleCheckIn = (refOrId) => {
      const b = bookings.find(item => item.bookingId === refOrId || item.noRujukan === refOrId || item.qrCodeData === refOrId);
      if (!b) {
        showToast('Ralat Daftar Masuk', 'Kod QR atau No Rujukan tidak ditemui.', 'error');
        return;
      }
      const updated = bookings.map(item => {
        if (item.bookingId === b.bookingId) {
          return {
            ...item,
            status: 'SEDANG_DIGUNAKAN',
            checkInAt: new Date().toISOString(),
            checkedInBy: currentUser.nama
          };
        }
        return item;
      });
      setBookings(updated);
      setStored('bookings', updated);
      showToast('Daftar Masuk Berjaya', `Mesyuarat ${b.tajukMesyuarat} (${b.roomName}) kini SEDANG DIGUNAKAN.`);
      setIsQRScannerOpen(false);
      setSelectedBookingForDetails(null);
    };

    // Show Login Portal if not logged in
    if (!isLoggedIn) {
      return React.createElement(LoginPage, {
        users: users,
        onLoginSuccess: handleLoginSuccess
      });
    }

    // Filtered bookings based on selected department filter
    const displayBookings = useMemo(() => {
      if (selectedDeptFilter === 'ALL') return bookings;
      return bookings.filter(b => b.jabatanId === selectedDeptFilter);
    }, [bookings, selectedDeptFilter]);

    const isAdmin = currentUser.role === 'PENTADBIR_SISTEM';
    const isApprover = currentUser.role === 'PELULUS' || isAdmin;

    // Fullscreen Kiosk Door Display Mode
    if (currentPage === 'door-display') {
      const activeRoom = rooms.find(r => r.roomId === doorDisplayRoomId) || rooms[0];
      const todayRoomBookings = bookings.filter(b => b.roomId === activeRoom.roomId && b.tarikh === '2026-08-14' && b.status !== 'DIBATALKAN');
      const currentOngoing = todayRoomBookings.find(b => b.status === 'SEDANG_DIGUNAKAN');

      return React.createElement('div', { className: 'fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-8 overflow-hidden font-sans' },
        React.createElement('div', { className: 'flex items-center justify-between border-b border-white/10 pb-6' },
          React.createElement('div', { className: 'flex items-center gap-4' },
            React.createElement('div', { className: 'w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white font-black text-2xl shadow-xl' }, 'M'),
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-2xl font-extrabold tracking-tight text-white' }, 'MPLBP e-BILIK • KIOSK PINTU'),
              React.createElement('p', { className: 'text-xs text-slate-400 font-semibold' }, 'Majlis Perbandaran Langkawi Bandaraya Pelancongan')
            )
          ),
          React.createElement('button', {
            onClick: () => setCurrentPage('dashboard'),
            className: 'px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl transition-colors'
          }, 'Keluar Mod Kiosk')
        ),

        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center' },
          React.createElement('div', { className: 'lg:col-span-7 space-y-6' },
            React.createElement('span', { className: 'px-3 py-1 bg-sky-950 border border-sky-700 text-sky-400 font-mono text-xs font-bold rounded-lg' }, activeRoom.kodBilik + ' • ' + activeRoom.aras),
            React.createElement('h2', { className: 'text-4xl sm:text-6xl font-black text-white' }, activeRoom.nama),
            React.createElement('p', { className: 'text-sm text-slate-300' }, `Kapasiti: ${activeRoom.kapasiti} Orang (Pax) • ${activeRoom.lokasi}`),

            React.createElement('div', {
              className: `p-8 rounded-3xl border-2 backdrop-blur-xl flex items-center justify-between ${
                currentOngoing ? 'bg-rose-950/80 border-rose-500 text-rose-300' : 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              }`
            },
              React.createElement('div', null,
                React.createElement('span', { className: 'text-xs font-extrabold uppercase tracking-widest text-slate-400 block' }, 'Status Bilik Semasa:'),
                React.createElement('h3', { className: 'text-3xl font-black uppercase mt-1' }, currentOngoing ? '🔴 SEDANG DIGUNAKAN' : '🟢 TERSEDIA UNTUK DIGUNAKAN')
              ),
              currentOngoing && React.createElement('div', { className: 'text-right font-mono text-xl font-bold' }, `${currentOngoing.masaMula} - ${currentOngoing.masaTamat}`)
            ),

            currentOngoing && React.createElement('div', { className: 'p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2' },
              React.createElement('h4', { className: 'text-lg font-bold text-white' }, currentOngoing.tajukMesyuarat),
              React.createElement('p', { className: 'text-xs text-slate-300' }, `🏢 ${currentOngoing.jabatanNama} • Ditempah oleh: ${currentOngoing.userName} • Pengerusi: ${currentOngoing.pengerusi}`)
            )
          ),

          React.createElement('div', { className: 'lg:col-span-5 space-y-6 flex flex-col items-center justify-center bg-white/5 p-8 rounded-3xl border border-white/10 text-center' },
            React.createElement('p', { className: 'text-xs font-bold text-sky-400 uppercase tracking-widest' }, 'Jumaat, 14 Ogos 2026'),
            React.createElement('div', { className: 'text-5xl font-black font-mono text-white' }, '09:30:00'),
            React.createElement('div', { className: 'p-4 bg-white rounded-3xl shadow-2xl' },
              React.createElement(SimpleQRCodeSVG, { value: currentOngoing?.qrCodeData || `MPLBP-ROOM-${activeRoom.kodBilik}-CHECKIN`, size: 140 })
            ),
            React.createElement('p', { className: 'text-xs text-slate-400 max-w-xs' }, 'Imbas Kod QR ini dengan telefon pintar untuk pendaftaran kehadiran mesyuarat pantas.')
          )
        ),

        React.createElement('div', { className: 'flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500 font-mono' },
          React.createElement('span', null, 'SISTEM e-BILIK MPLBP • PAPARAN KIOSK DIGITAL'),
          React.createElement('span', { className: 'text-emerald-400 font-bold' }, '🟢 KEMASKINI AUTOMATIK AKTIF')
        )
      );
    }

    // Printable Slip View
    if (selectedBookingForPrint) {
      const b = selectedBookingForPrint;
      return React.createElement('div', { className: 'min-h-screen bg-slate-100 p-6 flex flex-col items-center' },
        React.createElement('div', { className: 'max-w-3xl w-full bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-800 space-y-6' },
          React.createElement('div', { className: 'flex items-center justify-between border-b-2 border-slate-800 pb-4' },
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-lg font-black uppercase text-slate-900' }, 'Majlis Perbandaran Langkawi Bandaraya Pelancongan'),
              React.createElement('p', { className: 'text-xs text-blue-900 font-bold' }, 'SLIP PENGESAHAN TEMPAHAN BILIK MESYUARAT (MPLBP e-BILIK)')
            ),
            React.createElement('div', { className: 'text-right' },
              React.createElement('span', { className: 'text-xs font-mono font-bold text-blue-900' }, b.noRujukan),
              React.createElement('span', { className: 'block text-xs font-bold text-emerald-700' }, b.status)
            )
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-4 text-xs' },
            React.createElement('div', null, React.createElement('span', { className: 'text-slate-500 block' }, 'Tajuk Mesyuarat:'), React.createElement('strong', { className: 'text-sm' }, b.tajukMesyuarat)),
            React.createElement('div', null, React.createElement('span', { className: 'text-slate-500 block' }, 'Bilik Mesyuarat:'), React.createElement('strong', null, b.roomName)),
            React.createElement('div', null, React.createElement('span', { className: 'text-slate-500 block' }, 'Jabatan Pemohon:'), React.createElement('strong', { className: 'text-blue-900 font-bold' }, b.jabatanNama)),
            React.createElement('div', null, React.createElement('span', { className: 'text-slate-500 block' }, 'Pegawai Pemohon (Oleh Siapa):'), React.createElement('strong', null, `${b.userName} (${b.unit || 'Unit'})`)),
            React.createElement('div', null, React.createElement('span', { className: 'text-slate-500 block' }, 'Tarikh & Masa:'), React.createElement('strong', null, `${formatMalayDate(b.tarikh)} (${b.masaMula} - ${b.masaTamat})`)),
            React.createElement('div', null, React.createElement('span', { className: 'text-slate-500 block' }, 'Pengerusi Mesyuarat:'), React.createElement('strong', null, b.pengerusi)),
            React.createElement('div', null, React.createElement('span', { className: 'text-slate-500 block' }, 'No. Telefon / Ext:'), React.createElement('strong', null, b.userPhone || '04-9666590')),
            React.createElement('div', null, React.createElement('span', { className: 'text-slate-500 block' }, 'Bilangan Peserta:'), React.createElement('strong', null, `${b.bilanganPeserta} Orang`))
          ),
          React.createElement('div', { className: 'p-4 bg-slate-50 rounded-xl border flex items-center justify-between' },
            React.createElement('div', { className: 'text-xs space-y-1' },
              React.createElement('p', { className: 'font-bold' }, 'Kod Pengesahan Pas Digital QR:'),
              React.createElement('p', { className: 'text-slate-500' }, 'Imbas semasa tiba di bilik mesyuarat untuk rekod kehadiran.')
            ),
            React.createElement(SimpleQRCodeSVG, { value: b.qrCodeData || `MPLBP-${b.noRujukan}-VERIFIED`, size: 90 })
          ),
          React.createElement('div', { className: 'flex justify-end gap-3 pt-4 border-t' },
            React.createElement('button', {
              onClick: () => setSelectedBookingForPrint(null),
              className: 'px-4 py-2 bg-slate-100 font-bold text-xs rounded-xl'
            }, 'Tutup'),
            React.createElement('button', {
              onClick: () => window.print(),
              className: 'px-6 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md'
            }, 'Cetak Slip')
          )
        )
      );
    }

    return React.createElement('div', { className: 'min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800' },
      toast && React.createElement('div', {
        className: `fixed bottom-5 right-5 z-50 p-4 rounded-2xl shadow-2xl border text-white text-xs font-bold transition-all ${
          toast.type === 'error' ? 'bg-rose-900 border-rose-700' : toast.type === 'info' ? 'bg-sky-900 border-sky-700' : 'bg-emerald-900 border-emerald-700'
        }`
      },
        React.createElement('h4', { className: 'font-extrabold text-sm' }, toast.title),
        React.createElement('p', { className: 'mt-0.5 opacity-90' }, toast.message)
      ),

      // Top Navbar
      React.createElement('header', { className: 'sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs h-16 px-6 flex items-center justify-between' },
        React.createElement('div', { className: 'flex items-center gap-3 cursor-pointer', onClick: () => setCurrentPage('dashboard') },
          React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 via-blue-800 to-sky-600 flex items-center justify-center text-white shadow-md' },
            React.createElement(Icons.Building, null)
          ),
          React.createElement('div', null,
            React.createElement('div', { className: 'flex items-center gap-1.5' },
              React.createElement('span', { className: 'font-extrabold text-base text-slate-900' }, 'MPLBP'),
              React.createElement('span', { className: 'font-extrabold text-base text-blue-600' }, 'e-BILIK'),
              React.createElement('span', { className: 'text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200' }, 'PBT')
            ),
            React.createElement('p', { className: 'text-[10px] font-semibold text-slate-500 uppercase' }, 'Majlis Perbandaran Langkawi Bandaraya Pelancongan')
          )
        ),

        // Role Switcher & User Pill & Logout
        React.createElement('div', { className: 'flex items-center gap-3' },
          React.createElement('button', {
            onClick: () => setCurrentPage('user-manual'),
            className: 'hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 transition-colors'
          },
            React.createElement(Icons.BookOpen, null),
            React.createElement('span', null, 'Manual Pengguna')
          ),

          React.createElement('div', { className: 'flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-xs' },
            React.createElement(Icons.Sparkles, null),
            React.createElement('span', { className: 'font-bold text-blue-900' }, ROLE_LABELS[currentUser.role] || currentUser.role),
            React.createElement('select', {
              value: currentUser.role,
              onChange: e => handleSwitchRole(e.target.value),
              className: 'bg-transparent font-bold text-blue-700 outline-hidden ml-1 cursor-pointer'
            },
              Object.entries(ROLE_LABELS).map(([k, v]) => React.createElement('option', { key: k, value: k }, v))
            )
          ),

          React.createElement('div', { className: 'flex items-center gap-2.5 p-1 rounded-xl' },
            React.createElement('img', { src: currentUser.gambarProfil, alt: currentUser.nama, className: 'w-8 h-8 rounded-lg object-cover ring-2 ring-blue-600/20' }),
            React.createElement('div', { className: 'hidden md:block text-left' },
              React.createElement('p', { className: 'text-xs font-bold text-slate-800 line-clamp-1' }, currentUser.nama),
              React.createElement('p', { className: 'text-[10px] text-slate-500 truncate max-w-[180px]' }, `${currentUser.jawatan}`)
            )
          ),

          React.createElement('button', {
            onClick: handleLogout,
            title: 'Log Keluar dari Sistem',
            className: 'p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-colors'
          },
            React.createElement(Icons.LogOut, null)
          )
        )
      ),

      // Layout Body
      React.createElement('div', { className: 'flex-1 flex' },
        // Sidebar Navigation
        React.createElement('aside', { className: 'w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4 space-y-4' },
          React.createElement('button', {
            onClick: () => {
              setInitialDateForBooking('2026-08-14');
              setBookingFormDeptId(currentUser.jabatanId || 'dept-jkp');
              setIsBookingModalOpen(true);
            },
            className: 'w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-extrabold text-xs tracking-wide rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]'
          },
            React.createElement(Icons.CalendarPlus, null),
            React.createElement('span', null, '+ TEMPAH BILIK')
          ),

          React.createElement('nav', { className: 'space-y-1 text-xs font-semibold' },
            [
              { id: 'dashboard', label: 'Papan Pemuka', icon: Icons.Building },
              { id: 'my-bookings', label: 'Tempahan Mengikut Jabatan', icon: Icons.Calendar },
              { id: 'calendar', label: 'Kalendar Jadual', icon: Icons.Calendar },
              { id: 'rooms', label: 'Bilik Mesyuarat', icon: Icons.DoorOpen },
              isApprover && { id: 'approvals', label: `Kelulusan (${bookings.filter(b => b.status === 'MENUNGGU_KELULUSAN').length})`, icon: Icons.CheckSquare },
              (currentUser.role === 'URUS_SETIA' || isAdmin) && { id: 'secretariat', label: 'Urus Setia & Fasiliti', icon: Icons.Wrench },
              { id: 'reports', label: 'Laporan & Rekod', icon: Icons.Calendar },
              { id: 'user-manual', label: 'Manual Pengguna', icon: Icons.BookOpen },
              isAdmin && { id: 'admin-audit', label: 'Log Audit', icon: Icons.Lock }
            ].filter(Boolean).map(item =>
              React.createElement('button', {
                key: item.id,
                onClick: () => setCurrentPage(item.id),
                className: `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  currentPage === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              },
                React.createElement(item.icon, null),
                React.createElement('span', null, item.label)
              )
            )
          ),

          React.createElement('div', { className: 'pt-4 border-t border-slate-800 space-y-1' },
            React.createElement('button', {
              onClick: () => setIsQRScannerOpen(true),
              className: 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-emerald-400 text-xs font-bold'
            },
              React.createElement(Icons.QrCode, null),
              React.createElement('span', null, 'Pengimbas QR')
            ),
            React.createElement('button', {
              onClick: () => {
                setDoorDisplayRoomId(rooms[0].roomId);
                setCurrentPage('door-display');
              },
              className: 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-purple-400 text-xs font-bold'
            },
              React.createElement(Icons.DoorOpen, null),
              React.createElement('span', null, 'Kiosk Pintu Bilik')
            )
          )
        ),

        // Main Content View
        React.createElement('main', { className: 'flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-8' },
          // VIEW: DASHBOARD
          currentPage === 'dashboard' && React.createElement('div', { className: 'space-y-6' },
            React.createElement('div', { className: 'p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6' },
              React.createElement('div', { className: 'space-y-1' },
                React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement('span', { className: 'px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-sky-300' }, 'Portal Rasmi MPLBP e-BILIK'),
                  isAdmin && React.createElement('span', { className: 'px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black' }, 'KUASA PENTADBIR')
                ),
                React.createElement('h2', { className: 'text-2xl sm:text-3xl font-black mt-2' }, `Selamat Datang, ${currentUser.nama}`),
                React.createElement('p', { className: 'text-xs text-slate-300' }, `🏢 ${currentUser.jabatanNama} • ${currentUser.jawatan}`)
              ),
              React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement('button', {
                  onClick: () => {
                    setInitialDateForBooking('2026-08-14');
                    setBookingFormDeptId(currentUser.jabatanId || 'dept-jkp');
                    setIsBookingModalOpen(true);
                  },
                  className: 'px-6 py-3 bg-white hover:bg-slate-100 text-blue-950 rounded-2xl font-black text-xs shadow-lg'
                }, '+ TEMPAH BILIK')
              )
            ),

            React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
              [
                { title: 'Tempahan Hari Ini', value: bookings.filter(b => b.tarikh === '2026-08-14' && b.status !== 'DIBATALKAN').length, color: 'bg-blue-50 border-blue-200 text-blue-900' },
                { title: 'Menunggu Kelulusan', value: bookings.filter(b => b.status === 'MENUNGGU_KELULUSAN').length, color: 'bg-amber-50 border-amber-200 text-amber-900' },
                { title: 'Bilik Mesyuarat Aktif', value: `${rooms.filter(r => r.status === 'AKTIF').length} / ${rooms.length}`, color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
                { title: 'Jabatan / Bahagian', value: `${departments.length} Bahagian`, color: 'bg-purple-50 border-purple-200 text-purple-900' }
              ].map((kpi, idx) =>
                React.createElement('div', { key: idx, className: `p-5 rounded-3xl border shadow-card ${kpi.color}` },
                  React.createElement('p', { className: 'text-xs font-bold uppercase tracking-wider opacity-70' }, kpi.title),
                  React.createElement('h3', { className: 'text-3xl font-black tracking-tight mt-1' }, kpi.value)
                )
              )
            ),

            React.createElement('div', { className: 'p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4' },
              React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3' },
                React.createElement('h3', { className: 'text-base font-extrabold text-slate-900' }, 'Jadual Mesyuarat Hari Ini Mengikut Jabatan (14 Ogos 2026)'),
                React.createElement('select', {
                  value: selectedDeptFilter,
                  onChange: e => setSelectedDeptFilter(e.target.value),
                  className: 'px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-hidden max-w-[250px] truncate'
                },
                  React.createElement('option', { value: 'ALL' }, 'Semua Jabatan MPLBP'),
                  departments.map(d => React.createElement('option', { key: d.deptId, value: d.deptId }, d.nama))
                )
              ),
              React.createElement('div', { className: 'space-y-3' },
                displayBookings.filter(b => b.tarikh === '2026-08-14').length === 0
                  ? React.createElement('div', { className: 'p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl' }, 'Tiada mesyuarat dijadualkan bagi jabatan ini hari ini.')
                  : displayBookings.filter(b => b.tarikh === '2026-08-14').map(b =>
                    React.createElement('div', {
                      key: b.bookingId,
                      className: 'p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all'
                    },
                      React.createElement('div', { className: 'space-y-1' },
                        React.createElement('div', { className: 'flex items-center gap-2 flex-wrap' },
                          React.createElement('span', { className: 'text-[10px] font-mono font-bold text-slate-500' }, b.noRujukan),
                          React.createElement('span', { className: 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900' }, b.jabatanNama),
                          React.createElement('span', { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${BOOKING_STATUS_CONFIG[b.status]?.bg || 'bg-slate-100'} ${BOOKING_STATUS_CONFIG[b.status]?.text || 'text-slate-700'}` }, BOOKING_STATUS_CONFIG[b.status]?.label || b.status)
                        ),
                        React.createElement('h4', { className: 'text-sm font-bold text-slate-900' }, b.tajukMesyuarat),
                        React.createElement('p', { className: 'text-xs text-slate-600' }, `🏢 ${b.roomName} • 👤 Ditempah oleh: ${b.userName} (${b.unit || b.jabatanNama}) • Pengerusi: ${b.pengerusi}`)
                      ),
                      React.createElement('div', { className: 'flex items-center gap-2' },
                        React.createElement('span', { className: 'text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg' }, `${b.masaMula} - ${b.masaTamat}`),
                        React.createElement('button', {
                          onClick: () => setSelectedBookingForDetails(b),
                          className: 'px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold'
                        }, 'Butiran'),
                        isAdmin && React.createElement('button', {
                          onClick: () => handleDeleteBooking(b.bookingId),
                          className: 'p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200',
                          title: 'Padam Tempahan (Admin)'
                        }, React.createElement(Icons.Trash, null))
                      )
                    )
                  )
              )
            )
          ),

          // VIEW: KALENDAR JADUAL
          currentPage === 'calendar' && React.createElement(CalendarView, {
            bookings: bookings,
            rooms: rooms,
            departments: departments,
            onSelectBooking: b => setSelectedBookingForDetails(b),
            onNewBookingAtDate: dateStr => {
              setInitialDateForBooking(dateStr);
              setBookingFormDeptId(currentUser.jabatanId || 'dept-jkp');
              setIsBookingModalOpen(true);
            }
          }),

          // VIEW: MANUAL PENGGUNA
          currentPage === 'user-manual' && React.createElement(ManualPenggunaView, {
            rooms: rooms,
            departments: departments
          }),

          // VIEW: MY BOOKINGS / TEMPAHAN MENGIKUT JABATAN
          currentPage === 'my-bookings' && React.createElement('div', { className: 'space-y-6' },
            React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
              React.createElement('div', null,
                React.createElement('h2', { className: 'text-xl font-extrabold text-slate-900' }, 'Senarai Tempahan Mengikut Jabatan'),
                React.createElement('p', { className: 'text-xs text-slate-500' }, 'Pantau permohonan tempahan bilik mesyuarat oleh warga kerja MPLBP.')
              ),
              React.createElement('div', { className: 'flex items-center gap-3' },
                React.createElement('select', {
                  value: selectedDeptFilter,
                  onChange: e => setSelectedDeptFilter(e.target.value),
                  className: 'px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs max-w-[220px] truncate'
                },
                  React.createElement('option', { value: 'ALL' }, 'Semua Jabatan MPLBP'),
                  departments.map(d => React.createElement('option', { key: d.deptId, value: d.deptId }, d.nama))
                ),
                React.createElement('button', {
                  onClick: () => {
                    setInitialDateForBooking('2026-08-14');
                    setBookingFormDeptId(currentUser.jabatanId || 'dept-jkp');
                    setIsBookingModalOpen(true);
                  },
                  className: 'px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm whitespace-nowrap'
                }, '+ Tempah Bilik')
              )
            ),
            React.createElement('div', { className: 'space-y-3' },
              displayBookings.map(b =>
                React.createElement('div', {
                  key: b.bookingId,
                  className: 'p-5 bg-white rounded-3xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4'
                },
                  React.createElement('div', { className: 'space-y-1.5' },
                    React.createElement('div', { className: 'flex items-center gap-2 flex-wrap' },
                      React.createElement('span', { className: 'text-xs font-mono font-bold text-blue-900' }, b.noRujukan),
                      React.createElement('span', { className: 'px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900' }, b.jabatanNama),
                      React.createElement('span', { className: `px-2.5 py-0.5 rounded-full text-xs font-bold ${BOOKING_STATUS_CONFIG[b.status]?.bg} ${BOOKING_STATUS_CONFIG[b.status]?.text}` }, BOOKING_STATUS_CONFIG[b.status]?.label)
                    ),
                    React.createElement('h3', { className: 'text-base font-bold text-slate-900' }, b.tajukMesyuarat),
                    React.createElement('p', { className: 'text-xs text-slate-600' }, `🏢 ${b.roomName} • 📅 ${formatMalayDate(b.tarikh)} (${b.masaMula} - ${b.masaTamat})`),
                    React.createElement('p', { className: 'text-xs text-slate-500' }, `👤 Pemohon: ${b.userName} (${b.unit || b.jabatanNama}) • Pengerusi: ${b.pengerusi}`)
                  ),
                  React.createElement('div', { className: 'flex items-center gap-2 flex-wrap' },
                    React.createElement('button', {
                      onClick: () => setSelectedBookingForDetails(b),
                      className: 'px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl'
                    }, 'Butiran'),
                    React.createElement('button', {
                      onClick: () => setSelectedBookingForQR(b),
                      className: 'px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200'
                    }, 'Pas QR'),
                    React.createElement('button', {
                      onClick: () => setSelectedBookingForPrint(b),
                      className: 'px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border'
                    }, 'Slip'),
                    isAdmin && React.createElement('button', {
                      onClick: () => handleDeleteBooking(b.bookingId),
                      className: 'px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-1',
                      title: 'Padam Tempahan (Admin)'
                    },
                      React.createElement(Icons.Trash, null),
                      React.createElement('span', null, 'Padam')
                    )
                  )
                )
              )
            )
          ),

          // VIEW: ROOMS
          currentPage === 'rooms' && React.createElement('div', { className: 'space-y-6' },
            React.createElement('h2', { className: 'text-xl font-extrabold text-slate-900' }, 'Direktori Bilik Mesyuarat MPLBP'),
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
              rooms.map(r =>
                React.createElement('div', { key: r.roomId, className: 'bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden flex flex-col justify-between' },
                  React.createElement('div', null,
                    React.createElement('img', { src: r.gambar, alt: r.nama, className: 'w-full h-44 object-cover' }),
                    React.createElement('div', { className: 'p-5 space-y-2' },
                      React.createElement('div', { className: 'flex items-center justify-between' },
                        React.createElement('span', { className: 'text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded' }, r.kodBilik),
                        React.createElement('span', { className: 'text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full' }, `${r.kapasiti} Pax`)
                      ),
                      React.createElement('h3', { className: 'text-base font-bold text-slate-900' }, r.nama),
                      React.createElement('p', { className: 'text-xs text-slate-500' }, `${r.aras} • ${r.lokasi}`),
                      React.createElement('p', { className: 'text-xs text-slate-600 line-clamp-2' }, r.penerangan)
                    )
                  ),
                  React.createElement('div', { className: 'p-4 border-t flex items-center gap-2' },
                    React.createElement('button', {
                      onClick: () => {
                        setInitialDateForBooking('2026-08-14');
                        setBookingFormDeptId(currentUser.jabatanId || 'dept-jkp');
                        setIsBookingModalOpen(true);
                      },
                      className: 'flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold'
                    }, 'Tempah Bilik'),
                    React.createElement('button', {
                      onClick: () => {
                        setDoorDisplayRoomId(r.roomId);
                        setCurrentPage('door-display');
                      },
                      className: 'p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold'
                    }, 'Kiosk')
                  )
                )
              )
            )
          ),

          // VIEW: APPROVALS
          currentPage === 'approvals' && React.createElement('div', { className: 'space-y-6' },
            React.createElement('h2', { className: 'text-xl font-extrabold text-slate-900' }, 'Modul Kelulusan Tempahan'),
            React.createElement('div', { className: 'space-y-4' },
              bookings.filter(b => b.status === 'MENUNGGU_KELULUSAN').length === 0
                ? React.createElement('div', { className: 'p-8 text-center bg-white rounded-3xl border text-xs text-slate-500' }, 'Tiada permohonan menunggu tindakan.')
                : bookings.filter(b => b.status === 'MENUNGGU_KELULUSAN').map(b =>
                  React.createElement('div', {
                    key: b.bookingId,
                    className: 'p-6 bg-white rounded-3xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4'
                  },
                    React.createElement('div', { className: 'space-y-1' },
                      React.createElement('div', { className: 'flex items-center gap-2 flex-wrap' },
                        React.createElement('span', { className: 'text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full' }, b.noRujukan),
                        React.createElement('span', { className: 'text-xs font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full' }, b.jabatanNama)
                      ),
                      React.createElement('h3', { className: 'text-base font-bold text-slate-900' }, b.tajukMesyuarat),
                      React.createElement('p', { className: 'text-xs text-slate-600' }, `${b.roomName} • ${formatMalayDate(b.tarikh)} (${b.masaMula} - ${b.masaTamat})`),
                      React.createElement('p', { className: 'text-xs text-slate-500' }, `👤 Ditempah oleh: ${b.userName} (${b.unit || b.jabatanNama}) • Pengerusi: ${b.pengerusi}`)
                    ),
                    React.createElement('div', { className: 'flex items-center gap-2' },
                      React.createElement('button', {
                        onClick: () => handleRejectBooking(b.bookingId, 'Tidak diluluskan kerana percanggahan jadual kerja.'),
                        className: 'px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200'
                      }, 'Tolak'),
                      React.createElement('button', {
                        onClick: () => handleApproveBooking(b.bookingId),
                        className: 'px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md'
                      }, 'Luluskan')
                    )
                  )
                )
            )
          ),

          // VIEW: SECRETARIAT & FACILITIES
          currentPage === 'secretariat' && React.createElement('div', { className: 'space-y-6' },
            React.createElement('h2', { className: 'text-xl font-extrabold text-slate-900' }, 'Pengurusan Fasiliti & Persediaan Urus Setia'),
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
              bookings.filter(b => b.status === 'DILULUSKAN' || b.status === 'SEDANG_DIGUNAKAN').map(b =>
                React.createElement('div', { key: b.bookingId, className: 'p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-3' },
                  React.createElement('div', { className: 'flex items-center justify-between' },
                    React.createElement('span', { className: 'text-xs font-mono font-bold text-blue-900' }, b.noRujukan),
                    React.createElement('span', { className: 'px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200' }, b.serviceStatus || 'Sedia')
                  ),
                  React.createElement('h3', { className: 'text-sm font-bold text-slate-900' }, b.tajukMesyuarat),
                  React.createElement('p', { className: 'text-xs text-slate-600' }, `${b.roomName} • ${formatMalayDate(b.tarikh)} (${b.masaMula} - ${b.masaTamat})`),
                  React.createElement('p', { className: 'text-xs text-blue-900 font-semibold' }, `🏢 ${b.jabatanNama} • Pemohon: ${b.userName}`),
                  React.createElement('div', { className: 'p-3 bg-slate-50 rounded-xl text-xs space-y-1' },
                    React.createElement('p', null, '📐 Susunan: ', React.createElement('strong', null, b.perkhidmatan?.susunanMeja || 'Bentuk U')),
                    React.createElement('p', null, '🪑 Kerusi: ', React.createElement('strong', null, `${b.bilanganPeserta} Unit`)),
                    React.createElement('p', null, '☕ Jamuan/Minuman: ', React.createElement('strong', null, b.perkhidmatan?.minuman ? 'Disediakan' : 'Tiada'))
                  )
                )
              )
            )
          ),

          // VIEW: REPORTS
          currentPage === 'reports' && React.createElement('div', { className: 'space-y-6' },
            React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
              React.createElement('h2', { className: 'text-xl font-extrabold text-slate-900' }, 'Laporan Tempahan Mengikut Jabatan & Pemohon'),
              React.createElement('div', { className: 'flex items-center gap-3' },
                React.createElement('select', {
                  value: selectedDeptFilter,
                  onChange: e => setSelectedDeptFilter(e.target.value),
                  className: 'px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs max-w-[220px] truncate'
                },
                  React.createElement('option', { value: 'ALL' }, 'Semua Jabatan MPLBP'),
                  departments.map(d => React.createElement('option', { key: d.deptId, value: d.deptId }, d.nama))
                ),
                React.createElement('button', {
                  onClick: () => window.print(),
                  className: 'px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl'
                }, 'Cetak Laporan')
              )
            ),
            React.createElement('div', { className: 'bg-white rounded-3xl border p-6 shadow-card overflow-x-auto' },
              React.createElement('table', { className: 'w-full text-left text-xs min-w-[650px]' },
                React.createElement('thead', { className: 'bg-slate-50 border-b text-[11px] font-bold text-slate-500 uppercase' },
                  React.createElement('tr', null,
                    React.createElement('th', { className: 'p-3' }, 'No Rujukan'),
                    React.createElement('th', { className: 'p-3' }, 'Tajuk Mesyuarat'),
                    React.createElement('th', { className: 'p-3' }, 'Jabatan & Pemohon'),
                    React.createElement('th', { className: 'p-3' }, 'Bilik'),
                    React.createElement('th', { className: 'p-3' }, 'Tarikh & Masa'),
                    React.createElement('th', { className: 'p-3' }, 'Status'),
                    isAdmin && React.createElement('th', { className: 'p-3 text-center' }, 'Tindakan Admin')
                  )
                ),
                React.createElement('tbody', { className: 'divide-y divide-slate-100' },
                  displayBookings.map(b =>
                    React.createElement('tr', { key: b.bookingId, className: 'hover:bg-slate-50' },
                      React.createElement('td', { className: 'p-3 font-mono font-bold text-blue-900' }, b.noRujukan),
                      React.createElement('td', { className: 'p-3 font-bold text-slate-900' }, b.tajukMesyuarat),
                      React.createElement('td', { className: 'p-3' },
                        React.createElement('div', { className: 'font-bold text-blue-950' }, b.jabatanNama),
                        React.createElement('div', { className: 'text-[11px] text-slate-500' }, `👤 ${b.userName} (${b.unit || 'Unit'})`)
                      ),
                      React.createElement('td', { className: 'p-3' }, b.roomName),
                      React.createElement('td', { className: 'p-3 font-mono' }, `${b.tarikh} (${b.masaMula}-${b.masaTamat})`),
                      React.createElement('td', { className: 'p-3 font-semibold' }, b.status),
                      isAdmin && React.createElement('td', { className: 'p-3 text-center' },
                        React.createElement('button', {
                          onClick: () => handleDeleteBooking(b.bookingId),
                          className: 'px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold border border-rose-200'
                        }, 'Padam')
                      )
                    )
                  )
                )
              )
            )
          ),

          // VIEW: AUDIT LOGS
          currentPage === 'admin-audit' && React.createElement('div', { className: 'space-y-6' },
            React.createElement('h2', { className: 'text-xl font-extrabold text-slate-900' }, 'Log Audit Keselamatan Transaksi'),
            React.createElement('div', { className: 'bg-white rounded-3xl border p-6 shadow-card' },
              React.createElement('table', { className: 'w-full text-left text-xs' },
                React.createElement('thead', { className: 'bg-slate-50 border-b text-[11px] font-bold text-slate-500 uppercase' },
                  React.createElement('tr', null,
                    React.createElement('th', { className: 'p-3' }, 'Cap Masa'),
                    React.createElement('th', { className: 'p-3' }, 'Pengguna'),
                    React.createElement('th', { className: 'p-3' }, 'Modul'),
                    React.createElement('th', { className: 'p-3' }, 'Tindakan'),
                    React.createElement('th', { className: 'p-3' }, 'Keterangan')
                  )
                ),
                React.createElement('tbody', { className: 'divide-y divide-slate-100' },
                  auditLogs.map(l =>
                    React.createElement('tr', { key: l.logId },
                      React.createElement('td', { className: 'p-3 font-mono text-slate-500' }, formatMalayDate(l.tarikhMasa)),
                      React.createElement('td', { className: 'p-3 font-bold text-slate-900' }, l.namaPengguna),
                      React.createElement('td', { className: 'p-3 font-mono font-bold' }, l.modul),
                      React.createElement('td', { className: 'p-3 font-bold text-blue-700' }, l.tindakan),
                      React.createElement('td', { className: 'p-3 text-slate-700' }, l.keterangan)
                    )
                  )
                )
              )
            )
          )
        )
      ),

      // Booking Form Modal with Full Department & Officer Controls
      isBookingModalOpen && React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs' },
        React.createElement('div', { className: 'bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto' },
          React.createElement('div', { className: 'flex items-center justify-between border-b pb-3' },
            React.createElement('div', null,
              React.createElement('h3', { className: 'text-base font-extrabold text-slate-900' }, 'Borang Permohonan Tempahan Bilik Mesyuarat'),
              React.createElement('p', { className: 'text-[11px] text-slate-500 font-semibold' }, 'Majlis Perbandaran Langkawi Bandaraya Pelancongan')
            ),
            React.createElement('button', { onClick: () => setIsBookingModalOpen(false), className: 'text-slate-400 hover:text-slate-800 font-bold text-lg' }, '✕')
          ),
          React.createElement('form', {
            onSubmit: (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const deptId = fd.get('jabatanId');
              const deptObj = departments.find(d => d.deptId === deptId);

              handleCreateBooking({
                tajukMesyuarat: fd.get('tajukMesyuarat'),
                tujuan: fd.get('tujuan'),
                tarikh: fd.get('tarikh'),
                masaMula: fd.get('masaMula'),
                masaTamat: fd.get('masaTamat'),
                roomId: fd.get('roomId'),
                bilanganPeserta: Number(fd.get('bilanganPeserta')),
                pengerusi: fd.get('pengerusi'),
                urusSetia: fd.get('userName') || currentUser.nama,
                userId: currentUser.uid,
                userName: fd.get('userName'),
                userEmail: fd.get('userEmail') || currentUser.emel,
                userPhone: fd.get('userPhone') || currentUser.noTelefon,
                jabatanId: deptId,
                jabatanNama: deptObj?.nama || 'Jabatan Khidmat Pengurusan',
                unit: fd.get('unit'),
                jenisTempahan: 'SEKALI'
              });
            },
            className: 'space-y-4 text-xs'
          },
            // Seksyen 1: Maklumat Pemohon & Jabatan
            React.createElement('div', { className: 'p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3' },
              React.createElement('h4', { className: 'font-extrabold text-blue-900 text-xs uppercase tracking-wider' }, '1. Maklumat Jabatan & Pegawai Pemohon'),
              React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
                React.createElement('div', null,
                  React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Jabatan MPLBP (Direktori Rasmi) *'),
                  React.createElement('select', {
                    name: 'jabatanId',
                    value: bookingFormDeptId,
                    onChange: (e) => setBookingFormDeptId(e.target.value),
                    className: 'w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800'
                  },
                    departments.map(d => React.createElement('option', { key: d.deptId, value: d.deptId }, d.nama))
                  )
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Bahagian / Unit *'),
                  React.createElement('select', {
                    name: 'unit',
                    className: 'w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800'
                  },
                    (departments.find(d => d.deptId === bookingFormDeptId)?.unitList || ['Unit Pentadbiran']).map((u, i) =>
                      React.createElement('option', { key: i, value: u }, u)
                    )
                  )
                )
              ),
              React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3' },
                React.createElement('div', null,
                  React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Nama Pemohon (Oleh Siapa) *'),
                  React.createElement('input', {
                    name: 'userName',
                    required: true,
                    defaultValue: currentUser.nama,
                    placeholder: 'Nama pegawai pemohon',
                    className: 'w-full p-2 bg-white border rounded-xl font-semibold'
                  })
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'No Telefon / Ext *'),
                  React.createElement('input', {
                    name: 'userPhone',
                    required: true,
                    defaultValue: currentUser.noTelefon || '04-9666590',
                    placeholder: 'cth: 04-9666590',
                    className: 'w-full p-2 bg-white border rounded-xl'
                  })
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Emel Rasmi *'),
                  React.createElement('input', {
                    name: 'userEmail',
                    type: 'email',
                    required: true,
                    defaultValue: currentUser.emel,
                    placeholder: 'nama@mplbp.gov.my',
                    className: 'w-full p-2 bg-white border rounded-xl'
                  })
                )
              )
            ),

            // Seksyen 2: Maklumat Mesyuarat
            React.createElement('div', { className: 'space-y-3' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Tajuk Mesyuarat *'),
                React.createElement('input', {
                  name: 'tajukMesyuarat',
                  required: true,
                  placeholder: 'cth: Mesyuarat Jawatankuasa Penilaian Tender Bil. 4/2026',
                  className: 'w-full p-2.5 bg-slate-50 border rounded-xl font-bold'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Tujuan / Ringkasan Mesyuarat *'),
                React.createElement('textarea', {
                  name: 'tujuan',
                  required: true,
                  rows: 2,
                  placeholder: 'Nyatakan objektif atau ringkasan perbincangan...',
                  className: 'w-full p-2.5 bg-slate-50 border rounded-xl'
                })
              ),
              React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
                React.createElement('div', null,
                  React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Pilih Bilik Mesyuarat *'),
                  React.createElement('select', { name: 'roomId', className: 'w-full p-2.5 bg-slate-50 border rounded-xl font-bold' },
                    rooms.map(r => React.createElement('option', { key: r.roomId, value: r.roomId }, `${r.nama} (${r.kapasiti} Pax)`))
                  )
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Bilangan Peserta *'),
                  React.createElement('input', { name: 'bilanganPeserta', type: 'number', defaultValue: 10, min: 1, required: true, className: 'w-full p-2.5 bg-slate-50 border rounded-xl font-bold' })
                )
              ),
              React.createElement('div', { className: 'grid grid-cols-3 gap-3' },
                React.createElement('div', null,
                  React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Tarikh *'),
                  React.createElement('input', { name: 'tarikh', type: 'date', defaultValue: initialDateForBooking, required: true, className: 'w-full p-2.5 bg-slate-50 border rounded-xl font-bold' })
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Masa Mula *'),
                  React.createElement('input', { name: 'masaMula', type: 'time', defaultValue: '09:00', required: true, className: 'w-full p-2.5 bg-slate-50 border rounded-xl font-bold' })
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Masa Tamat *'),
                  React.createElement('input', { name: 'masaTamat', type: 'time', defaultValue: '11:00', required: true, className: 'w-full p-2.5 bg-slate-50 border rounded-xl font-bold' })
                )
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Pengerusi Mesyuarat *'),
                React.createElement('input', { name: 'pengerusi', required: true, placeholder: 'cth: Yang Dipertua / Setiausaha Perbandaran / Pengarah Jabatan', className: 'w-full p-2.5 bg-slate-50 border rounded-xl' })
              )
            ),

            React.createElement('div', { className: 'flex justify-end gap-3 pt-3 border-t' },
              React.createElement('button', {
                type: 'button',
                onClick: () => setIsBookingModalOpen(false),
                className: 'px-4 py-2 bg-slate-100 font-bold rounded-xl'
              }, 'Batal'),
              React.createElement('button', {
                type: 'submit',
                className: 'px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md'
              }, isAdmin ? 'Daftar & Sahkan Tempahan (Admin)' : 'Hantar Tempahan')
            )
          )
        )
      ),

      // Booking Details Modal
      selectedBookingForDetails && React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs' },
        React.createElement('div', { className: 'bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 text-xs' },
          React.createElement('div', { className: 'flex items-center justify-between border-b pb-3' },
            React.createElement('h3', { className: 'text-sm font-extrabold text-slate-900' }, selectedBookingForDetails.tajukMesyuarat),
            React.createElement('button', { onClick: () => setSelectedBookingForDetails(null), className: 'text-slate-400 font-bold' }, '✕')
          ),
          React.createElement('div', { className: 'space-y-2' },
            React.createElement('p', null, React.createElement('span', { className: 'text-slate-400' }, 'No Rujukan: '), React.createElement('strong', { className: 'font-mono text-blue-900' }, selectedBookingForDetails.noRujukan)),
            React.createElement('p', null, React.createElement('span', { className: 'text-slate-400' }, 'Bilik: '), React.createElement('strong', null, selectedBookingForDetails.roomName)),
            React.createElement('p', null, React.createElement('span', { className: 'text-slate-400' }, 'Jabatan: '), React.createElement('strong', { className: 'text-blue-900' }, selectedBookingForDetails.jabatanNama)),
            React.createElement('p', null, React.createElement('span', { className: 'text-slate-400' }, 'Ditempah Oleh: '), React.createElement('strong', null, `${selectedBookingForDetails.userName} (${selectedBookingForDetails.unit || 'Unit'})`)),
            React.createElement('p', null, React.createElement('span', { className: 'text-slate-400' }, 'Tarikh & Masa: '), React.createElement('strong', null, `${formatMalayDate(selectedBookingForDetails.tarikh)} (${selectedBookingForDetails.masaMula} - ${selectedBookingForDetails.masaTamat})`)),
            React.createElement('p', null, React.createElement('span', { className: 'text-slate-400' }, 'Pengerusi: '), React.createElement('strong', null, selectedBookingForDetails.pengerusi)),
            React.createElement('p', null, React.createElement('span', { className: 'text-slate-400' }, 'Tujuan: '), selectedBookingForDetails.tujuan)
          ),
          React.createElement('div', { className: 'flex justify-between items-center pt-4 border-t flex-wrap gap-2' },
            React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('button', {
                onClick: () => {
                  const b = selectedBookingForDetails;
                  setSelectedBookingForDetails(null);
                  setSelectedBookingForQR(b);
                },
                className: 'px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-200'
              }, 'Pas QR'),
              isAdmin && React.createElement('button', {
                onClick: () => handleDeleteBooking(selectedBookingForDetails.bookingId),
                className: 'px-3 py-1.5 bg-rose-50 text-rose-600 font-bold rounded-xl border border-rose-200 hover:bg-rose-100'
              }, 'Padam')
            ),
            React.createElement('div', { className: 'flex items-center gap-2' },
              (isApprover && selectedBookingForDetails.status === 'MENUNGGU_KELULUSAN') && React.createElement('button', {
                onClick: () => handleApproveBooking(selectedBookingForDetails.bookingId),
                className: 'px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl'
              }, 'Luluskan'),
              selectedBookingForDetails.status === 'DILULUSKAN' && React.createElement('button', {
                onClick: () => handleCheckIn(selectedBookingForDetails.bookingId),
                className: 'px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl'
              }, 'Daftar Masuk'),
              React.createElement('button', {
                onClick: () => setSelectedBookingForDetails(null),
                className: 'px-4 py-2 bg-slate-100 font-bold rounded-xl'
              }, 'Tutup')
            )
          )
        )
      ),

      // QR Pass Modal
      selectedBookingForQR && React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs' },
        React.createElement('div', { className: 'bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4' },
          React.createElement('h3', { className: 'text-base font-black text-slate-900' }, 'Pas Digital Kod QR'),
          React.createElement('p', { className: 'text-xs text-slate-500 font-mono' }, selectedBookingForQR.noRujukan),
          React.createElement('div', { className: 'flex justify-center p-4 bg-slate-50 rounded-2xl border' },
            React.createElement(SimpleQRCodeSVG, { value: selectedBookingForQR.qrCodeData || `MPLBP-${selectedBookingForQR.noRujukan}-VERIFIED`, size: 140 })
          ),
          React.createElement('p', { className: 'text-xs font-bold text-slate-800' }, selectedBookingForQR.tajukMesyuarat),
          React.createElement('p', { className: 'text-[11px] text-blue-900 font-bold' }, selectedBookingForQR.jabatanNama),
          React.createElement('p', { className: 'text-[11px] text-slate-500' }, `👤 ${selectedBookingForQR.userName} • ${selectedBookingForQR.roomName}`),
          React.createElement('button', {
            onClick: () => setSelectedBookingForQR(null),
            className: 'w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md'
          }, 'Tutup')
        )
      ),

      // QR Scanner Modal
      isQRScannerOpen && React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs' },
        React.createElement('div', { className: 'bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-xs' },
          React.createElement('div', { className: 'flex items-center justify-between border-b pb-3' },
            React.createElement('h3', { className: 'text-base font-extrabold text-slate-900' }, 'Pengimbas QR Daftar Masuk'),
            React.createElement('button', { onClick: () => setIsQRScannerOpen(false), className: 'text-slate-400 font-bold' }, '✕')
          ),
          React.createElement('p', { className: 'text-slate-500' }, 'Pilih tempahan diluluskan di bawah untuk mengesahkan kehadiran mesyuarat serta-merta:'),
          React.createElement('div', { className: 'space-y-2' },
            bookings.filter(b => b.status === 'DILULUSKAN').map(b =>
              React.createElement('div', {
                key: b.bookingId,
                className: 'p-3 bg-slate-50 rounded-2xl border flex items-center justify-between hover:bg-blue-50/50'
              },
                React.createElement('div', null,
                  React.createElement('p', { className: 'font-bold text-slate-900' }, b.tajukMesyuarat),
                  React.createElement('p', { className: 'text-[10px] text-blue-900 font-bold' }, `${b.jabatanNama} • ${b.userName}`),
                  React.createElement('p', { className: 'text-[10px] text-slate-500 font-mono' }, `${b.noRujukan} • ${b.roomName}`)
                ),
                React.createElement('button', {
                  onClick: () => handleCheckIn(b.bookingId),
                  className: 'px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-[10px]'
                }, 'Daftar Masuk')
              )
            )
          )
        )
      )
    );
  }

  // Render to DOM
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
  window._MPLBP_APP_MOUNTED = true;
})();
