import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FlaskConical,
  MapPin,
  Maximize2,
  Newspaper,
  Phone,
  Stethoscope,
  X,
} from 'lucide-react';
import { CLINIC_INFO, getGalleryItems } from '../services/clinicApi';
import { GalleryItem, TopTab } from '../types/clinic';

interface ClinicViewProps {
  onOpenBooking: () => void;
  onSwitchTab: (tab: TopTab) => void;
  todayBookingsCount: number;
}

export const ClinicView: React.FC<ClinicViewProps> = ({
  onOpenBooking,
  onSwitchTab,
  todayBookingsCount,
}) => {
  const gallery = useMemo(() => getGalleryItems(), []);
  const newsItems = useMemo(() => gallery.filter((g) => Boolean(g.news?.trim())), [gallery]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);
  const [popupItem, setPopupItem] = useState<GalleryItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [newsIndex, setNewsIndex] = useState(0);

  useEffect(() => {
    if (newsItems.length <= 1) return;
    const timer = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [newsItems.length]);

  const currentItem = gallery[activeIndex] || gallery[0];

  const handleNext = () => {
    setFlipDirection(1);
    setActiveIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrev = () => {
    setFlipDirection(-1);
    setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const currentNews = newsItems[newsIndex];

  return (
    <div className="space-y-5">
      {/* شريط الأخبار (نشرة الأخبار من pic.js) */}
      {newsItems.length > 0 && currentNews && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-[#0b1f3a] text-white rounded-2xl border border-[#c9a227]/35 overflow-hidden shadow-sm"
        >
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="flex items-center gap-2 shrink-0 text-[#c9a227] font-bold text-xs sm:text-sm">
              <Newspaper className="w-4 h-4" />
              <span>نشرة الأخبار</span>
            </div>
            <div className="h-4 w-px bg-white/15 shrink-0" />
            <button
              type="button"
              onClick={() => setPopupItem(currentNews)}
              className="flex-1 text-right overflow-hidden min-h-[32px] flex items-center cursor-pointer group"
              title="اضغط لعرض التفاصيل"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentNews.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs sm:text-sm text-white/90 group-hover:text-[#c9a227] transition-colors line-clamp-1 font-medium"
                >
                  {currentNews.news}
                </motion.span>
              </AnimatePresence>
            </button>
            {newsItems.length > 1 && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setNewsIndex((i) => (i - 1 + newsItems.length) % newsItems.length)}
                  className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="الخبر السابق"
                >
                  <ChevronRight className="w-4 h-4 text-white/80" />
                </button>
                <button
                  type="button"
                  onClick={() => setNewsIndex((i) => (i + 1) % newsItems.length)}
                  className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="الخبر التالي"
                >
                  <ChevronLeft className="w-4 h-4 text-white/80" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* قسم الصور التفاعلي القابل للتقليب والفتح المنبثق */}
      {gallery.length > 0 && currentItem && (
        <section className="bg-white rounded-[22px] border border-[#0b1f3a]/10 p-4 sm:p-5 shadow-[0_6px_24px_rgba(11,31,58,0.06)]">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#0b1f3a]">
                معرض العيادة والأخبار
              </h2>
              <p className="text-xs text-[#6e6e73]">
                قلّب بين الصور واضغط على أي بطاقة لعرضها بشكل منبثق
              </p>
            </div>
            <div className="flex items-center gap-1.5 font-mono-num text-xs text-[#6e6e73]">
              <span>{activeIndex + 1}</span>
              <span>/</span>
              <span>{gallery.length}</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[#081729] aspect-[16/10] sm:aspect-[16/9]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, rotateY: flipDirection * 18, scale: 0.96 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: flipDirection * -18, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setPopupItem(currentItem)}
                className="w-full h-full cursor-pointer relative group"
                style={{ perspective: 1000 }}
              >
                {!failedImages[currentItem.id] ? (
                  <img
                    src={currentItem.src}
                    alt={currentItem.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [currentItem.id]: true }))
                    }
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0b1f3a] to-[#16345e] text-white">
                    <Stethoscope className="w-12 h-12 text-[#c9a227] mb-3" />
                    <p className="font-bold text-base">{currentItem.title}</p>
                    {currentItem.subtitle && (
                      <p className="text-xs text-white/75 mt-1">{currentItem.subtitle}</p>
                    )}
                  </div>
                )}

                {/* تدرج لقراءة النص فوق الصورة */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#081729]/90 via-[#081729]/20 to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/45 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 group-hover:bg-[#c9a227] group-hover:text-[#0b1f3a] transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white text-right">
                  {currentItem.tag && (
                    <span className="text-[11px] font-semibold text-[#c9a227] block mb-1">
                      {currentItem.tag}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-lg font-bold leading-snug">
                    {currentItem.title}
                  </h3>
                  {currentItem.news && (
                    <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mt-1">
                      {currentItem.news}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="الصورة السابقة"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0b1f3a]/75 hover:bg-[#c9a227] text-white hover:text-[#0b1f3a] backdrop-blur-sm border border-white/20 flex items-center justify-center transition-colors shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="الصورة التالية"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0b1f3a]/75 hover:bg-[#c9a227] text-white hover:text-[#0b1f3a] backdrop-blur-sm border border-white/20 flex items-center justify-center transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* مصغرات سريعة للتقليب */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-2.5 mt-3">
              {gallery.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setFlipDirection(idx > activeIndex ? 1 : -1);
                      setActiveIndex(idx);
                    }}
                    className={`text-right rounded-xl p-2 border transition-all min-h-[48px] ${
                      isActive
                        ? 'border-[#c9a227] bg-[#f6f3ec]'
                        : 'border-[#0b1f3a]/10 bg-white hover:border-[#c9a227]/60'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-[#0b1f3a] line-clamp-1">
                      {item.tag || `صورة ${idx + 1}`}
                    </div>
                    <div className="text-[11px] text-[#6e6e73] line-clamp-1 mt-0.5">
                      {item.title}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* بطاقة معلومات الدكتور والتواصل */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="lg:col-span-7 bg-white rounded-[22px] border border-[#0b1f3a]/10 p-5 sm:p-6 shadow-[0_6px_24px_rgba(11,31,58,0.06)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0b1f3a] text-[#c9a227] flex items-center justify-center shrink-0 border border-[#c9a227]/40 shadow-sm">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#b8911f]">الطبيب المختص</p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1f3a] mt-0.5">
                  {CLINIC_INFO.doctorName}
                </h2>
                <p className="text-sm font-medium text-[#6e6e73] mt-1">
                  {CLINIC_INFO.degree}
                </p>
              </div>
            </div>

            <div className="h-px bg-[#0b1f3a]/10 my-5" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 py-2 border-b border-[#0b1f3a]/5">
                <span className="text-[#6e6e73]">رقم العيادة والواتساب</span>
                <a
                  href={CLINIC_INFO.phoneTel}
                  dir="ltr"
                  className="font-mono-num font-bold text-[#0b1f3a] hover:text-[#b8911f] transition-colors"
                >
                  {CLINIC_INFO.whatsappDisplay}
                </a>
              </div>
              <div className="flex items-center justify-between gap-3 py-2 border-b border-[#0b1f3a]/5">
                <span className="text-[#6e6e73]">التخصص السريري</span>
                <span className="font-bold text-[#0b1f3a]">أمراض الدم السريري والمخبرية</span>
              </div>
              <div className="flex items-center justify-between gap-3 py-2">
                <span className="text-[#6e6e73]">حجوزات اليوم المسجلة</span>
                <span className="font-mono-num font-bold text-[#06762f]">
                  {todayBookingsCount} حجز
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={onOpenBooking}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#c9a227] hover:bg-[#b8911f] text-[#0b1f3a] font-bold text-sm transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(201,162,39,0.35)] min-h-[46px]"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>احجز موعدك الآن</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchTab('cbc')}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#0b1f3a] hover:bg-[#081729] text-white font-bold text-sm transition-all active:scale-[0.98] min-h-[46px]"
            >
              <FlaskConical className="w-4 h-4 text-[#c9a227]" />
              <span>فحص تحليل CBC</span>
            </button>
          </div>
        </motion.div>

        {/* روابط التواصل المباشر وموقع العيادة */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="lg:col-span-5 bg-white rounded-[22px] border border-[#0b1f3a]/10 p-5 sm:p-6 shadow-[0_6px_24px_rgba(11,31,58,0.06)] flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-extrabold text-[#0b1f3a]">
              التواصل والموقع الجغرافي
            </h3>
            <p className="text-xs text-[#6e6e73] mt-1">
              روابط مباشرة للتواصل مع العيادة والوصول عبر الخرائط
            </p>

            <div className="space-y-2.5 mt-4">
              {/* واتساب */}
              <a
                href={CLINIC_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#f6f3ec] hover:bg-[#06762f]/10 border border-[#0b1f3a]/10 transition-colors min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#128a45] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#0b1f3a]">واتساب العيادة</div>
                    <div dir="ltr" className="text-xs font-mono-num text-[#6e6e73] text-right">
                      {CLINIC_INFO.whatsappDisplay}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#6e6e73]" />
              </a>

              {/* فيسبوك */}
              <a
                href={CLINIC_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#f6f3ec] hover:bg-[#1877f2]/10 border border-[#0b1f3a]/10 transition-colors min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1877f2] text-white flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3h2.6v8h3.4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#0b1f3a]">صفحة الفيسبوك</div>
                    <div className="text-xs text-[#6e6e73]">متابعة الإرشادات والمنشورات</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#6e6e73]" />
              </a>

              {/* انستجرام */}
              <a
                href={CLINIC_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#f6f3ec] hover:bg-[#be185d]/10 border border-[#0b1f3a]/10 transition-colors min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f59e0b] via-[#e11d48] to-[#7c3aed] text-white flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#0b1f3a]">حساب الانستجرام</div>
                    <div dir="ltr" className="text-xs text-[#6e6e73] text-right">
                      @dr.ghaith.altameemi
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#6e6e73]" />
              </a>

              {/* خرائط جوجل */}
              <a
                href={CLINIC_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0b1f3a] hover:bg-[#081729] text-white transition-colors min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c9a227] text-[#0b1f3a] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">عنوان العيادة على الخريطة</div>
                    <div className="text-xs text-white/75">اضغط لفتح الاتجاهات في خرائط جوجل</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#c9a227]" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* النافذة المنبثقة عند الضغط على الصور أو الأخبار */}
      <AnimatePresence>
        {popupItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopupItem(null)}
            className="fixed inset-0 z-50 bg-[#0b1f3a]/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] max-w-2xl w-full overflow-hidden shadow-2xl border border-[#c9a227]/35"
            >
              <div className="relative bg-[#081729] aspect-[16/10]">
                {!failedImages[popupItem.id] ? (
                  <img
                    src={popupItem.src}
                    alt={popupItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain bg-[#081729]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white p-6">
                    <Stethoscope className="w-14 h-14 text-[#c9a227] mb-3" />
                    <p className="font-bold">{popupItem.title}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setPopupItem(null)}
                  aria-label="إغلاق"
                  className="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/55 hover:bg-[#c9a227] text-white hover:text-[#0b1f3a] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 sm:p-6">
                {popupItem.tag && (
                  <span className="text-xs font-bold text-[#b8911f]">{popupItem.tag}</span>
                )}
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0b1f3a] mt-1">
                  {popupItem.title}
                </h3>
                {popupItem.subtitle && (
                  <p className="text-sm text-[#6e6e73] mt-1">{popupItem.subtitle}</p>
                )}
                {popupItem.news && (
                  <div className="mt-4 p-4 rounded-2xl bg-[#f6f3ec] border border-[#0b1f3a]/10 text-sm text-[#1d1d1f] leading-relaxed">
                    {popupItem.news}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
