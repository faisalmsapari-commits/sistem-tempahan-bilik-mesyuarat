import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { RoomCard } from '../components/rooms/RoomCard';
import { RoomFormModal } from '../components/rooms/RoomFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Room } from '../../types/room';
import {
  DoorOpen,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Tv
} from 'lucide-react';

interface RoomsPageProps {
  onBookRoom: (roomId: string) => void;
  onViewDoorDisplay: (roomId: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({
  onBookRoom,
  onViewDoorDisplay
}) => {
  const { currentUser } = useAuth();
  const { rooms, deleteRoom } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

  const [deleteConfirmRoomId, setDeleteConfirmRoomId] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'PENTADBIR_SISTEM' || currentUser?.role === 'URUS_SETIA';

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      if (levelFilter !== 'ALL' && !r.aras.includes(levelFilter)) return false;
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.nama.toLowerCase().includes(q);
        const matchesCode = r.kodBilik.toLowerCase().includes(q);
        const matchesDesc = r.penerangan.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesDesc) return false;
      }

      return true;
    });
  }, [rooms, levelFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Direktori Bilik Mesyuarat
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Senarai bilik mesyuarat, dewan seminar dan makmal latihan di Kompleks Pejabat MPLBP.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setRoomToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Bilik Baharu</span>
          </button>
        )}
      </div>

      {/* Filter Control Box */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari bilik, kod atau kemudahan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-hidden"
          >
            <option value="ALL">Semua Aras Bangunan</option>
            <option value="Aras 3">Aras 3</option>
            <option value="Aras 2">Aras 2</option>
            <option value="Aras 1">Aras 1</option>
            <option value="Aras Bawah">Aras Bawah / G</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-hidden"
          >
            <option value="ALL">Semua Status</option>
            <option value="AKTIF">Aktif / Tersedia</option>
            <option value="PENYELENGGARAAN">Dalam Penyelenggaraan</option>
            <option value="TIDAK_AKTIF">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <RoomCard
            key={room.roomId}
            room={room}
            onBook={onBookRoom}
            onViewDoorDisplay={onViewDoorDisplay}
            onEdit={r => {
              setRoomToEdit(r);
              setIsFormModalOpen(true);
            }}
            onDelete={id => setDeleteConfirmRoomId(id)}
          />
        ))}
      </div>

      {/* Add / Edit Room Modal */}
      <RoomFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setRoomToEdit(null);
        }}
        roomToEdit={roomToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmRoomId}
        onClose={() => setDeleteConfirmRoomId(null)}
        onConfirm={() => {
          if (deleteConfirmRoomId) deleteRoom(deleteConfirmRoomId);
        }}
        title="Padam Bilik Mesyuarat"
        message="Adakah anda pasti mahu memadam bilik mesyuarat ini daripada sistem MPLBP e-BILIK? Tindakan ini tidak boleh diundur."
        confirmText="Ya, Padam Bilik"
        cancelText="Batal"
      />
    </div>
  );
};
