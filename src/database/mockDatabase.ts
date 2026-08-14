import { UserProfile, UserRole, UserStatus } from '../types/user';
import { Room } from '../types/room';
import { Department } from '../types/department';
import { Booking, BookingStatus } from '../types/booking';
import { Holiday, SystemSettings } from '../types/settings';
import { RoomMaintenance } from '../types/maintenance';
import { RoomServiceRequest } from '../types/service';
import { AppNotification, NotificationType } from '../types/notification';
import { AuditLog, AuditAction, AuditModule } from '../types/audit';
import {
  SEED_USERS,
  SEED_ROOMS,
  SEED_DEPARTMENTS,
  SEED_BOOKINGS,
  SEED_HOLIDAYS,
  SEED_SETTINGS,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS,
  SEED_MAINTENANCE
} from './seedData';

const STORAGE_KEYS = {
  USERS: 'mplbp_ebilik_users',
  ROOMS: 'mplbp_ebilik_rooms',
  DEPARTMENTS: 'mplbp_ebilik_departments',
  BOOKINGS: 'mplbp_ebilik_bookings',
  HOLIDAYS: 'mplbp_ebilik_holidays',
  SETTINGS: 'mplbp_ebilik_settings',
  NOTIFICATIONS: 'mplbp_ebilik_notifications',
  AUDIT_LOGS: 'mplbp_ebilik_audit_logs',
  MAINTENANCE: 'mplbp_ebilik_maintenance',
  CURRENT_USER_ID: 'mplbp_ebilik_current_uid',
  INITIALIZED: 'mplbp_ebilik_initialized_v1'
};

