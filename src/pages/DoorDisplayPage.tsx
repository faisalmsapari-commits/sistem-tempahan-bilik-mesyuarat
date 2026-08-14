import React, { useState, useEffect, useMemo } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { Room } from '../types/room';
import { Booking } from '../types/booking';
import { formatMalayDate, formatMalayDateWithDay } from '../utils/dateUtils';
import { QRCodeSVG } from 'qrcode.react';
import {
  DoorOpen,
  Clock,
  Calendar,
  Users,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Maximize2,
  Minimize2,
  Tv
} from 'lucide-react';

interface DoorDisplayPageProps {
  selectedRoomId?: string;
  onExit?: () => void;
}

export const DoorDisplayPage: React.FC<DoorDisplayPageProps> = ({
  selectedRoomId,
  onExit
}) => {
  const { rooms, bookings, checkIn } = useBooking();
  const [activeRoomId, setActiveRoomId] = useState<string>(selectedRoomId || rooms[0]?.roomId || '');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeRoom = useMemo(() => {
    return rooms.find(r => r.roomId === activeRoomId) || rooms[0];
  }, [rooms, activeRoomId]);

  const todayStr = '2026-08-14';

  // Room's today bookings
  const roomTodayBookings = useMemo(() => {
    if (!activeRoom) return [];
    return bookings
      .filter(b => b.roomId === activeRoom.roomId && b.tarikh === todayStr && b.status !== 'DIBATALKAN')
      .sort((a, b) => a.masaMula.localeCompare(b.masaMula));
  }, [bookings, activeRoom, todayStr]);

  // Determine current active meeting
  const currentMeeting = useMemo(() => {
    return roomTodayBookings.find(b => b.status === 'SEDANG_DIGUNAKAN');
  }, [roomTodayBookings]);

  // Determine upcoming meeting
  const nextMeeting = useMemo(() => {
    if (currentMeeting) {
      return roomTodayBookings.find(b => b.masaMula >= currentMeeting.masaTamat && b.status === 'DILULUSKAN');
    }
    return roomTodayBookings.find(b => b.status === 'DILULUSKAN' || b.status === 'MENUNGGU_KELULUSAN');
  }, [roomTodayBookings, currentMeeting]);

  // Room State (🟢 TERSEDIA, 🔴 SEDANG DIGUNAKAN, 🟠 AKAN DIGUNAKAN)
  const roomState = useMemo(() => {
    if (activeRoom?.status === 'PENYELENGGARAAN') {
      return {
        label: 'DALAM PENYELENGGARAAN',
        bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
        badgeBg: 'bg-amber-500 text-slate-950',
        dotColor: 'bg-amber-400'
      };
    }

    if (currentMeeting) {
      return {
        label: 'SEDANG DIGUNAKAN',
        bg: 'bg-rose-950/80 border-rose-500/50 text-rose-300',
        badgeBg: 'bg-rose-600 text-white',
        dotColor: 'bg-rose-500 animate-ping'
      };
    }

    if (nextMeeting && nextMeeting.masaMula <= '10:00') {
      return {
        label: 'AKAN DIGUNAKAN',
        bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
        badgeBg: 'bg-amber-500 text-slate-950',
        dotColor: 'bg-amber-400'
      };
    }

    return {
      label: 'TERSEDIA',
      bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
      badgeBg: 'bg-emerald-500 text-slate-950',
      dotColor: 'bg-emerald-400'
    };
  }, [activeRoom, currentMeeting, nextMeeting]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!activeRoom) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 overflow-hidden font-sans select-none animate-fade-in">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight">MPLBP</span>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-sky-400">e-BILIK</span>
              <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                KIOSK TABLET
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Majlis Perbandaran Langkawi Bandaraya Pelancongan
            </p>
          </div>
        </div>

        {/* Room Switcher for Display */}
        <div className="flex items-center gap-3">
          <select
            value={activeRoomId}
            onChange={e => setActiveRoomId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl outline-hidden"
          >
            {rooms.map(r => (
              <option key={r.roomId} value={r.roomId}>
                {r.nama} ({r.kodBilik})
              </option>
            ))}
          </select>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            title="Skrin Penuh"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Keluar Kiosk
            </button>
          )}
        </div>
      </div>

      {/* Main Kiosk Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center py-6">
        {/* Left Column: Room Identity & Live Status Banner (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Room Name & Info */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400 bg-sky-950/60 px-3 py-1 rounded-lg border border-sky-800">
              {activeRoom.kodBilik} • {activeRoom.aras}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {activeRoom.nama}
            </h1>
            <p className="text-sm text-slate-400 flex items-center gap-4 pt-1">
              <span>Kapasiti: <strong>{activeRoom.kapasiti} Orang</strong></span>
              <span>•</span>
              <span>{activeRoom.lokasi}</span>
            </p>
          </div>

          {/* Huge Live Status Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border-2 backdrop-blur-xl transition-all shadow-2xl flex items-center justify-between gap-6 ${roomState.bg}`}>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className={`w-3.5 h-3.5 rounded-full ${roomState.dotColor}`} />
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
                  Status Semasa Bilik:
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight uppercase">
                {roomState.label}
              </h2>
            </div>

            {currentMeeting && (
              <div className="hidden sm:block text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-mono">Tempoh Masa</span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-white">
                  {currentMeeting.masaMula} - {currentMeeting.masaTamat}
                </span>
              </div>
            )}
          </div>

          {/* Current Meeting Details */}
          {currentMeeting ? (
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                Mesyuarat Sedang Berlangsung:
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {currentMeeting.tajukMesyuarat}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-300 pt-2 border-t border-white/10">
                <div>Pengerusi: <strong className="text-white">{currentMeeting.pengerusi}</strong></div>
                <div>Urus Setia: <strong className="text-white">{currentMeeting.userName}</strong></div>
                <div>Jabatan: <strong className="text-white">{currentMeeting.jabatanNama}</strong></div>
                <div>No. Rujukan: <span className="font-mono text-sky-300 font-bold">{currentMeeting.noRujukan}</span></div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-xs text-slate-400 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Bilik mesyuarat ini sedang kosong dan boleh ditempah atau digunakan untuk perbincangan rasmi.</span>
            </div>
          )}
        </div>

        {/* Right Column: QR Check-In Pass & Next Meeting Schedule (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Big Clock */}
          <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 text-center space-y-1">
            <p className="text-xs font-bold text-sky-400 uppercase tracking-widest">
              {formatMalayDateWithDay(new Date())}
            </p>
            <div className="text-4xl sm:text-5xl font-mono font-black text-white tracking-tight">
              {currentTime || '09:30:00'}
            </div>
          </div>

          {/* QR Check-In / Room Booking Pass */}
          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Daftar Masuk Pantas</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Urus setia atau peserta mesyuarat boleh mengimbas kod QR ini untuk rekod kehadiran rasmi.
              </p>
              {currentMeeting && (
                <span className="inline-block mt-2 text-[10px] font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
                  {currentMeeting.noRujukan}
                </span>
              )}
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-xl shrink-0">
              <QRCodeSVG
                value={currentMeeting?.qrCodeData || `MPLBP-ROOM-${activeRoom.kodBilik}-CHECKIN`}
                size={95}
                level="M"
              />
            </div>
          </div>

          {/* Next Upcoming Meeting */}
          {nextMeeting && (
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-bold uppercase">Mesyuarat Seterusnya:</span>
                <span className="font-mono text-amber-400 font-bold">{nextMeeting.masaMula} - {nextMeeting.masaTamat}</span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{nextMeeting.tajukMesyuarat}</h4>
              <p className="text-[11px] text-slate-400 truncate">Pengerusi: {nextMeeting.pengerusi}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-slate-500 font-mono">
        <span>SISTEM e-BILIK MPLBP • PAPARAN KIOSK DIGITAL</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>KEMASKINI AUTOMATIK AKTIF</span>
        </span>
      </div>
    </div>
  );
};
