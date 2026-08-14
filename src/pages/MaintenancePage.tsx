import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { Modal } from '../components/common/Modal';
import { RoomMaintenance } from '../types/maintenance';
import { formatMalayDate } from '../utils/dateUtils';
import { EmptyState } from '../components/common/EmptyState';
import { Wrench, Plus, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { maintenances, rooms, createMaintenance, updateMaintenanceStatus } = useBooking();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomId, setRoomId] = useState(rooms[0]?.roomId || '');
  const [tarikhMula, setTarikhMula] = useState('2026-08-25');
  const [tarikhTamat, setTarikhTamat] = useState('2026-08-26');
  const [sebab, setSebab] = useState('');
  const [catatan, setCatatan] = useState('');

  const selectedRoom = rooms.find(r => r.roomId === roomId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !tarikhMula || !tarikhTamat || !sebab) return;

    createMaintenance({
      roomId,
      roomName: selectedRoom?.nama || 'Bilik Mesyuarat',
      tarikhMula,
      tarikhTamat,
      sebab,
      catatan,
      status: 'BERJADUAL',
      diciptaOleh: currentUser?.uid || 'user-admin',
      diciptaNama: currentUser?.nama || 'Pentadbir'
    });

    setIsModalOpen(false);
    setSebab('');
    setCatatan('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pengurusan Penyelenggaraan Bilik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Jadualkan kerja baik pulih dan penyelenggaraan berkala. Bilik akan disekat daripada tempahan baharu secara automatik.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Jadualkan Penyelenggaraan</span>
        </button>
      </div>

      {maintenances.length === 0 ? (
        <EmptyState
          title="Tiada Rekod Penyelenggaraan"
          description="Semua bilik mesyuarat berada dalam keadaan baik dan beroperasi sepenuhnya."
          actionText="+ Jadualkan Sekarang"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {maintenances.map(m => (
            <div
              key={m.maintId}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{m.status}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">ID: {m.maintId}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{m.roomName}</h3>
                
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5 text-slate-700">
                  <p><span className="text-slate-400">Tempoh:</span> <strong>{formatMalayDate(m.tarikhMula)} hingga {formatMalayDate(m.tarikhTamat)}</strong></p>
                  <p><span className="text-slate-400">Sebab Penyelenggaraan:</span> {m.sebab}</p>
                  {m.catatan && <p><span className="text-slate-400">Catatan:</span> {m.catatan}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Didaftar oleh: {m.diciptaNama}</span>
                {m.status !== 'SELESAI' && m.status !== 'DIBATALKAN' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateMaintenanceStatus(m.maintId, 'SELESAI')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      Tanda Selesai
                    </button>
                    <button
                      onClick={() => updateMaintenanceStatus(m.maintId, 'DIBATALKAN')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Maintenance Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Jadualkan Penyelenggaraan Bilik"
        subtitle="Sekatan Tempahan Automatik"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilih Bilik Mesyuarat <span className="text-rose-500">*</span>
            </label>
            <select
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-hidden focus:border-blue-500"
            >
              {rooms.map(r => (
                <option key={r.roomId} value={r.roomId}>{r.nama} ({r.kodBilik})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tarikh Mula <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tarikhMula}
                onChange={e => setTarikhMula(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tarikh Tamat <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tarikhTamat}
                onChange={e => setTarikhTamat(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Sebab / Skop Kerja Penyelenggaraan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth: Servis pendingin hawa berpusat & penentukuran Smart TV"
              value={sebab}
              onChange={e => setSebab(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Catatan Kontraktor / Pegawai
            </label>
            <textarea
              rows={2}
              placeholder="Maklumat kontraktor atau tindakan persediaan..."
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Tetapkan Penyelenggaraan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
