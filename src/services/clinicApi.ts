import { Booking, GalleryItem, VisitStats } from '../types/clinic';

declare global {
  interface Window {
    CLINIC_PIC_CONFIG?: {
      APPS_SCRIPT_URL?: string;
      SHEET_URL?: string;
      gallery?: GalleryItem[];
    };
  }
}

export const CLINIC_INFO = {
  doctorName: 'دكتور غيث التميمي',
  degree: 'دكتوراه في أمراض الدم السريري',
  whatsappDisplay: '+964 781 1318002',
  whatsappUrl: 'https://wa.me/9647811318002',
  phoneTel: 'tel:+9647811318002',
  facebookUrl: 'https://www.facebook.com/share/1GTxqALAhv/',
  instagramUrl: 'https://www.instagram.com/dr.ghaith.altameemi?dmpr=dDRoaHp0M3Zueno0',
  mapsUrl: 'https://maps.app.goo.gl/GF52pXDXLFLaF6967?g_st=aw',
  doctorCode: 'cbc2000',
  designerName: 'أ.م مصطفى رحيم فندي',
  designerUrl: 'https://mustafa211r.github.io/',
};

const LS_KEYS = {
  BOOKINGS: 'ghaith_clinic_bookings_v1',
  VISITS: 'ghaith_clinic_visits_v1',
  VISIT_SESSION: 'ghaith_clinic_visit_recorded_date',
  SCRIPT_URL: 'ghaith_clinic_apps_script_url',
  SHEET_URL: 'ghaith_clinic_sheet_url',
};

