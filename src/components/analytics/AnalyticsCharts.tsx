import React from 'react';
import { Booking } from '../../types/booking';
import { Room } from '../../types/room';
import { Department } from '../../types/department';

interface AnalyticsChartsProps {
  bookings: Booking[];
  rooms: Room[];
  departments: Department[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  bookings,
  rooms,
  departments
}) => {
  // Monthly Trends (Jan - Dec 2026)
  const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
  const monthlyData = [12, 18, 15, 22, 28, 24, 30, 35, 20, 15, 10, 8];

  // Room Utilization
  const roomUsage = rooms.map(room => {
    const count = bookings.filter(b => b.roomId === room.roomId).length;
    return {
      name: room.nama,
      code: room.kodBilik,
      count,
      color: room.warna || '#1e3a8a'
    };
  });

  const maxRoomUsage = Math.max(...roomUsage.map(r => r.count), 1);

  // Department Distribution
  const deptUsage = departments.map(d => {
    const count = bookings.filter(b => b.jabatanId === d.deptId).length;
    return {
      code: d.kod,
      name: d.nama,
      count
    };
  });

  const totalDeptCount = deptUsage.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Trend Tempahan Bulanan */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Trend Tempahan Bilik Mesyuarat (2026)</h3>
          <p className="text-xs text-slate-500">Jumlah tempahan yang dijadualkan mengikut bulan</p>
        </div>

        {/* SVG Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100">
          {months.map((m, idx) => {
            const val = monthlyData[idx];
            const heightPercent = (val / 40) * 100;
            const isCurrentMonth = m === 'Ogo';

            return (
              <div key={m} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}
                </span>
                <div
                  className={`w-full max-w-[28px] rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                    isCurrentMonth
                      ? 'bg-gradient-to-t from-blue-700 to-sky-500 shadow-md shadow-blue-600/30'
                      : 'bg-slate-200 group-hover:bg-blue-300'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className={`text-[10px] font-bold ${isCurrentMonth ? 'text-blue-700 font-extrabold' : 'text-slate-500'}`}>
                  {m}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Bulan Terpilih: <strong>Ogos 2026 (Puncak)</strong></span>
          <span className="font-bold text-blue-600">35 Tempahan</span>
        </div>
      </div>

      {/* Chart 2: Kadar Penggunaan Mengikut Bilik Mesyuarat */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Kadar Penggunaan Setiap Bilik</h3>
          <p className="text-xs text-slate-500">Bilik mesyuarat paling kerap ditempah dan digunakan</p>
        </div>

        <div className="space-y-3.5 pt-2">
          {roomUsage.map((r, i) => {
            const percentage = Math.round((r.count / maxRoomUsage) * 100);
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 line-clamp-1">{r.name}</span>
                  <span className="font-mono font-bold text-blue-700">{r.count} Kali ({percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: r.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 3: Pecahan Tempahan Mengikut Jabatan */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card space-y-4 lg:col-span-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Pecahan Penggunaan Mengikut Jabatan MPLBP</h3>
          <p className="text-xs text-slate-500">Aktiviti tempahan bilik mesyuarat merentas jabatan</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {deptUsage.map((d, idx) => {
            const pct = Math.round((d.count / totalDeptCount) * 100);
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{d.code}</span>
                <h4 className="text-lg font-extrabold text-slate-900">{d.count}</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1">{d.name}</p>
                <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
