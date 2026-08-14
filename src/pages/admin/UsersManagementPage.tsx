import React, { useState, useMemo } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { UserBadge } from '../../components/common/Badge';
import { UserProfile, UserRole, UserStatus, ROLE_LABELS, STATUS_LABELS } from '../../types/user';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatMalayDate } from '../../utils/dateUtils';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Shield,
  UserCheck,
  UserX,
  KeyRound
} from 'lucide-react';

export const UsersManagementPage: React.FC = () => {
  const { users, departments, createUser, updateUser, setUserStatus } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);

  // Form fields
  const [nama, setNama] = useState('');
  const [emel, setEmel] = useState('');
  const [noTelefon, setNoTelefon] = useState('');
  const [noStaf, setNoStaf] = useState('');
  const [jawatan, setJawatan] = useState('');
  const [jabatanId, setJabatanId] = useState(departments[0]?.deptId || '');
  const [unit, setUnit] = useState('');
  const [role, setRole] = useState<UserRole>('KAKITANGAN');
  const [status, setStatus] = useState<UserStatus>('AKTIF');

  // Status toggle confirmation
  const [userToToggleStatus, setUserToToggleStatus] = useState<UserProfile | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.nama.toLowerCase().includes(q);
        const matchesEmail = u.emel.toLowerCase().includes(q);
        const matchesStaff = u.noStaf.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesStaff) return false;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, searchQuery]);

  const openAddModal = () => {
    setUserToEdit(null);
    setNama('');
    setEmel('');
    setNoTelefon('012-');
    setNoStaf(`MPLBP-${Math.floor(100 + Math.random() * 900)}`);
    setJawatan('Penolong Pegawai');
    setJabatanId(departments[0]?.deptId || '');
    setUnit('Pentadbiran');
    setRole('KAKITANGAN');
    setStatus('AKTIF');
    setIsModalOpen(true);
  };

  const openEditModal = (u: UserProfile) => {
    setUserToEdit(u);
    setNama(u.nama);
    setEmel(u.emel);
    setNoTelefon(u.noTelefon);
    setNoStaf(u.noStaf);
    setJawatan(u.jawatan);
    setJabatanId(u.jabatanId);
    setUnit(u.unit);
    setRole(u.role);
    setStatus(u.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find(d => d.deptId === jabatanId);

    if (userToEdit) {
      updateUser(userToEdit.uid, {
        nama,
        noTelefon,
        noStaf,
        jawatan,
        jabatanId,
        jabatanNama: dept?.nama || '',
        unit,
        role,
        status
      });
    } else {
      createUser({
        nama,
        emel,
        noTelefon,
        noStaf,
        jawatan,
        jabatanId,
        jabatanNama: dept?.nama || '',
        unit,
        role,
        status,
        gambarProfil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pengurusan Pengguna & Peranan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar, kemaskini peranan, jabatan dan kawalan status akses kakitangan MPLBP.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Pengguna Baharu</span>
        </button>
      </div>

      {/* Filter Control Box */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama, emel atau no staf..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-hidden"
          >
            <option value="ALL">Semua Peranan</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-hidden"
          >
            <option value="ALL">Semua Status</option>
            <option value="AKTIF">Aktif</option>
            <option value="TIDAK_AKTIF">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">No. Staf</th>
                <th className="py-3.5 px-4">Jawatan & Jabatan</th>
                <th className="py-3.5 px-4">Peranan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(u => (
                <tr key={u.uid} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.gambarProfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={u.nama}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{u.nama}</p>
                        <p className="text-[11px] text-slate-500">{u.emel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {u.noStaf}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800">{u.jawatan}</p>
                    <p className="text-[10px] text-slate-500">{u.jabatanNama}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px] border border-blue-200/60">
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <UserBadge status={u.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors inline-block"
                      title="Kemaskini Pengguna"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setUserToToggleStatus(u)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-colors inline-block ${
                        u.status === 'AKTIF'
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                      }`}
                      title={u.status === 'AKTIF' ? 'Nyahaktifkan Akaun' : 'Aktifkan Akaun'}
                    >
                      {u.status === 'AKTIF' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={userToEdit ? 'Kemaskini Maklumat Pengguna' : 'Daftar Pengguna Baharu'}
        subtitle="Kawalan Akses Pengguna MPLBP"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Penuh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={e => setNama(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Emel Rasmi <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                disabled={!!userToEdit}
                value={emel}
                onChange={e => setEmel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-hidden focus:border-blue-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                No. Telefon <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={noTelefon}
                onChange={e => setNoTelefon(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                No. Staf MPLBP <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={noStaf}
                onChange={e => setNoStaf(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jawatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={jawatan}
                onChange={e => setJawatan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jabatan <span className="text-rose-500">*</span>
              </label>
              <select
                value={jabatanId}
                onChange={e => setJabatanId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-hidden focus:border-blue-500"
              >
                {departments.map(d => (
                  <option key={d.deptId} value={d.deptId}>{d.kod} - {d.nama}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Unit / Bahagian
              </label>
              <input
                type="text"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Peranan Pengguna <span className="text-rose-500">*</span>
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-900 outline-hidden focus:border-blue-500"
              >
                {Object.entries(ROLE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status Akaun
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as UserStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-hidden focus:border-blue-500"
              >
                <option value="AKTIF">Aktif</option>
                <option value="TIDAK_AKTIF">Tidak Aktif</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
            >
              {userToEdit ? 'Simpan Perubahan' : 'Daftar Pengguna'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Toggle Status */}
      <ConfirmDialog
        isOpen={!!userToToggleStatus}
        onClose={() => setUserToToggleStatus(null)}
        onConfirm={() => {
          if (userToToggleStatus) {
            setUserStatus(userToToggleStatus.uid, userToToggleStatus.status === 'AKTIF' ? 'TIDAK_AKTIF' : 'AKTIF');
          }
        }}
        title="Ubah Status Akaun Pengguna"
        message={`Adakah anda pasti mahu ${userToToggleStatus?.status === 'AKTIF' ? 'menyahaktifkan' : 'mengaktifkan semula'} akaun ${userToToggleStatus?.nama}?`}
        confirmText="Ya, Ubah Status"
        cancelText="Batal"
        type={userToToggleStatus?.status === 'AKTIF' ? 'warning' : 'info'}
      />
    </div>
  );
};
