import React from 'react';
import { BookingStatus, BOOKING_STATUS_CONFIG } from '../../types/booking';
import { RoomStatus, ROOM_STATUS_LABELS } from '../../types/room';
import { UserStatus, STATUS_LABELS } from '../../types/user';

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export const BookingBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const config = BOOKING_STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} shadow-sm`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {config.label}
    </span>
  );
};

export const RoomBadge: React.FC<{ status: RoomStatus }> = ({ status }) => {
  const isAvailable = status === 'AKTIF';
  const isMaintenance = status === 'PENYELENGGARAAN';

  const bg = isAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
             isMaintenance ? 'bg-amber-50 text-amber-700 border-amber-300' :
             'bg-slate-100 text-slate-600 border-slate-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isAvailable ? 'bg-emerald-500' : isMaintenance ? 'bg-amber-500' : 'bg-slate-400'}`} />
      {ROOM_STATUS_LABELS[status] || status}
    </span>
  );
};

export const UserBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
  const isActive = status === 'AKTIF';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {STATUS_LABELS[status] || status}
    </span>
  );
};
