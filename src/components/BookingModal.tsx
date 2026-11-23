import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, CheckCircle2, Phone, Stethoscope, User, X } from 'lucide-react';
import {
  formatArabicDate,
  getTodayDateStr,
  submitBooking,
} from '../services/clinicApi';
import { Booking } from '../types/clinic';

interface BookingModalProps {
  isOpen: boolean;
  initialCondition?: string;
  onClose: () => void;
  onBooked: (booking: Booking, syncedToSheet: boolean) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  initialCondition = '',
  onClose,
  onBooked,
}) => {
  const today = getTodayDateStr();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateMode, setDateMode] = useState<'today' | 'custom'>('today');
  const [customDate, setCustomDate] = useState(today);
  const [condition, setCondition] = useState(initialCondition);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (initialCondition) setCondition(initialCondition);
    } else {
      setConfirmedBooking(null);
    }
  }, [isOpen, initialCondition]);

  const effectiveDate = dateMode === 'today' ? today : customDate || today;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = fullName.trim().replace(/\s+/g, ' ');
    const cleanPhone = phone.trim();

    if (cleanName.split(' ').length < 2 || cleanName.length < 5) {
      setError('يرجى إدخال الاسم الثلاثي الكامل بشكل صحيح.');
      return;
    }
    if (cleanPhone.replace(/\D/g, '').length < 8) {
      setError('يرجى إدخال رقم هاتف صحيح للتواصل.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { booking, syncedToSheet } = await submitBooking({
        fullName: cleanName,
        phone: cleanPhone,
        bookingDate: effectiveDate,
        condition: condition.trim(),
      });
      setConfirmedBooking(booking);
      onBooked(booking, syncedToSheet);
      setFullName('');
      setPhone('');
      setCondition('');
    } catch {
      setError('حدث خطأ أثناء تسجيل الحجز، يرجى المحاولة مجدداً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* الخلفية المعتمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0b1f3a]/70 backdrop-blur-sm"
          />

          {/* النافذة المنبثقة */}
          <motion.div
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="حجز موعد في العيادة"
            className="relative z-10 w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-[28px] p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            {/* شريط ذهبي علوي */}
            <div className="w-12 h-1.5 rounded-full bg-[#0b1f3a]/15 mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0b1f3a] text-[#c9a227] flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0b1f3a]">
                    {confirmedBooking ? 'تم تأكيد الحجز' : 'حجز موعد في العيادة'}
                  </h3>
                  <p className="text-xs text-[#6e6e73]">عيادة الدكتور غيث التميمي</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="w-9 h-9 rounded-full bg-[#f6f3ec] hover:bg-[#0b1f3a]/10 flex items-center justify-center text-[#0b1f3a] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {confirmedBooking ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#06762f]/10 text-[#06762f] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1.5">
                  <p className="text-base sm:text-lg font-extrabold text-[#0b1f3a] leading-relaxed">
                    شكراً لك، تم حجزك على العيادة ورقمك هو{' '}
                    <span className="font-mono-num text-2xl text-[#b8911f]">
                      {confirmedBooking.queueNumber}
                    </span>
                  </p>
                  <p className="text-sm text-[#6e6e73]">
                    الاسم: <strong className="text-[#0b1f3a]">{confirmedBooking.fullName}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#f6f3ec] border border-[#c9a227]/35 space-y-2">
                  <div className="text-xs text-[#6e6e73]">تاريخ الموعد المحجوز</div>
                  <div className="text-sm font-bold text-[#0b1f3a]">
                    {formatArabicDate(confirmedBooking.bookingDate)}
                  </div>
                  <div className="text-xs font-mono-num text-[#b8911f]">
                    {confirmedBooking.bookingDate}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-full bg-[#0b1f3a] hover:bg-[#081729] text-white font-bold text-sm transition-colors min-h-[46px]"
                >
                  تم
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-[#d33333]/10 border border-[#d33333]/25 text-xs font-bold text-[#d33333]">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#0b1f3a] mb-1.5">
                    الاسم الثلاثي <span className="text-[#d33333]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={80}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: أحمد كريم علي"
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-[#0b1f3a]/15 focus:border-[#c9a227] focus:outline-none text-sm min-h-[46px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b1f3a] mb-1.5">
                    رقم الهاتف <span className="text-[#d33333]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      dir="ltr"
                      required
                      maxLength={20}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07xxxxxxxxx"
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-[#0b1f3a]/15 focus:border-[#c9a227] focus:outline-none text-sm font-mono-num text-left min-h-[46px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b1f3a] mb-1.5">
                    موعد الحجز
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-[#f6f3ec] border border-[#0b1f3a]/10 mb-2.5">
                    <button
                      type="button"
                      onClick={() => setDateMode('today')}
                      className={`py-2 px-3 rounded-full text-xs font-bold transition-all min-h-[40px] ${
                        dateMode === 'today'
                          ? 'bg-[#0b1f3a] text-white'
                          : 'text-[#0b1f3a]'
                      }`}
                    >
                      اليوم ({today})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateMode('custom')}
                      className={`py-2 px-3 rounded-full text-xs font-bold transition-all min-h-[40px] ${
                        dateMode === 'custom'
                          ? 'bg-[#0b1f3a] text-white'
                          : 'text-[#0b1f3a]'
                      }`}
                    >
                      تحديد موعد آخر
                    </button>
                  </div>

                  {dateMode === 'custom' ? (
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        min={today}
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-[#0b1f3a]/15 focus:border-[#c9a227] focus:outline-none text-sm font-mono-num min-h-[44px]"
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-[#6e6e73] px-1">
                      موعد الحجز: {formatArabicDate(today)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b1f3a] mb-1.5">
                    حالة المريض — مماذا يعاني (اختياري)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={400}
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="اكتب باختصار الأعراض أو سبب المراجعة أو نتائج الفحص..."
                    className="w-full px-4 py-3 rounded-xl border border-[#0b1f3a]/15 focus:border-[#c9a227] focus:outline-none text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#c9a227] hover:bg-[#b8911f] text-[#0b1f3a] font-extrabold text-sm transition-all active:scale-[0.98] shadow-[0_6px_18px_rgba(201,162,39,0.35)] min-h-[48px] disabled:opacity-60"
                >
                  {isSubmitting ? 'جارٍ تثبيت الحجز...' : 'تأكيد الحجز والحصول على الرقم'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
