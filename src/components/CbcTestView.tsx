import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  Droplets,
  Eraser,
  FileSpreadsheet,
  FlaskConical,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  analyzeCbc,
  CBC_PARAMETERS,
  getRangeForProfile,
  SAMPLE_LAB_VALUES,
} from '../data/cbcData';
import { CbcCategory, CbcReferenceProfile } from '../types/clinic';

interface CbcTestViewProps {
  onBookWithSummary: (summaryText: string) => void;
}

const CATEGORY_TITLES: Record<CbcCategory, string> = {
  wbc: 'كريات الدم البيضاء (WBC & Differential)',
  rbc: 'كريات الدم الحمراء والهيموغلوبين (RBC Indices)',
  plt: 'الصفائح الدموية (Platelets)',
};

export const CbcTestView: React.FC<CbcTestViewProps> = ({ onBookWithSummary }) => {
  const [entryMode, setEntryMode] = useState<'single' | 'all'>('single');
  const [profile, setProfile] = useState<CbcReferenceProfile>('standard');
  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedKey, setSelectedKey] = useState<string>('HGB');
  const [singleValue, setSingleValue] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<CbcCategory | 'all'>('all');

  const selectedDef = useMemo(
    () => CBC_PARAMETERS.find((p) => p.key === selectedKey) || CBC_PARAMETERS[0],
    [selectedKey]
  );

  const report = useMemo(() => analyzeCbc(values, profile), [values, profile]);

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = singleValue.trim().replace(',', '.');
    if (!cleaned || Number.isNaN(Number(cleaned))) return;
    setValues((prev) => ({ ...prev, [selectedKey]: cleaned }));
    setSingleValue('');
  };

  const handleRemoveParam = (key: string) => {
    setValues((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleLoadSample = () => {
    setValues({ ...SAMPLE_LAB_VALUES });
    setEntryMode('all');
    setActiveCategory('all');
  };

  const handleClearAll = () => {
    setValues({});
    setSingleValue('');
  };

  const handleBookWithFindings = () => {
    if (report.evaluated.length === 0) {
      onBookWithSummary('مراجعة لقراءة تحليل CBC');
      return;
    }
    const abnormalText = report.evaluated
      .filter((e) => e.status !== 'normal')
      .map((e) => `${e.def.symbol}: ${e.value}`)
      .join('، ');
    const headline = report.findings[0]?.title || 'مراجعة تحليل CBC';
    onBookWithSummary(
      abnormalText ? `${headline} (${abnormalText})` : `${headline}`
    );
  };

  const filteredAllParams = useMemo(() => {
    if (activeCategory === 'all') return CBC_PARAMETERS;
    return CBC_PARAMETERS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const singleRange = getRangeForProfile(selectedDef, profile);

  return (
    <div className="space-y-4">
      {/* ترويسة اختبار CBC */}
      <section className="bg-white rounded-[22px] border border-[#0b1f3a]/10 p-5 shadow-[0_6px_24px_rgba(11,31,58,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0b1f3a] text-[#c9a227] flex items-center justify-center shrink-0">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0b1f3a]">
                تحليل فحص الدم الشامل (CBC)
              </h2>
              <p className="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
                أدخل فحصاً واحداً أو أدخل كامل نسب التحليل للحصول على التفسير الطبي باللغة العربية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f6f3ec] hover:bg-[#c9a227]/20 border border-[#0b1f3a]/10 text-xs font-bold text-[#0b1f3a] transition-colors min-h-[38px]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#b8911f]" />
              <span>نموذج ورقة المختبر</span>
            </button>
            {Object.keys(values).length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#d33333]/10 hover:bg-[#d33333]/15 text-xs font-bold text-[#d33333] transition-colors min-h-[38px]"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>مسح القيم</span>
              </button>
            )}
          </div>
        </div>

        {/* تبديل طريقة الإدخال (فردي / الكل) + اختيار الفئة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-[#f6f3ec] border border-[#0b1f3a]/10">
            <button
              type="button"
              onClick={() => setEntryMode('single')}
              className={`py-2 px-3 rounded-full text-xs sm:text-sm font-bold transition-all min-h-[40px] whitespace-nowrap ${
                entryMode === 'single'
                  ? 'bg-[#0b1f3a] text-white shadow-sm'
                  : 'text-[#0b1f3a] hover:bg-white/60'
              }`}
            >
              إدخال فردي
            </button>
            <button
              type="button"
              onClick={() => setEntryMode('all')}
              className={`py-2 px-3 rounded-full text-xs sm:text-sm font-bold transition-all min-h-[40px] whitespace-nowrap ${
                entryMode === 'all'
                  ? 'bg-[#0b1f3a] text-white shadow-sm'
                  : 'text-[#0b1f3a] hover:bg-white/60'
              }`}
            >
              إدخال الكل ({CBC_PARAMETERS.length})
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 rounded-full bg-[#f6f3ec] border border-[#0b1f3a]/10">
            {(
              [
                ['standard', 'قياسي'],
                ['male', 'ذكر'],
                ['female', 'أنثى'],
              ] as [CbcReferenceProfile, string][]
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setProfile(k)}
                className={`py-2 px-2 rounded-full text-xs font-bold transition-all min-h-[40px] whitespace-nowrap ${
                  profile === k
                    ? 'bg-[#c9a227] text-[#0b1f3a] shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#0b1f3a]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* وضع الإدخال الفردي */}
        {entryMode === 'single' ? (
          <form onSubmit={handleAddSingle} className="mt-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold text-[#0b1f3a] mb-1.5">
                  اختر المؤشر المراد فحصه
                </label>
                <select
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#0b1f3a]/15 bg-white text-sm font-semibold text-[#0b1f3a] focus:border-[#c9a227] focus:outline-none min-h-[44px]"
                >
                  {CBC_PARAMETERS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.symbol} — {p.arName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#0b1f3a]">القيمة ({selectedDef.unit})</span>
                  <span dir="ltr" className="font-mono-num text-[#6e6e73]">
                    {singleRange.min} – {singleRange.max}
                  </span>
                </div>
                <input
                  type="number"
                  step={selectedDef.step}
                  min="0"
                  dir="ltr"
                  value={singleValue}
                  onChange={(e) => setSingleValue(e.target.value)}
                  placeholder={selectedDef.placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#0b1f3a]/15 text-sm font-mono-num text-left focus:border-[#c9a227] focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#c9a227] hover:bg-[#b8911f] text-[#0b1f3a] font-bold text-sm transition-colors min-h-[44px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>فحص</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-[#6e6e73]">{selectedDef.description}</p>

            {/* أزرار سريعة لأهم الفحوصات الفردية */}
            <div className="pt-2 border-t border-[#0b1f3a]/10">
              <div className="text-xs font-bold text-[#6e6e73] mb-2">
                اختيار سريع لأبرز الفحوصات:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['HGB', 'MCV', 'WBC', 'PLT', 'RBC', 'HCT', 'RDW_CV', 'LYM_PCT'].map((k) => {
                  const def = CBC_PARAMETERS.find((p) => p.key === k)!;
                  const active = selectedKey === k;
                  const hasVal = Boolean(values[k]);
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSelectedKey(k)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-bold border transition-colors min-h-[36px] ${
                        active
                          ? 'bg-[#0b1f3a] text-[#c9a227] border-[#0b1f3a]'
                          : hasVal
                            ? 'bg-[#c9a227]/15 text-[#0b1f3a] border-[#c9a227]'
                            : 'bg-[#f6f3ec] text-[#0b1f3a] border-[#0b1f3a]/10 hover:border-[#c9a227]'
                      }`}
                    >
                      {def.symbol}
                      {hasVal ? ` (${values[k]})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        ) : (
          /* وضع إدخال الكل */
          <div className="mt-5 space-y-4">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {(
                [
                  ['all', 'كل المؤشرات'],
                  ['rbc', 'كريات الدم الحمراء'],
                  ['wbc', 'كريات الدم البيضاء'],
                  ['plt', 'الصفائح الدموية'],
                ] as [CbcCategory | 'all', string][]
              ).map(([cat, label]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors min-h-[38px] ${
                    activeCategory === cat
                      ? 'bg-[#0b1f3a] text-white'
                      : 'bg-[#f6f3ec] text-[#0b1f3a] hover:bg-[#c9a227]/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAllParams.map((def) => {
                const range = getRangeForProfile(def, profile);
                const valStr = values[def.key] || '';
                const num = parseFloat(valStr);
                const hasNum = valStr.trim() !== '' && !Number.isNaN(num);
                const isLow = hasNum && num < range.min;
                const isHigh = hasNum && num > range.max;

                return (
                  <div
                    key={def.key}
                    className={`p-3 rounded-2xl border transition-colors ${
                      isLow || isHigh
                        ? 'border-[#d33333]/40 bg-[#d33333]/[0.03]'
                        : hasNum
                          ? 'border-[#06762f]/40 bg-[#06762f]/[0.03]'
                          : 'border-[#0b1f3a]/10 bg-[#f6f3ec]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono-num font-extrabold text-sm text-[#0b1f3a]">
                        {def.symbol}
                      </span>
                      <span dir="ltr" className="text-[11px] font-mono-num text-[#6e6e73]">
                        {range.min}–{range.max} {def.unit}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-[#6e6e73] mb-2 line-clamp-1">
                      {def.arName}
                    </div>
                    <input
                      type="number"
                      step={def.step}
                      min="0"
                      dir="ltr"
                      value={valStr}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [def.key]: e.target.value }))
                      }
                      placeholder={def.placeholder}
                      className="w-full px-3 py-2 rounded-xl border border-[#0b1f3a]/15 bg-white text-sm font-mono-num text-left focus:border-[#c9a227] focus:outline-none min-h-[40px]"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* قسم النتائج والتفسير الطبي باللغة العربية */}
      <AnimatePresence>
        {report.evaluated.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* ملخص التشخيص السريري باللغة العربية */}
            <div className="bg-white rounded-[22px] border border-[#0b1f3a]/10 p-5 shadow-[0_6px_24px_rgba(11,31,58,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0b1f3a]">
                    القراءة الطبية والتفسير باللغة العربية
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold font-mono-num">
                  <span className="text-[#06762f]">طبيعي: {report.normalCount}</span>
                  <span className="text-[#0b1f3a]/30">·</span>
                  <span className={report.abnormalCount > 0 ? 'text-[#d33333]' : 'text-[#6e6e73]'}>
                    خارج المدى: {report.abnormalCount}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {report.findings.map((finding, idx) => {
                  const isAlert = finding.severity === 'alert';
                  const isAttention = finding.severity === 'attention';
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${
                        isAlert
                          ? 'bg-[#d33333]/[0.05] border-[#d33333]/25'
                          : isAttention
                            ? 'bg-[#c9a227]/10 border-[#c9a227]/35'
                            : 'bg-[#06762f]/[0.06] border-[#06762f]/25'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-extrabold text-sm text-[#0b1f3a]">
                        {isAlert ? (
                          <AlertTriangle className="w-4 h-4 text-[#d33333] shrink-0" />
                        ) : isAttention ? (
                          <Droplets className="w-4 h-4 text-[#b8911f] shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-[#06762f] shrink-0" />
                        )}
                        <span>{finding.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#1d1d1f] mt-1.5 leading-relaxed">
                        {finding.detail}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-[#0b1f3a]/10 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#6e6e73] max-w-xl">
                  تنويه طبي: هذه القراءة آلية استرشادية ولا تغني عن الفحص السريري الدقيق لدى الدكتور غيث التميمي.
                </p>
                <button
                  type="button"
                  onClick={handleBookWithFindings}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b1f3a] hover:bg-[#081729] text-white font-bold text-xs sm:text-sm transition-colors min-h-[42px]"
                >
                  <CalendarPlus className="w-4 h-4 text-[#c9a227]" />
                  <span>حجز موعد لعرض التحليل</span>
                </button>
              </div>
            </div>

            {/* جدول تفصيلي لكل فحص مُدخل */}
            <div className="bg-white rounded-[22px] border border-[#0b1f3a]/10 p-5 shadow-[0_4px_16px_rgba(11,31,58,0.06)]">
              <h4 className="text-sm font-extrabold text-[#0b1f3a] mb-3">
                تفاصيل المؤشرات المدخلة ({report.evaluated.length})
              </h4>

              <div className="divide-y divide-[#0b1f3a]/10">
                {report.evaluated.map((item) => {
                  const statusLabel =
                    item.status === 'low'
                      ? '▼ منخفض (L)'
                      : item.status === 'high'
                        ? '▲ مرتفع (H)'
                        : '● طبيعي';
                  const statusColor =
                    item.status === 'normal' ? 'text-[#06762f]' : 'text-[#d33333]';

                  return (
                    <div key={item.def.key} className="py-3.5 first:pt-1 last:pb-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono-num font-extrabold text-sm text-[#0b1f3a]">
                              {item.def.symbol}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold text-[#1d1d1f]">
                              {item.def.arName}
                            </span>
                          </div>
                          <div className="text-xs text-[#6e6e73] mt-0.5">{item.note}</div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-left">
                            <div className={`font-mono-num font-extrabold text-base ${statusColor}`}>
                              {item.value}{' '}
                              <span className="text-[11px] font-normal text-[#6e6e73]">
                                {item.def.unit}
                              </span>
                            </div>
                            <div className={`text-[11px] font-bold ${statusColor}`}>
                              {statusLabel}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveParam(item.def.key)}
                            aria-label={`حذف ${item.def.symbol}`}
                            className="w-8 h-8 rounded-full hover:bg-[#d33333]/10 text-[#86868b] hover:text-[#d33333] flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* شريط المدى المرجعي */}
                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="relative flex-1 h-2 rounded-full bg-[#0b1f3a]/10 overflow-hidden">
                          {/* المنطقة الخضراء الوسطى تمثل المدى الطبيعي */}
                          <div
                            className="absolute inset-y-0 bg-[#06762f]/25"
                            style={{ left: '25%', right: '25%' }}
                          />
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow ${
                              item.status === 'normal' ? 'bg-[#06762f]' : 'bg-[#d33333]'
                            }`}
                            style={{ left: `calc(${item.positionPct}% - 6px)` }}
                          />
                        </div>
                        <span dir="ltr" className="text-[11px] font-mono-num text-[#6e6e73] shrink-0">
                          {item.min} – {item.max}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* تلميح توضيحي بسيط حول المجموعات المرجعية عندما تكون القيم فارغة */}
      {report.evaluated.length === 0 && (
        <div className="bg-white/75 rounded-2xl border border-[#0b1f3a]/10 p-4 text-xs sm:text-sm text-[#6e6e73]">
          <span className="font-bold text-[#0b1f3a]">نصيحة: </span>
          لتمييز سبب فقر الدم بدقة (نقص الحديد مقابل نقص فيتامين B12)، أدخل قيم{' '}
          <span className="font-mono-num font-bold text-[#0b1f3a]">HGB</span> و{' '}
          <span className="font-mono-num font-bold text-[#0b1f3a]">MCV</span> و{' '}
          <span className="font-mono-num font-bold text-[#0b1f3a]">RDW_CV</span>، أو اضغط على
          «نموذج ورقة المختبر» لمعاينة تحليل كامل.
        </div>
      )}
    </div>
  );
};
