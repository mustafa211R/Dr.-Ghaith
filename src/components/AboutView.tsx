import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Code2, Download, ExternalLink, Link2, Sparkles, UserCheck } from 'lucide-react';
import {
  CLINIC_INFO,
  getConfiguredUrls,
  saveConfiguredUrls,
} from '../services/clinicApi';

interface AboutViewProps {
  onConfigSaved: () => void;
  onShowToast: (msg: string, type?: 'ok' | 'bad') => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onConfigSaved, onShowToast }) => {
  const initial = getConfiguredUrls();
  const [appsScriptUrl, setAppsScriptUrl] = useState(initial.appsScriptUrl);
  const [sheetUrl, setSheetUrl] = useState(initial.sheetUrl);
  const [saved, setSaved] = useState(false);

  const handleSaveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfiguredUrls(appsScriptUrl, sheetUrl);
    setSaved(true);
    onShowToast('تم حفظ روابط الربط مع Google Sheets بنجاح', 'ok');
    onConfigSaved();
    setTimeout(() => setSaved(false), 2500);
  };

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

      {/* بطاقة ربط Google Sheets و Apps Script */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="bg-white rounded-[22px] border border-[#0b1f3a]/10 p-5 sm:p-6 shadow-[0_6px_24px_rgba(11,31,58,0.06)]"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-[#c9a227]" />
            <h3 className="text-base sm:text-lg font-extrabold text-[#0b1f3a]">
              ربط قاعدة بيانات Google Sheets (code.gs)
            </h3>
          </div>
          <a
            href="/code.gs"
            download="code.gs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f6f3ec] hover:bg-[#c9a227]/20 border border-[#0b1f3a]/10 text-xs font-bold text-[#0b1f3a] transition-colors min-h-[38px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل ملف code.gs</span>
          </a>
        </div>

        <ol className="text-xs sm:text-sm text-[#6e6e73] space-y-1.5 list-decimal list-inside bg-[#f6f3ec] p-4 rounded-2xl border border-[#0b1f3a]/5 mb-4">
          <li>افتح Google Sheets وأنشئ جدولاً جديداً ثم اختر Extensions &gt; Apps Script.</li>
          <li>الصق محتوى ملف <span className="font-mono-num font-bold text-[#0b1f3a]">code.gs</span> وشغّل دالة <span className="font-mono-num font-bold text-[#0b1f3a]">setup</span> لتجهيز الأوراق تلقائياً.</li>
          <li>انشره كـ Web App (الصلاحية: Anyone) ثم ضع الرابط هنا أو في ملف <span className="font-mono-num font-bold text-[#0b1f3a]">pic.js</span>.</li>
        </ol>

        <form onSubmit={handleSaveLinks} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#0b1f3a] mb-1.5">
              رابط Google Apps Script (Web App URL)
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-[#86868b] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                dir="ltr"
                value={appsScriptUrl}
                onChange={(e) => setAppsScriptUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-[#0b1f3a]/15 focus:border-[#c9a227] focus:outline-none text-xs sm:text-sm font-mono-num text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1f3a] mb-1.5">
              رابط جدول Google Sheets (اختياري للاسترجاع المباشر)
            </label>
            <input
              type="url"
              dir="ltr"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#0b1f3a]/15 focus:border-[#c9a227] focus:outline-none text-xs sm:text-sm font-mono-num text-left"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0b1f3a] hover:bg-[#081729] text-white font-bold text-sm transition-colors min-h-[44px]"
          >
            {saved ? <Check className="w-4 h-4 text-[#c9a227]" /> : <Sparkles className="w-4 h-4 text-[#c9a227]" />}
            <span>{saved ? 'تم الحفظ والمزامنة' : 'حفظ وربط البيانات'}</span>
          </button>
        </form>
      </motion.section>
    </div>
  );
};
