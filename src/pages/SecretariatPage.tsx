import React, { useState } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { RoomServiceRequest, ServiceStatus } from '../types/service';
import { formatMalayDate, formatMalayDateWithDay } from '../utils/dateUtils';
import { EmptyState } from '../components/common/EmptyState';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Coffee,
  Mic,
  Tv,
  Layers,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

export const SecretariatPage: React.FC = () => {
  const { services, updateServiceStatus } = useBooking();
  const [statusFilter, setStatusFilter] = useState<'ALL' | ServiceStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(s => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!s.tajukMesyuarat.toLowerCase().includes(q) &&
          !s.noRujukan.toLowerCase().includes(q) &&
          !s.roomName.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pengurusan Fasiliti & Urus Setia Bilik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau dan kemaskini penyediaan susunan kerusi/meja, peralatan audio visual, dan jamuan mesyuarat.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'ALL' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({services.length})
          </button>
          <button
            onClick={() => setStatusFilter('MENUNGGU')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'MENUNGGU' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu Tindakan ({services.filter(s => s.status === 'MENUNGGU').length})
          </button>
          <button
            onClick={() => setStatusFilter('DALAM_PROSES')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'DALAM_PROSES' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dalam Proses ({services.filter(s => s.status === 'DALAM_PROSES').length})
          </button>
          <button
            onClick={() => setStatusFilter('SELESAI')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'SELESAI' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai ({services.filter(s => s.status === 'SELESAI').length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari mesyuarat atau bilik..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <EmptyState
          title="Tiada Permintaan Persediaan"
          description="Semua tugasan persediaan fasiliti telah dikemaskini."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map(svc => (
            <div
              key={svc.serviceId}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {svc.noRujukan}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      svc.status === 'SELESAI' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      svc.status === 'DALAM_PROSES' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {svc.status === 'SELESAI' ? 'Selesai' : svc.status === 'DALAM_PROSES' ? 'Sedang Disediakan' : 'Menunggu Persediaan'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{svc.tajukMesyuarat}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong>{svc.roomName}</strong> • {formatMalayDate(svc.tarikh)} ({svc.masaMula} - {svc.masaTamat})
                  </p>
                </div>

                {/* Checklist Requirements */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Senarai Keperluan Fasiliti:</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div>📐 Susunan: <strong>{svc.susunanMeja}</strong></div>
                    <div>🪑 Kerusi: <strong>{svc.bilanganKerusi} Unit</strong></div>
                    <div>📽️ Projektor HD: <strong>{svc.projektor ? 'Ya' : 'Tidak'}</strong></div>
                    <div>🎤 Mikrofon: <strong>{svc.mikrofonQty} Unit</strong></div>
                    <div>☕ Jamuan/Minuman: <strong>{svc.minuman || svc.jamuanRingan ? 'Disediakan' : 'Tiada'}</strong></div>
                    <div>🧹 Kebersihan: <strong>{svc.kebersihan ? 'Diperlukan' : 'Standard'}</strong></div>
                  </div>
                  {svc.catatan && (
                    <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                      <span className="font-semibold">Catatan:</span> {svc.catatan}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">Tukar Status:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateServiceStatus(svc.bookingId, 'MENUNGGU')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      svc.status === 'MENUNGGU' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Menunggu
                  </button>
                  <button
                    onClick={() => updateServiceStatus(svc.bookingId, 'DALAM_PROSES')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      svc.status === 'DALAM_PROSES' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Dalam Proses
                  </button>
                  <button
                    onClick={() => updateServiceStatus(svc.bookingId, 'SELESAI')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      svc.status === 'SELESAI' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Selesai
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
