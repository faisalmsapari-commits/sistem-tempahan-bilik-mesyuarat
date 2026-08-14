import React, { useState, useMemo } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { Booking } from '../../types/booking';
import { formatMalayDate, formatMalayDateWithDay, getTodayDateString } from '../../utils/dateUtils';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameDay,
  isSameMonth
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  DoorOpen,
  Plus
} from 'lucide-react';

interface CalendarViewProps {
  onSelectBooking: (booking: Booking) => void;
  onNewBookingAtDate?: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onSelectBooking,
  onNewBookingAtDate
}) => {
  const { bookings, rooms, departments } = useBooking();

  const [currentDate, setCurrentDate] = useState(new Date('2026-08-14'));
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'DAY'>('MONTH');

  // Filters
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (b.status === 'DIBATALKAN') return false;
      if (selectedRoomFilter !== 'ALL' && b.roomId !== selectedRoomFilter) return false;
      if (selectedDeptFilter !== 'ALL' && b.jabatanId !== selectedDeptFilter) return false;
      if (selectedStatusFilter !== 'ALL' && b.status !== selectedStatusFilter) return false;
      return true;
    });
  }, [bookings, selectedRoomFilter, selectedDeptFilter, selectedStatusFilter]);

  // Handlers for Navigation
  const handlePrev = () => {
    if (viewMode === 'MONTH') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'WEEK') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, -1));
  };

  const handleNext = () => {
    if (viewMode === 'MONTH') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'WEEK') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date('2026-08-14'));
  };

  // Month Grid Days
  const monthDays = useMemo(() => {
    const startMonth = startOfMonth(currentDate);
    const endMonth = endOfMonth(currentDate);
    const startGrid = startOfWeek(startMonth, { weekStartsOn: 1 }); // Monday start
    const endGrid = endOfWeek(endMonth, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: startGrid, end: endGrid });
  }, [currentDate]);

  // Week Days
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden flex flex-col">
      {/* Calendar Top Control Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        {/* Month Title & Nav */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              title="Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hari Ini
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              title="Seterusnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {formatMalayDate(currentDate)}
          </h2>
        </div>

        {/* View Mode Buttons & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-bold text-slate-700">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'MONTH' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Bulan
            </button>
            <button
              onClick={() => setViewMode('WEEK')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'WEEK' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Minggu
            </button>
            <button
              onClick={() => setViewMode('DAY')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'DAY' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Hari
            </button>
          </div>

          {/* Filter Dropdown: Room */}
          <select
            value={selectedRoomFilter}
            onChange={e => setSelectedRoomFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-hidden"
          >
            <option value="ALL">Semua Bilik Mesyuarat</option>
            {rooms.map(r => (
              <option key={r.roomId} value={r.roomId}>{r.nama}</option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW: MONTH */}
      {viewMode === 'MONTH' && (
        <div className="p-4 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div>Isnin</div>
              <div>Selasa</div>
              <div>Rabu</div>
              <div>Khamis</div>
              <div>Jumaat</div>
              <div className="text-rose-500">Sabtu</div>
              <div className="text-rose-500">Ahad</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((day, idx) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDate = dayStr === '2026-08-14';
                const dayBookings = filteredBookings.filter(b => b.tarikh === dayStr);

                return (
                  <div
                    key={idx}
                    className={`min-h-[110px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                      isTodayDate
                        ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-400'
                        : isCurrentMonth
                        ? 'border-slate-100 bg-white hover:border-slate-300'
                        : 'border-slate-50 bg-slate-50/40 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isTodayDate ? 'bg-blue-600 text-white' : 'text-slate-700'
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {onNewBookingAtDate && isCurrentMonth && (
                        <button
                          onClick={() => onNewBookingAtDate(dayStr)}
                          className="opacity-0 hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 rounded-md transition-opacity"
                          title="Tempah pada tarikh ini"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Bookings pills */}
                    <div className="space-y-1 overflow-y-auto max-h-[80px]">
                      {dayBookings.map(b => (
                        <div
                          key={b.bookingId}
                          onClick={() => onSelectBooking(b)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-white truncate cursor-pointer shadow-xs hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: b.roomColor || '#1e3a8a' }}
                          title={`${b.masaMula} - ${b.masaTamat} | ${b.tajukMesyuarat} (${b.roomName})`}
                        >
                          {b.masaMula} {b.tajukMesyuarat}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: WEEK */}
      {viewMode === 'WEEK' && (
        <div className="p-4 overflow-x-auto">
          <div className="min-w-[850px] grid grid-cols-7 gap-3">
            {weekDays.map((day, idx) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const isTodayDate = dayStr === '2026-08-14';
              const dayBookings = filteredBookings.filter(b => b.tarikh === dayStr);

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex flex-col min-h-[350px] ${
                    isTodayDate ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="text-center border-b border-slate-100 pb-2 mb-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">
                      {format(day, 'EEEE')}
                    </span>
                    <span className={`inline-block mt-0.5 text-sm font-extrabold px-2.5 py-0.5 rounded-full ${
                      isTodayDate ? 'bg-blue-600 text-white' : 'text-slate-800'
                    }`}>
                      {day.getDate()}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {dayBookings.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center mt-6">Tiada mesyuarat</p>
                    ) : (
                      dayBookings.map(b => (
                        <div
                          key={b.bookingId}
                          onClick={() => onSelectBooking(b)}
                          className="p-2.5 rounded-xl border text-left cursor-pointer hover:shadow-md transition-all space-y-1 text-white"
                          style={{ backgroundColor: b.roomColor || '#1e3a8a' }}
                        >
                          <div className="flex items-center justify-between text-[10px] opacity-90">
                            <span className="font-mono">{b.masaMula} - {b.masaTamat}</span>
                          </div>
                          <h4 className="text-xs font-bold line-clamp-2">{b.tajukMesyuarat}</h4>
                          <p className="text-[10px] opacity-90 truncate">{b.roomName}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: DAY */}
      {viewMode === 'DAY' && (
        <div className="p-6">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs font-bold text-blue-900 flex items-center justify-between">
              <span>Jadual Mesyuarat pada {formatMalayDateWithDay(currentDate)}</span>
              <span>{filteredBookings.filter(b => b.tarikh === format(currentDate, 'yyyy-MM-dd')).length} Mesyuarat</span>
            </div>

            <div className="space-y-3">
              {filteredBookings.filter(b => b.tarikh === format(currentDate, 'yyyy-MM-dd')).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                  Tiada tempahan dijadualkan pada hari ini.
                </div>
              ) : (
                filteredBookings
                  .filter(b => b.tarikh === format(currentDate, 'yyyy-MM-dd'))
                  .sort((a, b) => a.masaMula.localeCompare(b.masaMula))
                  .map(b => (
                    <div
                      key={b.bookingId}
                      onClick={() => onSelectBooking(b)}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-3 h-12 rounded-full shrink-0"
                          style={{ backgroundColor: b.roomColor || '#1e3a8a' }}
                        />
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{b.noRujukan}</span>
                          <h4 className="text-sm font-bold text-slate-900">{b.tajukMesyuarat}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {b.roomName} • Pengerusi: <strong>{b.pengerusi}</strong>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Pemohon: {b.userName} ({b.jabatanNama})
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                          {b.masaMula} - {b.masaTamat}
                        </div>
                        <span className="block mt-1 text-[10px] font-bold text-slate-500 uppercase">
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
