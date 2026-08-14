import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useBooking } from './contexts/BookingContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { BookingsPage } from './pages/BookingsPage';
import { RoomsPage } from './pages/RoomsPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { SecretariatPage } from './pages/SecretariatPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { DoorDisplayPage } from './pages/DoorDisplayPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReportsPage } from './pages/ReportsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UsersManagementPage } from './pages/admin/UsersManagementPage';
import { DepartmentsManagementPage } from './pages/admin/DepartmentsManagementPage';
import { HolidaysManagementPage } from './pages/admin/HolidaysManagementPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';

// Calendar & Modals
import { CalendarView } from './components/calendar/CalendarView';
import { BookingFormModal } from './components/bookings/BookingFormModal';
import { BookingDetailsModal } from './components/bookings/BookingDetailsModal';
import { BookingSlipPrint } from './components/bookings/BookingSlipPrint';
import { QRCodeModal } from './components/qr/QRCodeModal';
import { QRScannerModal } from './components/qr/QRScannerModal';
import { Booking } from './types/booking';

export const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();

  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [initialRoomIdForBooking, setInitialRoomIdForBooking] = useState<string | undefined>(undefined);
  const [initialDateForBooking, setInitialDateForBooking] = useState<string | undefined>(undefined);

  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<Booking | null>(null);
  const [selectedBookingForPrint, setSelectedBookingForPrint] = useState<Booking | null>(null);

  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  // Door display room ID
  const [doorDisplayRoomId, setDoorDisplayRoomId] = useState<string | undefined>(undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Memuatkan MPLBP e-BILIK...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Fullscreen Kiosk Door Display Mode
  if (currentPage === 'door-display') {
    return (
      <DoorDisplayPage
        selectedRoomId={doorDisplayRoomId}
        onExit={() => {
          setDoorDisplayRoomId(undefined);
          setCurrentPage('dashboard');
        }}
      />
    );
  }

  // Printable Slip Full Screen
  if (selectedBookingForPrint) {
    return (
      <BookingSlipPrint
        booking={selectedBookingForPrint}
        onClose={() => setSelectedBookingForPrint(null)}
      />
    );
  }

  const handleOpenBookingModal = (roomId?: string, dateStr?: string) => {
    setInitialRoomIdForBooking(roomId);
    setInitialDateForBooking(dateStr);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onNavigate={page => setCurrentPage(page)}
        currentPage={currentPage}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={page => setCurrentPage(page)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenBookingModal={() => handleOpenBookingModal()}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={page => setCurrentPage(page)}
              onOpenBookingModal={roomId => handleOpenBookingModal(roomId)}
              onSelectBooking={b => setSelectedBookingForDetails(b)}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
            />
          )}

          {currentPage === 'my-bookings' && (
            <MyBookingsPage
              onOpenBookingModal={() => handleOpenBookingModal()}
              onSelectBooking={b => setSelectedBookingForDetails(b)}
              onViewQr={b => setSelectedBookingForQR(b)}
              onPrintSlip={b => setSelectedBookingForPrint(b)}
            />
          )}

          {currentPage === 'bookings' && (
            <BookingsPage
              onOpenBookingModal={() => handleOpenBookingModal()}
              onSelectBooking={b => setSelectedBookingForDetails(b)}
              onViewQr={b => setSelectedBookingForQR(b)}
              onPrintSlip={b => setSelectedBookingForPrint(b)}
            />
          )}

          {currentPage === 'calendar' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Kalendar Tempahan Bersepadu
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Paparan takwim penggunaan fasiliti mengikut mod Bulan, Minggu dan Hari.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenBookingModal()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all self-start sm:self-auto"
                >
                  + Tempah Bilik
                </button>
              </div>

              <CalendarView
                onSelectBooking={b => setSelectedBookingForDetails(b)}
                onNewBookingAtDate={dateStr => handleOpenBookingModal(undefined, dateStr)}
              />
            </div>
          )}

          {currentPage === 'rooms' && (
            <RoomsPage
              onBookRoom={roomId => handleOpenBookingModal(roomId)}
              onViewDoorDisplay={roomId => {
                setDoorDisplayRoomId(roomId);
                setCurrentPage('door-display');
              }}
            />
          )}

          {currentPage === 'approvals' && (
            <ApprovalsPage
              onSelectBooking={b => setSelectedBookingForDetails(b)}
            />
          )}

          {currentPage === 'secretariat' && (
            <SecretariatPage />
          )}

          {currentPage === 'maintenance' && (
            <MaintenancePage />
          )}

          {currentPage === 'notifications' && (
            <NotificationsPage
              onNavigateToBooking={bookingId => {
                setCurrentPage('my-bookings');
              }}
            />
          )}

          {currentPage === 'profile' && (
            <ProfilePage />
          )}

          {currentPage === 'reports' && (
            <ReportsPage />
          )}

          {currentPage === 'analytics' && (
            <AnalyticsPage />
          )}

          {currentPage === 'admin-users' && (
            <UsersManagementPage />
          )}

          {currentPage === 'admin-departments' && (
            <DepartmentsManagementPage />
          )}

          {currentPage === 'admin-holidays' && (
            <HolidaysManagementPage />
          )}

          {currentPage === 'admin-audit' && (
            <AuditLogsPage />
          )}

          {currentPage === 'admin-settings' && (
            <SystemSettingsPage />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialRoomId={initialRoomIdForBooking}
        initialDate={initialDateForBooking}
      />

      <BookingDetailsModal
        isOpen={!!selectedBookingForDetails}
        onClose={() => setSelectedBookingForDetails(null)}
        booking={selectedBookingForDetails}
        onViewQr={b => setSelectedBookingForQR(b)}
        onPrintSlip={b => setSelectedBookingForPrint(b)}
      />

      <QRCodeModal
        isOpen={!!selectedBookingForQR}
        onClose={() => setSelectedBookingForQR(null)}
        booking={selectedBookingForQR}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onSuccess={bookingId => {
          // Toast notifies user
        }}
      />
    </div>
  );
};
