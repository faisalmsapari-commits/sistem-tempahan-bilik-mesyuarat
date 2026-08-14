import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '../types/user';
import { db } from '../database/mockDatabase';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUserProfile: (data: Partial<UserProfile>) => void;
  resetPasswordRequest: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error, info } = useToast();

  const loadUser = useCallback(() => {
    const user = db.getCurrentUser();
    if (user && user.status === 'AKTIF') {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
    const unsub = db.subscribe('mplbp_ebilik_current_uid', loadUser);
    return () => unsub();
  }, [loadUser]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate brief network authentication
    await new Promise(resolve => setTimeout(resolve, 400));

    const user = db.getUserByEmail(email);

    if (!user) {
      error('Log Masuk Gagal', 'Emel tidak ditemui dalam rekod MPLBP. Sila semak emel anda.');
      setIsLoading(false);
      return false;
    }

    if (user.status === 'TIDAK_AKTIF') {
      error('Akaun Dinyahaktifkan', 'Akaun anda tidak aktif. Sila hubungi Pentadbir Sistem MPLBP.');
      setIsLoading(false);
      return false;
    }

    db.setCurrentUserId(user.uid);
    db.logAudit({
      userId: user.uid,
      tindakan: 'LOG_MASUK',
      modul: 'AUTH',
      rekodId: user.uid,
      keterangan: `Pengguna ${user.nama} (${user.emel}) berjaya log masuk.`
    });

    setCurrentUser(user);
    setIsLoading(false);
    success('Log Masuk Berjaya', `Selamat kembali, ${user.nama}.`);
    return true;
  };

  const logout = () => {
    if (currentUser) {
      db.logAudit({
        userId: currentUser.uid,
        tindakan: 'LOG_KELUAR',
        modul: 'AUTH',
        rekodId: currentUser.uid,
        keterangan: `Pengguna ${currentUser.nama} log keluar daripada sistem.`
      });
    }
    // Switch to null or staff for testing
    localStorage.removeItem('mplbp_ebilik_current_uid');
    setCurrentUser(null);
    info('Log Keluar', 'Anda telah berjaya log keluar dari sistem MPLBP e-BILIK.');
  };

  const switchRole = (role: UserRole) => {
    const users = db.getUsers();
    const targetUser = users.find(u => u.role === role && u.status === 'AKTIF');
    if (targetUser) {
      db.setCurrentUserId(targetUser.uid);
      setCurrentUser(targetUser);
      info('Peranan Ditukar', `Kini melihat sistem sebagai: ${targetUser.nama} (${role})`);
    } else {
      error('Gagal Menukar Peranan', `Tiada akaun pengguna aktif ditemui bagi peranan ${role}.`);
    }
  };

  const updateCurrentUserProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const updated = db.updateUser(currentUser.uid, data);
      setCurrentUser(updated);
      success('Profil Dikemaskini', 'Maklumat profil anda telah berjaya disimpan.');
    } catch (err: any) {
      error('Ralat', err.message || 'Gagal mengemaskini profil.');
    }
  };

  const resetPasswordRequest = async (email: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    const user = db.getUserByEmail(email);
    if (!user) {
      error('Emel Tidak Ditemui', 'Tiada akaun berdaftar dengan alamat emel tersebut.');
      return false;
    }

    db.logAudit({
      userId: user.uid,
      tindakan: 'RESET_KATA_LALUAN',
      modul: 'AUTH',
      rekodId: user.uid,
      keterangan: `Permintaan pautan tetapan semula kata laluan dihantar ke emel ${email}.`
    });

    success('Pautan Dihantar', `Pautan tetapan semula kata laluan telah dihantar ke emel ${email}. Sila semak peti masuk anda.`);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        switchRole,
        updateCurrentUserProfile,
        resetPasswordRequest
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth mesti digunakan dalam AuthProvider');
  return context;
};
