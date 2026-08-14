import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building, Lock, Mail, ShieldCheck, Sparkles, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { UserRole, ROLE_LABELS } from '../types/user';

export const LoginPage: React.FC = () => {
  const { login, resetPasswordRequest } = useAuth();

  const [email, setEmail] = useState('admin@mplbp.gov.my');
  const [password, setPassword] = useState('mplbp2026');
  const [isLoading, setIsLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('mplbp2026');
    login(demoEmail, 'mplbp2026');
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsSendingReset(true);
    const ok = await resetPasswordRequest(forgotEmail);
    setIsSendingReset(false);
    if (ok) {
      setShowForgotModal(false);
      setForgotEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Emblem & Brand */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 text-white shadow-2xl shadow-blue-500/30 ring-4 ring-white/10 mb-4 animate-bounce-slow">
          <Building className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          MPLBP <span className="text-sky-400">e-BILIK</span>
        </h1>
        <p className="mt-1 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Sistem Pengurusan Tempahan Bilik Mesyuarat Bersepadu
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Majlis Perbandaran Langkawi Bandaraya Pelancongan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-white/20">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Emel Rasmi MPLBP
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="nama@mplbp.gov.my"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:border-blue-600 focus:bg-white text-xs font-medium text-slate-800 transition-all outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Kata Laluan
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Lupa Kata Laluan?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:border-blue-600 focus:bg-white text-xs font-medium text-slate-800 transition-all outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-sky-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-700/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {isLoading ? (
                <span>Mengesahkan...</span>
              ) : (
                <>
                  <span>LOG MASUK SISTEM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-3 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Akses Pantas Mengikut Peranan (Demo):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@mplbp.gov.my')}
                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-[11px] font-bold text-left transition-colors"
              >
                1. Pentadbir Sistem
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('pelulus@mplbp.gov.my')}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-[11px] font-bold text-left transition-colors"
              >
                2. Pegawai Pelulus
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('urussetia@mplbp.gov.my')}
                className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-[11px] font-bold text-left transition-colors"
              >
                3. Urus Setia Fasiliti
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('deptadmin@mplbp.gov.my')}
                className="p-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 rounded-xl text-[11px] font-bold text-left transition-colors"
              >
                4. Pentadbir Jabatan
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('kakitangan@mplbp.gov.my')}
                className="col-span-2 p-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-[11px] font-bold text-center transition-colors"
              >
                5. Kakitangan Pengguna (Tempahan Bilik)
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-400 font-medium">
          Hak Cipta Terpelihara &copy; 2026 Majlis Perbandaran Langkawi Bandaraya Pelancongan.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Lupa Kata Laluan</h3>
                <p className="text-xs text-slate-500">Tetapkan semula kata laluan anda</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Masukkan alamat emel rasmi MPLBP anda. Sistem akan menghantar pautan pengesahan untuk menetapkan semula kata laluan anda.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="nama@mplbp.gov.my"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-hidden focus:border-blue-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  {isSendingReset ? 'Menghantar...' : 'Hantar Pautan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
