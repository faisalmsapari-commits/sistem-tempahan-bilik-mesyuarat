import React from 'react';
import { Room } from '../types/room';

interface ManualPageProps {
  rooms: Room[];
}

export const ManualPage: React.FC<ManualPageProps> = ({ rooms }) => {
  const handleDownloadHtml = () => {
    window.open('MANUAL_PENGGUNA_MPLBP_eBILIK.html', '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-sky-300">
            Panduan Lengkap Rasmi
          </span>
          <h2 className="text-2xl font-black mt-2">Manual Pengguna MPLBP e-BILIK</h2>
          <p className="text-xs text-slate-300">
            Langkah demi langkah penggunaan sistem pengurusan bilik mesyuarat.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-blue-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <span>🖨️ Cetak / PDF</span>
          </button>
          <button
            onClick={handleDownloadHtml}
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <span>📥 Buka Fail Manual (HTML)</span>
          </button>
        </div>
      </div>

      {/* Official Room Directory Gallery */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
          1. Senarai Bilik Mesyuarat Rasmi MPLBP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map((r) => (
            <div
              key={r.roomId}
              className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-slate-50/50"
            >
              <img src={r.gambar} alt={r.nama} className="w-full h-32 object-cover" />
              <div className="p-3.5 space-y-1 text-xs">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-mono font-bold rounded text-[10px]">
                  {r.kodBilik}
                </span>
                <h4 className="font-bold text-slate-900">{r.nama}</h4>
                <p className="text-emerald-700 font-black">
                  Kapasiti: {r.kapasiti} Orang (Pax)
                </p>
                <p className="text-slate-500 text-[11px]">
                  {r.aras} • {r.lokasi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step by Step Guide */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6 text-xs">
        <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
          2. Panduan Langkah Demi Langkah Penggunaan
        </h3>

        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border">
          <h4 className="font-extrabold text-sm text-blue-900">
            Langkah 1: Log Masuk & Pemilihan Peranan (RBAC)
          </h4>
          <p className="text-slate-700 leading-relaxed">
            Pengguna boleh log masuk menggunakan emel rasmi kerajaan atau memilih peranan pada menu bar atas: <strong>Pentadbir Sistem, Pegawai Pelulus, Urus Setia, Pentadbir Jabatan, atau Kakitangan.</strong>
          </p>
        </div>

        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border">
          <h4 className="font-extrabold text-sm text-blue-900">
            Langkah 2: Semakan Kalendar & Ketersediaan Bilik
          </h4>
          <p className="text-slate-700 leading-relaxed">
            Buka menu <strong>"Kalendar Jadual"</strong> untuk melihat takwim dalam mod Bulan, Minggu atau Hari. Klik pada mana-mana kotak tarikh untuk membuka borang tempahan dengan tarikh tersebut sedia diisi.
          </p>
        </div>

        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border">
          <h4 className="font-extrabold text-sm text-blue-900">
            Langkah 3: Permohonan Tempahan Bilik Baharu
          </h4>
          <p className="text-slate-700 leading-relaxed">
            Klik butang <strong className="text-blue-600">"+ TEMPAH BILIK"</strong>. Masukkan tajuk, tujuan, pilih bilik, bilangan peserta (disemak mengikut had kapasiti bilik secara automatik), tarikh, masa mula/tamat, dan pengerusi mesyuarat. Jika berlaku pertindihan masa, sistem akan menyekat permohonan secara langsung.
          </p>
        </div>

        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border">
          <h4 className="font-extrabold text-sm text-blue-900">
            Langkah 4: Kelulusan oleh Pegawai Pelulus
          </h4>
          <p className="text-slate-700 leading-relaxed">
            Pegawai Pelulus membuka menu <strong>"Kelulusan Tempahan"</strong> untuk meneliti permohonan dan menekan butang <strong className="text-emerald-600">"Luluskan"</strong> atau <strong className="text-rose-600">"Tolak"</strong> (wajib ulasan justifikasi).
          </p>
        </div>

        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border">
          <h4 className="font-extrabold text-sm text-blue-900">
            Langkah 5: Pendaftaran Kehadiran Kod QR (Check-In) & Kiosk Pintu
          </h4>
          <p className="text-slate-700 leading-relaxed">
            Setiap tempahan diluluskan mempunyai <strong>Pas Digital Kod QR</strong>. Pada hari mesyuarat, urus setia boleh mengimbas QR melalui menu "Pengimbas QR" atau membuka "Kiosk Pintu Bilik" di luar bilik mesyuarat.
          </p>
        </div>
      </div>
    </div>
  );
};
