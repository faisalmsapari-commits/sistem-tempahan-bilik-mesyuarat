import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useBooking } from '../../contexts/BookingContext';
import { QrCode, Scan, Search, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bookingId: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { checkIn, bookings } = useBooking();
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleManualCheckIn = (code: string) => {
    if (!code) return;
    try {
      const b = checkIn(code);
      setScanResult(`Daftar masuk berjaya bagi ${b.tajukMesyuarat} (${b.noRujukan}) di ${b.roomName}!`);
      if (onSuccess) onSuccess(b.bookingId);
      setTimeout(() => {
        setScanResult(null);
        setManualCode('');
        onClose();
      }, 2000);
    } catch (err: any) {
      // Toast handles error
    }
  };

  const handleSimulateScan = (refNo: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      handleManualCheckIn(refNo);
    }, 600);
  };

  // Approved bookings ready for check-in today
  const readyBookings = bookings.filter(b => b.status === 'DILULUSKAN' || b.status === 'SEDANG_DIGUNAKAN');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengimbas & Pengesahan Kod QR"
      subtitle="Daftar Masuk Kehadiran Mesyuarat Bersepadu MPLBP"
      maxWidth="md"
    >
      <div className="space-y-5 text-xs">
        {/* Scanner Viewfinder Box */}
        <div className="relative bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center text-white overflow-hidden aspect-video border-2 border-slate-800 shadow-inner">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-28 h-28 border-2 border-blue-400 border-dashed rounded-2xl flex items-center justify-center relative animate-pulse">
              <Scan className="w-12 h-12 text-blue-400 opacity-80" />
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400 shadow-lg shadow-blue-400 animate-bounce" />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Halakan kod QR tempahan ke arah pengimbas atau pilih tempahan sedia ada di bawah.
            </p>
          </div>

          <div className="absolute inset-0 bg-radial-gradient from-blue-900/30 to-slate-950/80 pointer-events-none" />
        </div>

        {scanResult && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 flex items-center gap-2 font-bold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{scanResult}</span>
          </div>
        )}

        {/* Manual Code Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Atau Masukkan Nombor Rujukan Tempahan / Kod QR Secara Manual:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="cth: MB-2026-000101"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono text-xs uppercase text-slate-800 outline-hidden"
            />
            <button
              onClick={() => handleManualCheckIn(manualCode)}
              disabled={!manualCode}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shrink-0"
            >
              Sahkan
            </button>
          </div>
        </div>

        {/* Quick Test Demo List */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-600 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Imbas Pantas Tempahan Diluluskan (Demo):
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {readyBookings.map(b => (
              <div
                key={b.bookingId}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
              >
                <div>
                  <p className="font-bold text-slate-800">{b.tajukMesyuarat}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{b.noRujukan} • {b.roomName}</p>
                </div>
                <button
                  onClick={() => handleSimulateScan(b.noRujukan)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors"
                >
                  Imbas QR
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
