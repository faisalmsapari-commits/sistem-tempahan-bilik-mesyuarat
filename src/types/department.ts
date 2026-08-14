export interface Department {
  deptId: string;
  kod: string;
  nama: string;
  ketuaJabatan: string;
  emel: string;
  noTelefon: string;
  unitList: string[];
  status: 'AKTIF' | 'TIDAK_AKTIF';
  createdAt: string;
  updatedAt: string;
}
