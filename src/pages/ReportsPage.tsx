import React, { useState, useMemo } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { BookingBadge } from '../components/common/Badge';
import { formatMalayDate, formatMalayDateWithDay } from '../utils/dateUtils';
import { exportBookingsToCSV } from '../utils/exportUtils';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingUp,
  Building
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { bookings, rooms, departments } = useBooking();

  const [reportType, setReportType] = useState<'TEMPAHAN' | 'PENGGUNAAN_BILIK' | 'BATAL_NO_SHOW' | 'CHECK_IN'>('TEMPAHAN');
  const [selectedRoom, setSelectedRoom] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-31');

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (selectedRoom !== 'ALL' && b.roomId !== selectedRoom) return false;
      if (selectedDept !== 'ALL' && b.jabatanId !== selectedDept) return false;
      if (startDate && b.tarikh < startDate) return false;
      if (endDate && b.tarikh > endDate) return false;

      if (reportType === 'BATAL_NO_SHOW' && b.status !== 'DIBATALKAN' && b.status !== 'TIDAK_HADIR') return false;
      if (reportType === 'CHECK_IN' && !b.checkInAt) return false;

      return true;
    });
  }, [bookings, reportType, selectedRoom, selectedDept, startDate, endDate]);

  const handleExportCSV = () => {
    exportBookingsToCSV(filteredBookings, `laporan-${reportType.toLowerCase()}-mplbp.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pusat Laporan & Rekod Rasmi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Jana, cetak dan eksport laporan penggunaan fasiliti bilik mesyuarat MPLBP mengikut tarikh dan jabatan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Eksport CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Report Types & Filter Controls (hidden in print) */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4 print:hidden">
        {/* Report Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
          {[
            { id: 'TEMPAHAN', label: '1. Laporan Tempahan Keseluruhan' },
            { id: 'PENGGUNAAN_BILIK', label: '2. Laporan Penggunaan Fasiliti Bilik' },
            { id: 'CHECK_IN', label: '3. Laporan Kehadiran & Check-In' },
            { id: 'BATAL_NO_SHOW', label: '4. Laporan Pembatalan & Tidak Hadir' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tarikh Mula</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tarikh Tamat</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Bilik</label>
            <select
              value={selectedRoom}
              onChange={e => setSelectedRoom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            >
              <option value="ALL">Semua Bilik Mesyuarat</option>
              {rooms.map(r => (
                <option key={r.roomId} value={r.roomId}>{r.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Jabatan</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            >
              <option value="ALL">Semua Jabatan</option>
              {departments.map(d => (
                <option key={d.deptId} value={d.deptId}>{d.kod} - {d.nama}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Printable Report Output Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Official Org Letterhead */}
        <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 uppercase">
              Majlis Perbandaran Langkawi Bandaraya Pelancongan
            </h2>
            <p className="text-xs font-bold text-blue-800">
              SISTEM PENGURUSAN TEMPAHAN BILIK MESYUARAT (MPLBP e-BILIK)
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Jenis Laporan: <strong className="text-slate-800">{reportType.replace(/_/g, ' ')}</strong> • Tempoh: {formatMalayDate(startDate)} hingga {formatMalayDate(endDate)}
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-[10px] text-slate-400 block font-mono">TARIKH DIJANA:</span>
            <span className="font-bold text-slate-800">{formatMalayDate(new Date())}</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-y border-slate-300 text-[11px] font-bold text-slate-700 uppercase">
              <tr>
                <th className="py-2.5 px-3">Bil.</th>
                <th className="py-2.5 px-3">No. Rujukan</th>
                <th className="py-2.5 px-3">Tajuk Mesyuarat</th>
                <th className="py-2.5 px-3">Bilik</th>
                <th className="py-2.5 px-3">Tarikh & Masa</th>
                <th className="py-2.5 px-3">Pemohon / Jabatan</th>
                <th className="py-2.5 px-3">Pengerusi</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    Tiada rekod transaksi dijumpai bagi kriteria penapis ini.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, idx) => (
                  <tr key={b.bookingId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{b.noRujukan}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 max-w-xs truncate">{b.tajukMesyuarat}</td>
                    <td className="py-2.5 px-3">{b.roomName}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {formatMalayDate(b.tarikh)} ({b.masaMula} - {b.masaTamat})
                    </td>
                    <td className="py-2.5 px-3">{b.userName} ({b.jabatanNama})</td>
                    <td className="py-2.5 px-3">{b.pengerusi}</td>
                    <td className="py-2.5 px-3 font-semibold">{b.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Report Footer / Signature */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Jumlah Rekod: <strong>{filteredBookings.length}</strong></span>
          <span>Dokumen Rasmi MPLBP e-BILIK</span>
        </div>
      </div>
    </div>
  );
};
