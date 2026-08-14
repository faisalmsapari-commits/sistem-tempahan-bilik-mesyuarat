import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_LABELS, STATUS_LABELS } from '../types/user';
import { User, Phone, Mail, Building, Briefcase, Shield, KeyRound, Save, CheckCircle2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUserProfile } = useAuth();
  const { success } = useToast();

  const [nama, setNama] = useState(currentUser?.nama || '');
  const [noTelefon, setNoTelefon] = useState(currentUser?.noTelefon || '');
  const [unit, setUnit] = useState(currentUser?.unit || '');
  const [gambarProfil, setGambarProfil] = useState(currentUser?.gambarProfil || '');

  // Change Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      nama,
      noTelefon,
      unit,
      gambarProfil
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Kata laluan baharu dan pengesahan tidak sepadan.');
      return;
    }
    setPasswordChangedSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    success('Kata Laluan Ditukar', 'Kata laluan akaun anda telah berjaya dikemaskini.');
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Profil Pengguna & Tetapan Akaun
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Kemaskini maklumat peribadi dan kata laluan akaun MPLBP e-BILIK anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card text-center space-y-4 flex flex-col items-center justify-center">
          <div className="relative">
            <img
              src={currentUser.gambarProfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.nama}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-600/20 shadow-lg"
            />
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-base">{currentUser.nama}</h3>
            <p className="text-xs text-slate-500 font-medium">{currentUser.jawatan}</p>
            <div className="mt-2 inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              {ROLE_LABELS[currentUser.role]}
            </div>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 text-left text-xs space-y-2 text-slate-600">
            <p><span className="text-slate-400">No. Staf:</span> <strong>{currentUser.noStaf}</strong></p>
            <p><span className="text-slate-400">Jabatan:</span> <strong>{currentUser.jabatanNama}</strong></p>
            <p><span className="text-slate-400">Status Akaun:</span> <span className="font-bold text-emerald-600">{STATUS_LABELS[currentUser.status]}</span></p>
          </div>
        </div>

        {/* Edit Profile Form (2 Cols) */}
        <div className="md:col-span-2 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Maklumat Profil Pengguna
          </h3>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Penuh
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alamat Emel Rasmi (Kekal)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.emel}
                  className="w-full px-4 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  No. Telefon Bimbit
                </label>
                <input
                  type="text"
                  required
                  value={noTelefon}
                  onChange={e => setNoTelefon(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Unit / Bahagian
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pautan URL Gambar Profil
                </label>
                <input
                  type="url"
                  value={gambarProfil}
                  onChange={e => setGambarProfil(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Maklumat Profil</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-card space-y-6">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-blue-600" />
          Tukar Kata Laluan Keselamatan
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kata Laluan Semasa
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kata Laluan Baharu
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Sahkan Kata Laluan Baharu
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 outline-hidden focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              Kemaskini Kata Laluan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
