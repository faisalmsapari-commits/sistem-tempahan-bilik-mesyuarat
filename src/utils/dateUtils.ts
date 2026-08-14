import { format, parseISO, isToday, isTomorrow, isPast, isFuture, addDays, addWeeks, addMonths } from 'date-fns';

const MALAY_MONTHS = [
  'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
  'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
];

const MALAY_DAYS = [
  'Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'
];

export function formatMalayDate(dateString: string | Date): string {
  try {
    const d = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const day = d.getDate();
    const month = MALAY_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return String(dateString);
  }
}

export function formatMalayDateWithDay(dateString: string | Date): string {
  try {
    const d = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const dayName = MALAY_DAYS[d.getDay()];
    const day = d.getDate();
    const month = MALAY_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  } catch {
    return String(dateString);
  }
}

export function formatMalayDateTime(isoString: string): string {
  try {
    const d = parseISO(isoString);
    const dateFormatted = formatMalayDate(d);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${dateFormatted}, ${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}

export function formatTimeSlot(start: string, end: string): string {
  return `${start} - ${end}`;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Jana senarai tarikh berulang (harian, mingguan, bulanan)
 */
export function generateRecurringDates(
  startDateStr: string,
  type: 'HARIAN' | 'MINGGUAN' | 'BULANAN',
  count: number = 4
): string[] {
  const dates: string[] = [];
  const start = parseISO(startDateStr);

  for (let i = 0; i < count; i++) {
    let nextDate: Date;
    if (type === 'HARIAN') {
      nextDate = addDays(start, i);
      // Skip weekends if needed (e.g. Saturday/Sunday)
      if (nextDate.getDay() === 0 || nextDate.getDay() === 6) continue;
    } else if (type === 'MINGGUAN') {
      nextDate = addWeeks(start, i);
    } else {
      nextDate = addMonths(start, i);
    }

    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextDate.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
}

/**
 * Semak sama ada slot waktu mesyuarat sedang aktif sekarang
 */
export function isMeetingOngoing(tarikh: string, masaMula: string, masaTamat: string): boolean {
  const today = getTodayDateString();
  if (tarikh !== today) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = masaMula.split(':').map(Number);
  const [endH, endM] = masaTamat.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

/**
 * Semak sama ada mesyuarat akan bermula dalam masa 30 minit
 */
export function isMeetingUpcomingSoon(tarikh: string, masaMula: string): boolean {
  const today = getTodayDateString();
  if (tarikh !== today) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = masaMula.split(':').map(Number);
  const startMinutes = startH * 60 + startM;

  return startMinutes > currentMinutes && (startMinutes - currentMinutes) <= 30;
}
