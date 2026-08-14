import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { BookingBadge } from '../components/common/Badge';
import { Booking } from '../types/booking';
import { formatMalayDate, formatMalayDateWithDay } from '../utils/dateUtils';
import { EmptyState } from '../components/common/EmptyState';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  Calendar,
  User,
  Eye,
  AlertCircle,
  Search,
  CheckCheck
} from 'lucide-react';

interface ApprovalsPageProps {
  onSelectBooking: (booking: Booking) => void;
}

export const ApprovalsPage: React.FC<ApprovalsPageProps> = ({
  onSelectBooking
}) => {
  const { currentUser } = useAuth();
  const { bookings, approveBooking, rejectBooking, returnBooking } = useBooking();

  const [activeFilter, setActiveFilter] = useState<'PENDING' | 'HISTORY'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // Rejection / Return Modal states
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<'REJECT' | 'RETURN' | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  const pendingList = useMemo(() => {
    return bookings.filter(b => b.status === 'MENUNGGU_KELULUSAN');
  }, [bookings]);

  const historyList = useMemo(() => {
    return bookings.filter(b => b.status === 'DILULUSKAN' || b.status === 'DITOLAK' || b.status === 'DIPULANGKAN');
  }, [bookings]);

  const displayedList = useMemo(() => {
    const list = activeFilter === 'PENDING' ? pendingList : historyList;
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(b => 
      b.tajukMesyuarat.toLowerCase().includes(q) ||
      b.noRujukan.toLowerCase().includes(q) ||
      b.userName.toLowerCase().includes(q) ||
      (b.roomName || '').toLowerCase().includes(q)
    );
  }, [activeFilter, pendingList, historyList, searchQuery]);

  const handleQuickApprove = (bookingId: string) => {
    approveBooking(bookingId, 'Diluluskan oleh Pegawai Pelulus.');
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForAction || !reasonInput.trim()) return;

    if (actionType === 'REJECT') {
      rejectBooking(selectedBookingForAction.bookingId, reasonInput);
    } else if (actionType === 'RETURN') {
      returnBooking(selectedBookingForAction.bookingId, reasonInput);
    }

    setSelectedBookingForAction(null);
    setActionType(null);
    setReasonInput('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Modul Kelulusan Tempahan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Semakan permohonan rasmi tempahan bilik mesyuarat MPLBP oleh Pegawai Pelulus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{pendingList.length} Menunggu Kelulusan</span>
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeFilter === 'PENDING' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu Tindakan ({pendingList.length})
          </button>
          <button
            onClick={() => setActiveFilter('HISTORY')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeFilter === 'HISTORY' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sejarah Tindakan ({historyList.length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari permohonan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* List of Applications */}
      {displayedList.length === 0 ? (
        <EmptyState
          title={activeFilter === 'PENDING' ? 'Tiada Permohonan Menunggu' : 'Tiada Rekod Sejarah'}
          description={
            activeFilter === 'PENDING'
              ? 'Semua permohonan tempahan bilik mesyuarat telah selesai disemak.'
              : 'Belum ada sebarang sejarah keputusan kelulusan dibuat.'
          }
        />
      ) : (
        <div className="space-y-4">
          {displayedList.map(b => (
            <div
              key={b.bookingId}
              className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-blue-300 shadow-card hover:shadow-card-hover transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Column: Details */}
              <div className="flex items-start gap-4 flex-1">
                <div
                  className="w-3.5 h-20 rounded-xl shrink-0 mt-0.5"
                  style={{ backgroundColor: b.roomColor || '#1e3a8a' }}
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {b.noRujukan}
                    </span>
                    <BookingBadge status={b.status} />
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {b.jenisTempahan}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectBooking(b)}
                    className="text-base font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {b.tajukMesyuarat}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                    <div><span className="text-slate-400">Bilik:</span> <strong>{b.roomName}</strong></div>
                    <div><span className="text-slate-400">Tarikh:</span> <strong>{formatMalayDateWithDay(b.tarikh)}</strong></div>
                    <div><span className="text-slate-400">Masa:</span> <strong>{b.masaMula} - {b.masaTamat}</strong></div>
                    <div><span className="text-slate-400">Pemohon:</span> {b.userName} ({b.jabatanNama})</div>
                    <div><span className="text-slate-400">Pengerusi:</span> <strong>{b.pengerusi}</strong></div>
                    <div><span className="text-slate-400">Bil. Peserta:</span> {b.bilanganPeserta} Orang</div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Tujuan:</span> {b.tujuan}
                  </p>
                </div>
              </div>

              {/* Right Column: Approver Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-between gap-2.5 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 shrink-0">
                <button
                  onClick={() => onSelectBooking(b)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Semak Butiran Penuh</span>
                </button>

                {b.status === 'MENUNGGU_KELULUSAN' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedBookingForAction(b);
                        setActionType('RETURN');
                        setReasonInput('');
                      }}
                      className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pulang</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedBookingForAction(b);
                        setActionType('REJECT');
                        setReasonInput('');
                      }}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>

                    <button
                      onClick={() => handleQuickApprove(b.bookingId)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Luluskan</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Prompt Dialog for Reject or Return */}
      {selectedBookingForAction && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {actionType === 'REJECT' ? 'Tolak Permohonan Tempahan' : 'Pulangkan Permohonan untuk Pembetulan'}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedBookingForAction.tajukMesyuarat} ({selectedBookingForAction.noRujukan})
            </p>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {actionType === 'REJECT' ? 'Alasan Penolakan (Wajib):' : 'Ulasan Pembetulan untuk Pemohon:'}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={actionType === 'REJECT' ? 'Nyatakan sebab penolakan...' : 'Nyatakan apa yang perlu diperbetulkan...'}
                  value={reasonInput}
                  onChange={e => setReasonInput(e.target.value)}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBookingForAction(null);
                    setActionType(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!reasonInput.trim()}
                  className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-sm ${
                    actionType === 'REJECT' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {actionType === 'REJECT' ? 'Sahkan Penolakan' : 'Hantar Ulasan Pulang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