export function getTodayDateStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatArabicDate(dateStr: string): string {
  if (!dateStr) return '—';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateStr;
  const dt = new Date(parts[0], parts[1] - 1, parts[2]);
  return dt.toLocaleDateString('ar-IQ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getGalleryItems(): GalleryItem[] {
  const cfg = window.CLINIC_PIC_CONFIG;
  if (cfg && Array.isArray(cfg.gallery) && cfg.gallery.length > 0) {
    return cfg.gallery;
  }
  return [
    {
      id: 'pic-1',
      src: '/image_folder/doctor_clinic.svg',
      title: 'دكتور غيث التميمي — عيادة أمراض الدم السريري',
      subtitle: 'دكتوراه في أمراض الدم السريري · استشارات وتشخيص دقيق',
      tag: 'العيادة والموقع',
      news: 'أهلاً بكم في عيادة الدكتور غيث التميمي (دكتوراه في أمراض الدم السريري) — الحجز الإلكتروني متاح الآن يومياً.',
    },
    {
      id: 'pic-2',
      src: '/image_folder/hematology_care.svg',
      title: 'تشخيص ومتابعة أمراض الدم وتحليل CBC',
      subtitle: 'قراءة دقيقة لنسب كريات الدم والهيموغلوبين والصفائح',
      tag: 'المختبر السريري',
      news: 'يمكنكم فحص نتائج تحليل CBC عبر التبويب المخصص في الموقع والحصول على التفسير الفوري باللغة العربية.',
    },
    {
      id: 'pic-3',
      src: '/image_folder/clinic_hours.svg',
      title: 'خدمة الحجز الإلكتروني السريع للمراجعين',
      subtitle: 'احجز دورك لليوم أو لأي موعد قادم واحصل على رقمك فوراً',
      tag: 'المواعيد',
      news: 'عند الحجز عبر الزر الأوسط في الشريط السفلي تحصل على رقم دورك وتاريخ الموعد مباشرة.',
    },
  ];
}

export function getConfiguredUrls(): { appsScriptUrl: string; sheetUrl: string } {
  const picCfg = window.CLINIC_PIC_CONFIG || {};
  const lsScript = localStorage.getItem(LS_KEYS.SCRIPT_URL) || '';
  const lsSheet = localStorage.getItem(LS_KEYS.SHEET_URL) || '';
  return {
    appsScriptUrl: (lsScript || picCfg.APPS_SCRIPT_URL || '').trim(),
    sheetUrl: (lsSheet || picCfg.SHEET_URL || '').trim(),
  };
}

export function saveConfiguredUrls(appsScriptUrl: string, sheetUrl: string): void {
  localStorage.setItem(LS_KEYS.SCRIPT_URL, appsScriptUrl.trim());
  localStorage.setItem(LS_KEYS.SHEET_URL, sheetUrl.trim());
}

export function extractSheetId(urlOrId: string): string {
  const s = (urlOrId || '').trim();
  const m = s.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : s;
}

function loadLocalBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LS_KEYS.BOOKINGS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalBookings(list: Booking[]): void {
  try {
    localStorage.setItem(LS_KEYS.BOOKINGS, JSON.stringify(list));
  } catch {
    // ignore storage quota
  }
}

function loadLocalVisits(): VisitStats {
  const today = getTodayDateStr();
  try {
    const raw = localStorage.getItem(LS_KEYS.VISITS);
    if (raw) {
      const parsed = JSON.parse(raw) as VisitStats;
      const history = Array.isArray(parsed.dailyHistory) ? parsed.dailyHistory : [];
      const todayEntry = history.find((h) => h.date === today);
      return {
        totalVisits: Number(parsed.totalVisits || 0),
        todayVisits: todayEntry ? todayEntry.count : 0,
        today,
        dailyHistory: history,
      };
    }
  } catch {
    // ignore
  }
  return {
    totalVisits: 0,
    todayVisits: 0,
    today,
    dailyHistory: [{ date: today, count: 0 }],
  };
}

function saveLocalVisits(stats: VisitStats): void {
  try {
    localStorage.setItem(LS_KEYS.VISITS, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          q = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      q = true;
    } else if (c === ',') {
      row.push(cur);
      cur = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur);
      cur = '';
      rows.push(row);
      row = [];
    } else {
      cur += c;
    }
  }
  if (cur !== '' || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

function csvToObjects(text: string): Record<string, string>[] {
  const rows = parseCSV(text.replace(/^\uFEFF/, ''));
  if (!rows.length) return [];
  const head = rows[0].map((h, i) => String(h).trim() || `col${i + 1}`);
  return rows
    .slice(1)
    .filter((r) => r.some((c) => String(c).trim() !== ''))
    .map((r) => {
      const obj: Record<string, string> = {};
      head.forEach((h, i) => {
        obj[h] = String(r[i] ?? '').trim();
      });
      return obj;
    });
}

async function fetchSheetGviz(sheetId: string, sheetName: string): Promise<Record<string, string>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&headers=1&_=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('sheet-http-error');
  const txt = await res.text();
  if (/^\s*</.test(txt)) throw new Error('sheet-private-or-html');
  return csvToObjects(txt);
}

export async function fetchClinicState(): Promise<{
  bookings: Booking[];
  visits: VisitStats;
  source: 'apps-script' | 'google-sheet' | 'local';
}> {
  const { appsScriptUrl, sheetUrl } = getConfiguredUrls();
  const today = getTodayDateStr();

  // 1. المحاولة الأساسية عبر Google Apps Script Web App
  if (appsScriptUrl) {
    try {
      const res = await fetch(`${appsScriptUrl}${appsScriptUrl.includes('?') ? '&' : '?'}action=all&_=${Date.now()}`, {
        redirect: 'follow',
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.ok) {
          const remoteBookings: Booking[] = Array.isArray(json.bookings) ? json.bookings : [];
          // دمج أي حجوزات محلية لم تُرفع بعد
          const remoteIds = new Set(remoteBookings.map((b) => b.id));
          const localPending = loadLocalBookings().filter((b) => !b.synced && !remoteIds.has(b.id));
          const merged = [...remoteBookings, ...localPending].sort(
            (a, b) => a.bookingDate.localeCompare(b.bookingDate) || a.queueNumber - b.queueNumber
          );
          saveLocalBookings(merged);

          const visits: VisitStats = json.visits || loadLocalVisits();
          saveLocalVisits(visits);
          return { bookings: merged, visits, source: 'apps-script' };
        }
      }
    } catch {
      // المتابعة للخطة البديلة
    }
  }

  // 2. خطة بديلة: قراءة جدول Google Sheets مباشرة عبر رابط Sheets
  const sheetId = extractSheetId(sheetUrl);
  if (sheetId) {
    try {
      const [bRows, vRows] = await Promise.all([
        fetchSheetGviz(sheetId, 'Bookings'),
        fetchSheetGviz(sheetId, 'Visits').catch(() => []),
      ]);

      const bookings: Booking[] = bRows
        .filter((r) => r.fullName || r.id)
        .map((r) => ({
          id: r.id || `bk_${r.queueNumber}_${r.bookingDate}`,
          queueNumber: Number(r.queueNumber || 0),
          bookingDate: r.bookingDate || today,
          fullName: r.fullName || '',
          phone: r.phone || '',
          condition: r.condition || '',
          status: r.status || 'بانتظار المراجعة',
          createdAt: r.createdAt || '',
          synced: true,
        }));

      saveLocalBookings(bookings);

      let totalVisits = 0;
      let todayVisits = 0;
      const dailyHistory: { date: string; count: number }[] = [];
      for (const v of vRows) {
        if (v.date === 'TOTAL') {
          totalVisits = Number(v.count || 0);
        } else if (v.date) {
          const c = Number(v.count || 0);
          if (v.date === today) todayVisits = c;
          dailyHistory.push({ date: v.date, count: c });
        }
      }
      const visits: VisitStats = vRows.length
        ? { totalVisits, todayVisits, today, dailyHistory: dailyHistory.slice(-14) }
        : loadLocalVisits();
      saveLocalVisits(visits);

      return { bookings, visits, source: 'google-sheet' };
    } catch {
      // المتابعة للتخزين المحلي
    }
  }

  return {
    bookings: loadLocalBookings(),
    visits: loadLocalVisits(),
    source: 'local',
  };
}

export async function recordClinicVisit(): Promise<VisitStats> {
  const today = getTodayDateStr();
  const alreadyRecordedDate = sessionStorage.getItem(LS_KEYS.VISIT_SESSION);

  if (alreadyRecordedDate === today) {
    return loadLocalVisits();
  }

  sessionStorage.setItem(LS_KEYS.VISIT_SESSION, today);

  // تحديث فوري محلياً
  const current = loadLocalVisits();
  const history = [...current.dailyHistory];
  const idx = history.findIndex((h) => h.date === today);
  if (idx >= 0) {
    history[idx] = { ...history[idx], count: history[idx].count + 1 };
  } else {
    history.push({ date: today, count: 1 });
  }
  const updatedLocal: VisitStats = {
    totalVisits: current.totalVisits + 1,
    todayVisits: idx >= 0 ? history[idx].count : 1,
    today,
    dailyHistory: history.slice(-14),
  };
  saveLocalVisits(updatedLocal);

  const { appsScriptUrl } = getConfiguredUrls();
  if (appsScriptUrl) {
    try {
      const res = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'visit' }),
        redirect: 'follow',
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.ok && json.visits) {
          saveLocalVisits(json.visits);
          return json.visits;
        }
      }
    } catch {
      // الاحتفاظ بالعد المحلي
    }
  }

  return updatedLocal;
}

