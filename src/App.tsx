import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  Building2,
  ClipboardList,
  Eye,
  FlaskConical,
  Info,
  MapPin,
  Plus,
  Stethoscope,
} from 'lucide-react';
import { AboutView } from './components/AboutView';
import { BookingModal } from './components/BookingModal';
import { BookingsView } from './components/BookingsView';
import { CbcTestView } from './components/CbcTestView';
import { ClinicView } from './components/ClinicView';
import { VisitsView } from './components/VisitsView';
import {
  CLINIC_INFO,
  fetchClinicState,
  getTodayDateStr,
  recordClinicVisit,
} from './services/clinicApi';
import { Booking, BottomView, TopTab, VisitStats } from './types/clinic';

export default function App() {
  const [activeTopTab, setActiveTopTab] = useState<TopTab>('clinic');
  const [bottomView, setBottomView] = useState<BottomView>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visits, setVisits] = useState<VisitStats>({
    totalVisits: 0,
    todayVisits: 0,
    today: getTodayDateStr(),
    dailyHistory: [],
  });
  const [syncSource, setSyncSource] = useState<'apps-script' | 'google-sheet' | 'local'>('local');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPrefillCondition, setBookingPrefillCondition] = useState('');

  const [toast, setToast] = useState<{ msg: string; kind: '' | 'ok' | 'bad' } | null>(null);

  const showToast = useCallback((msg: string, kind: '' | 'ok' | 'bad' = '') => {
    setToast({ msg, kind });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, [toast]);

  const loadData = useCallback(async (manual = false) => {
    setIsRefreshing(true);
    try {
      const state = await fetchClinicState();
      setBookings(state.bookings);
      setVisits(state.visits);
      setSyncSource(state.source);
      if (manual) {
        showToast('تم تحديث البيانات بنجاح', 'ok');
      }
    } catch {
      if (manual) showToast('تعذر الاتصال، يتم عرض البيانات المحفوظة محلياً', 'bad');
    } finally {
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    const init = async () => {
      const updatedVisits = await recordClinicVisit();
      setVisits(updatedVisits);
      await loadData(false);
    };
    init();
  }, [loadData]);

  const handleSelectTopTab = (tab: TopTab) => {
    setBottomView(null);
    setActiveTopTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingsView = () => {
    setBottomView('bookings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingModal = (prefill = '') => {
    setBookingPrefillCondition(prefill);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = async (booking: Booking, syncedToSheet: boolean) => {
    setBookings((prev) => {
      const next = [...prev.filter((b) => b.id !== booking.id), booking];
      return next.sort(
        (a, b) => a.bookingDate.localeCompare(b.bookingDate) || a.queueNumber - b.queueNumber
      );
    });
    showToast(
      syncedToSheet
        ? `تم تسجيل حجزك رقم ${booking.queueNumber} ومزامنته مع السجل`
        : `تم تسجيل حجزك رقم ${booking.queueNumber} بنجاح`,
      'ok'
    );
  };

  const today = getTodayDateStr();
  const todayBookingsCount = bookings.filter((b) => b.bookingDate === today).length;

  const topTabs: { id: TopTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'clinic', label: 'العيادة', icon: Building2 },
    { id: 'visits', label: 'عدد الزيارات', icon: Eye },
    { id: 'cbc', label: 'اختبار CBC', icon: FlaskConical },
    { id: 'about', label: 'حول', icon: Info },
  ];

  const currentViewKey = bottomView === 'bookings' ? 'bookings' : activeTopTab;

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f3ec] text-[#1d1d1f]">
      {/* الهيدر الرئيسي بتصميم الكحلي والذهبي */}
      <header className="bg-gradient-to-b from-[#0b1f3a] via-[#0b1f3a] to-[#081729] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(201,162,39,0.28), transparent 45%), radial-gradient(circle at 80% 30%, rgba(201,162,39,0.18), transparent 45%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 pt-4 pb-6 flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between gap-3 mb-3">
            <a
              href={CLINIC_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/25 hover:border-[#c9a227] hover:bg-[#c9a227]/15 text-xs font-semibold text-white transition-colors min-h-[38px] whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c9a227]" />
              <span>موقع العيادة</span>
            </a>

            <button
              type="button"
              onClick={handleOpenBookingsView}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#c9a227]/55 bg-white/10 hover:bg-[#c9a227]/20 text-xs font-bold text-[#c9a227] transition-colors min-h-[38px] whitespace-nowrap"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>حجوزات اليوم:</span>
              <span className="font-mono-num text-white">{todayBookingsCount}</span>
            </button>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-20 rounded-full bg-white p-1.5 border-2 border-[#c9a227] shadow-[0_8px_28px_rgba(0,0,0,0.4)] mb-3 flex items-center justify-center"
          >
            <div className="w-full h-full rounded-full bg-[#0b1f3a] flex items-center justify-center text-[#c9a227]">
              <Stethoscope className="w-9 h-9" />
            </div>
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            عيادة {CLINIC_INFO.doctorName}
          </h1>
          <div className="gold-line my-2.5" />
          <p className="text-xs sm:text-sm text-white/80 max-w-md">
            {CLINIC_INFO.degree} · الحجز الإلكتروني، متابعة المواعيد، وقراءة تحليل الدم CBC
          </p>
        </div>
      </header>

      {/* شريط التبويبات العلوي */}
      <nav
        aria-label="التبويبات الرئيسية"
        className="sticky top-0 z-30 bg-[#f6f3ec]/95 backdrop-blur-md border-b border-[#0b1f3a]/10"
      >
        <div className="max-w-5xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {topTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = bottomView === null && activeTopTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTopTab(tab.id)}
                className={`flex-1 min-w-fit flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 min-h-[40px] ${
                  isActive
                    ? 'bg-[#c9a227] text-[#0b1f3a] shadow-[0_4px_14px_rgba(201,162,39,0.35)]'
                    : 'bg-white text-[#0b1f3a] border border-[#0b1f3a]/10 hover:border-[#c9a227]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentViewKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {bottomView === 'bookings' ? (
              <BookingsView
                bookings={bookings}
                isRefreshing={isRefreshing}
                onRefresh={() => loadData(true)}
                onBookingUpdated={() => loadData(false)}
                onShowToast={showToast}
                onOpenNewBooking={() => handleOpenBookingModal('')}
              />
            ) : activeTopTab === 'clinic' ? (
              <ClinicView
                onOpenBooking={() => handleOpenBookingModal('')}
                onSwitchTab={handleSelectTopTab}
                todayBookingsCount={todayBookingsCount}
              />
            ) : activeTopTab === 'visits' ? (
              <VisitsView
                visits={visits}
                bookings={bookings}
                syncSource={syncSource}
                isRefreshing={isRefreshing}
                onRefresh={() => loadData(true)}
              />
            ) : activeTopTab === 'cbc' ? (
              <CbcTestView
                onBookWithSummary={(summary) => handleOpenBookingModal(summary)}
              />
            ) : (
              <AboutView
                onConfigSaved={() => loadData(true)}
                onShowToast={showToast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* التذييل */}
      <footer className="bg-[#081729] text-[#d1d5db] text-center text-xs sm:text-sm py-6 px-4 mt-8">
        <div className="gold-line mx-auto mb-3" />
        <p className="font-semibold text-white">
          © {new Date().getFullYear()} عيادة {CLINIC_INFO.doctorName} — جميع الحقوق محفوظة
        </p>
        <p className="text-xs text-[#9ca3af] mt-1">
          تصميم:{' '}
          <a
            href={CLINIC_INFO.designerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a227] hover:underline font-semibold"
          >
            {CLINIC_INFO.designerName}
          </a>
        </p>
      </footer>

      {/* الشريط السفلي الثابت (يمين: الحجوزات | وسط: حجز بأسلوب تيك توك | يسار: العيادة) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#0b1f3a]/10 shadow-[0_-8px_24px_rgba(11,31,58,0.08)]">
        <div className="max-w-lg mx-auto px-4 h-16 grid grid-cols-3 items-center">
          {/* الجهة اليمنى (في RTL العنصر الأول يظهر يميناً): الحجوزات */}
          <button
            type="button"
            onClick={handleOpenBookingsView}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 min-h-[48px] transition-colors ${
              bottomView === 'bookings'
                ? 'text-[#b8911f] font-extrabold'
                : 'text-[#0b1f3a]/75 hover:text-[#0b1f3a] font-semibold'
            }`}
          >
            <div className="relative">
              <ClipboardList className="w-5 h-5" />
              {todayBookingsCount > 0 && (
                <span className="absolute -top-1.5 -left-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#0b1f3a] text-[#c9a227] text-[10px] font-mono-num font-extrabold flex items-center justify-center">
                  {todayBookingsCount}
                </span>
              )}
            </div>
            <span className="text-[11px]">الحجوزات</span>
          </button>

          {/* المنتصف: زر حجز يشبه إضافة ريلز في تيك توك */}
          <div className="flex flex-col items-center justify-center -mt-4">
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => handleOpenBookingModal('')}
              aria-label="حجز موعد جديد"
              className="relative group flex items-center justify-center"
            >
              {/* طبقتا الألوان الجانبيتان المستوحاة من زر تيك توك بالهوية الكحلية والذهبية */}
              <span className="absolute -right-1 inset-y-0.5 w-12 rounded-2xl bg-[#c9a227] transition-transform group-hover:translate-x-0.5" />
              <span className="absolute -left-1 inset-y-0.5 w-12 rounded-2xl bg-[#1d4ed8] opacity-85 transition-transform group-hover:-translate-x-0.5" />
              <span className="relative w-14 h-10 rounded-2xl bg-[#0b1f3a] text-white flex items-center justify-center border border-white/25 tiktok-book-btn">
                <Plus className="w-6 h-6 text-[#c9a227] stroke-[2.75]" />
              </span>
            </motion.button>
            <span className="text-[11px] font-extrabold text-[#0b1f3a] mt-1">حجز</span>
          </div>

          {/* الجهة اليسرى (العنصر الثالث في RTL): العيادة / اختبار CBC */}
          <button
            type="button"
            onClick={() =>
              handleSelectTopTab(bottomView === 'bookings' ? 'clinic' : activeTopTab === 'cbc' ? 'clinic' : 'cbc')
            }
            className={`flex flex-col items-center justify-center gap-0.5 py-1 min-h-[48px] transition-colors ${
              bottomView === null && activeTopTab === 'cbc'
                ? 'text-[#b8911f] font-extrabold'
                : 'text-[#0b1f3a]/75 hover:text-[#0b1f3a] font-semibold'
            }`}
          >
            {bottomView === 'bookings' || activeTopTab === 'cbc' ? (
              <>
                <Activity className="w-5 h-5" />
                <span className="text-[11px]">العيادة</span>
              </>
            ) : (
              <>
                <FlaskConical className="w-5 h-5" />
                <span className="text-[11px]">تحليل CBC</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* نافذة الحجز المنبثقة */}
      <BookingModal
        isOpen={isBookingOpen}
        initialCondition={bookingPrefillCondition}
        onClose={() => setIsBookingOpen(false)}
        onBooked={handleBookingSuccess}
      />

      {/* إشعار Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xl border max-w-[90vw] text-center ${
              toast.kind === 'bad'
                ? 'bg-[#7f1d1d] text-white border-[#d33333]'
                : toast.kind === 'ok'
                  ? 'bg-[#0b1f3a] text-white border-[#34d399]'
                  : 'bg-[#0b1f3a] text-white border-[#c9a227]'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
