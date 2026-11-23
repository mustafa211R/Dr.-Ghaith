import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar,
  CheckCircle2,
  Lock,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import {
  CLINIC_INFO,
  formatArabicDate,
  getTodayDateStr,
  maskPhone,
  updateBookingStatus,
} from '../services/clinicApi';
import { Booking } from '../types/clinic';

interface BookingsViewProps {
  bookings: Booking[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onBookingUpdated: () => void;
  onShowToast: (msg: string, type?: 'ok' | 'bad') => void;
  onOpenNewBooking: () => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  isRefreshing,
  onRefresh,
  onBookingUpdated,
  onShowToast,
  onOpenNewBooking,
}) => {
  const today = getTodayDateStr();

  const [scopeMode, setScopeMode] = useState<'today' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // تدفق التحقق من الدكتور وعرض بروفايل المريض
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [verifyStep, setVerifyStep] = useState<'ask' | 'code' | 'profile' | null>(null);
  const [doctorCodeInput, setDoctorCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const hasExplicitSearch = Boolean(q || dateFilter);

    return bookings
      .filter((b) => {
        // تلقائياً تظهر حجوزات اليوم ما لم يختر المستخدم "الكل" أو يبحث بتاريخ محدد
        if (!hasExplicitSearch && scopeMode === 'today' && b.bookingDate !== today) {
          return false;
        }
        if (dateFilter && b.bookingDate !== dateFilter) {
          return false;
        }
        if (q) {
          const matchName = b.fullName.toLowerCase().includes(q);
          const matchQueue = String(b.queueNumber) === q || `#${b.queueNumber}` === q;
          const matchDate = b.bookingDate.includes(q);
          return matchName || matchQueue || matchDate;
        }
        return true;
      })
      .sort((a, b) => a.bookingDate.localeCompare(b.bookingDate) || a.queueNumber - b.queueNumber);
  }, [bookings, scopeMode, searchQuery, dateFilter, today]);

  const todayCount = useMemo(
    () => bookings.filter((b) => b.bookingDate === today).length,
    [bookings, today]
  );

  const handleOpenBookingItem = (booking: Booking) => {
    setSelectedBooking(booking);
    setDoctorCodeInput('');
    setCodeError('');
    setVerifyStep('ask');
  };

  const handleVerifyDoctorCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctorCodeInput.trim() === CLINIC_INFO.doctorCode) {
      setCodeError('');
      setVerifyStep('profile');
    } else {
      setCodeError('الكود غير صحيح. هذه البيانات مخصصة للدكتور غيث التميمي فقط.');
    }
  };

  const handleStatusChange = async (newStatus: Booking['status']) => {
    if (!selectedBooking) return;
    setUpdatingStatus(true);
    const ok = await updateBookingStatus(
      selectedBooking.id,
      newStatus,
      CLINIC_INFO.doctorCode
    );
    setUpdatingStatus(false);
    if (ok) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
      onBookingUpdated();
      onShowToast(`تم تحديث حالة الحجز إلى: ${newStatus}`, 'ok');
    }
  };

  const closeVerification = () => {
    setSelectedBooking(null);
    setVerifyStep(null);
    setDoctorCodeInput('');
    setCodeError('');
  };

  const cleanWhatsAppPhone = (raw: string) => {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('00')) digits = digits.slice(2);
    else if (digits.startsWith('0')) digits = '964' + digits.slice(1);
    return digits;
  };

  return (
    <div className="space-y-4">
      {/* ترويسة الحجوزات */}
      <div className="bg-white rounded-[22px] border border-[#0b1f3a]/10 p-4 sm:p-5 shadow-[0_6px_24px_rgba(11,31,58,0.06)] space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0b1f3a]">
              سجل الحجوزات والمواعيد
            </h2>
            <p className="text-xs text-[#6e6e73] mt-0.5">
              حجوزات اليوم ({today}): <strong className="font-mono-num text-[#0b1f3a]">{todayCount}</strong> · اضغط على أي حجز لفتح ملف المريض (خاص بالدكتور)
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="تحديث الحجوزات"
            className="w-10 h-10 rounded-full bg-[#f6f3ec] hover:border-[#c9a227] border border-[#0b1f3a]/10 flex items-center justify-center text-[#0b1f3a] transition-colors shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* البحث بالاسم أو رقم الحجز أو التاريخ */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المريض، رقم الحجز (مثال 19)، أو التاريخ..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-[#0b1f3a]/15 bg-[#f6f3ec]/40 focus:bg-white focus:border-[#c9a227] focus:outline-none text-sm min-h-[44px]"
            />
          </div>
          <div className="sm:col-span-4 relative">
            <Calendar className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              aria-label="تصفية بتاريخ محدد"
              className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-[#0b1f3a]/15 bg-[#f6f3ec]/40 focus:bg-white focus:border-[#c9a227] focus:outline-none text-sm font-mono-num min-h-[44px]"
            />
          </div>
        </div>

        {/* تبديل حجوزات اليوم / جميع الحجوزات */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-grid grid-cols-2 gap-1 p-1 rounded-full bg-[#f6f3ec] border border-[#0b1f3a]/10">
            <button
              type="button"
              onClick={() => {
                setScopeMode('today');
                setDateFilter('');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all min-h-[36px] ${
                scopeMode === 'today' && !dateFilter
                  ? 'bg-[#0b1f3a] text-white'
                  : 'text-[#0b1f3a]'
              }`}
            >
              حجوزات اليوم ({todayCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setScopeMode('all');
                setDateFilter('');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all min-h-[36px] ${
                scopeMode === 'all' && !dateFilter
                  ? 'bg-[#0b1f3a] text-white'
                  : 'text-[#0b1f3a]'
              }`}
            >
              كل الحجوزات ({bookings.length})
            </button>
          </div>

          {(searchQuery || dateFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDateFilter('');
              }}
              className="text-xs font-bold text-[#b8911f] hover:underline"
            >
              مسح الفلتر
            </button>
          )}
        </div>
      </div>

      {/* قائمة الحجوزات */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-[22px] border border-[#0b1f3a]/10 p-8 text-center shadow-[0_4px_16px_rgba(11,31,58,0.06)]">
          <UserRound className="w-10 h-10 text-[#c9a227] mx-auto mb-2.5" />
          <p className="font-bold text-[#0b1f3a] text-base">
            {searchQuery || dateFilter
              ? 'لا توجد حجوزات مطابقة لبحثك'
              : 'لا توجد حجوزات مسجلة لهذا اليوم بعد'}
          </p>
          <p className="text-xs text-[#6e6e73] mt-1">
            يمكنك تسجيل حجز جديد من الزر الأوسط في الشريط السفلي
          </p>
          <button
            type="button"
            onClick={onOpenNewBooking}
            className="mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#c9a227] hover:bg-[#b8911f] text-[#0b1f3a] font-bold text-sm transition-colors min-h-[42px]"
          >
            تسجيل حجز جديد
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredBookings.map((booking, idx) => (
            <motion.button
              key={booking.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx, 10) * 0.03 }}
              onClick={() => handleOpenBookingItem(booking)}
              className="w-full text-right bg-white hover:border-[#c9a227] rounded-2xl border border-[#0b1f3a]/10 p-4 shadow-[0_2px_12px_rgba(11,31,58,0.05)] transition-all active:scale-[0.99] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#0b1f3a] text-[#c9a227] flex flex-col items-center justify-center shrink-0 font-mono-num">
                  <span className="text-[10px] text-white/70 leading-none">رقم</span>
                  <span className="text-lg font-extrabold leading-tight">
                    {booking.queueNumber}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="font-extrabold text-sm sm:text-base text-[#0b1f3a] truncate">
                    {booking.fullName}
                  </div>
                  <div className="text-xs text-[#6e6e73] mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="font-mono-num">{booking.bookingDate}</span>
                    <span>·</span>
                    <span dir="ltr" className="font-mono-num">
                      {maskPhone(booking.phone)}
                    </span>
                    <span>·</span>
                    <span
                      className={
                        booking.status === 'تم الفحص'
                          ? 'text-[#06762f] font-bold'
                          : booking.status === 'ملغي'
                            ? 'text-[#d33333] font-bold'
                            : 'text-[#b8911f] font-semibold'
                      }
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-[#6e6e73] shrink-0">
                <Lock className="w-3.5 h-3.5 text-[#c9a227]" />
                <span className="hidden sm:inline">ملف المريض</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* نافذة التحقق من الدكتور (هل أنت الدكتور -> كود cbc2000 -> بروفايل المريض) */}
      <AnimatePresence>
        {selectedBooking && verifyStep && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeVerification}
              className="fixed inset-0 bg-[#0b1f3a]/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%', opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-label="التحقق من صلاحية الدكتور"
              className="relative z-10 w-full max-w-md bg-white rounded-t-[28px] sm:rounded-[28px] p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 text-[#0b1f3a] font-extrabold">
                  <ShieldCheck className="w-5 h-5 text-[#c9a227]" />
                  <span>
                    {verifyStep === 'ask'
                      ? 'التحقق من الهوية'
                      : verifyStep === 'code'
                        ? 'كود التحقق الخاص بالدكتور'
                        : 'بروفايل المريض'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeVerification}
                  aria-label="إغلاق"
                  className="w-9 h-9 rounded-full bg-[#f6f3ec] hover:bg-[#0b1f3a]/10 flex items-center justify-center text-[#0b1f3a]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {verifyStep === 'ask' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#f6f3ec] border border-[#0b1f3a]/10 text-center">
                    <div className="text-xs text-[#6e6e73]">الحجز رقم #{selectedBooking.queueNumber}</div>
                    <div className="text-base font-extrabold text-[#0b1f3a] mt-1">
                      {selectedBooking.fullName}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#0b1f3a] text-center">
                    هل أنت الدكتور؟
                  </p>
                  <p className="text-xs text-[#6e6e73] text-center">
                    للحفاظ على خصوصية المرضى، عرض تفاصيل الحالة ورقم الهاتف الكامل متاح للدكتور غيث التميمي فقط.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setVerifyStep('code')}
                      className="py-3 px-4 rounded-full bg-[#0b1f3a] hover:bg-[#081729] text-white font-bold text-sm min-h-[44px]"
                    >
                      نعم، أنا الدكتور
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onShowToast('عرض الملف الكامل متاح للدكتور فقط حفاظاً على الخصوصية.');
                        closeVerification();
                      }}
                      className="py-3 px-4 rounded-full bg-[#f6f3ec] hover:bg-[#0b1f3a]/10 text-[#0b1f3a] font-bold text-sm min-h-[44px]"
                    >
                      لا
                    </button>
                  </div>
                </div>
              )}

              {verifyStep === 'code' && (
                <form onSubmit={handleVerifyDoctorCode} className="space-y-4">
                  <p className="text-xs sm:text-sm text-[#6e6e73]">
                    يرجى إدخال كود الدكتور لفتح بروفايل المريض الكامل:
                  </p>
                  {codeError && (
                    <div className="p-3 rounded-xl bg-[#d33333]/10 text-xs font-bold text-[#d33333]">
                      {codeError}
                    </div>
                  )}
                  <input
                    type="password"
                    autoFocus
                    dir="ltr"
                    value={doctorCodeInput}
                    onChange={(e) => setDoctorCodeInput(e.target.value)}
                    placeholder="أدخل الكود هنا..."
                    className="w-full px-4 py-3 rounded-xl border border-[#0b1f3a]/15 focus:border-[#c9a227] focus:outline-none text-center font-mono-num text-base min-h-[48px]"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="submit"
                      className="py-3 px-4 rounded-full bg-[#c9a227] hover:bg-[#b8911f] text-[#0b1f3a] font-extrabold text-sm min-h-[44px]"
                    >
                      فتح البروفايل
                    </button>
                    <button
                      type="button"
                      onClick={closeVerification}
                      className="py-3 px-4 rounded-full bg-[#f6f3ec] text-[#0b1f3a] font-bold text-sm min-h-[44px]"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}

              {verifyStep === 'profile' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#0b1f3a] text-white flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-[#c9a227] font-bold">ملف المريض</div>
                      <div className="text-lg font-extrabold mt-0.5">
                        {selectedBooking.fullName}
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#c9a227] text-[#0b1f3a] flex flex-col items-center justify-center font-mono-num shrink-0">
                      <span className="text-[10px] font-bold">رقم</span>
                      <span className="text-lg font-extrabold leading-none">
                        {selectedBooking.queueNumber}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#f6f3ec]">
                      <span className="text-[#6e6e73] text-xs">تاريخ الموعد</span>
                      <span className="font-bold text-[#0b1f3a] text-xs sm:text-sm">
                        {formatArabicDate(selectedBooking.bookingDate)} ({selectedBooking.bookingDate})
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#f6f3ec]">
                      <span className="text-[#6e6e73] text-xs">رقم الهاتف الكامل</span>
                      <span dir="ltr" className="font-mono-num font-bold text-[#0b1f3a]">
                        {selectedBooking.phone}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#f6f3ec]">
                      <div className="text-xs text-[#6e6e73] mb-1">حالة المريض / الشكوى</div>
                      <div className="text-sm font-medium text-[#1d1d1f] leading-relaxed">
                        {selectedBooking.condition || 'لم تُكتب تفاصيل إضافية من قبل المريض.'}
                      </div>
                    </div>
                  </div>

                  {/* تواصل سريع مع المريض */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${selectedBooking.phone}`}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#0b1f3a] text-white font-bold text-xs min-h-[42px]"
                    >
                      <Phone className="w-4 h-4 text-[#c9a227]" />
                      <span>اتصال هاتفي</span>
                    </a>
                    <a
                      href={`https://wa.me/${cleanWhatsAppPhone(selectedBooking.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#128a45] text-white font-bold text-xs min-h-[42px]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>مراسلة واتساب</span>
                    </a>
                  </div>

                  {/* تحديث حالة المراجعة */}
                  <div className="pt-2 border-t border-[#0b1f3a]/10">
                    <div className="text-xs font-bold text-[#6e6e73] mb-2">
                      تحديث حالة المراجعة:
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['بانتظار المراجعة', 'تم الفحص', 'ملغي'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          disabled={updatingStatus}
                          onClick={() => handleStatusChange(st)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors min-h-[40px] ${
                            selectedBooking.status === st
                              ? 'bg-[#c9a227] border-[#c9a227] text-[#0b1f3a]'
                              : 'bg-white border-[#0b1f3a]/15 text-[#0b1f3a] hover:bg-[#f6f3ec]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
