import React from 'react';
import { motion } from 'motion/react';
import { CalendarCheck2, Eye, RefreshCw, TrendingUp, Users } from 'lucide-react';
import { formatArabicDate, getTodayDateStr } from '../services/clinicApi';
import { Booking, VisitStats } from '../types/clinic';

interface VisitsViewProps {
  visits: VisitStats;
  bookings: Booking[];
  syncSource: 'apps-script' | 'google-sheet' | 'local';
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const VisitsView: React.FC<VisitsViewProps> = ({
  visits,
  bookings,
  syncSource,
  isRefreshing,
  onRefresh,
}) => {
  const today = getTodayDateStr();
  const todayBookingsCount = bookings.filter((b) => b.bookingDate === today).length;
  const maxDaily = Math.max(1, ...visits.dailyHistory.map((d) => d.count));

  const tiles = [
    {
      label: 'إجمالي الزيارات',
      value: visits.totalVisits,
      icon: Eye,
      gradient: 'from-[#0b1f3a] to-[#1d4278]',
    },
    {
      label: 'زيارات اليوم',
      value: visits.todayVisits,
      icon: TrendingUp,
      gradient: 'from-[#c9a227] to-[#a8861b]',
    },
    {
      label: 'حجوزات اليوم',
      value: todayBookingsCount,
      icon: CalendarCheck2,
      gradient: 'from-[#0b1f3a] to-[#1d4278]',
    },
    {
      label: 'إجمالي الحجوزات',
      value: bookings.length,
      icon: Users,
      gradient: 'from-[#c9a227] to-[#a8861b]',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[#0b1f3a]">إحصائيات الزيارات والحجوزات</h2>
          <p className="text-xs text-[#6e6e73] mt-0.5">
            التاريخ الحالي: {formatArabicDate(today)}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="تحديث البيانات"
          className="w-10 h-10 rounded-full bg-white border border-[#0b1f3a]/10 hover:border-[#c9a227] flex items-center justify-center text-[#0b1f3a] transition-colors shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* بطاقات الأرقام الرئيسية */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tiles.map((tile, idx) => {
          const Icon = tile.icon;
          return (
            <motion.div
              key={tile.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`relative overflow-hidden rounded-[20px] p-4 text-white bg-gradient-to-br ${tile.gradient} shadow-[0_6px_18px_rgba(11,31,58,0.12)]`}
            >
              <div className="w-20 h-20 rounded-full bg-white/10 absolute -left-5 -top-5 pointer-events-none" />
              <Icon className="w-5 h-5 opacity-85 mb-2" />
              <div className="text-2xl sm:text-3xl font-extrabold font-mono-num leading-tight">
                {tile.value}
              </div>
              <div className="text-xs font-semibold opacity-90 mt-1">{tile.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* سجل الزيارات اليومية */}
      <div className="bg-white rounded-[20px] border border-[#0b1f3a]/10 p-5 shadow-[0_4px_16px_rgba(11,31,58,0.06)]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-extrabold text-[#0b1f3a]">توزيع الزيارات اليومية</h3>
          <span className="text-xs text-[#6e6e73]">
            {syncSource === 'apps-script'
              ? 'مربوط مع Google Apps Script'
              : syncSource === 'google-sheet'
                ? 'مقروء من Google Sheets'
                : 'حفظ محلي نشط (بانتظار ربط Sheets)'}
          </span>
        </div>

        {visits.dailyHistory.length === 0 ? (
          <p className="text-sm text-[#6e6e73] py-6 text-center">
            لم تُسجل بيانات أيام سابقة بعد.
          </p>
        ) : (
          <div className="space-y-3">
            {[...visits.dailyHistory].reverse().map((item) => {
              const widthPct = Math.max(8, Math.round((item.count / maxDaily) * 100));
              return (
                <div key={item.date} className="flex items-center gap-3 text-xs sm:text-sm">
                  <span className="w-24 font-mono-num text-[#6e6e73] shrink-0">{item.date}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-[#0b1f3a]/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-l from-[#c9a227] to-[#e5c14b]"
                    />
                  </div>
                  <span className="w-10 text-left font-mono-num font-bold text-[#0b1f3a]">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
