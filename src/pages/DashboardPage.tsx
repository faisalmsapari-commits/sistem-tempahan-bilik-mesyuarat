import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { StatCard } from '../components/analytics/StatCard';
import { BookingBadge, RoomBadge } from '../components/common/Badge';
import { Booking } from '../types/booking';
import { ROLE_LABELS } from '../types/user';
import { formatMalayDate, formatMalayDateWithDay, isMeetingOngoing, isMeetingUpcomingSoon } from '../utils/dateUtils';
import {
  Calendar,
  CalendarPlus,
  Clock,
  DoorOpen,
  CheckCircle,
  FileCheck,
  QrCode,
  ArrowRight,
  Sparkles,
  Building,
  AlertCircle,
  UserCheck,
  Flame,
  Tv
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onOpenBookingModal: (roomId?: string) => void;
  onSelectBooking: (booking: Booking) => void;
  onOpenQRScanner: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenBookingModal,
  onSelectBooking,
  onOpenQRScanner
}) => {
  const { currentUser } = useAuth();
  const { bookings, rooms, notifications, checkIn } = useBooking();

  const role = currentUser?.role || 'KAKITANGAN';
  const todayStr = '2026-08-14';

  // Metrics Calculations
  const todayBookings = useMemo(() => {
    return bookings
      .filter(b => b.tarikh === todayStr && b.status !== 'DIBATALKAN')
      .sort((a, b) => a.masaMula.localeCompare(b.masaMula));
  }, [bookings, todayStr]);

  const upcomingBookings = useMemo(() => {
    return bookings.filter(b => b.tarikh > todayStr && b.status === 'DILULUSKAN');
  }, [bookings, todayStr]);

  const pendingApprovals = useMemo(() => {
    return bookings.filter(b => b.status === 'MENUNGGU_KELULUSAN');
  }, [bookings]);

  const activeRooms = useMemo(() => {
    return rooms.filter(r => r.status === 'AKTIF');
  }, [rooms]);

  // Current ongoing meeting right now
  const currentOngoingBooking = useMemo(() => {
    return todayBookings.find(b => b.status === 'SEDANG_DIGUNAKAN');
  }, [todayBookings]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-blue-700/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Portal Bersepadu MPLBP e-BILIK</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {currentUser?.nama}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentUser?.jawatan} • <strong>{currentUser?.jabatanNama}</strong> ({currentUser ? ROLE_LABELS[currentUser.role] : ''})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenBookingModal()}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-blue-950 text-xs font-extrabold flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
            >
              <CalendarPlus className="w-4 h-4 text-blue-600" />
              <span>+ TEMPAH BILIK</span>
            </button>

            <button
              onClick={onOpenQRScanner}
              className="px-4 py-3 rounded-2xl bg-blue-700/80 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 border border-blue-400/30 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Imbas QR</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Tempahan Hari Ini"
          value={todayBookings.length}
          subtitle="Mesyuarat berjadual pada 14 Ogos"
          icon={Calendar}
          color="blue"
          onClick={() => onNavigate('calendar')}
        />

        <StatCard
          title="Menunggu Kelulusan"
          value={pendingApprovals.length}
          subtitle={role === 'PELULUS' ? 'Perlu tindakan semakan anda' : 'Permohonan dalam proses'}
          icon={FileCheck}
          color="amber"
          onClick={() => onNavigate(role === 'PELULUS' ? 'approvals' : 'my-bookings')}
        />

        <StatCard
          title="Tempahan Akan Datang"
          value={upcomingBookings.length}
          subtitle="Bagi minggu seterusnya"
          icon={Clock}
          color="purple"
          onClick={() => onNavigate('my-bookings')}
        />

        <StatCard
          title="Bilik Mesyuarat Tersedia"
          value={`${activeRooms.length} / ${rooms.length}`}
          subtitle="Sedia untuk ditempah"
          icon={DoorOpen}
          color="emerald"
          onClick={() => onNavigate('rooms')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Today's Schedule & Actionable Meetings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Jadual Hari Ini */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  Jadual Mesyuarat Hari Ini (14 Ogos 2026)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Senarai mesyuarat rasmi berlangsung di Kompleks Pejabat MPLBP
                </p>
              </div>

              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Lihat Kalendar &rarr;
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {todayBookings.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
                  📅 Tiada tempahan bilik mesyuarat dijadualkan pada hari ini.
                </div>
              ) : (
                todayBookings.map(booking => {
                  const isOngoing = booking.status === 'SEDANG_DIGUNAKAN';
                  return (
                    <div
                      key={booking.bookingId}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isOngoing
                          ? 'border-blue-400 bg-blue-50/50 shadow-md shadow-blue-500/5 ring-1 ring-blue-300'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className="w-3.5 h-12 rounded-xl shrink-0 mt-0.5"
                          style={{ backgroundColor: booking.roomColor || '#1e3a8a' }}
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-slate-500">{booking.noRujukan}</span>
                            <BookingBadge status={booking.status} />
                          </div>
                          <h4
                            onClick={() => onSelectBooking(booking)}
                            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {booking.tajukMesyuarat}
                          </h4>
                          <p className="text-xs text-slate-600 flex items-center gap-2">
                            <span>{booking.roomName}</span>
                            <span>•</span>
                            <span>Pengerusi: <strong>{booking.pengerusi}</strong></span>
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                          {booking.masaMula} - {booking.masaTamat}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectBooking(booking)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors"
                          >
                            Butiran
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Rooms Overview */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Direktori Bilik Mesyuarat Utama</h3>
                <p className="text-xs text-slate-500">Pilih bilik untuk tempahan segera</p>
              </div>
              <button
                onClick={() => onNavigate('rooms')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Semua Bilik ({rooms.length}) &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rooms.slice(0, 3).map(room => (
                <div
                  key={room.roomId}
                  onClick={() => onOpenBookingModal(room.roomId)}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div>
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block mr-1.5"
                      style={{ backgroundColor: room.warna }}
                    />
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {room.nama}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{room.aras} • {room.kapasiti} Pax</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                    Tempah Sekarang &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Ongoing Status, Approver Callout & Activity Stream */}
        <div className="space-y-6">
          {/* Ongoing Room Callout Box */}
          {currentOngoingBooking ? (
            <div className="p-5 bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl text-white shadow-lg space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Sedang Berlangsung
                </span>
                <span className="text-xs font-mono opacity-80">{currentOngoingBooking.masaMula} - {currentOngoingBooking.masaTamat}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold leading-snug">{currentOngoingBooking.tajukMesyuarat}</h4>
                <p className="text-xs text-sky-200 mt-1">{currentOngoingBooking.roomName}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">Pengerusi: {currentOngoingBooking.pengerusi}</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-300">Daftar Masuk: {currentOngoingBooking.checkedInBy || 'Pegawai Urus Setia'}</span>
                <button
                  onClick={() => onSelectBooking(currentOngoingBooking)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Paparan Kiosk
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Tiada Mesyuarat Sedang Berlangsung</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Semua bilik mesyuarat utama kini berada dalam keadaan sedia (*standby*) untuk sesi berikutnya.
              </p>
            </div>
          )}

          {/* Approver Action Callout (If user is approver) */}
          {(role === 'PELULUS' || role === 'PENTADBIR_SISTEM') && pendingApprovals.length > 0 && (
            <div className="p-5 bg-amber-50 rounded-3xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Menunggu Kelulusan Anda
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                  {pendingApprovals.length}
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Terdapat {pendingApprovals.length} permohonan tempahan bilik yang memerlukan semakan dan pengesahan anda.
              </p>
              <button
                onClick={() => onNavigate('approvals')}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Semak Permohonan Sekarang &rarr;
              </button>
            </div>
          )}

          {/* Activity Stream (Aktiviti Terkini) */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Aktiviti & Pemberitahuan Terkini</h3>
            <div className="space-y-3">
              {notifications.slice(0, 4).map(n => (
                <div key={n.notifId} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <h5 className="font-bold text-slate-800">{n.tajuk}</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{n.mesej}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">{formatMalayDate(n.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