export async function submitBooking(input: {
  fullName: string;
  phone: string;
  bookingDate: string;
  condition: string;
}): Promise<{ booking: Booking; syncedToSheet: boolean }> {
  const { appsScriptUrl } = getConfiguredUrls();
  const existing = loadLocalBookings();

  // إرسال عبر Apps Script أولاً للحصول على رقم الدور المتسلسل من الشيت
  if (appsScriptUrl) {
    try {
      const res = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'book',
          fullName: input.fullName.trim(),
          phone: input.phone.trim(),
          bookingDate: input.bookingDate,
          condition: input.condition.trim(),
        }),
        redirect: 'follow',
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.ok && json.booking) {
          const remoteBooking: Booking = { ...json.booking, synced: true };
          const updated = [...existing.filter((b) => b.id !== remoteBooking.id), remoteBooking];
          saveLocalBookings(updated);
          return { booking: remoteBooking, syncedToSheet: true };
        }
      }
    } catch {
      // حفظ محلي عند تعذر الاتصال
    }
  }

  // الحفظ المحلي المتسلسل حسب تاريخ الحجز
  const sameDayMax = existing
    .filter((b) => b.bookingDate === input.bookingDate)
    .reduce((max, b) => Math.max(max, Number(b.queueNumber || 0)), 0);

  const localBooking: Booking = {
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    queueNumber: sameDayMax + 1,
    bookingDate: input.bookingDate,
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    condition: input.condition.trim(),
    status: 'بانتظار المراجعة',
    createdAt: new Date().toISOString(),
    synced: false,
  };

  saveLocalBookings([...existing, localBooking]);
  return { booking: localBooking, syncedToSheet: false };
}

export async function updateBookingStatus(
  id: string,
  status: Booking['status'],
  doctorCode: string
): Promise<boolean> {
  if (doctorCode.trim() !== CLINIC_INFO.doctorCode) return false;

  const list = loadLocalBookings();
  const updated = list.map((b) => (b.id === id ? { ...b, status } : b));
  saveLocalBookings(updated);

  const { appsScriptUrl } = getConfiguredUrls();
  if (appsScriptUrl) {
    try {
      await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateStatus',
          id,
          status,
          code: doctorCode,
        }),
        redirect: 'follow',
      });
    } catch {
      // ignore network failure
    }
  }
  return true;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\s+/g, '');
  if (digits.length <= 5) return '••••';
  return `${digits.slice(0, 4)}••••${digits.slice(-2)}`;
}
