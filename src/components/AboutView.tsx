import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, UserCheck } from 'lucide-react';
import { CLINIC_INFO } from '../services/clinicApi';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* بطاقة المصمم والتعريف بالمنصة */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-[22px] border border-[#0b1f3a]/10 p-5 sm:p-6 shadow-[0_6px_24px_rgba(11,31,58,0.06)]"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0b1f3a] text-[#c9a227] flex items-center justify-center shrink-0 border border-[#c9a227]/40">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#b8911f]">تصميم وتطوير النظام</p>
            <h2 className="text-xl font-extrabold text-[#0b1f3a] mt-0.5">
              {CLINIC_INFO.designerName}
            </h2>
            <p className="text-sm text-[#6e6e73] mt-1 leading-relaxed">
              منصة ذكية متكاملة لعيادة {CLINIC_INFO.doctorName} ({CLINIC_INFO.degree}) تتيح حجز
              المواعيد إلكترونياً، متابعة طابور المراجعين، وقراءة وتحليل فحوصات الدم الشاملة CBC
              باللغة العربية.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-[#0b1f3a]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#6e6e73]">
            الموقع الرسمي للمصمم: <span dir="ltr" className="font-mono-num text-[#0b1f3a]">mustafa211r.github.io</span>
          </div>
          <a
            href={CLINIC_INFO.designerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c9a227] hover:bg-[#b8911f] text-[#0b1f3a] font-bold text-sm transition-colors min-h-[42px]"
          >
            <span>زيارة موقع المصمم</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.section>
    </div>
  );
};
