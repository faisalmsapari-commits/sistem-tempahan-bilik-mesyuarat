import React, { useState } from 'react';
import { UserRole, ROLE_LABELS } from '../../types/user';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, ChevronDown, Check, User, Users, FileCheck, Wrench, Sparkles } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { role: UserRole; icon: any; color: string; desc: string }[] = [
    {
      role: 'PENTADBIR_SISTEM',
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      desc: 'Akses penuh ke seluruh sistem & audit log'
    },
    {
      role: 'PELULUS',
      icon: FileCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      desc: 'Meneliti, melulus, menolak & memulangkan permohonan'
    },
    {
      role: 'URUS_SETIA',
      icon: Wrench,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      desc: 'Persediaan bilik, jamuan, status live & check-in'
    },
    {
      role: 'PENTADBIR_JABATAN',
      icon: Users,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      desc: 'Pengurusan bilik & tempahan jabatan'
    },
    {
      role: 'KAKITANGAN',
      icon: User,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      desc: 'Membuat tempahan baharu & lihat tempahan sendiri'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 text-xs font-semibold hover:bg-blue-100/70 transition-all shadow-sm"
        title="Tukar Peranan Pengguna untuk Menguji Akses"
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Peranan:</span>
        <span className="font-bold text-blue-700">
          {currentUser ? ROLE_LABELS[currentUser.role] : 'Pilih Peranan'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-blue-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 animate-fade-in">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tukar Peranan Pengguna (Demo)</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Uji kebenaran akses dan aliran kerja mengikut peranan.</p>
            </div>

            <div className="py-1.5 space-y-1">
              {roles.map(item => {
                const Icon = item.icon;
                const isSelected = currentUser?.role === item.role;
                return (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-3 transition-all ${
                      isSelected ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl border shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{ROLE_LABELS[item.role]}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
