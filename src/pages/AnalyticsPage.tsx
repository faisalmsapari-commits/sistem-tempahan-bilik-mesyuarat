import React from 'react';
import { useBooking } from '../contexts/BookingContext';
import { AnalyticsCharts } from '../components/analytics/AnalyticsCharts';
import { StatCard } from '../components/analytics/StatCard';
import {
  TrendingUp,
  Users,
  DoorOpen,
  Calendar,
  Clock,
  Ban,
  CheckCircle,
  BarChart3
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { bookings, rooms, departments } = useBooking();

  const totalBookings = bookings.length;
  const approvedBookings = bookings.filter(b => b.status === 'DILULUSKAN' || b.status === 'SELESAI' || b.status === 'SEDANG_DIGUNAKAN').length;
  const cancelledBookings = bookings.filter(b => b.status === 'DIBATALKAN').length;
  const checkInBookings = bookings.filter(b => b.checkInAt).length;

  const utilizationRate = Math.round((approvedBookings / (totalBookings || 1)) * 100);
  const checkInRate = Math.round((checkInBookings / (approvedBookings || 1)) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Papan Pemuka Analitik & Penggunaan Fasiliti
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Analisis statistik masa nyata kecekapan penggunaan bilik mesyuarat, trend jabatan, dan waktu puncak operasi MPLBP.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Kadar Kelulusan Tempahan"
          value={`${utilizationRate}%`}
          subtitle={`${approvedBookings} daripada ${totalBookings} diluluskan`}
          icon={TrendingUp}
          color="emerald"
        />

        <StatCard
          title="Kadar Kehadiran (Check-In)"
          value={`${checkInRate}%`}
          subtitle={`${checkInBookings} pendaftaran kod QR`}
          icon={CheckCircle}
          color="blue"
        />

        <StatCard
          title="Jumlah Tempahan Keseluruhan"
          value={totalBookings}
          subtitle="Tahun 2026"
          icon={Calendar}
          color="purple"
        />

        <StatCard
          title="Kadar Pembatalan"
          value={`${Math.round((cancelledBookings / (totalBookings || 1)) * 100)}%`}
          subtitle={`${cancelledBookings} tempahan dibatalkan`}
          icon={Ban}
          color="rose"
        />
      </div>

      {/* Deep Charts Section */}
      <AnalyticsCharts
        bookings={bookings}
        rooms={rooms}
        departments={departments}
      />
    </div>
  );
};
