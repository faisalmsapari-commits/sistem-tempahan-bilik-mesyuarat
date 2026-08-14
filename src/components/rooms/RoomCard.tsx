import React from 'react';
import { Room } from '../../types/room';
import { RoomBadge } from '../common/Badge';
import { Users, MapPin, CalendarPlus, Tv, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RoomCardProps {
  room: Room;
  onBook: (roomId: string) => void;
  onViewDoorDisplay: (roomId: string) => void;
  onEdit?: (room: Room) => void;
  onDelete?: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onBook,
  onViewDoorDisplay,
  onEdit,
  onDelete
}) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'PENTADBIR_SISTEM' || currentUser?.role === 'URUS_SETIA';
  const isAvailable = room.status === 'AKTIF';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Room Image Container */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={room.gambar}
          alt={room.nama}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <RoomBadge status={room.status} />
        </div>

        {/* Capacity Tag & Code */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
              {room.kodBilik}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold shadow-sm">
            <Users className="w-3.5 h-3.5" />
            <span>{room.kapasiti} Pax</span>
          </div>
        </div>
      </div>

      {/* Room Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
              {room.nama}
            </h3>
          </div>

          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{room.aras} • {room.lokasi}</span>
          </p>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {room.penerangan}
          </p>
        </div>

        {/* Facilities Chips */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kemudahan Utama:</p>
          <div className="flex flex-wrap gap-1.5">
            {room.kemudahan.slice(0, 4).map((f, i) => (
              <span
                key={i}
                className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg"
              >
                {f}
              </span>
            ))}
            {room.kemudahan.length > 4 && (
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg">
                +{room.kemudahan.length - 4} lagi
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => onBook(room.roomId)}
            disabled={!isAvailable}
            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Tempah Bilik</span>
          </button>

          <button
            onClick={() => onViewDoorDisplay(room.roomId)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Buka Paparan Pintu Kiosk"
          >
            <Tv className="w-4 h-4 text-purple-600" />
          </button>

          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(room)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Kemaskini Maklumat Bilik"
            >
              <Edit className="w-4 h-4 text-slate-600" />
            </button>
          )}

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(room.roomId)}
              className="p-2 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 rounded-xl transition-colors"
              title="Padam Bilik"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
