import React, { useState, useMemo } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { AuditLog, AuditAction, AuditModule } from '../../types/audit';
import { formatMalayDateTime } from '../../utils/dateUtils';
import { Modal } from '../../components/common/Modal';
import {
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Lock,
  User,
  Clock,
  Eye,
  ShieldAlert
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [selectedLogForDetails, setSelectedLogForDetails] = useState<AuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(l => {
      if (selectedModule !== 'ALL' && l.modul !== selectedModule) return false;
      if (selectedAction !== 'ALL' && l.tindakan !== selectedAction) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesUser = l.namaPengguna.toLowerCase().includes(q);
        const matchesEmail = l.emelPengguna.toLowerCase().includes(q);
        const matchesDesc = l.keterangan.toLowerCase().includes(q);
        const matchesRecord = l.rekodId.toLowerCase().includes(q);
        if (!matchesUser && !matchesEmail && !matchesDesc && !matchesRecord) return false;
      }

      return true;
    });
  }, [auditLogs, selectedModule, selectedAction, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-600" />
            Log Audit Keselamatan (Tidak Boleh Diubah)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Jejak audit rasmi bagi setiap transaksi pengguna, kelulusan, pembatalan dan perubahan sistem MPLBP e-BILIK.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Integriti Pangkalan Data Terpelihara</span>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari pengguna, emel atau tindakan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
          />
        </div>

        <select
          value={selectedModule}
          onChange={e => setSelectedModule(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-hidden"
        >
          <option value="ALL">Semua Modul Sistem</option>
          <option value="AUTH">AUTH</option>
          <option value="TEMPAHAN">TEMPAHAN</option>
          <option value="KELULUSAN">KELULUSAN</option>
          <option value="BILIK">BILIK</option>
          <option value="PENGGUNA">PENGGUNA</option>
          <option value="PENYELENGGARAAN">PENYELENGGARAAN</option>
          <option value="TETAPAN">TETAPAN</option>
        </select>

        <select
          value={selectedAction}
          onChange={e => setSelectedAction(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-hidden"
        >
          <option value="ALL">Semua Jenis Tindakan</option>
          <option value="LOG_MASUK">LOG_MASUK</option>
          <option value="LOG_KELUAR">LOG_KELUAR</option>
          <option value="CIPTA_TEMPAHAN">CIPTA_TEMPAHAN</option>
          <option value="KEMASKINI_TEMPAHAN">KEMASKINI_TEMPAHAN</option>
          <option value="BATAL_TEMPAHAN">BATAL_TEMPAHAN</option>
          <option value="LULUS_TEMPAHAN">LULUS_TEMPAHAN</option>
          <option value="TOLAK_TEMPAHAN">TOLAK_TEMPAHAN</option>
          <option value="CHECK_IN">CHECK_IN</option>
          <option value="CHECK_OUT">CHECK_OUT</option>
          <option value="CIPTA_PENGGUNA">CIPTA_PENGGUNA</option>
          <option value="NYAHAKTIF_PENGGUNA">NYAHAKTIF_PENGGUNA</option>
          <option value="KEMASKINI_TETAPAN">KEMASKINI_TETAPAN</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Cap Masa (Asia/KL)</th>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Modul</th>
                <th className="py-3 px-4">Tindakan</th>
                <th className="py-3 px-4">Keterangan Transaksi</th>
                <th className="py-3 px-4 text-right">Butiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.logId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {formatMalayDateTime(log.tarikhMasa)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{log.namaPengguna}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{log.perananPengguna}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                      {log.modul}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      log.tindakan.includes('LULUS') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      log.tindakan.includes('TOLAK') || log.tindakan.includes('BATAL') ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      log.tindakan.includes('CHECK') ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {log.tindakan}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-sm">
                    <p className="line-clamp-2 leading-relaxed">{log.keterangan}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedLogForDetails(log)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs transition-colors"
                      title="Lihat Log Penuh"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLogForDetails && (
        <Modal
          isOpen={!!selectedLogForDetails}
          onClose={() => setSelectedLogForDetails(null)}
          title="Butiran Rekod Log Audit"
          subtitle={`Log ID: ${selectedLogForDetails.logId}`}
          maxWidth="md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200/80">
              <div><span className="text-slate-400">Pengguna:</span> <strong>{selectedLogForDetails.namaPengguna}</strong> ({selectedLogForDetails.emelPengguna})</div>
              <div><span className="text-slate-400">Peranan:</span> <strong>{selectedLogForDetails.perananPengguna}</strong></div>
              <div><span className="text-slate-400">Cap Masa:</span> <strong>{formatMalayDateTime(selectedLogForDetails.tarikhMasa)}</strong></div>
              <div><span className="text-slate-400">Alamat IP:</span> <span className="font-mono">{selectedLogForDetails.ipAddress || '10.20.4.15'}</span></div>
              <div><span className="text-slate-400">Modul & Tindakan:</span> <span className="font-mono font-bold text-blue-700">{selectedLogForDetails.modul} &rarr; {selectedLogForDetails.tindakan}</span></div>
              <div><span className="text-slate-400">ID Rekod Terlibat:</span> <span className="font-mono">{selectedLogForDetails.rekodId}</span></div>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-1">Keterangan:</p>
              <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border">
                {selectedLogForDetails.keterangan}
              </p>
            </div>

            {selectedLogForDetails.maklumatTambahan && (
              <div>
                <p className="font-bold text-slate-800 mb-1">Metadata Tambahan (JSON):</p>
                <pre className="p-3 bg-slate-900 text-sky-300 rounded-xl text-[10px] font-mono overflow-x-auto">
                  {JSON.stringify(selectedLogForDetails.maklumatTambahan, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedLogForDetails(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
