import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { RoleSwitcher } from './RoleSwitcher';
import { formatMalayDateWithDay } from '../../utils/dateUtils';
import { ROLE_LABELS } from '../../types/user';
import {
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Clock,
  CheckCheck,
  Building,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onNavigate,
  currentPage
}) => {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, resetDatabase } = useBooking();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [timeString, setTimeString] = useState('');

  // Clock ticker in Asia/Kuala_Lumpur
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.dibaca).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 via-blue-800 to-sky-600 flex items-center justify-center text-white shadow-md shadow-blue-950/20 group-hover:scale-105 transition-transform">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">MPLBP</span>
                <span className="font-extrabold text-base tracking-tight text-blue-600">e-BILIK</span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.2 rounded-md">
                  PBT
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight hidden md:block">
                Majlis Perbandaran Langkawi Bandaraya Pelancongan
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Live Clock & Date */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{formatMalayDateWithDay(new Date())}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{timeString}</span>
          </div>
        </div>

        {/* Right Side: Role Switcher, Notifications, User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Role Switcher */}
          <RoleSwitcher />

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Adakah anda pasti mahu menetapkan semula pangkalan data kepada data demo asal?')) {
                resetDatabase();
              }
            }}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors hidden sm:flex items-center"
            title="Set Semula Data Demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Pemberitahuan"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pemberitahuan</h4>
                      <p className="text-[11px] text-slate-500">{unreadCount} belum dibaca</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsAsRead()}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Tanda Semua
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        Tiada pemberitahuan pada masa ini.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map(notif => (
                        <div
                          key={notif.notifId}
                          onClick={() => {
                            markNotificationAsRead(notif.notifId);
                            if (notif.bookingId) {
                              onNavigate('my-bookings');
                            }
                            setShowNotifications(false);
                          }}
                          className={`p-3.5 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                            !notif.dibaca ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className={`text-xs font-bold ${!notif.dibaca ? 'text-blue-950' : 'text-slate-700'}`}>
                              {notif.tajuk}
                            </h5>
                            {!notif.dibaca && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                            {notif.mesej}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1.5 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                    <button
                      onClick={() => {
                        onNavigate('notifications');
                        setShowNotifications(false);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 py-1"
                    >
                      Lihat Semua Pemberitahuan &rarr;
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200/60"
            >
              <img
                src={currentUser?.gambarProfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.nama || 'Pengguna'}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-600/20"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-800 leading-tight line-clamp-1">
                  {currentUser?.nama || 'Pengguna MPLBP'}
                </p>
                <p className="text-[10px] font-medium text-slate-500 line-clamp-1">
                  {currentUser ? ROLE_LABELS[currentUser.role] : 'Akaun'}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 animate-fade-in">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser?.nama}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.emel}</p>
                    <div className="mt-1.5 inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {currentUser ? ROLE_LABELS[currentUser.role] : ''}
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profil Saya
                    </button>
                    {currentUser?.role === 'PENTADBIR_SISTEM' && (
                      <button
                        onClick={() => {
                          onNavigate('admin-settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
                      >
                        <Shield className="w-4 h-4 text-slate-400" />
                        Tetapan Pentadbir
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Log Keluar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
