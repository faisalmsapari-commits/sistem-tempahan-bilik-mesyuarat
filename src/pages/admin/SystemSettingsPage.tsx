import React, { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { SystemSettings } from '../../types/settings';
import { Settings, Save, Clock, ShieldCheck, Building, Sparkles } from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDatabase } = useBooking();

  const [namaOrganisasi, setNamaOrganisasi] = useState(settings.namaOrganisasi);
  const [singkatanOrganisasi, setSingkatanOrganisasi] = useState(settings.singkatanOrganisasi);
  const [alamat, setAlamat] = useState(settings.alamat);
  const [noTelefon, setNoTelefon] = useState(settings.noTelefon);
  const [emel, setEmel] = useState(settings.emel);

  const [waktuMulaOperasi, setWaktuMulaOperasi] = useState(settings.waktuMulaOperasi);
  const [waktuTamatOperasi, setWaktuTamatOperasi] = useState(settings.waktuTamatOperasi);
  const [tempohMaksimumTempahanHari, setTempohMaksimumTempahanHari] = useState(settings.tempohMaksimumTempahanHari);
  const [tempohMinimumBatalJam, setTempohMinimumBatalJam] = useState(settings.tempohMinimumBatalJam);
  const [tempohMaksimumMesyuaratJam, setTempohMaksimumMesyuaratJam] = useState(settings.tempohMaksimumMesyuaratJam);

  const [peringatanSebelumMinit, setPeringatanSebelumMinit] = useState(settings.peringatanSebelumMinit);
  const [benarkanCheckInAwalMinit, setBenarkanCheckInAwalMinit] = useState(settings.benarkanCheckInAwalMinit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      namaOrganisasi,
      singkatanOrganisasi,
      alamat,
      noTelefon,
      emel,
      waktuMulaOperasi,
      waktuTamatOperasi,
      tempohMaksimumTempahanHari: Number(tempohMaksimumTempahanHari),
      tempohMinimumBatalJam: Number(tempohMinimumBatalJam),
      tempohMaksimumMesyuaratJam: Number(tempohMaksimumMesyuaratJam),
      peringatanSebelumMinit: Number(peringatanSebelumMinit),
      benarkanCheckInAwalMinit: Number(benarkanCheckInAwalMinit)
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Tetapan Parameter & Polisi Sistem
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Konfigurasi waktu operasi rasmi, had tempoh tempahan awal, dasar pembatalan dan maklumat organisasi MPLBP.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Org Info */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Maklumat Organisasi PBT
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Penuh Organisasi
              </label>
              <input
                type="text"
                required
                value={namaOrganisasi}
                onChange={e => setNamaOrganisasi(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Singkatan Nama
              </label>
              <input
                type="text"
                required
                value={singkatanOrganisasi}
                onChange={e => setSingkatanOrganisasi(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                No. Telefon Rasmi
              </label>
              <input
                type="text"
                required
                value={noTelefon}
                onChange={e => setNoTelefon(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Alamat Rasmi Bangunan
              </label>
              <textarea
                rows={2}
                value={alamat}
                onChange={e => setAlamat(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Operational Hours & Booking Policies */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Waktu Operasi & Dasar Tempahan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Waktu Mula Operasi Harian
              </label>
              <input
                type="time"
                required
                value={waktuMulaOperasi}
                onChange={e => setWaktuMulaOperasi(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Waktu Tamat Operasi Harian
              </label>
              <input
                type="time"
                required
                value={waktuTamatOperasi}
                onChange={e => setWaktuTamatOperasi(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tempoh Maksimum Tempahan Awal (Hari)
              </label>
              <input
                type="number"
                min={7}
                max={365}
                required
                value={tempohMaksimumTempahanHari}
                onChange={e => setTempohMaksimumTempahanHari(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Dasar Minimum Notis Pembatalan (Jam)
              </label>
              <input
                type="number"
                min={1}
                max={48}
                required
                value={tempohMinimumBatalJam}
                onChange={e => setTempohMinimumBatalJam(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Had Maksimum Tempoh 1 Mesyuarat (Jam)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                required
                value={tempohMaksimumMesyuaratJam}
                onChange={e => setTempohMaksimumMesyuaratJam(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tetingkap Daftar Masuk Awal (Minit)
              </label>
              <input
                type="number"
                min={5}
                max={60}
                required
                value={benarkanCheckInAwalMinit}
                onChange={e => setBenarkanCheckInAwalMinit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit & Reset Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Adakah anda pasti mahu memuatkan semula data demo asal sistem MPLBP e-BILIK?')) {
                resetDatabase();
              }
            }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-2xl text-xs font-bold transition-colors"
          >
            Set Semula Pangkalan Data Demo
          </button>

          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Tetapan Sistem</span>
          </button>
        </div>
      </form>
    </div>
  );
};
