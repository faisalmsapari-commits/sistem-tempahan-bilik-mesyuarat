import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { Modal } from '../common/Modal';
import { ConflictWarning } from './ConflictWarning';
import { Room } from '../../types/room';
import { RecurringType, LAYOUT_LABELS } from '../../types/booking';
import { formatMalayDate, generateRecurringDates, getTodayDateString } from '../../utils/dateUtils';
import {
  Calendar,
  Clock,
  Users,
  DoorOpen,
  FileText,
  Layers,
  Sparkles,
  CheckCircle2,
  Tv,
  Mic,
  Coffee,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomId?: string;
  initialDate?: string;
}

export const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  initialRoomId,
  initialDate
}) => {
  const { currentUser } = useAuth();
  const { rooms, departments, createBooking, checkConflict, bookings } = useBooking();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [tajukMesyuarat, setTajukMesyuarat] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [tarikh, setTarikh] = useState(initialDate || getTodayDateString());
  const [masaMula, setMasaMula] = useState('09:00');
  const [masaTamat, setMasaTamat] = useState('11:00');
  const [roomId, setRoomId] = useState(initialRoomId || (rooms[0]?.roomId || ''));
  const [bilanganPeserta, setBilanganPeserta] = useState<number>(15);
  const [pengerusi, setPengerusi] = useState('');
  const [urusSetia, setUrusSetia] = useState(currentUser?.nama || '');
  const [jabatanId, setJabatanId] = useState(currentUser?.jabatanId || departments[0]?.deptId || '');
  const [unit, setUnit] = useState(currentUser?.unit || '');
  const [catatan, setCatatan] = useState('');

  // Recurring
  const [jenisTempahan, setJenisTempahan] = useState<RecurringType>('SEKALI');
  const [recurringCount, setRecurringCount] = useState<number>(4);

  // Equipment
  const [projektor, setProjektor] = useState(true);
  const [sistemAudio, setSistemAudio] = useState(true);
  const [mikrofonKuantiti, setMikrofonKuantiti] = useState(2);
  const [persidanganVideo, setPersidanganVideo] = useState(false);
  const [komputerLanjutan, setKomputerLanjutan] = useState(false);
  const [papanPutih, setPapanPutih] = useState(true);
  const [catatanPeralatan, setCatatanPeralatan] = useState('');

  // Services
  const [susunanMeja, setSusunanMeja] = useState<'BENTUK_U' | 'TEATER' | 'BILIK_DARJAH' | 'MEJA_BULAT' | 'BENTUK_V' | 'LAIN_LAIN'>('BENTUK_U');
  const [minuman, setMinuman] = useState(true);
  const [jamuanRingan, setJamuanRingan] = useState(false);
  const [kebersihanKhas, setKebersihanKhas] = useState(true);
  const [catatanKhidmat, setCatatanKhidmat] = useState('');

  // Conflict state
  const [conflictResult, setConflictResult] = useState<{
    hasConflict: boolean;
    conflictingBooking?: any;
    reason?: string;
  }>({ hasConflict: false });

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      if (initialRoomId) setRoomId(initialRoomId);
      if (initialDate) setTarikh(initialDate);
      if (currentUser) {
        setUrusSetia(currentUser.nama);
        setJabatanId(currentUser.jabatanId || departments[0]?.deptId || '');
        setUnit(currentUser.unit || '');
      }
      setActiveStep(1);
    }
  }, [isOpen, initialRoomId, initialDate, currentUser, departments]);

  // Selected room details
  const selectedRoom = useMemo(() => rooms.find(r => r.roomId === roomId), [rooms, roomId]);
  const selectedDept = useMemo(() => departments.find(d => d.deptId === jabatanId), [departments, jabatanId]);

  // Check conflicts live whenever room, date, or time changes
  useEffect(() => {
    if (!roomId || !tarikh || !masaMula || !masaTamat) return;

    if (masaMula >= masaTamat) {
      setConflictResult({
        hasConflict: true,
        reason: 'Masa tamat mesyuarat mestilah lebih lewat daripada masa mula.'
      });
      return;
    }

    if (jenisTempahan === 'SEKALI') {
      const res = checkConflict(roomId, tarikh, masaMula, masaTamat);
      setConflictResult(res);
    } else {
      // Check recurring series
      const recType = jenisTempahan === 'HARIAN' ? 'HARIAN' : jenisTempahan === 'MINGGUAN' ? 'MINGGUAN' : 'BULANAN';
      const seriesDates = generateRecurringDates(tarikh, recType, recurringCount);
      let foundConflict: any = null;

      for (const d of seriesDates) {
        const res = checkConflict(roomId, d, masaMula, masaTamat);
        if (res.hasConflict) {
          foundConflict = {
            hasConflict: true,
            reason: `Pertindihan berlaku pada tarikh siri berulang: ${formatMalayDate(d)}. (${res.reason})`
          };
          break;
        }
      }

      setConflictResult(foundConflict || { hasConflict: false });
    }
  }, [roomId, tarikh, masaMula, masaTamat, jenisTempahan, recurringCount, checkConflict]);

  // Alternative rooms if capacity or conflict occurs
  const alternateRooms = useMemo(() => {
    return rooms.filter(r => r.roomId !== roomId && r.status === 'AKTIF' && r.kapasiti >= bilanganPeserta);
  }, [rooms, roomId, bilanganPeserta]);

  // Capacity Warning
  const isOverCapacity = selectedRoom && bilanganPeserta > selectedRoom.kapasiti;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;
    if (conflictResult.hasConflict) return;

    const recurringDates = jenisTempahan !== 'SEKALI'
      ? generateRecurringDates(tarikh, jenisTempahan === 'HARIAN' ? 'HARIAN' : jenisTempahan === 'MINGGUAN' ? 'MINGGUAN' : 'BULANAN', recurringCount)
      : undefined;

    try {
      createBooking({
        tajukMesyuarat,
        tujuan,
        tarikh,
        masaMula,
        masaTamat,
        roomId,
        roomName: selectedRoom?.nama,
        userId: currentUser.uid,
        userName: currentUser.nama,
        userEmail: currentUser.emel,
        userPhone: currentUser.noTelefon || '012-3456789',
        jabatanId: selectedDept?.deptId || 'dept-kp',
        jabatanNama: selectedDept?.nama || 'Jabatan Khidmat Pengurusan',
        unit: unit || 'Pentadbiran',
        bilanganPeserta: Number(bilanganPeserta),
        pengerusi: pengerusi || 'Pengerusi Mesyuarat',
        urusSetia: urusSetia || currentUser.nama,
        peralatan: {
          projektor,
          sistemAudio,
          mikrofonKuantiti: Number(mikrofonKuantiti),
          persidanganVideo,
          komputerLanjutan,
          papanPutih,
          catatanPeralatan
        },
        perkhidmatan: {
          susunanMeja,
          bilanganKerusi: Number(bilanganPeserta),
          minuman,
          jamuanRingan,
          kebersihanKhas,
          catatanKhidmat
        },
        catatan,
        jenisTempahan,
        tarikhBerulang: recurringDates,
        status: 'MENUNGGU_KELULUSAN'
      });

      onClose();
    } catch (err) {
      // Handled in context toast
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Borang Permohonan Tempahan Bilik Mesyuarat"
      subtitle="Sistem Pengurusan Tempahan Bersepadu MPLBP"
      maxWidth="4xl"
    >
      {/* Steps Navigation Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              activeStep === 1
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            <span>Maklumat Mesyuarat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              activeStep === 2
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            <span>Peralatan & Susunan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              activeStep === 3
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            <span>Semakan & Hantar</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: MAKLUMAT MESYUARAT */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tajuk Mesyuarat */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tajuk Mesyuarat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth: Mesyuarat Jawatankuasa Penilaian Tender Bil. 4/2026"
                  value={tajukMesyuarat}
                  onChange={e => setTajukMesyuarat(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800 transition-all outline-hidden"
                />
              </div>

              {/* Tujuan / Ringkasan */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tujuan / Agenda Mesyuarat <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Nyatakan tujuan atau ringkasan mesyuarat..."
                  value={tujuan}
                  onChange={e => setTujuan(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 transition-all outline-hidden"
                />
              </div>

              {/* Pilihan Bilik */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Bilik Mesyuarat <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rooms.map(room => {
                    const isSelected = room.roomId === roomId;
                    const isAvailable = room.status === 'AKTIF';
                    return (
                      <div
                        key={room.roomId}
                        onClick={() => isAvailable && setRoomId(room.roomId)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                            : isAvailable
                            ? 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            : 'border-slate-100 bg-slate-100/50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: room.warna }}
                          />
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border text-slate-600">
                            {room.kapasiti} Pax
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{room.nama}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{room.aras}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tarikh & Masa */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tarikh Mesyuarat <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    required
                    value={tarikh}
                    onChange={e => setTarikh(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800 transition-all outline-hidden"
                  />
                </div>
              </div>

              {/* Bilangan Peserta */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bilangan Peserta (Orang) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min={1}
                    max={200}
                    required
                    value={bilanganPeserta}
                    onChange={e => setBilanganPeserta(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800 transition-all outline-hidden"
                  />
                </div>
              </div>

              {/* Masa Mula & Masa Tamat */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Masa Mula <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="time"
                    required
                    value={masaMula}
                    onChange={e => setMasaMula(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800 transition-all outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Masa Tamat <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="time"
                    required
                    value={masaTamat}
                    onChange={e => setMasaTamat(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800 transition-all outline-hidden"
                  />
                </div>
              </div>

              {/* Pengerusi & Urus Setia */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pengerusi Mesyuarat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth: YDP / Setiausaha Perbandaran / Pengarah Jabatan"
                  value={pengerusi}
                  onChange={e => setPengerusi(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 transition-all outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pegawai Urus Setia / Pemohon <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={urusSetia}
                  onChange={e => setUrusSetia(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 transition-all outline-hidden"
                />
              </div>

              {/* Jabatan & Unit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Jabatan MPLBP <span className="text-rose-500">*</span>
                </label>
                <select
                  value={jabatanId}
                  onChange={e => setJabatanId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 transition-all outline-hidden"
                >
                  {departments.map(d => (
                    <option key={d.deptId} value={d.deptId}>
                      {d.kod} - {d.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Unit / Bahagian
                </label>
                <input
                  type="text"
                  placeholder="cth: Unit Pentadbiran & Fasiliti"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 transition-all outline-hidden"
                />
              </div>

              {/* Jenis Tempahan (Sekali vs Berulang) */}
              <div className="md:col-span-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kekerapan Tempahan (Recurring)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['SEKALI', 'HARIAN', 'MINGGUAN', 'BULANAN'] as RecurringType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setJenisTempahan(type)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        jenisTempahan === type
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {type === 'SEKALI' ? 'Tempahan Sekali' :
                       type === 'HARIAN' ? 'Harian (Bekerja)' :
                       type === 'MINGGUAN' ? 'Mingguan' : 'Bulanan'}
                    </button>
                  ))}
                </div>

                {jenisTempahan !== 'SEKALI' && (
                  <div className="mt-3 p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                    <span>Bilangan Ulangan Siri:</span>
                    <select
                      value={recurringCount}
                      onChange={e => setRecurringCount(Number(e.target.value))}
                      className="px-3 py-1 bg-white border border-blue-300 rounded-lg text-xs font-bold"
                    >
                      <option value={2}>2 Sesi</option>
                      <option value={4}>4 Sesi (1 Bulan)</option>
                      <option value={8}>8 Sesi (2 Bulan)</option>
                      <option value={12}>12 Sesi (3 Bulan)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Warning: Kapasiti Bilik */}
            {isOverCapacity && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Perhatian: Bilangan peserta ({bilanganPeserta} orang) melebihi kapasiti maksimum bilik ini ({selectedRoom?.kapasiti} orang).
                </span>
              </div>
            )}

            {/* Conflict Warning */}
            {conflictResult.hasConflict && (
              <ConflictWarning
                reason={conflictResult.reason}
                conflictingBooking={conflictResult.conflictingBooking}
                alternateRooms={alternateRooms}
                onSelectAlternateRoom={id => setRoomId(id)}
              />
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                disabled={!tajukMesyuarat || !tujuan || conflictResult.hasConflict}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Seterusnya: Peralatan & Susunan &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PERALATAN & SUSUNAN BILIK */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            {/* Susunan Meja */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Pilihan Susunan Meja & Kerusi
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(LAYOUT_LABELS).map(([layoutKey, label]) => (
                  <div
                    key={layoutKey}
                    onClick={() => setSusunanMeja(layoutKey as any)}
                    className={`p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all flex flex-col justify-between ${
                      susunanMeja === layoutKey
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-[10px] text-slate-400 font-normal mt-1">Disyorkan untuk {bilanganPeserta} pax</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Senarai Keperluan Peralatan & AV */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Keperluan Peralatan Audio Visual (AV)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={projektor}
                    onChange={e => setProjektor(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-xs font-semibold text-slate-800">Projektor & Skrin Bermotor HD</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={sistemAudio}
                    onChange={e => setSistemAudio(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-xs font-semibold text-slate-800">Sistem Audio & Mikrofon Tanpa Wayar</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={persidanganVideo}
                    onChange={e => setPersidanganVideo(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-xs font-semibold text-slate-800">Persidangan Video (Polycom / Teams / Zoom)</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={komputerLanjutan}
                    onChange={e => setKomputerLanjutan(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-xs font-semibold text-slate-800">Komputer / PC Urus Setia di Bilik</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={papanPutih}
                    onChange={e => setPapanPutih(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-xs font-semibold text-slate-800">Papan Putih Pintar / Smart Board</span>
                </label>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Bilangan Mikrofon Diperlukan:</span>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={mikrofonKuantiti}
                    onChange={e => setMikrofonKuantiti(Number(e.target.value))}
                    className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs text-center font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Perkhidmatan Makanan & Kebersihan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Perkhidmatan Minuman & Urus Setia
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={minuman}
                    onChange={e => setMinuman(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-xs font-semibold text-slate-800">Air Mineral & Gelas</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={jamuanRingan}
                    onChange={e => setJamuanRingan(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-xs font-semibold text-slate-800">Jamuan / Minum Ringan</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={kebersihanKhas}
                    onChange={e => setKebersihanKhas(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-xs font-semibold text-slate-800">Pembersihan Pra/Pasca Mesyuarat</span>
                </label>
              </div>
            </div>

            {/* Catatan Tambahan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Catatan Khas / Permintaan Tambahan
              </label>
              <textarea
                rows={2}
                placeholder="cth: Memerlukan susunan bendera persekutuan dan negeri di hadapan bilik..."
                value={catatanKhidmat}
                onChange={e => setCatatanKhidmat(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 transition-all outline-hidden"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                &larr; Kembali
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Seterusnya: Semakan & Hantar &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SEMAKAN & HANTAR */}
        {activeStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="font-bold text-slate-900 text-sm">{tajukMesyuarat}</span>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                  {jenisTempahan}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 text-[11px] block">Bilik Dipilih:</span>
                  <span className="font-bold text-slate-800">{selectedRoom?.nama}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Tarikh:</span>
                  <span className="font-bold text-slate-800">{formatMalayDate(tarikh)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Masa:</span>
                  <span className="font-bold text-slate-800">{masaMula} - {masaTamat}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Bilangan Peserta:</span>
                  <span className="font-bold text-slate-800">{bilanganPeserta} Orang</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Pengerusi:</span>
                  <span className="font-bold text-slate-800">{pengerusi}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Jabatan / Unit:</span>
                  <span className="font-bold text-slate-800">{selectedDept?.kod} ({unit})</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Susunan Meja:</span>
                  <span className="font-bold text-slate-800">{LAYOUT_LABELS[susunanMeja]}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Pegawai Urus Setia:</span>
                  <span className="font-bold text-slate-800">{urusSetia}</span>
                </div>
              </div>
            </div>

            {/* Akuan Pemohon */}
            <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Akuan & Terma Tempahan MPLBP:
              </p>
              <p className="text-[11px] text-blue-900/80 leading-relaxed">
                Saya mengesahkan maklumat tempahan di atas adalah benar. Sebarang pembatalan hendaklah dibuat sekurang-kurangnya 2 jam sebelum mesyuarat bermula.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                &larr; Kembali
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
              >
                Hantar Permohonan Tempahan
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
