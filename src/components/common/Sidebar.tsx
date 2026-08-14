import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  BookmarkCheck,
  DoorOpen,
  CheckSquare,
  Wrench,
  QrCode,
  FileBarChart,
  BarChart3,
  Users,
  Building2,
  CalendarDays,
  FileText,
  Settings,
  Tv,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenBookingModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  onOpenBookingModal
}) => {
  const { currentUser } = useAuth();
  const { bookings } = useBooking();

  const role = currentUser?.role || 'KAKITANGAN';

  // Count pending approvals
  const pendingApprovalsCount = bookings.filter(b => b.status === 'MENUNGGU_KELULUSAN').length;
  // Count today's bookings
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookingsCount = bookings.filter(b => b.tarikh === todayStr && b.status !== 'DIBATALKAN').length;

  const handleNav = (page: string) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Quick Action: + Tempah Bilik */}
        <div className="p-4 border-b border-slate-800/80">
          <button
            onClick={() => {
              onOpenBookingModal();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>+ TEMPAH BILIK</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {/* UTAMA */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Menu Utama
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleNav('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Papan Pemuka</span>
              </button>

              <button
                onClick={() => handleNav('my-bookings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPage === 'my-bookings'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>Tempahan Saya</span>
              </button>

              <button
                onClick={() => handleNav('calendar')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPage === 'calendar'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Kalendar Jadual</span>
              </button>

              <button
                onClick={() => handleNav('rooms')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPage === 'rooms'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <DoorOpen className="w-4 h-4" />
                <span>Bilik Mesyuarat</span>
              </button>
            </div>
          </div>

          {/* OPERASI & KELULUSAN */}
          {(role === 'PENTADBIR_SISTEM' || role === 'PELULUS' || role === 'URUS_SETIA' || role === 'PENTADBIR_JABATAN') && (
            <div>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Operasi & Kelulusan
              </p>
              <div className="space-y-1">
                {(role === 'PENTADBIR_SISTEM' || role === 'PELULUS') && (
                  <button
                    onClick={() => handleNav('approvals')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      currentPage === 'approvals'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span>Kelulusan Tempahan</span>
                    </div>
                    {pendingApprovalsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                        {pendingApprovalsCount}
                      </span>
                    )}
                  </button>
                )}

                {(role === 'PENTADBIR_SISTEM' || role === 'URUS_SETIA') && (
                  <>
                    <button
                      onClick={() => handleNav('secretariat')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        currentPage === 'secretariat'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Wrench className="w-4 h-4 text-amber-400" />
                      <span>Urus Setia & Fasiliti</span>
                    </button>

                    <button
                      onClick={() => handleNav('maintenance')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        currentPage === 'maintenance'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Wrench className="w-4 h-4 text-cyan-400" />
                      <span>Penyelenggaraan</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleNav('bookings')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === 'bookings'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookmarkCheck className="w-4 h-4 text-sky-400" />
                    <span>Semua Tempahan</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {bookings.length}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* KIOSK & DAFTAR MASUK QR */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Kiosk & Digital
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleNav('door-display')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPage === 'door-display'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Tv className="w-4 h-4 text-purple-400" />
                <span>Paparan Pintu (Kiosk)</span>
              </button>

              <button
                onClick={() => handleNav('qr-scanner')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPage === 'qr-scanner'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Pengimbas QR Check-In</span>
              </button>
            </div>
          </div>

          {/* LAPORAN & ANALITIK */}
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Laporan & Analisis
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleNav('reports')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentPage === 'reports'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileBarChart className="w-4 h-4 text-blue-400" />
                <span>Laporan Rasmi</span>
              </button>

              {(role === 'PENTADBIR_SISTEM' || role === 'PENTADBIR_JABATAN' || role === 'PELULUS') && (
                <button
                  onClick={() => handleNav('analytics')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === 'analytics'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <span>Analitik Penggunaan</span>
                </button>
              )}
            </div>
          </div>

          {/* PENTADBIRAN SISTEM (ADMIN ONLY) */}
          {role === 'PENTADBIR_SISTEM' && (
            <div>
              <p className="px-3 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                Pentadbir Sistem
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => handleNav('admin-users')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === 'admin-users'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Pengurusan Pengguna</span>
                </button>

                <button
                  onClick={() => handleNav('admin-departments')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === 'admin-departments'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <span>Jabatan & Unit</span>
                </button>

                <button
                  onClick={() => handleNav('admin-holidays')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === 'admin-holidays'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <CalendarDays className="w-4 h-4 text-emerald-400" />
                  <span>Cuti & Takwim</span>
                </button>

                <button
                  onClick={() => handleNav('admin-audit')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === 'admin-audit'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Log Audit Keselamatan</span>
                </button>

                <button
                  onClick={() => handleNav('admin-settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === 'admin-settings'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Tetapan Sistem</span>
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
          <span>v1.0.0 (MPLBP 2026)</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Sistem Aktif
          </span>
        </div>
      </aside>
    </>
  );
};
