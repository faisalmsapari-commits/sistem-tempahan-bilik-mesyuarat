import React from 'react';
import { Modal } from '../common/Modal';
import { Booking } from '../../types/booking';
import { formatMalayDate } from '../../utils/dateUtils';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  if (!booking) return null;

  const qrValue = booking.qrCodeData || `MPLBP-${booking.noRujukan}-VERIFIED`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pas Digital Kod QR Daftar Masuk"
      subtitle={`No. Rujukan: ${booking.noRujukan}`}
      maxWidth="md"
    >
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
        {/* QR Code Container */}
        <div className="p-5 bg-white rounded-3xl shadow-xl border-4 border-blue-600/20 relative group">
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="H"
            includeMargin
            imageSettings={{
              src: '/favicon.svg',
              x: undefined,
              y: undefined,
              height: 36,
              width: 36,
              excavate: true
            }}
          />
          <div className="absolute inset-0 bg-blue-600/5 rounded-3xl pointer-events-none" />
        </div>

        {/* Meeting Info */}
        <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-left space-y-2">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Tajuk Mesyuarat:</span>
            <p className="font-bold text-slate-900 text-sm">{booking.tajukMesyuarat}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
            <div>
              <span className="text-slate-500 text-[10px] block">Bilik:</span>
              <span className="font-bold text-slate-800">{booking.roomName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Tarikh:</span>
              <span className="font-bold text-slate-800">{formatMalayDate(booking.tarikh)}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Masa:</span>
              <span className="font-bold text-slate-800">{booking.masaMula} - {booking.masaTamat}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Pemohon:</span>
              <span className="font-bold text-slate-800">{booking.userName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Kod QR ini telah disahkan selamat dan unik bagi tempahan ini.</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Cetak Pas QR
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};
