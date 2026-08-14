import React from 'react';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { formatMalayDateTime } from '../utils/dateUtils';
import { EmptyState } from '../components/common/EmptyState';
import { Bell, CheckCheck, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface NotificationsPageProps {
  onNavigateToBooking?: (bookingId: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onNavigateToBooking
}) => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useBooking();

  const unreadCount = notifications.filter(n => !n.dibaca).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pusat Pemberitahuan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Semua makluman status permohonan tempahan dan aktiviti sistem MPLBP e-BILIK anda.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-2xl border border-blue-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Tanda Semua Sebagai Dibaca</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="Tiada Pemberitahuan"
          description="Peti masuk pemberitahuan anda kosong pada masa ini."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.notifId}
              onClick={() => {
                markNotificationAsRead(n.notifId);
                if (n.bookingId && onNavigateToBooking) onNavigateToBooking(n.bookingId);
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.dibaca
                  ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`p-3 rounded-2xl shrink-0 ${
                  n.jenis === 'TEMPAHAN_DILULUSKAN' ? 'bg-emerald-50 text-emerald-600' :
                  n.jenis === 'TEMPAHAN_DITOLAK' ? 'bg-rose-50 text-rose-600' :
                  n.jenis === 'TEMPAHAN_DIPULANGKAN' ? 'bg-amber-50 text-amber-600' :
                  'bg-blue-50 text-blue-600'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${!n.dibaca ? 'text-slate-900' : 'text-slate-700'}`}>
                    {n.tajuk}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatMalayDateTime(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.mesej}</p>
                {n.noRujukan && (
                  <span className="inline-block mt-1.5 text-[10px] font-mono font-bold text-blue-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    Rujukan: {n.noRujukan}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
