import React, { useState, useMemo } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { BookingBadge } from '../../components/common/Badge';
import { Booking } from '../../types/booking';
import { formatMalayDate, formatMalayDateWithDay } from '../../utils/dateUtils';
import { exportBookingsToCSV } from '../../utils/exportUtils';
import {
  Calendar,
  Search,
  Download,
  Filter,
  Eye,
  CalendarPlus,
  DoorOpen,
  Building
} from 'lucide-react';

interface BookingsPageProps {
  onOpenBookingModal: () => void;
  onSelectBooking: (booking: Booking) => void;
  onViewQr: (booking: Booking) => void;
  onPrintSlip: (booking: Booking) => void;
}

export const BookingsPage: React.FC<BookingsPageProps> = ({
  onOpenBookingModal,
  onSelectBooking,
  onViewQr,
  onPrintSlip
}) => {
  const { bookings, rooms, departments } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (selectedRoom !== 'ALL' && b.roomId !== selectedRoom) return false;
      if (selectedDept !== 'ALL' && b.jabatanId !== selectedDept) return false;
      if (selectedStatus !== 'ALL' && b.status !== selectedStatus) return false;
      if (selectedDate && b.tarikh !== selectedDate) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = b.tajukMesyuarat.toLowerCase().includes(q);
        const matchesRef = b.noRujukan.toLowerCase().includes(q);
        const matchesUser = b.userName.toLowerCase().includes(q);
        const matchesChairman = (b.pengerusi || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesRef && !matchesUser && !matchesChairman) return false;
      }

      return true;
    }).sort((a, b) => b.tarikh.localeCompare(a.tarikh));
  }, [bookings, selectedRoom, selectedDept, selectedStatus, selectedDate, searchQuery]);

  const handleExport = () => {
    exportBookingsToCSV(filteredBookings, `rekod-tempahan-mplbp-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Senarai Semua Tempahan Bilik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pangkalan data rekod transaksi tempahan fasiliti bilik mesyuarat MPLBP.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl flex items-center gap-2 border border-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Eksport CSV</span>
          </button>

          <button
            onClick={onOpenBookingModal}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>+ Tempah Bilik</span>
          </button>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari tajuk, rujukan, pemohon..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Room Filter */}
        <select
          value={selectedRoom}
          onChange={e => setSelectedRoom(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-hidden focus:border-blue-500 focus:bg-white"
        >
          <option value="ALL">Semua Bilik Mesyuarat</option>
          {rooms.map(r => (
            <option key={r.roomId} value={r.roomId}>{r.nama}</option>
          ))}
        </select>

        {/* Department Filter */}
        <select
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-hidden focus:border-blue-500 focus:bg-white"
        >
          <option value="ALL">Semua Jabatan</option>
          {departments.map(d => (
            <option key={d.deptId} value={d.deptId}>{d.kod} - {d.nama}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-hidden focus:border-blue-500 focus:bg-white"
        >
          <option value="ALL">Semua Status</option>
          <option value="MENUNGGU_KELULUSAN">Menunggu Kelulusan</option>
          <option value="DILULUSKAN">Diluluskan</option>
          <option value="SEDANG_DIGUNAKAN">Sedang Digunakan</option>
          <option value="SELESAI">Selesai</option>
          <option value="DITOLAK">Ditolak</option>
          <option value="DIPULANGKAN">Dipulangkan</option>
          <option value="DIBATALKAN">Dibatalkan</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-hidden focus:border-blue-500 focus:bg-white"
        />
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">No. Rujukan</th>
                <th className="py-3.5 px-4">Tajuk Mesyuarat</th>
                <th className="py-3.5 px-4">Bilik</th>
                <th className="py-3.5 px-4">Tarikh & Masa</th>
                <th className="py-3.5 px-4">Pemohon & Jabatan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tiada rekod tempahan ditemui berdasarkan kriteria carian.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b.bookingId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {b.noRujukan}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{b.tajukMesyuarat}</p>
                      <p className="text-[11px] text-slate-500 truncate">Pengerusi: {b.pengerusi}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {b.roomName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="font-medium text-slate-800">{formatMalayDate(b.tarikh)}</p>
                      <p className="text-[11px] font-mono text-slate-500">{b.masaMula} - {b.masaTamat}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{b.userName}</p>
                      <p className="text-[10px] text-slate-500">{b.jabatanNama}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <BookingBadge status={b.status} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => onSelectBooking(b)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lihat</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>Memaparkan {filteredBookings.length} daripada {bookings.length} rekod</span>
        </div>
      </div>
    </div>
  );
};
