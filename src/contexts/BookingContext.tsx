import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Booking, BookingStatus } from '../types/booking';
import { Room } from '../types/room';
import { Department } from '../types/department';
import { AppNotification } from '../types/notification';
import { AuditLog } from '../types/audit';
import { RoomMaintenance } from '../types/maintenance';
import { RoomServiceRequest, ServiceStatus } from '../types/service';
import { Holiday, SystemSettings } from '../types/settings';
import { UserProfile, UserRole } from '../types/user';
import { db } from '../database/mockDatabase';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface BookingContextType {
  bookings: Booking[];
  rooms: Room[];
  departments: Department[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  maintenances: RoomMaintenance[];
  services: RoomServiceRequest[];
  holidays: Holiday[];
  settings: SystemSettings;
  users: UserProfile[];

  // Bookings Actions
  createBooking: (data: Omit<Booking, 'bookingId' | 'noRujukan' | 'createdAt' | 'updatedAt'>) => Booking;
  updateBooking: (id: string, updates: Partial<Booking>) => Booking;
  cancelBooking: (id: string, reason: string) => Booking;
  approveBooking: (id: string, notes?: string) => Booking;
  rejectBooking: (id: string, reason: string) => Booking;
  returnBooking: (id: string, feedback: string) => Booking;
  checkIn: (refOrId: string) => Booking;
  checkOut: (id: string) => Booking;
  checkConflict: (roomId: string, tarikh: string, masaMula: string, masaTamat: string, excludeId?: string) => { hasConflict: boolean; conflictingBooking?: Booking; reason?: string };

  // Room Actions
  createRoom: (room: Omit<Room, 'roomId' | 'createdAt' | 'updatedAt'>) => Room;
  updateRoom: (id: string, updates: Partial<Room>) => Room;
  deleteRoom: (id: string) => void;

  // Department Actions
  createDepartment: (dept: Omit<Department, 'deptId' | 'createdAt' | 'updatedAt'>) => Department;
  updateDepartment: (id: string, updates: Partial<Department>) => Department;

  // Maintenance Actions
  createMaintenance: (maint: Omit<RoomMaintenance, 'maintId' | 'createdAt' | 'updatedAt'>) => RoomMaintenance;
  updateMaintenanceStatus: (id: string, status: 'BERJADUAL' | 'SEDANG_BERJALAN' | 'SELESAI' | 'DIBATALKAN') => void;

  // Service Actions
  updateServiceStatus: (bookingId: string, status: ServiceStatus) => void;

  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Settings & Holidays
  updateSettings: (updates: Partial<SystemSettings>) => SystemSettings;
  createHoliday: (holiday: Omit<Holiday, 'holidayId'>) => Holiday;
  deleteHoliday: (id: string) => void;

  // User Management
  createUser: (user: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>) => UserProfile;
  updateUser: (id: string, updates: Partial<UserProfile>) => UserProfile;
  setUserStatus: (id: string, status: 'AKTIF' | 'TIDAK_AKTIF') => UserProfile;

  // System Reset
  resetDatabase: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { success, error, info } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [maintenances, setMaintenances] = useState<RoomMaintenance[]>([]);
  const [services, setServices] = useState<RoomServiceRequest[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(db.getSettings());
  const [users, setUsers] = useState<UserProfile[]>([]);

  const refreshAll = useCallback(() => {
    setBookings([...db.getBookings()]);
    setRooms([...db.getRooms()]);
    setDepartments([...db.getDepartments()]);
    setNotifications([...db.getNotifications(currentUser?.uid)]);
    setAuditLogs([...db.getAuditLogs()]);
    setMaintenances([...db.getMaintenances()]);
    setServices([...db.getServices()]);
    setHolidays([...db.getHolidays()]);
    setSettings(db.getSettings());
    setUsers([...db.getUsers()]);
  }, [currentUser?.uid]);

  useEffect(() => {
    refreshAll();

    // Subscribe to storage changes
    const unsubBookings = db.subscribe('mplbp_ebilik_bookings', refreshAll);
    const unsubRooms = db.subscribe('mplbp_ebilik_rooms', refreshAll);
    const unsubUsers = db.subscribe('mplbp_ebilik_users', refreshAll);
    const unsubDepts = db.subscribe('mplbp_ebilik_departments', refreshAll);
    const unsubNotifs = db.subscribe('mplbp_ebilik_notifications', refreshAll);
    const unsubAudits = db.subscribe('mplbp_ebilik_audit_logs', refreshAll);
    const unsubMaint = db.subscribe('mplbp_ebilik_maintenance', refreshAll);
    const unsubSettings = db.subscribe('mplbp_ebilik_settings', refreshAll);
    const unsubHolidays = db.subscribe('mplbp_ebilik_holidays', refreshAll);

    return () => {
      unsubBookings();
      unsubRooms();
      unsubUsers();
      unsubDepts();
      unsubNotifs();
      unsubAudits();
      unsubMaint();
      unsubSettings();
      unsubHolidays();
    };
  }, [refreshAll]);

  // --- ACTIONS ---
  const handleCreateBooking = (data: Omit<Booking, 'bookingId' | 'noRujukan' | 'createdAt' | 'updatedAt'>): Booking => {
    try {
      const newBooking = db.createBooking(data);
      success('Tempahan Berjaya Dihantar', `Permohonan tempahan ${newBooking.noRujukan} telah dihantar untuk kelulusan.`);
      return newBooking;
    } catch (err: any) {
      error('Gagal Menempah', err.message || 'Ralat semasa menghantar tempahan.');
      throw err;
    }
  };

  const handleUpdateBooking = (id: string, updates: Partial<Booking>): Booking => {
    try {
      const updated = db.updateBooking(id, updates);
      success('Kemaskini Berjaya', `Tempahan ${updated.noRujukan} telah berjaya dikemaskini.`);
      return updated;
    } catch (err: any) {
      error('Gagal Kemaskini', err.message);
      throw err;
    }
  };

  const handleCancelBooking = (id: string, reason: string): Booking => {
    try {
      const cancelled = db.cancelBooking(id, reason);
      info('Tempahan Dibatalkan', `Tempahan ${cancelled.noRujukan} telah dibatalkan.`);
      return cancelled;
    } catch (err: any) {
      error('Gagal Membatalkan', err.message);
      throw err;
    }
  };

  const handleApproveBooking = (id: string, notes?: string): Booking => {
    try {
      const approved = db.approveBooking(id, notes);
      success('Permohonan Diluluskan', `Tempahan ${approved.noRujukan} telah diluluskan.`);
      return approved;
    } catch (err: any) {
      error('Gagal Meluluskan', err.message);
      throw err;
    }
  };

  const handleRejectBooking = (id: string, reason: string): Booking => {
    try {
      const rejected = db.rejectBooking(id, reason);
      info('Permohonan Ditolak', `Tempahan ${rejected.noRujukan} telah ditolak.`);
      return rejected;
    } catch (err: any) {
      error('Gagal Menolak', err.message);
      throw err;
    }
  };

  const handleReturnBooking = (id: string, feedback: string): Booking => {
    try {
      const returned = db.returnBooking(id, feedback);
      info('Permohonan Dipulangkan', `Tempahan ${returned.noRujukan} telah dipulangkan kepada pemohon.`);
      return returned;
    } catch (err: any) {
      error('Gagal Memulangkan', err.message);
      throw err;
    }
  };

  const handleCheckIn = (refOrId: string): Booking => {
    try {
      const checkedIn = db.checkInBooking(refOrId, currentUser?.nama);
      success('Daftar Masuk Berjaya', `Mesyuarat bagi ${checkedIn.roomName} (${checkedIn.noRujukan}) kini SEDANG DIGUNAKAN.`);
      return checkedIn;
    } catch (err: any) {
      error('Daftar Masuk Gagal', err.message);
      throw err;
    }
  };

  const handleCheckOut = (id: string): Booking => {
    try {
      const checkedOut = db.checkOutBooking(id);
      success('Daftar Keluar Selesai', `Status mesyuarat ${checkedOut.noRujukan} dikemaskini kepada SELESAI.`);
      return checkedOut;
    } catch (err: any) {
      error('Daftar Keluar Gagal', err.message);
      throw err;
    }
  };

  const handleCreateRoom = (room: Omit<Room, 'roomId' | 'createdAt' | 'updatedAt'>): Room => {
    try {
      const newRoom = db.createRoom(room);
      success('Bilik Ditambah', `Bilik mesyuarat "${newRoom.nama}" berjaya didaftarkan.`);
      return newRoom;
    } catch (err: any) {
      error('Gagal Menambah Bilik', err.message);
      throw err;
    }
  };

  const handleUpdateRoom = (id: string, updates: Partial<Room>): Room => {
    try {
      const updated = db.updateRoom(id, updates);
      success('Bilik Dikemaskini', `Maklumat bilik "${updated.nama}" berjaya disimpan.`);
      return updated;
    } catch (err: any) {
      error('Gagal Mengemaskini Bilik', err.message);
      throw err;
    }
  };

  const handleDeleteRoom = (id: string) => {
    try {
      db.deleteRoom(id);
      info('Bilik Dipadam', 'Bilik mesyuarat telah dikeluarkan dari sistem.');
    } catch (err: any) {
      error('Gagal Memadam Bilik', err.message);
    }
  };

  const handleCreateDepartment = (dept: Omit<Department, 'deptId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newDept = db.createDepartment(dept);
      success('Jabatan Ditambah', `Jabatan ${newDept.nama} berjaya ditambah.`);
      return newDept;
    } catch (err: any) {
      error('Ralat', err.message);
      throw err;
    }
  };

  const handleUpdateDepartment = (id: string, updates: Partial<Department>) => {
    try {
      const updated = db.updateDepartment(id, updates);
      success('Jabatan Dikemaskini', `Jabatan ${updated.nama} berjaya dikemaskini.`);
      return updated;
    } catch (err: any) {
      error('Ralat', err.message);
      throw err;
    }
  };

  const handleCreateMaintenance = (maint: Omit<RoomMaintenance, 'maintId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newM = db.createMaintenance(maint);
      success('Penyelenggaraan Dijadualkan', `Penyelenggaraan bagi ${maint.roomName} berjaya ditetapkan.`);
      return newM;
    } catch (err: any) {
      error('Ralat', err.message);
      throw err;
    }
  };

  const handleUpdateMaintenanceStatus = (id: string, status: 'BERJADUAL' | 'SEDANG_BERJALAN' | 'SELESAI' | 'DIBATALKAN') => {
    try {
      db.updateMaintenanceStatus(id, status);
      success('Status Penyelenggaraan Dikemaskini', `Status diubah kepada ${status}.`);
    } catch (err: any) {
      error('Ralat', err.message);
    }
  };

  const handleUpdateServiceStatus = (bookingId: string, status: ServiceStatus) => {
    try {
      db.updateServiceStatus(bookingId, status);
      success('Status Perkhidmatan Dikemaskini', `Status persediaan diubah kepada ${status}.`);
    } catch (err: any) {
      error('Ralat', err.message);
    }
  };

  const handleMarkNotification = (id: string) => {
    db.markNotificationAsRead(id);
  };

  const handleMarkAllNotifications = () => {
    if (currentUser) {
      db.markAllNotificationsAsRead(currentUser.uid);
      info('Notifikasi Dibaca', 'Semua notifikasi telah ditandakan sebagai dibaca.');
    }
  };

  const handleUpdateSettings = (updates: Partial<SystemSettings>) => {
    try {
      const updated = db.updateSettings(updates);
      success('Tetapan Disimpan', 'Tetapan polisi operasi MPLBP e-BILIK berjaya dikemaskini.');
      return updated;
    } catch (err: any) {
      error('Ralat', err.message);
      throw err;
    }
  };

  const handleCreateHoliday = (h: Omit<Holiday, 'holidayId'>) => {
    try {
      const hol = db.createHoliday(h);
      success('Cuti Ditambah', `${hol.namaCuti} (${hol.tarikh}) telah ditambah ke takwim.`);
      return hol;
    } catch (err: any) {
      error('Ralat', err.message);
      throw err;
    }
  };

  const handleDeleteHoliday = (id: string) => {
    try {
      db.deleteHoliday(id);
      info('Cuti Dipadam', 'Tarikh cuti telah dikeluarkan dari takwim.');
    } catch (err: any) {
      error('Ralat', err.message);
    }
  };

  const handleCreateUser = (u: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newUser = db.createUser(u);
      success('Pengguna Didaftarkan', `Pengguna ${newUser.nama} (${newUser.emel}) telah didaftarkan.`);
      return newUser;
    } catch (err: any) {
      error('Ralat Pendaftaran', err.message);
      throw err;
    }
  };

  const handleUpdateUser = (id: string, updates: Partial<UserProfile>) => {
    try {
      const updated = db.updateUser(id, updates);
      success('Pengguna Dikemaskini', `Maklumat ${updated.nama} berjaya dikemaskini.`);
      return updated;
    } catch (err: any) {
      error('Ralat', err.message);
      throw err;
    }
  };

  const handleSetUserStatus = (id: string, status: 'AKTIF' | 'TIDAK_AKTIF') => {
    try {
      const updated = db.setUserStatus(id, status);
      info('Status Pengguna Diubah', `Status akaun ${updated.nama} kini ${status}.`);
      return updated;
    } catch (err: any) {
      error('Ralat', err.message);
      throw err;
    }
  };

  const handleResetDatabase = () => {
    db.resetToSeedData();
    refreshAll();
    success('Pangkalan Data Diset Semula', 'Semua rekod demo MPLBP e-BILIK telah dimuatkan semula.');
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        rooms,
        departments,
        notifications,
        auditLogs,
        maintenances,
        services,
        holidays,
        settings,
        users,

        createBooking: handleCreateBooking,
        updateBooking: handleUpdateBooking,
        cancelBooking: handleCancelBooking,
        approveBooking: handleApproveBooking,
        rejectBooking: handleRejectBooking,
        returnBooking: handleReturnBooking,
        checkIn: handleCheckIn,
        checkOut: handleCheckOut,
        checkConflict: (roomId, tarikh, start, end, excludeId) => db.checkBookingConflict(roomId, tarikh, start, end, excludeId),

        createRoom: handleCreateRoom,
        updateRoom: handleUpdateRoom,
        deleteRoom: handleDeleteRoom,

        createDepartment: handleCreateDepartment,
        updateDepartment: handleUpdateDepartment,

        createMaintenance: handleCreateMaintenance,
        updateMaintenanceStatus: handleUpdateMaintenanceStatus,

        updateServiceStatus: handleUpdateServiceStatus,

        markNotificationAsRead: handleMarkNotification,
        markAllNotificationsAsRead: handleMarkAllNotifications,

        updateSettings: handleUpdateSettings,
        createHoliday: handleCreateHoliday,
        deleteHoliday: handleDeleteHoliday,

        createUser: handleCreateUser,
        updateUser: handleUpdateUser,
        setUserStatus: handleSetUserStatus,

        resetDatabase: handleResetDatabase
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking mesti digunakan dalam BookingProvider');
  return context;
};
