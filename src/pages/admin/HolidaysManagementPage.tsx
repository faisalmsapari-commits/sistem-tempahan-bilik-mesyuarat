import React, { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { Holiday } from '../../types/settings';
import { Modal } from '../../components/common/Modal';
import { formatMalayDate } from '../../utils/dateUtils';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';

export const HolidaysManagementPage: React.FC = () => {
  const { holidays, createHoliday, deleteHoliday } = useBooking();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarikh, setTarikh] = useState('2026-09-16');
  const [namaCuti, setNamaCuti] = useState('');
  const [kategori, setKategori] = useState<'KEBANGSAAN' | 'NEGERI' | 'PENUTUPAN_KHAS'>('KEBANGSAAN');
  const [keterangan, setKeterangan] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tarikh || !namaCuti) return;
    createHoliday({
      tarikh,
      namaCuti,
      kategori,
      keterangan
    });
    setIsModalOpen(false);
    setNamaCuti('');
    setKeterangan('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pengurusan Cuti & Hari Tidak Beroperasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Senarai cuti umum kebangsaan, cuti Negeri Kedah dan hari penutupan khas operasi MPLBP.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Tarikh Cuti</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Tarikh</th>
                <th className="py-3 px-4">Nama Cuti / Acara</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {holidays.map(h => (
                <tr key={h.holidayId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                    {formatMalayDate(h.tarikh)}
                  </td>
                  <td className="py-3 px-4 font-bold text-blue-900">
                    {h.namaCuti}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      h.kategori === 'KEBANGSAAN' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      h.kategori === 'NEGERI' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {h.kategori}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {h.keterangan || '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteHoliday(h.holidayId)}
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"
                      title="Padam Cuti"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Tarikh Cuti / Penutupan Khas"
        subtitle="Takwim Operasi MPLBP"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tarikh Cuti <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={tarikh}
              onChange={e => setTarikh(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Cuti / Sebab Penutupan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth: Cuti Peristiwa Langkawi Geopark"
              value={namaCuti}
              onChange={e => setNamaCuti(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kategori
            </label>
            <select
              value={kategori}
              onChange={e => setKategori(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            >
              <option value="KEBANGSAAN">Cuti Kebangsaan Malaysia</option>
              <option value="NEGERI">Cuti Negeri Kedah Darul Aman</option>
              <option value="PENUTUPAN_KHAS">Penutupan Khas Operasi MPLBP</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Keterangan
            </label>
            <input
              type="text"
              placeholder="Catatan tambahan..."
              value={keterangan}
              onChange={e => setKeterangan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
            >
              Tambah Cuti
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
