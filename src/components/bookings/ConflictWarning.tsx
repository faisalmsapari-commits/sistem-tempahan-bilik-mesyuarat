import React from 'react';
import { AlertCircle, Clock, DoorOpen, CheckCircle } from 'lucide-react';
import { Booking } from '../../types/booking';
import { Room } from '../../types/room';

interface ConflictWarningProps {
  reason?: string;
  conflictingBooking?: Booking;
  alternateRooms?: Room[];
  onSelectAlternateRoom?: (roomId: string) => void;
  onSelectAlternateTime?: (start: string, end: string) => void;
}

export const ConflictWarning: React.FC<ConflictWarningProps> = ({
  reason,
  conflictingBooking,
  alternateRooms = [],
  onSelectAlternateRoom,
  onSelectAlternateTime
}) => {
  return (
    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3 animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1 text-xs">
          <h4 className="font-bold text-rose-800 text-sm">Pertindihan Jadual Dikesan!</h4>
          <p className="mt-1 leading-relaxed text-rose-700">
            {reason || 'Bilik ini telah ditempah pada waktu tersebut. Sila pilih waktu atau bilik lain.'}
          </p>
        </div>
      </div>

      {conflictingBooking && (
        <div className="p-3 bg-white/80 rounded-xl border border-rose-100 text-xs text-slate-700 space-y-1">
          <p className="font-semibold text-slate-900">Maklumat Tempahan Bertindih:</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div><span className="text-slate-500">Mesyuarat:</span> {conflictingBooking.tajukMesyuarat}</div>
            <div><span className="text-slate-500">Masa:</span> {conflictingBooking.masaMula} - {conflictingBooking.masaTamat}</div>
            <div><span className="text-slate-500">Pemohon:</span> {conflictingBooking.userName}</div>
            <div><span className="text-slate-500">No. Rujukan:</span> {conflictingBooking.noRujukan}</div>
          </div>
        </div>
      )}

      {/* Cadangan Bilik Alternatif */}
      {alternateRooms.length > 0 && onSelectAlternateRoom && (
        <div className="pt-2 border-t border-rose-200/60">
          <p className="text-[11px] font-bold text-rose-900 mb-2 flex items-center gap-1.5">
            <DoorOpen className="w-3.5 h-3.5 text-rose-700" />
            Cadangan Bilik Mesyuarat Lain yang Sesuai:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {alternateRooms.slice(0, 2).map(room => (
              <button
                key={room.roomId}
                type="button"
                onClick={() => onSelectAlternateRoom(room.roomId)}
                className="p-2.5 rounded-xl bg-white border border-rose-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{room.nama}</p>
                  <p className="text-[10px] text-slate-500">Kapasiti: {room.kapasiti} orang • {room.aras}</p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  Pilih
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
