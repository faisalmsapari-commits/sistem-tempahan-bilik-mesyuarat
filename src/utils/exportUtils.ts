import { Booking } from '../types/booking';
import { formatMalayDate } from './dateUtils';

export function exportBookingsToCSV(bookings: Booking[], filename: string = 'laporan-tempahan-mplbp.csv') {
  const headers = [
    'No. Rujukan',
    'Tajuk Mesyuarat',
    'Bilik',
    'Tarikh',
    'Masa Mula',
    'Masa Tamat',
    'Pemohon',
    'Jabatan',
    'Bil. Peserta',
    'Status',
    'Pengerusi',
    'Tarikh Dicipta'
  ];

  const rows = bookings.map(b => [
    `"${b.noRujukan}"`,
    `"${b.tajukMesyuarat.replace(/"/g, '""')}"`,
    `"${b.roomName || ''}"`,
    `"${b.tarikh}"`,
    `"${b.masaMula}"`,
    `"${b.masaTamat}"`,
    `"${b.userName}"`,
    `"${b.jabatanNama}"`,
    b.bilanganPeserta,
    `"${b.status}"`,
    `"${b.pengerusi || ''}"`,
    `"${formatMalayDate(b.createdAt)}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
