import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Room, RoomStatus, STANDARD_FACILITIES } from '../../types/room';
import { useBooking } from '../../contexts/BookingContext';
import { Image, Layers, Sparkles, Users, MapPin } from 'lucide-react';

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomToEdit?: Room | null;
}

export const RoomFormModal: React.FC<RoomFormModalProps> = ({
  isOpen,
  onClose,
  roomToEdit
}) => {
  const { createRoom, updateRoom } = useBooking();

  const [nama, setNama] = useState('');
  const [kodBilik, setKodBilik] = useState('');
  const [lokasi, setLokasi] = useState('Kompleks Pejabat MPLBP, Kuah');
  const [aras, setAras] = useState('Aras 2');
  const [kapasiti, setKapasiti] = useState(25);
  const [penerangan, setPenerangan] = useState('');
  const [gambar, setGambar] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80');
  const [kemudahan, setKemudahan] = useState<string[]>([...STANDARD_FACILITIES.slice(0, 5)]);
  const [status, setStatus] = useState<RoomStatus>('AKTIF');
  const [warna, setWarna] = useState('#1e3a8a');

  useEffect(() => {
    if (roomToEdit) {
      setNama(roomToEdit.nama);
      setKodBilik(roomToEdit.kodBilik);
      setLokasi(roomToEdit.lokasi);
      setAras(roomToEdit.aras);
      setKapasiti(roomToEdit.kapasiti);
      setPenerangan(roomToEdit.penerangan);
      setGambar(roomToEdit.gambar);
      setKemudahan(roomToEdit.kemudahan);
      setStatus(roomToEdit.status);
      setWarna(roomToEdit.warna);
    } else {
      setNama('');
      setKodBilik(`BM-${Math.floor(10 + Math.random() * 90)}`);
      setLokasi('Kompleks Pejabat MPLBP, Kuah');
      setAras('Aras 2');
      setKapasiti(25);
      setPenerangan('');
      setGambar('https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80');
      setKemudahan([...STANDARD_FACILITIES.slice(0, 5)]);
      setStatus('AKTIF');
      setWarna('#1e3a8a');
    }
  }, [roomToEdit, isOpen]);

  const toggleFacility = (facility: string) => {
    if (kemudahan.includes(facility)) {
      setKemudahan(kemudahan.filter(f => f !== facility));
    } else {
      setKemudahan([...kemudahan, facility]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !kodBilik) return;

    if (roomToEdit) {
      updateRoom(roomToEdit.roomId, {
        nama,
        kodBilik,
        lokasi,
        aras,
        kapasiti: Number(kapasiti),
        penerangan,
        gambar,
        kemudahan,
        status,
        warna
      });
    } else {
      createRoom({
        nama,
        kodBilik,
        lokasi,
        aras,
        kapasiti: Number(kapasiti),
        penerangan,
        gambar,
        kemudahan,
        status,
        warna
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={roomToEdit ? 'Kemaskini Bilik Mesyuarat' : 'Tambah Bilik Mesyuarat Baharu'}
      subtitle="Pengurusan Fasiliti MPLBP"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Bilik Mesyuarat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth: Bilik Mesyuarat Utama Mahsuri"
              value={nama}
              onChange={e => setNama(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-sm font-bold text-slate-800 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kod Bilik <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth: BM-MHS-01"
              value={kodBilik}
              onChange={e => setKodBilik(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 font-mono text-xs text-slate-800 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kapasiti Maksimum (Peserta) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={2}
              max={500}
              required
              value={kapasiti}
              onChange={e => setKapasiti(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-xs font-bold text-slate-800 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Aras / Blok <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth: Aras 3 (Sayap VIP)"
              value={aras}
              onChange={e => setAras(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-xs text-slate-800 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Lokasi Bangunan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={lokasi}
              onChange={e => setLokasi(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-xs text-slate-800 outline-hidden"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Penerangan / Spesifikasi Bilik
            </label>
            <textarea
              rows={2}
              placeholder="Terangkan fungsi bilik, kelengkapan khas, suasana..."
              value={penerangan}
              onChange={e => setPenerangan(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 text-xs text-slate-800 outline-hidden"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pautan URL Gambar Bilik
            </label>
            <input
              type="url"
              value={gambar}
              onChange={e => setGambar(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 text-xs text-slate-800 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Operasi
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as RoomStatus)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-xs font-bold text-slate-800 outline-hidden"
            >
              <option value="AKTIF">Aktif / Tersedia</option>
              <option value="TIDAK_AKTIF">Tidak Aktif</option>
              <option value="PENYELENGGARAAN">Dalam Penyelenggaraan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Warna Pengecam Kalendar
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={warna}
                onChange={e => setWarna(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
              />
              <span className="font-mono text-xs text-slate-600 uppercase font-bold">{warna}</span>
            </div>
          </div>

          {/* Checklist Kemudahan */}
          <div className="md:col-span-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Kemudahan & Peralatan Disediakan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STANDARD_FACILITIES.map(f => (
                <label
                  key={f}
                  className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70"
                >
                  <input
                    type="checkbox"
                    checked={kemudahan.includes(f)}
                    onChange={() => toggleFacility(f)}
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-xs text-slate-800">{f}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
          >
            {roomToEdit ? 'Simpan Perubahan' : 'Daftar Bilik'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
