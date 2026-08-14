import React from 'react';
import { Booking, LAYOUT_LABELS } from '../../types/booking';
import { formatMalayDate, formatMalayDateWithDay } from '../../utils/dateUtils';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, ArrowLeft } from 'lucide-react';

interface BookingSlipPrintProps {
  booking: Booking;
  onClose: () => void;
}

export const BookingSlipPrint: React.FC<BookingSlipPrintProps> = ({
  booking,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto p-4 sm:p-8 animate-fade-in print:p-0">
      {/* Top Action Bar (hidden in print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden border-b border-slate-200 pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          <Printer className="w-4 h-4" />
          Cetak Slip Rasmi
        </button>
      </div>

      {/* Printable Slip Container */}
      <div className="max-w-4xl mx-auto border-2 border-slate-800 p-8 rounded-2xl bg-white shadow-lg print:border-none print:shadow-none print:p-0">
        {/* Header Rasmi MPLBP */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-900 flex items-center justify-center text-white font-extrabold text-2xl">
              M
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 uppercase">
                Majlis Perbandaran Langkawi Bandaraya Pelancongan
              </h1>
              <p className="text-xs font-semibold text-slate-600">
                Sistem Pengurusan Tempahan Bilik Mesyuarat Bersepadu (MPLBP e-BILIK)
              </p>
              <p className="text-[11px] text-slate-500">
                Kompleks Pejabat MPLBP, Persiaran Putra, 07000 Kuah, Langkawi, Kedah Darul Aman
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">No. Rujukan Tempahan</span>
            <span className="text-base font-extrabold font-mono text-blue-900 block">{booking.noRujukan}</span>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold border border-slate-800 bg-slate-100">
              STATUS: {booking.status}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-4 bg-slate-50 py-2 border border-slate-200 rounded-xl">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            SLIP PENGESAHAN TEMPAHAN FASILITI BILIK MESYUARAT
          </h2>
        </div>

        {/* Maklumat Utama */}
        <div className="grid grid-cols-3 gap-6 my-6 text-xs">
          <div className="col-span-2 space-y-3">
            <div>
              <span className="text-slate-500 text-[11px] block font-semibold uppercase">Tajuk Mesyuarat:</span>
              <p className="text-sm font-extrabold text-slate-900 leading-snug">{booking.tajukMesyuarat}</p>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block font-semibold uppercase">Tujuan / Agenda:</span>
              <p className="text-slate-700 leading-relaxed">{booking.tujuan}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-slate-500 text-[11px] block font-semibold uppercase">Bilik Mesyuarat:</span>
                <span className="text-xs font-bold text-slate-900">{booking.roomName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block font-semibold uppercase">Tarikh Mesyuarat:</span>
                <span className="text-xs font-bold text-slate-900">{formatMalayDateWithDay(booking.tarikh)}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block font-semibold uppercase">Masa Penggunaan:</span>
                <span className="text-xs font-bold text-slate-900">{booking.masaMula} - {booking.masaTamat}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block font-semibold uppercase">Bilangan Peserta:</span>
                <span className="text-xs font-bold text-slate-900">{booking.bilanganPeserta} Orang</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block font-semibold uppercase">Pengerusi Mesyuarat:</span>
                <span className="text-xs font-bold text-slate-900">{booking.pengerusi}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block font-semibold uppercase">Pegawai Pemohon / Urus Setia:</span>
                <span className="text-xs font-bold text-slate-900">{booking.userName} ({booking.userPhone})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block font-semibold uppercase">Jabatan / Bahagian:</span>
                <span className="text-xs font-bold text-slate-900">{booking.jabatanNama} ({booking.unit})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block font-semibold uppercase">Susunan Meja:</span>
                <span className="text-xs font-bold text-slate-900">{LAYOUT_LABELS[booking.perkhidmatan?.susunanMeja || 'BENTUK_U']}</span>
              </div>
            </div>
          </div>

          {/* QR Code Pass Box */}
          <div className="flex flex-col items-center justify-center p-4 border border-slate-300 rounded-2xl bg-slate-50 text-center">
            <QRCodeSVG
              value={booking.qrCodeData || `MPLBP-${booking.noRujukan}-VERIFIED`}
              size={130}
              level="H"
            />
            <span className="text-[10px] font-mono font-bold text-slate-600 mt-2 block">
              {booking.noRujukan}
            </span>
            <span className="text-[9px] text-slate-500 mt-0.5">
              Imbas semasa pendaftaran masuk mesyuarat
            </span>
          </div>
        </div>

        {/* Keperluan Peralatan */}
        <div className="my-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <p className="font-bold text-slate-900 mb-2 uppercase text-[11px]">Keperluan Fasiliti & Urus Setia:</p>
          <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-700">
            <div>Projektor HD: {booking.peralatan?.projektor ? '✅ Ya' : '❌ Tidak'}</div>
            <div>Sistem PA & Audio: {booking.peralatan?.sistemAudio ? '✅ Ya' : '❌ Tidak'}</div>
            <div>Mikrofon: {booking.peralatan?.mikrofonKuantiti || 0} Unit</div>
            <div>Video Konferens: {booking.peralatan?.persidanganVideo ? '✅ Ya' : '❌ Tidak'}</div>
            <div>Air Mineral: {booking.perkhidmatan?.minuman ? '✅ Ya' : '❌ Tidak'}</div>
            <div>Jamuan Ringan: {booking.perkhidmatan?.jamuanRingan ? '✅ Ya' : '❌ Tidak'}</div>
          </div>
          {booking.catatan && (
            <p className="mt-2 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
              <span className="font-semibold">Catatan Khas:</span> {booking.catatan}
            </p>
          )}
        </div>

        {/* Status Kelulusan & Pengesahan Tandatangan */}
        <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t-2 border-slate-800 text-xs">
          <div className="space-y-12">
            <div>
              <p className="font-bold text-slate-800">Disediakan Oleh Pemohon:</p>
              <p className="text-slate-500 text-[11px]">Tarikh: {formatMalayDate(booking.createdAt)}</p>
            </div>
            <div className="border-t border-slate-400 pt-1">
              <p className="font-bold text-slate-900">{booking.userName}</p>
              <p className="text-slate-600 text-[11px]">{booking.jabatanNama}</p>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <p className="font-bold text-slate-800">Diluluskan / Disahkan Oleh:</p>
              <p className="text-slate-500 text-[11px]">
                {booking.approvedAt ? `Tarikh: ${formatMalayDate(booking.approvedAt)}` : 'Menunggu Pengesahan'}
              </p>
            </div>
            <div className="border-t border-slate-400 pt-1">
              <p className="font-bold text-slate-900">{booking.approvedByName || 'Pegawai Pelulus Utama'}</p>
              <p className="text-slate-600 text-[11px]">Majlis Perbandaran Langkawi Bandaraya Pelancongan</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
          Dokumen ini dijana secara digital oleh Sistem MPLBP e-BILIK pada {formatMalayDateWithDay(new Date())}.
        </div>
      </div>
    </div>
  );
};