class MockDatabase {
  private listeners: Map<string, Set<() => void>> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.resetToSeedData();
    }
  }

  public resetToSeedData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(SEED_ROOMS));
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(SEED_DEPARTMENTS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(SEED_HOLIDAYS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(SEED_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(SEED_MAINTENANCE));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-admin');
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    this.notifyAll();
  }

  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    this.notify(key);
  }

  // Reactive listeners for live UI updates
  public subscribe(key: string, callback: () => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  private notify(key: string) {
    this.listeners.get(key)?.forEach(cb => cb());
  }

  private notifyAll() {
    this.listeners.forEach(cbs => cbs.forEach(cb => cb()));
  }

  // --- USERS & AUTH ---
  public getUsers(): UserProfile[] {
    return this.getItem<UserProfile[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  public getUserById(uid: string): UserProfile | undefined {
    return this.getUsers().find(u => u.uid === uid);
  }

  public getUserByEmail(email: string): UserProfile | undefined {
    return this.getUsers().find(u => u.emel.toLowerCase() === email.toLowerCase());
  }

  public getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-admin';
  }

  public setCurrentUserId(uid: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, uid);
    this.notify(STORAGE_KEYS.CURRENT_USER_ID);
  }

  public getCurrentUser(): UserProfile | undefined {
    return this.getUserById(this.getCurrentUserId());
  }

  public updateUser(uid: string, updates: Partial<UserProfile>): UserProfile {
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index === -1) throw new Error('Pengguna tidak ditemui.');
    
    const updatedUser: UserProfile = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    users[index] = updatedUser;
    this.setItem(STORAGE_KEYS.USERS, users);
    
    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'KEMASKINI_PENGGUNA',
      modul: 'PENGGUNA',
      rekodId: uid,
      keterangan: `Mengemaskini maklumat profil pengguna ${updatedUser.nama} (${updatedUser.emel}).`
    });

    return updatedUser;
  }

  public createUser(user: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>): UserProfile {
    const users = this.getUsers();
    if (users.some(u => u.emel.toLowerCase() === user.emel.toLowerCase())) {
      throw new Error('Emel pengguna ini telah wujud dalam sistem.');
    }

    const newUser: UserProfile = {
      ...user,
      uid: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    this.setItem(STORAGE_KEYS.USERS, users);

    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'CIPTA_PENGGUNA',
      modul: 'PENGGUNA',
      rekodId: newUser.uid,
      keterangan: `Mendaftar pengguna baharu ${newUser.nama} (${newUser.emel}) dengan peranan ${newUser.role}.`
    });

    return newUser;
  }

  public setUserStatus(uid: string, status: UserStatus): UserProfile {
    const user = this.updateUser(uid, { status });
    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: status === 'AKTIF' ? 'KEMASKINI_PENGGUNA' : 'NYAHAKTIF_PENGGUNA',
      modul: 'PENGGUNA',
      rekodId: uid,
      keterangan: `Mengubah status pengguna ${user.nama} kepada ${status}.`
    });
    return user;
  }

  // --- ROOMS ---
  public getRooms(): Room[] {
    return this.getItem<Room[]>(STORAGE_KEYS.ROOMS, SEED_ROOMS);
  }

  public getRoomById(roomId: string): Room | undefined {
    return this.getRooms().find(r => r.roomId === roomId);
  }

  public createRoom(room: Omit<Room, 'roomId' | 'createdAt' | 'updatedAt'>): Room {
    const rooms = this.getRooms();
    const newRoom: Room = {
      ...room,
      roomId: `room-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    rooms.push(newRoom);
    this.setItem(STORAGE_KEYS.ROOMS, rooms);

    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'CIPTA_BILIK',
      modul: 'BILIK',
      rekodId: newRoom.roomId,
      keterangan: `Menambah bilik mesyuarat baharu: ${newRoom.nama} (${newRoom.kodBilik}).`
    });

    return newRoom;
  }

  public updateRoom(roomId: string, updates: Partial<Room>): Room {
    const rooms = this.getRooms();
    const index = rooms.findIndex(r => r.roomId === roomId);
    if (index === -1) throw new Error('Bilik mesyuarat tidak ditemui.');

    const updatedRoom: Room = {
      ...rooms[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    rooms[index] = updatedRoom;
    this.setItem(STORAGE_KEYS.ROOMS, rooms);

    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'KEMASKINI_BILIK',
      modul: 'BILIK',
      rekodId: roomId,
      keterangan: `Mengemaskini maklumat bilik mesyuarat ${updatedRoom.nama}.`
    });

    return updatedRoom;
  }

  public deleteRoom(roomId: string) {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.roomId === roomId);
    const filtered = rooms.filter(r => r.roomId !== roomId);
    this.setItem(STORAGE_KEYS.ROOMS, filtered);

    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'PADAM_BILIK',
      modul: 'BILIK',
      rekodId: roomId,
      keterangan: `Memadam bilik mesyuarat ${room?.nama || roomId}.`
    });
  }

  // --- DEPARTMENTS ---
  public getDepartments(): Department[] {
    return this.getItem<Department[]>(STORAGE_KEYS.DEPARTMENTS, SEED_DEPARTMENTS);
  }

  public createDepartment(dept: Omit<Department, 'deptId' | 'createdAt' | 'updatedAt'>): Department {
    const depts = this.getDepartments();
    const newDept: Department = {
      ...dept,
      deptId: `dept-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    depts.push(newDept);
    this.setItem(STORAGE_KEYS.DEPARTMENTS, depts);
    return newDept;
  }

  public updateDepartment(deptId: string, updates: Partial<Department>): Department {
    const depts = this.getDepartments();
    const idx = depts.findIndex(d => d.deptId === deptId);
    if (idx === -1) throw new Error('Jabatan tidak ditemui.');
    depts[idx] = { ...depts[idx], ...updates, updatedAt: new Date().toISOString() };
    this.setItem(STORAGE_KEYS.DEPARTMENTS, depts);
    return depts[idx];
  }

  // --- BOOKINGS & CONFLICT DETECTION ---
  public getBookings(): Booking[] {
    return this.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
  }

  public getBookingById(bookingId: string): Booking | undefined {
    return this.getBookings().find(b => b.bookingId === bookingId);
  }

  public generateReferenceNo(): string {
    const year = new Date().getFullYear();
    const bookings = this.getBookings();
    const count = bookings.length + 101;
    return `MB-${year}-${String(count).padStart(6, '0')}`;
  }

  /**
   * Semakan Pertindihan Kritikal (Conflict Detection Engine)
   * Logik: newStart < existingEnd AND newEnd > existingStart
   * untuk bilik yang sama, tarikh yang sama, dan status yang masih aktif/sah.
   */
  public checkBookingConflict(
    roomId: string,
    tarikh: string,
    masaMula: string,
    masaTamat: string,
    excludeBookingId?: string
  ): { hasConflict: boolean; conflictingBooking?: Booking; reason?: string } {
    const bookings = this.getBookings();
    const activeStatuses: BookingStatus[] = [
      'DRAF',
      'MENUNGGU_KELULUSAN',
      'DILULUSKAN',
      'SEDANG_DIGUNAKAN'
    ];

    // Semak penyelenggaraan bilik
    const maintenances = this.getMaintenances();
    const maintenanceConflict = maintenances.find(m => 
      m.roomId === roomId &&
      m.status !== 'DIBATALKAN' &&
      m.status !== 'SELESAI' &&
      tarikh >= m.tarikhMula &&
      tarikh <= m.tarikhTamat
    );

    if (maintenanceConflict) {
      return {
        hasConflict: true,
        reason: `Bilik ini berada dalam status penyelenggaraan pada tarikh tersebut (${maintenanceConflict.sebab}).`
      };
    }

    // Semak pertindihan tempahan lain
    const conflict = bookings.find(b => {
      if (b.roomId !== roomId) return false;
      if (b.tarikh !== tarikh) return false;
      if (excludeBookingId && b.bookingId === excludeBookingId) return false;
      if (!activeStatuses.includes(b.status)) return false;

      // Conflict logic: (newStart < existingEnd && newEnd > existingStart)
      return masaMula < b.masaTamat && masaTamat > b.masaMula;
    });

    if (conflict) {
      return {
        hasConflict: true,
        conflictingBooking: conflict,
        reason: `Bilik ini telah ditempah untuk "${conflict.tajukMesyuarat}" dari jam ${conflict.masaMula} hingga ${conflict.masaTamat} (${conflict.noRujukan}).`
      };
    }

    return { hasConflict: false };
  }

  public createBooking(bookingData: Omit<Booking, 'bookingId' | 'noRujukan' | 'createdAt' | 'updatedAt'>): Booking {
    // Check conflicts
    const conflictCheck = this.checkBookingConflict(
      bookingData.roomId,
      bookingData.tarikh,
      bookingData.masaMula,
      bookingData.masaTamat
    );

    if (conflictCheck.hasConflict) {
      throw new Error(conflictCheck.reason || 'Bilik telah ditempah pada waktu tersebut.');
    }

    const room = this.getRoomById(bookingData.roomId);
    if (!room) throw new Error('Bilik tidak sah.');
    if (room.status !== 'AKTIF') throw new Error('Bilik ini tidak aktif atau dalam penyelenggaraan.');

    const bookings = this.getBookings();
    const noRujukan = this.generateReferenceNo();
    const bookingId = `bk-${Date.now()}`;

    const newBooking: Booking = {
      ...bookingData,
      bookingId,
      noRujukan,
      roomName: room.nama,
      roomColor: room.warna,
      qrCodeData: `MPLBP-${noRujukan}-VERIFIED`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    this.setItem(STORAGE_KEYS.BOOKINGS, bookings);

    // Auto-create service request for Urus Setia
    this.createServiceRequestFromBooking(newBooking);

    // Notify Approvers
    this.createNotification({
      userId: 'user-approver',
      tajuk: 'Permohonan Tempahan Baharu',
      mesej: `${newBooking.userName} (${newBooking.jabatanNama}) telah memohon tempahan ${room.nama} pada ${newBooking.tarikh} (${newBooking.masaMula} - ${newBooking.masaTamat}). No Rujukan: ${noRujukan}.`,
      jenis: 'TEMPAHAN_BARU',
      bookingId: newBooking.bookingId,
      noRujukan: newBooking.noRujukan
    });

    // Notify Urus Setia
    this.createNotification({
      userId: 'user-secretariat',
      tajuk: 'Tempahan Bilik Baharu Dijana',
      mesej: `Permohonan tempahan baharu ${room.nama} pada ${newBooking.tarikh} memerlukan semakan persediaan fasiliti.`,
      jenis: 'TEMPAHAN_BARU',
      bookingId: newBooking.bookingId,
      noRujukan: newBooking.noRujukan
    });

    // Log audit
    this.logAudit({
      userId: newBooking.userId,
      tindakan: 'CIPTA_TEMPAHAN',
      modul: 'TEMPAHAN',
      rekodId: newBooking.bookingId,
      keterangan: `Mencipta tempahan bilik ${room.nama} bagi mesyuarat "${newBooking.tajukMesyuarat}" (${noRujukan}).`,
      maklumatTambahan: { tarikh: newBooking.tarikh, masaMula: newBooking.masaMula, masaTamat: newBooking.masaTamat }
    });

    return newBooking;
  }

  public updateBooking(bookingId: string, updates: Partial<Booking>): Booking {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.bookingId === bookingId);
    if (index === -1) throw new Error('Tempahan tidak ditemui.');

    const current = bookings[index];

    // If date/time/room changed, re-verify conflict
    if (
      (updates.roomId && updates.roomId !== current.roomId) ||
      (updates.tarikh && updates.tarikh !== current.tarikh) ||
      (updates.masaMula && updates.masaMula !== current.masaMula) ||
      (updates.masaTamat && updates.masaTamat !== current.masaTamat)
    ) {
      const conflict = this.checkBookingConflict(
        updates.roomId || current.roomId,
        updates.tarikh || current.tarikh,
        updates.masaMula || current.masaMula,
        updates.masaTamat || current.masaTamat,
        bookingId
      );
      if (conflict.hasConflict) {
        throw new Error(conflict.reason || 'Bilik telah ditempah pada waktu tersebut.');
      }
    }

    const updatedBooking: Booking = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    bookings[index] = updatedBooking;
    this.setItem(STORAGE_KEYS.BOOKINGS, bookings);

    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'KEMASKINI_TEMPAHAN',
      modul: 'TEMPAHAN',
      rekodId: bookingId,
      keterangan: `Mengemaskini maklumat tempahan ${updatedBooking.noRujukan} ("${updatedBooking.tajukMesyuarat}").`
    });

    return updatedBooking;
  }

  public cancelBooking(bookingId: string, reason: string): Booking {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Tempahan tidak ditemui.');

    const updated = this.updateBooking(bookingId, {
      status: 'DIBATALKAN',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString()
    });

    // Notify applicant
    this.createNotification({
      userId: booking.userId,
      tajuk: 'Tempahan Dibatalkan',
      mesej: `Tempahan anda bagi ${booking.roomName} pada ${booking.tarikh} (${booking.noRujukan}) telah DIBATALKAN. Sebab: ${reason}.`,
      jenis: 'TEMPAHAN_DIBATALKAN',
      bookingId: booking.bookingId,
      noRujukan: booking.noRujukan
    });

    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'BATAL_TEMPAHAN',
      modul: 'TEMPAHAN',
      rekodId: bookingId,
      keterangan: `Membatalkan tempahan ${booking.noRujukan}. Alasan: ${reason}.`
    });

    return updated;
  }

  // --- APPROVAL WORKFLOW ---
  public approveBooking(bookingId: string, approverNotes?: string): Booking {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Tempahan tidak ditemui.');

    const approver = this.getCurrentUser();

    const updated = this.updateBooking(bookingId, {
      status: 'DILULUSKAN',
      approvedBy: approver?.uid || 'user-approver',
      approvedByName: approver?.nama || 'Pegawai Pelulus',
      approvedAt: new Date().toISOString(),
      approvalNotes: approverNotes || 'Permohonan diluluskan.'
    });

    // Notify applicant
    this.createNotification({
      userId: booking.userId,
      tajuk: 'Permohonan Tempahan Diluluskan',
      mesej: `Tahniah! Tempahan anda bagi ${booking.roomName} pada ${booking.tarikh} (${booking.noRujukan}) telah DILULUSKAN oleh ${approver?.nama || 'Pegawai Pelulus'}. Sila guna Kod QR semasa sesi mesyuarat.`,
      jenis: 'TEMPAHAN_DILULUSKAN',
      bookingId: booking.bookingId,
      noRujukan: booking.noRujukan
    });

    this.logAudit({
      userId: approver?.uid || 'user-approver',
      tindakan: 'LULUS_TEMPAHAN',
      modul: 'KELULUSAN',
      rekodId: bookingId,
      keterangan: `Meluluskan tempahan ${booking.noRujukan} ("${booking.tajukMesyuarat}").`
    });

    return updated;
  }

  public rejectBooking(bookingId: string, reason: string): Booking {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Alasan penolakan adalah wajib diisi.');
    }

    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Tempahan tidak ditemui.');

    const approver = this.getCurrentUser();

    const updated = this.updateBooking(bookingId, {
      status: 'DITOLAK',
      rejectedReason: reason,
      approvedBy: approver?.uid || 'user-approver',
      approvedByName: approver?.nama || 'Pegawai Pelulus',
      approvedAt: new Date().toISOString()
    });

    this.createNotification({
      userId: booking.userId,
      tajuk: 'Permohonan Tempahan Ditolak',
      mesej: `Dukacita dimaklumkan bahawa tempahan ${booking.roomName} pada ${booking.tarikh} (${booking.noRujukan}) telah DITOLAK. Sebab penolakan: ${reason}.`,
      jenis: 'TEMPAHAN_DITOLAK',
      bookingId: booking.bookingId,
      noRujukan: booking.noRujukan
    });

    this.logAudit({
      userId: approver?.uid || 'user-approver',
      tindakan: 'TOLAK_TEMPAHAN',
      modul: 'KELULUSAN',
      rekodId: bookingId,
      keterangan: `Menolak permohonan tempahan ${booking.noRujukan}. Alasan: ${reason}.`
    });

    return updated;
  }

  public returnBooking(bookingId: string, feedback: string): Booking {
    if (!feedback || feedback.trim().length === 0) {
      throw new Error('Ulasan pembetulan adalah wajib diisi.');
    }

    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Tempahan tidak ditemui.');

    const approver = this.getCurrentUser();

    const updated = this.updateBooking(bookingId, {
      status: 'DIPULANGKAN',
      returnFeedback: feedback,
      approvedBy: approver?.uid || 'user-approver',
      approvedByName: approver?.nama || 'Pegawai Pelulus',
      approvedAt: new Date().toISOString()
    });

    this.createNotification({
      userId: booking.userId,
      tajuk: 'Permohonan Tempahan Dipulangkan untuk Pembetulan',
      mesej: `Permohonan tempahan ${booking.roomName} (${booking.noRujukan}) dipulangkan untuk semakan/pembetulan: "${feedback}". Sila kemaskini dan hantar semula.`,
      jenis: 'TEMPAHAN_DIPULANGKAN',
      bookingId: booking.bookingId,
      noRujukan: booking.noRujukan
    });

    this.logAudit({
      userId: approver?.uid || 'user-approver',
      tindakan: 'PULANG_TEMPAHAN',
      modul: 'KELULUSAN',
      rekodId: bookingId,
      keterangan: `Memulangkan tempahan ${booking.noRujukan} untuk pembetulan. Ulasan: ${feedback}.`
    });

    return updated;
  }

  // --- QR CHECK-IN & CHECK-OUT ---
  public checkInBooking(bookingRefOrId: string, checkedByName?: string): Booking {
    const bookings = this.getBookings();
    const booking = bookings.find(b => 
      b.bookingId === bookingRefOrId || 
      b.noRujukan === bookingRefOrId ||
      b.qrCodeData === bookingRefOrId
    );

    if (!booking) throw new Error('Tempahan atau Kod QR tidak sah / tidak ditemui.');

    if (booking.status === 'DIBATALKAN') {
      throw new Error('Tempahan ini telah dibatalkan dan tidak boleh didaftar masuk.');
    }

    if (booking.status === 'DITOLAK') {
      throw new Error('Tempahan ini telah ditolak oleh Pegawai Pelulus.');
    }

    if (booking.status !== 'DILULUSKAN' && booking.status !== 'SEDANG_DIGUNAKAN') {
      throw new Error(`Status tempahan (${booking.status}) tidak membenarkan pendaftaran masuk.`);
    }

    const currentUserName = checkedByName || this.getCurrentUser()?.nama || booking.userName;

    const updated = this.updateBooking(booking.bookingId, {
      status: 'SEDANG_DIGUNAKAN',
      checkInAt: new Date().toISOString(),
      checkedInBy: currentUserName
    });

    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'CHECK_IN',
      modul: 'TEMPAHAN',
      rekodId: booking.bookingId,
      keterangan: `Daftar masuk berjaya untuk tempahan ${booking.noRujukan} (${booking.roomName}) oleh ${currentUserName}.`
    });

    return updated;
  }

  public checkOutBooking(bookingId: string): Booking {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Tempahan tidak ditemui.');

    const updated = this.updateBooking(bookingId, {
      status: 'SELESAI',
      checkOutAt: new Date().toISOString()
    });

    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'CHECK_OUT',
      modul: 'TEMPAHAN',
      rekodId: bookingId,
      keterangan: `Daftar keluar selesai bagi tempahan ${booking.noRujukan} (${booking.roomName}).`
    });

    return updated;
  }

  // --- URUS SETIA SERVICES ---
  public getServices(): RoomServiceRequest[] {
    const bookings = this.getBookings();
    return bookings.map(b => ({
      serviceId: `svc-${b.bookingId}`,
      bookingId: b.bookingId,
      noRujukan: b.noRujukan,
      roomId: b.roomId,
      roomName: b.roomName || 'Bilik Mesyuarat',
      tarikh: b.tarikh,
      masaMula: b.masaMula,
      masaTamat: b.masaTamat,
      tajukMesyuarat: b.tajukMesyuarat,
      pemohonNama: b.userName,
      pemohonTelefon: b.userPhone,
      jabatanNama: b.jabatanNama,
      susunanMeja: b.perkhidmatan?.susunanMeja || 'BENTUK_U',
      bilanganKerusi: b.perkhidmatan?.bilanganKerusi || b.bilanganPeserta,
      peralatanAudio: b.peralatan?.sistemAudio || false,
      mikrofonQty: b.peralatan?.mikrofonKuantiti || 0,
      projektor: b.peralatan?.projektor || false,
      persidanganVideo: b.peralatan?.persidanganVideo || false,
      minuman: b.perkhidmatan?.minuman || false,
      jamuanRingan: b.perkhidmatan?.jamuanRingan || false,
      kebersihan: b.perkhidmatan?.kebersihanKhas || false,
      catatan: b.perkhidmatan?.catatanKhidmat || b.peralatan?.catatanPeralatan,
      status: b.serviceStatus || 'MENUNGGU',
      createdAt: b.createdAt,
      updatedAt: b.updatedAt
    }));
  }

  private createServiceRequestFromBooking(booking: Booking) {
    // Automatically tracked via booking.serviceStatus
  }

  public updateServiceStatus(bookingId: string, status: 'MENUNGGU' | 'DALAM_PROSES' | 'SELESAI') {
    this.updateBooking(bookingId, { serviceStatus: status });
  }

  // --- MAINTENANCE ---
  public getMaintenances(): RoomMaintenance[] {
    return this.getItem<RoomMaintenance[]>(STORAGE_KEYS.MAINTENANCE, SEED_MAINTENANCE);
  }

  public createMaintenance(maint: Omit<RoomMaintenance, 'maintId' | 'createdAt' | 'updatedAt'>): RoomMaintenance {
    const list = this.getMaintenances();
    const newMaint: RoomMaintenance = {
      ...maint,
      maintId: `maint-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newMaint);
    this.setItem(STORAGE_KEYS.MAINTENANCE, list);

    // Set room status to PENYELENGGARAAN
    this.updateRoom(maint.roomId, { status: 'PENYELENGGARAAN' });

    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'PENYELENGGARAAN_BILIK',
      modul: 'PENYELENGGARAAN',
      rekodId: newMaint.maintId,
      keterangan: `Menjadualkan penyelenggaraan untuk ${maint.roomName} dari ${maint.tarikhMula} hingga ${maint.tarikhTamat} (${maint.sebab}).`
    });

    return newMaint;
  }

  public updateMaintenanceStatus(maintId: string, status: 'BERJADUAL' | 'SEDANG_BERJALAN' | 'SELESAI' | 'DIBATALKAN') {
    const list = this.getMaintenances();
    const idx = list.findIndex(m => m.maintId === maintId);
    if (idx === -1) throw new Error('Rekod penyelenggaraan tidak ditemui.');
    list[idx] = { ...list[idx], status, updatedAt: new Date().toISOString() };
    this.setItem(STORAGE_KEYS.MAINTENANCE, list);

    if (status === 'SELESAI' || status === 'DIBATALKAN') {
      this.updateRoom(list[idx].roomId, { status: 'AKTIF' });
    }
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId?: string): AppNotification[] {
    const all = this.getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    if (!userId) return all;
    return all.filter(n => n.userId === userId || n.userId === 'ALL');
  }

  public createNotification(notif: Omit<AppNotification, 'notifId' | 'dibaca' | 'createdAt'>): AppNotification {
    const list = this.getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    const newNotif: AppNotification = {
      ...notif,
      notifId: `notif-${Date.now()}`,
      dibaca: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newNotif);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    return newNotif;
  }

  public markNotificationAsRead(notifId: string) {
    const list = this.getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    const idx = list.findIndex(n => n.notifId === notifId);
    if (idx !== -1) {
      list[idx].dibaca = true;
      list[idx].readAt = new Date().toISOString();
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    const list = this.getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    list.forEach(n => {
      if (n.userId === userId) {
        n.dibaca = true;
        n.readAt = new Date().toISOString();
      }
    });
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  }

  public logAudit(entry: {
    userId: string;
    tindakan: AuditAction;
    modul: AuditModule;
    rekodId: string;
    keterangan: string;
    ipAddress?: string;
    maklumatTambahan?: Record<string, any>;
  }): AuditLog {
    const user = this.getUserById(entry.userId);
    const logs = this.getAuditLogs();

    const newLog: AuditLog = {
      logId: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: entry.userId,
      namaPengguna: user?.nama || 'Sistem',
      emelPengguna: user?.emel || 'system@mplbp.gov.my',
      perananPengguna: user?.role || 'PENTADBIR_SISTEM',
      tindakan: entry.tindakan,
      modul: entry.modul,
      rekodId: entry.rekodId,
      keterangan: entry.keterangan,
      ipAddress: entry.ipAddress || '10.20.4.15',
      tarikhMasa: new Date().toISOString(),
      maklumatTambahan: entry.maklumatTambahan
    };

    logs.unshift(newLog);
    // Keep last 1000 logs
    if (logs.length > 1000) logs.pop();
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
    return newLog;
  }

  // --- HOLIDAYS & SETTINGS ---
  public getHolidays(): Holiday[] {
    return this.getItem<Holiday[]>(STORAGE_KEYS.HOLIDAYS, SEED_HOLIDAYS);
  }

  public createHoliday(holiday: Omit<Holiday, 'holidayId'>): Holiday {
    const list = this.getHolidays();
    const newHol: Holiday = { ...holiday, holidayId: `hol-${Date.now()}` };
    list.push(newHol);
    this.setItem(STORAGE_KEYS.HOLIDAYS, list);
    return newHol;
  }

  public deleteHoliday(holidayId: string) {
    const list = this.getHolidays().filter(h => h.holidayId !== holidayId);
    this.setItem(STORAGE_KEYS.HOLIDAYS, list);
  }

  public getSettings(): SystemSettings {
    return this.getItem<SystemSettings>(STORAGE_KEYS.SETTINGS, SEED_SETTINGS);
  }

  public updateSettings(updates: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated: SystemSettings = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: this.getCurrentUserId()
    };
    this.setItem(STORAGE_KEYS.SETTINGS, updated);

    this.logAudit({
      userId: this.getCurrentUserId(),
      tindakan: 'KEMASKINI_TETAPAN',
      modul: 'TETAPAN',
      rekodId: 'global-settings',
      keterangan: 'Mengemaskini parameter polisi dan tetapan sistem operasi MPLBP e-BILIK.'
    });

    return updated;
  }
}

export const db = new MockDatabase();
