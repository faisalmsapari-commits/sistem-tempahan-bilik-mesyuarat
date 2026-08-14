import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BookingBadge } from '../common/Badge';
import { Booking, LAYOUT_LABELS } from '../../types/booking';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { formatMalayDate, formatMalayDateWithDay } from '../../utils/dateUtils';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  User,
  QrCode,
  Printer,
  CheckCircle,
  XCircle,
  RotateCcw,
  Ban,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onViewQr?: (booking: Booking) => void;
  onPrintSlip?: (booking: Booking) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  onViewQr,
  onPrintSlip
}) => {
  const { currentUser } = useAuth();
  const { approveBooking, rejectBooking, returnBooking, cancelBooking, checkIn, checkOut } = useBooking();

  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [isReturning, setIsReturning] = useState(false);
  const [returnFeedback, setReturnFeedback] = useState('');

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!booking) return null;

  const role = currentUser?.role || 'KAKITANGAN';
  const isApprover = role === 'PELULUS' || role === 'PENTADBIR_SISTEM';
  const isOwner = currentUser?.uid === booking.userId;
  const isSecretariat = role === 'URUS_SETIA' || role === 'PENTADBIR_SISTEM';

  const handleApprove = () => {
    approveBooking(booking.bookingId, 'Permohonan disemak dan diluluskan.');
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectBooking(booking.bookingId, rejectReason);
    setIsRejecting(false);
    onClose();
  };

  const handleReturn = () => {
    if (!returnFeedback.trim()) return;
    returnBooking(booking.bookingId, returnFeedback);
    setIsReturning(false);
    onClose();
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    cancelBooking(booking.bookingId, cancelReason);
    setIsCancelling(false);
    onClose();
  };

  const handleCheckInNow = () => {
    checkIn(booking.bookingId);
    onClose();
  };

  const handleCheckOutNow = () => {
    checkOut(booking.bookingId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={booking.tajukMesyuarat}
      subtitle={`No. Rujukan: ${booking.noRujukan}`}
      maxWidth="3xl"
    >
      <div className="space-y-6 text-xs text-slate-700">
        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Status:</span>
            <BookingBadge status={booking.status} />
          </div>

          <div className="flex items-center gap-2">
            {onViewQr && booking.status !== 'DIBATALKAN' && (
              <button
                onClick={() => {
                  onClose();
                  onViewQr(booking);
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                <span>Kod QR Pass</span>
              </button>
            )}

            {onPrintSlip && (
              <button
                onClick={() => {
                  onClose();
                  onPrintSlip(booking);
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Cetak Slip</span>
              </button>
            )}
          </div>
        </div>

        {/* Maklumat Utama */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Masa & Lokasi
            </h4>
            <div className="space-y-1.5">
              <p><span className="text-slate-500">Bilik Mesyuarat:</span> <strong className="text-slate-900">{booking.roomName}</strong></p>
              <p><span className="text-slate-500">Tarikh:</span> <strong className="text-slate-900">{formatMalayDateWithDay(booking.tarikh)}</strong></p>
              <p><span className="text-slate-500">Masa Penggunaan:</span> <strong className="text-slate-900">{booking.masaMula} - {booking.masaTamat}</strong></p>
              <p><span className="text-slate-500">Bilangan Peserta:</span> <strong className="text-slate-900">{booking.bilanganPeserta} Orang</strong></p>
              <p><span className="text-slate-500">Jenis Tempahan:</span> <span className="font-semibold text-blue-700">{booking.jenisTempahan}</span></p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Pemohon & Urus Setia
            </h4>
            <div className="space-y-1.5">
              <p><span className="text-slate-500">Pengerusi:</span> <strong className="text-slate-900">{booking.pengerusi}</strong></p>
              <p><span className="text-slate-500">Pegawai Pemohon:</span> <strong className="text-slate-900">{booking.userName}</strong></p>
              <p><span className="text-slate-500">Jabatan:</span> <strong className="text-slate-900">{booking.jabatanNama}</strong></p>
              <p><span className="text-slate-500">Unit:</span> <strong className="text-slate-900">{booking.unit}</strong></p>
              <p><span className="text-slate-500">No. Telefon:</span> <strong className="text-slate-900">{booking.userPhone}</strong></p>
            </div>
          </div>
        </div>

        {/* Tujuan & Catatan */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Tujuan & Ringkasan Mesyuarat</h4>
          <p className="text-slate-700 leading-relaxed">{booking.tujuan}</p>
          {booking.catatan && (
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span className="font-semibold">Catatan Khas:</span> {booking.catatan}
            </p>
          )}
        </div>

        {/* Keperluan Fasiliti & Susunan */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Susunan Meja & Peralatan AV</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 bg-white rounded-xl border">
              <span className="text-slate-400 block text-[10px]">Susunan:</span>
              <span className="font-bold">{LAYOUT_LABELS[booking.perkhidmatan?.susunanMeja || 'BENTUK_U']}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border">
              <span className="text-slate-400 block text-[10px]">Projektor HD:</span>
              <span className="font-bold">{booking.peralatan?.projektor ? 'Disediakan' : 'Tiada'}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border">
              <span className="text-slate-400 block text-[10px]">Mikrofon:</span>
              <span className="font-bold">{booking.peralatan?.mikrofonKuantiti || 0} Unit</span>
            </div>
            <div className="p-2 bg-white rounded-xl border">
              <span className="text-slate-400 block text-[10px]">Minuman:</span>
              <span className="font-bold">{booking.perkhidmatan?.minuman ? 'Disediakan' : 'Tiada'}</span>
            </div>
          </div>
        </div>

        {/* Maklumat Kelulusan & Alasan (Jika Ada) */}
        {booking.status === 'DILULUSKAN' && booking.approvedByName && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
            <p className="font-bold">Diluluskan oleh: {booking.approvedByName} ({booking.approvedAt ? formatMalayDate(booking.approvedAt) : ''})</p>
            {booking.approvalNotes && <p className="mt-0.5 text-[11px] text-emerald-800">{booking.approvalNotes}</p>}
          </div>
        )}

        {booking.status === 'DITOLAK' && (
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs">
            <p className="font-bold">Ditolak oleh: {booking.approvedByName || 'Pegawai Pelulus'}</p>
            <p className="mt-0.5 text-[11px] text-rose-800"><span className="font-semibold">Alasan Penolakan:</span> {booking.rejectedReason}</p>
          </div>
        )}

        {booking.status === 'DIPULANGKAN' && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
            <p className="font-bold">Dipulangkan untuk Pembetulan</p>
            <p className="mt-0.5 text-[11px] text-amber-800"><span className="font-semibold">Ulasan:</span> {booking.returnFeedback}</p>
          </div>
        )}

        {booking.status === 'DIBATALKAN' && (
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-700 text-xs">
            <p className="font-bold">Tempahan Dibatalkan</p>
            <p className="mt-0.5 text-[11px]"><span className="font-semibold">Sebab:</span> {booking.cancellationReason || 'Tiada catatan'}</p>
          </div>
        )}

        {/* Action Prompt Forms (Reject / Return / Cancel) */}
        {isRejecting && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 animate-fade-in">
            <h5 className="font-bold text-rose-900 text-xs">Alasan Penolakan Permohonan (Wajib):</h5>
            <textarea
              rows={2}
              required
              placeholder="Nyatakan alasan penolakan rasmi..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-rose-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-rose-200"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRejecting(false)}
                className="px-3 py-1.5 bg-white text-slate-700 text-xs font-bold rounded-lg border"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Sahkan Penolakan
              </button>
            </div>
          </div>
        )}

        {isReturning && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 animate-fade-in">
            <h5 className="font-bold text-amber-900 text-xs">Ulasan Pembetulan untuk Pemohon:</h5>
            <textarea
              rows={2}
              required
              placeholder="Nyatakan perkara yang perlu diperbetulkan oleh pemohon..."
              value={returnFeedback}
              onChange={e => setReturnFeedback(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-amber-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-amber-200"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReturning(false)}
                className="px-3 py-1.5 bg-white text-slate-700 text-xs font-bold rounded-lg border"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReturn}
                disabled={!returnFeedback.trim()}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Hantar Pulang
              </button>
            </div>
          </div>
        )}

        {isCancelling && (
          <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl space-y-3 animate-fade-in">
            <h5 className="font-bold text-slate-800 text-xs">Sebab Pembatalan Tempahan:</h5>
            <textarea
              rows={2}
              required
              placeholder="Nyatakan sebab pembatalan..."
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-slate-200"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCancelling(false)}
                className="px-3 py-1.5 bg-white text-slate-700 text-xs font-bold rounded-lg border"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={!cancelReason.trim()}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Batalkan Tempahan Ini
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {/* Cancel Button (Owner or Admin) */}
            {(isOwner || role === 'PENTADBIR_SISTEM') && booking.status !== 'DIBATALKAN' && booking.status !== 'SELESAI' && !isCancelling && (
              <button
                type="button"
                onClick={() => setIsCancelling(true)}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-rose-200 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                Batalkan Tempahan
              </button>
            )}

            {/* Check-In / Check-Out Actions */}
            {booking.status === 'DILULUSKAN' && (
              <button
                type="button"
                onClick={handleCheckInNow}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Daftar Masuk (Check-In)
              </button>
            )}

            {booking.status === 'SEDANG_DIGUNAKAN' && (
              <button
                type="button"
                onClick={handleCheckOutNow}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Daftar Keluar (Check-Out)
              </button>
            )}
          </div>

          {/* Approver Action Buttons */}
          {isApprover && booking.status === 'MENUNGGU_KELULUSAN' && !isRejecting && !isReturning && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReturning(true)}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs border border-amber-200 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Pulangkan
              </button>

              <button
                type="button"
                onClick={() => setIsRejecting(true)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl text-xs border border-rose-200 transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                Tolak
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Luluskan Tempahan
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
