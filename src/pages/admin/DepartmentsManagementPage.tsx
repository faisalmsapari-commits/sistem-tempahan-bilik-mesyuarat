import React, { useState } from 'react';
import { useBooking } from '../../contexts/BookingContext';
import { Department } from '../../types/department';
import { Modal } from '../../components/common/Modal';
import { Building2, Plus, Edit, Phone, Mail, User, Layers } from 'lucide-react';

export const DepartmentsManagementPage: React.FC = () => {
  const { departments, createDepartment, updateDepartment } = useBooking();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deptToEdit, setDeptToEdit] = useState<Department | null>(null);

  const [kod, setKod] = useState('');
  const [nama, setNama] = useState('');
  const [ketuaJabatan, setKetuaJabatan] = useState('');
  const [emel, setEmel] = useState('');
  const [noTelefon, setNoTelefon] = useState('');
  const [unitListStr, setUnitListStr] = useState('');

  const openAdd = () => {
    setDeptToEdit(null);
    setKod('');
    setNama('');
    setKetuaJabatan('');
    setEmel('');
    setNoTelefon('04-9666');
    setUnitListStr('Unit Pentadbiran, Unit Operasi');
    setIsModalOpen(true);
  };

  const openEdit = (d: Department) => {
    setDeptToEdit(d);
    setKod(d.kod);
    setNama(d.nama);
    setKetuaJabatan(d.ketuaJabatan);
    setEmel(d.emel);
    setNoTelefon(d.noTelefon);
    setUnitListStr(d.unitList.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unitList = unitListStr.split(',').map(u => u.trim()).filter(Boolean);

    if (deptToEdit) {
      updateDepartment(deptToEdit.deptId, {
        kod,
        nama,
        ketuaJabatan,
        emel,
        noTelefon,
        unitList
      });
    } else {
      createDepartment({
        kod,
        nama,
        ketuaJabatan,
        emel,
        noTelefon,
        unitList,
        status: 'AKTIF'
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pengurusan Jabatan & Unit MPLBP
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Struktur organisasi jabatan majlis perbandaran bagi agihan tempahan bilik.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Jabatan Baharu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(d => (
          <div
            key={d.deptId}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-xl">
                  {d.kod}
                </span>
                <button
                  onClick={() => openEdit(d)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors"
                  title="Kemaskini Jabatan"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{d.nama}</h3>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ketua: <strong>{d.ketuaJabatan}</strong></span>
                </p>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {d.emel}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {d.noTelefon}</p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unit / Bahagian:</p>
                <div className="flex flex-wrap gap-1">
                  {d.unitList.map((u, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={deptToEdit ? 'Kemaskini Jabatan' : 'Tambah Jabatan Baharu'}
        subtitle="Struktur Organisasi MPLBP"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kod Singkatan Jabatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="cth: JKP"
                value={kod}
                onChange={e => setKod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                No. Telefon
              </label>
              <input
                type="text"
                value={noTelefon}
                onChange={e => setNoTelefon(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Penuh Jabatan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth: Jabatan Khidmat Pengurusan"
              value={nama}
              onChange={e => setNama(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Pengarah / Ketua Jabatan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={ketuaJabatan}
              onChange={e => setKetuaJabatan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Emel Rasmi Jabatan
            </label>
            <input
              type="email"
              value={emel}
              onChange={e => setEmel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Senarai Unit (Asingkan dengan koma)
            </label>
            <textarea
              rows={2}
              value={unitListStr}
              onChange={e => setUnitListStr(e.target.value)}
              placeholder="cth: Unit Pentadbiran, Unit Sumber Manusia, Unit IT"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
            >
              {deptToEdit ? 'Simpan Perubahan' : 'Daftar Jabatan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
