import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { BookingBadge } from '../components/common/Badge';
import { Booking, BookingStatus } from '../types/booking';
import { formatMalayDate, formatMalayDateWithDay } from '../utils/dateUtils';
import { EmptyState } from '../components/common/EmptyState';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Printer,
  Ban,
  CalendarPlus,
  Search,
  Filter,
  Eye
} from 'lucide-react';

interface MyBookingsPageProps {
  onOpenBookingModal: () => void;
  onSelectBooking: (booking: Booking) => void;
  onViewQr: (booking: Booking) => void;
  onPrintSlip: (booking: Booking) => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  onOpenBookingModal,
  onSelectBooking,
  onViewQr,
  onPrintSlip
}) => {
  const { currentUser } = useAuth();
  const { bookings, cancelBooking } = useBooking();

  const [activeTab, setActiveTab] = useState<'SEMUA' | 'AKAN_DATANG' | 'MENUNGGU' | 'SELESAI' | 'BATAL'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = '2026-08-14';

  // Filter bookings belonging to current user
  const userBookings = useMemo(() => {
    return bookings.filter(b => b.userId === currentUser?.uid || b.userEmail === currentUser?.emel);
  }, [bookings, currentUser]);

  const filteredBookings = useMemo(() => {
    return userBookings.filter(b => {
      // Tab filter
      if (activeTab === 'AKAN_DATANG' && (b.tarikh < todayStr || b.status === 'DIBATALKAN' || b.status === 'SELESAI')) return false;
      if (activeTab === 'MENUNGGU' && b.status !== 'MENUNGGU_KELULUSAN') return false;
      if (activeTab === 'SELESAI' && b.status !== 'SELESAI') return false;
      if (activeTab === 'BATAL' && b.status !== 'DIBATALKAN') return false;

      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = b.tajukMesyuarat.toLowerCase().includes(query);
        const matchesRef = b.noRujukan.toLowerCase().includes(query);
        const matchesRoom = (b.roomName || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesRef && !matchesRoom) return false;
      }

      return true;
    }).sort((a, b) => b.tarikh.localeCompare(a.tarikh));
  }, [userBookings, activeTab, searchQuery, todayStr]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Tempahan Saya
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Semak rekod permohonan tempahan bilik mesyuarat, pas kod QR dan slip pengesahan anda.
          </p>
        </div>

        <button
          onClick={onOpenBookingModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>+ Tempah Bilik Baharu</span>
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('SEMUA')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'SEMUA' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({userBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('AKAN_DATANG')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'AKAN_DATANG' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Akan Datang ({userBookings.filter(b => b.tarikh >= todayStr && b.status !== 'DIBATALKAN').length})
          </button>

          <button
            onClick={() => setActiveTab('MENUNGGU')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'MENUNGGU' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu Kelulusan ({userBookings.filter(b => b.status === 'MENUNGGU_KELULUSAN').length})
          </button>

          <button
            onClick={() => setActiveTab('SELESAI')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'SELESAI' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai ({userBookings.filter(b => b.status === 'SELESAI').length})
          </button>

          <button
            onClick={() => setActiveTab('BATAL')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'BATAL' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dibatalkan ({userBookings.filter(b => b.status === 'DIBATALKAN').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari tajuk / rujukan / bilik..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="Tiada Tempahan Dijumpai"
          description="Anda belum mempunyai sebarang rekod tempahan bilik mesyuarat di bawah kategori ini."
          actionText="+ Buat Tempahan Sekarang"
          onAction={onOpenBookingModal}
        />
      ) : (
        <div className="space-y-3">
          {filteredBookings.map(b => (
            <div
              key={b.bookingId}
              className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-blue-300 shadow-card hover:shadow-card-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-3.5 h-16 rounded-xl shrink-0 mt-0.5"
                  style={{ backgroundColor: b.roomColor || '#1e3a8a' }}
                />
                <div className="space-y-1">
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
                    className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {b.tajukMesyuarat}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <DoorOpen className="w-3.5 h-3.5 text-blue-600" />
                      {b.roomName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatMalayDateWithDay(b.tarikh)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {b.masaMula} - {b.masaTamat}
                    </span>
                    <span>•</span>
                    <span>{b.bilanganPeserta} Pax</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 self-end md:self-center">
                <button
                  onClick={() => onSelectBooking(b)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Lihat Butiran Penuh"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Butiran</span>
                </button>

                {b.status !== 'DIBATALKAN' && (
                  <button
                    onClick={() => onViewQr(b)}
                    className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-blue-200 transition-colors"
                    title="Buka Pas Kod QR"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pas QR</span>
                  </button>
                )}

                <button
                  onClick={() => onPrintSlip(b)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors"
                  title="Cetak Slip Rasmi"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
