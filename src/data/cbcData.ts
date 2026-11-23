import {
  CbcAnalysisReport,
  CbcClinicalFinding,
  CbcEvaluatedParam,
  CbcParameterDef,
  CbcReferenceProfile,
  ParameterStatus,
} from '../types/clinic';

export const CBC_PARAMETERS: CbcParameterDef[] = [
  // كريات الدم البيضاء ومكوناتها
  {
    key: 'WBC',
    symbol: 'WBC',
    arName: 'عدد كريات الدم البيضاء الكلي',
    unit: '10³/uL',
    category: 'wbc',
    min: 4.0,
    max: 10.5,
    step: '0.1',
    placeholder: '6.8',
    description: 'الخلايا المناعية المسؤولة عن الدفاع ضد العدوى والالتهابات.',
    lowHint: 'انخفاض كريات الدم البيضاء (نقص المناعة المؤقت، عدوى فيروسية، أو تأثر نخاع العظم).',
    highHint: 'ارتفاع كريات الدم البيضاء (غالباً يشير إلى التهاب بكتيري أو عدوى أو استجابة مناعية).',
  },
  {
    key: 'LYM_PCT',
    symbol: 'LYM%',
    arName: 'نسبة الخلايا اللمفاوية',
    unit: '%',
    category: 'wbc',
    min: 20.0,
    max: 40.0,
    step: '0.1',
    placeholder: '30.5',
    description: 'النسبة المئوية للخلايا اللمفاوية من إجمالي الكريات البيضاء.',
    lowHint: 'انخفاض نسبي في الخلايا اللمفاوية (قد يرافق ارتفاع الخلايا الحبيبية أو الإجهاد).',
    highHint: 'ارتفاع نسبة الخلايا اللمفاوية (شائع في العدوى الفيروسية أو بعض اضطرابات الدم).',
  },
  {
    key: 'MID_PCT',
    symbol: 'MID%',
    arName: 'نسبة الخلايا المتوسطة (Monocytes/Eos/Baso)',
    unit: '%',
    category: 'wbc',
    min: 1.0,
    max: 15.0,
    step: '0.1',
    placeholder: '6.2',
    description: 'نسبة الخلايا وحيدة النواة والحمضية والقاعدية.',
    lowHint: 'قيمة منخفضة ضمن الحد الطفيف عادةً.',
    highHint: 'ارتفاع قد يرتبط بالحساسية، الطفيليات، أو التهاب مزمن.',
  },
  {
    key: 'GRAN_PCT',
    symbol: 'GRAN%',
    arName: 'نسبة الخلايا الحبيبية (العدلات)',
    unit: '%',
    category: 'wbc',
    min: 50.0,
    max: 70.0,
    step: '0.1',
    placeholder: '60.0',
    description: 'خط الدفاع الأول ضد العدوى البكتيرية.',
    lowHint: 'انخفاض نسبة العدلات قد يترك الجسم أكثر عرضة للعدوى.',
    highHint: 'ارتفاع نسبة العدلات يشير غالباً إلى التهاب بكتيري حاد.',
  },
  {
    key: 'LYM_ABS',
    symbol: 'LYM#',
    arName: 'العدد المطلق للخلايا اللمفاوية',
    unit: '10³/uL',
    category: 'wbc',
    min: 0.6,
    max: 4.1,
    step: '0.1',
    placeholder: '2.1',
    description: 'العدد الفعلي للخلايا اللمفاوية في الميكرولتر.',
    lowHint: 'نقص الخلايا اللمفاوية الفعلي، يتطلب مراجعة الطبيب المختص.',
    highHint: 'زيادة الخلايا اللمفاوية الفعلي، قد يرتبط بعدوى فيروسية أو فحص دم تخصصي.',
  },
  {
    key: 'MID_ABS',
    symbol: 'MID#',
    arName: 'العدد المطلق للخلايا المتوسطة',
    unit: '10³/uL',
    category: 'wbc',
    min: 0.1,
    max: 1.8,
    step: '0.1',
    placeholder: '0.5',
    description: 'العدد الفعلي للخلايا المتوسطة.',
    lowHint: 'انخفاض طفيف في الخلايا المتوسطة.',
    highHint: 'ارتفاع الخلايا المتوسطة، يرتبط بالعدوى المزمنة أو التحسس.',
  },
  {
    key: 'GRAN_ABS',
    symbol: 'GRAN#',
    arName: 'العدد المطلق للخلايا الحبيبية',
    unit: '10³/uL',
    category: 'wbc',
    min: 2.0,
    max: 7.8,
    step: '0.1',
    placeholder: '4.5',
    description: 'العدد الفعلي للخلايا العدلة.',
    lowHint: 'انخفاض العدلات المطلق (Neutropenia) ويستوجب التقييم الطبي.',
    highHint: 'ارتفاع العدلات المطلق، يظهر عادةً مع العدوى البكتيرية أو الالتهابات.',
  },

  // كريات الدم الحمراء والهيموغلوبين
  {
    key: 'RBC',
    symbol: 'RBC',
    arName: 'عدد كريات الدم الحمراء',
    unit: '10⁶/uL',
    category: 'rbc',
    min: 3.50,
    max: 5.50,
    maleMin: 4.50,
    maleMax: 5.90,
    femaleMin: 3.80,
    femaleMax: 5.20,
    step: '0.01',
    placeholder: '4.47',
    description: 'الخلايا الناقلة للأوكسجين في الدم.',
    lowHint: 'انخفاض كريات الدم الحمراء قد يشير إلى فقر الدم.',
    highHint: 'ارتفاع كريات الدم الحمراء (احمرار الدم أو الجفاف أو التدخين).',
  },
  {
    key: 'HGB',
    symbol: 'HGB',
    arName: 'الهيموغلوبين (نسبة الدم)',
    unit: 'g/dL',
    category: 'rbc',
    min: 11.0,
    max: 15.0,
    maleMin: 13.0,
    maleMax: 17.0,
    femaleMin: 11.5,
    femaleMax: 15.5,
    step: '0.1',
    placeholder: '13.2',
    description: 'البروتين المسؤول عن حمل الأوكسجين وتحديد وجود فقر الدم.',
    lowHint: 'انخفاض الهيموغلوبين يدل على فقر الدم (أنيميا) ويحتاج تحديد السبب عبر MCV.',
    highHint: 'ارتفاع الهيموغلوبين قد يدل على زيادة اللزوجة أو الجفاف أو احمرار الدم.',
  },
  {
    key: 'HCT',
    symbol: 'HCT',
    arName: 'مكداس الدم (الهيماتوكريت)',
    unit: '%',
    category: 'rbc',
    min: 36.0,
    max: 48.0,
    maleMin: 40.0,
    maleMax: 52.0,
    femaleMin: 36.0,
    femaleMax: 46.0,
    step: '0.1',
    placeholder: '41.0',
    description: 'نسبة حجم كريات الدم الحمراء إلى حجم الدم الكلي.',
    lowHint: 'انخفاض الهيماتوكريت يرافق حالات فقر الدم أو زيادة السوائل.',
    highHint: 'ارتفاع الهيماتوكريت يشير إلى الجفاف أو زيادة تركيز كريات الدم الحمراء.',
  },
  {
    key: 'MCV',
    symbol: 'MCV',
    arName: 'متوسط حجم الكرية الحمراء',
    unit: 'fL',
    category: 'rbc',
    min: 78.0,
    max: 99.0,
    step: '0.1',
    placeholder: '85.0',
    description: 'المؤشر الأهم لتصنيف نوع فقر الدم (صغير الكريات مقابل كبير الكريات).',
    lowHint: 'صِغَر حجم الكريات الحمراء — يوجّه نحو نقص الحديد أو سمة الثلاسيميا.',
    highHint: 'كِبَر حجم الكريات الحمراء — يوجّه نحو نقص فيتامين B12 أو حمض الفوليك.',
  },
  {
    key: 'MCH',
    symbol: 'MCH',
    arName: 'متوسط هيموغلوبين الكرية',
    unit: 'pg',
    category: 'rbc',
    min: 26.0,
    max: 32.0,
    step: '0.1',
    placeholder: '29.0',
    description: 'كمية الهيموغلوبين داخل كل كرية دم حمراء.',
    lowHint: 'انخفاض كمية الهيموغلوبين بالكرية (مرتبط بنقص الحديد أو الثلاسيميا).',
    highHint: 'ارتفاع كمية الهيموغلوبين بالكرية (يُلاحظ في فقر الدم كبير الكريات).',
  },
  {
    key: 'MCHC',
    symbol: 'MCHC',
    arName: 'تركيز الهيموغلوبين الوسطي',
    unit: 'g/dL',
    category: 'rbc',
    min: 32.0,
    max: 36.0,
    step: '0.1',
    placeholder: '33.5',
    description: 'تركيز الصبغة الحمراء داخل كريات الدم الحمراء.',
    lowHint: 'نقص تلوّن الكريات (Hypochromia) — شائع في فقر الدم بنقص الحديد.',
    highHint: 'ارتفاع تركيز الصبغة — قد يرتبط بتكثف الكريات أو بعض الحالات الوراثية.',
  },
  {
    key: 'RDW_CV',
    symbol: 'RDW_CV',
    arName: 'تفاوت أحجام الكريات الحمراء (CV)',
    unit: '%',
    category: 'rbc',
    min: 11.5,
    max: 14.5,
    step: '0.1',
    placeholder: '13.0',
    description: 'يقيس مدى اختلاف أحجام كريات الدم الحمراء، ويساعد في التفريق بين نقص الحديد والثلاسيميا.',
    lowHint: 'تجانس عالٍ في أحجام الكريات (غالباً طبيعي).',
    highHint: 'تفاوت ملحوظ في أحجام الكريات — مؤشر مهم يدعم تشخيص نقص الحديد أو نقص الفيتامينات.',
  },
  {
    key: 'RDW_SD',
    symbol: 'RDW_SD',
    arName: 'تفاوت أحجام الكريات الحمراء (SD)',
    unit: 'fL',
    category: 'rbc',
    min: 39.0,
    max: 46.0,
    step: '0.1',
    placeholder: '42.0',
    description: 'الانحراف المعياري لتوزيع عرض كريات الدم الحمراء.',
    lowHint: 'أقل من المعدل الطفيف دون دلالة مرضية منفردة.',
    highHint: 'ارتفاع يشير إلى عدم تجانس أحجام الكريات الحمراء.',
  },

  // الصفائح الدموية
  {
    key: 'PLT',
    symbol: 'PLT',
    arName: 'عدد الصفائح الدموية',
    unit: '10³/uL',
    category: 'plt',
    min: 150,
    max: 450,
    step: '1',
    placeholder: '270',
    description: 'العنصر الأساسي في تخثر الدم وإيقاف النزيف.',
    lowHint: 'انخفاض الصفائح الدموية (Thrombocytopenia) — يتطلب متابعة طبية لتقييم قابلية النزف.',
    highHint: 'ارتفاع الصفائح الدموية (Thrombocytosis) — قد يكون تفاعلياً مع نقص الحديد أو الالتهاب.',
  },
  {
    key: 'MPV',
    symbol: 'MPV',
    arName: 'متوسط حجم الصفيحة الدموية',
    unit: 'fL',
    category: 'plt',
    min: 7.4,
    max: 10.4,
    step: '0.1',
    placeholder: '8.4',
    description: 'يعكس حجم ونشاط الصفائح الدموية المنتجة من نخاع العظم.',
    lowHint: 'صفيحات أصغر حجماً.',
    highHint: 'ارتفاع حجم الصفائح يعكس إنتاجاً نشطاً من نخاع العظم.',
  },
  {
    key: 'PDW',
    symbol: 'PDW',
    arName: 'عرض توزيع الصفائح الدموية',
    unit: 'fL',
    category: 'plt',
    min: 10.0,
    max: 14.0,
    step: '0.1',
    placeholder: '12.0',
    description: 'يقيس مدى التفاوت في أحجام الصفائح الدموية.',
    lowHint: 'تجانس حجم الصفائح (غير مقلق بمفرده).',
    highHint: 'تفاوت في أحجام الصفائح الدموية، يُفسر مع عدد الصفائح الكلي PLT.',
  },
  {
    key: 'PCT',
    symbol: 'PCT',
    arName: 'نسبة الصفائح الدموية (Plateletcrit)',
    unit: '%',
    category: 'plt',
    min: 0.10,
    max: 0.28,
    step: '0.01',
    placeholder: '0.22',
    description: 'الحجم الكلي الذي تشغله الصفائح في الدم.',
    lowHint: 'انخفاض حجم الصفائح الكلي بالدم.',
    highHint: 'ارتفاع حجم الصفائح الكلي بالدم.',
  },
  {
    key: 'P_LCR',
    symbol: 'P_LCR',
    arName: 'نسبة الصفائح كبيرة الحجم',
    unit: '%',
    category: 'plt',
    min: 13.0,
    max: 43.0,
    step: '0.1',
    placeholder: '18.3',
    description: 'نسبة الصفائح الكبيرة الفتية في الدم.',
    lowHint: 'نسبة منخفضة للصفائح الكبيرة.',
    highHint: 'زيادة الصفائح الكبيرة الفتية.',
  },
  {
    key: 'P_LCC',
    symbol: 'P_LCC',
    arName: 'عدد الصفائح كبيرة الحجم',
    unit: '10³/uL',
    category: 'plt',
    min: 13,
    max: 129,
    step: '1',
    placeholder: '49',
    description: 'العدد الفعلي للصفائح الدموية كبيرة الحجم.',
    lowHint: 'انخفاض عدد الصفائح الكبيرة.',
    highHint: 'زيادة عدد الصفائح الكبيرة.',
  },
];

// قيم نموذجية مطابقة لتقرير المختبر المرفق (حالة فقر دم بنقص الحديد)
export const SAMPLE_LAB_VALUES: Record<string, string> = {
  WBC: '8.2',
  LYM_PCT: '26.4',
  MID_PCT: '6.8',
  GRAN_PCT: '66.8',
  LYM_ABS: '2.2',
  MID_ABS: '0.6',
  GRAN_ABS: '6.1',
  RBC: '4.47',
  HGB: '6.7',
  HCT: '24.0',
  MCV: '53.8',
  MCH: '13.6',
  MCHC: '25.4',
  RDW_CV: '16.7',
  RDW_SD: '40.7',
  PLT: '270',
  MPV: '8.4',
  PDW: '17.1',
  PCT: '0.22',
  P_LCR: '18.3',
  P_LCC: '49',
};

export function getRangeForProfile(def: CbcParameterDef, profile: CbcReferenceProfile): { min: number; max: number } {
  if (profile === 'male' && def.maleMin !== undefined && def.maleMax !== undefined) {
    return { min: def.maleMin, max: def.maleMax };
  }
  if (profile === 'female' && def.femaleMin !== undefined && def.femaleMax !== undefined) {
    return { min: def.femaleMin, max: def.femaleMax };
  }
  return { min: def.min, max: def.max };
}

export function analyzeCbc(
  inputs: Record<string, string>,
  profile: CbcReferenceProfile = 'standard'
): CbcAnalysisReport {
  const evaluated: CbcEvaluatedParam[] = [];
  const byKey: Record<string, CbcEvaluatedParam> = {};

  for (const def of CBC_PARAMETERS) {
    const raw = (inputs[def.key] || '').trim().replace(',', '.');
    if (!raw) continue;
    const value = parseFloat(raw);
    if (Number.isNaN(value) || value < 0) continue;

    const { min, max } = getRangeForProfile(def, profile);
    let status: ParameterStatus = 'normal';
    let note = 'ضمن المدى المرجعي الطبيعي.';

    if (value < min) {
      status = 'low';
      note = def.lowHint;
    } else if (value > max) {
      status = 'high';
      note = def.highHint;
    }

    // حساب موضع القيمة على شريط العرض من 0% إلى 100% (المدى الطبيعي يمثل المنطقة الوسطى 25%..75%)
    const span = Math.max(0.0001, max - min);
    let positionPct = 50;
    if (value < min) {
      const ratio = Math.max(0, value / Math.max(0.0001, min));
      positionPct = Math.max(4, Math.min(24, ratio * 25));
    } else if (value > max) {
      const over = (value - max) / span;
      positionPct = Math.min(96, Math.max(76, 75 + over * 25));
    } else {
      positionPct = 25 + ((value - min) / span) * 50;
    }

    const item: CbcEvaluatedParam = {
      def,
      value,
      min,
      max,
      status,
      positionPct,
      note,
    };
    evaluated.push(item);
    byKey[def.key] = item;
  }

  const findings: CbcClinicalFinding[] = [];
  const hgb = byKey.HGB;
  const rbc = byKey.RBC;
  const hct = byKey.HCT;
  const mcv = byKey.MCV;
  const mch = byKey.MCH;
  const mchc = byKey.MCHC;
  const rdw = byKey.RDW_CV;
  const wbc = byKey.WBC;
  const plt = byKey.PLT;
  const lymPct = byKey.LYM_PCT;
  const granPct = byKey.GRAN_PCT;

  // 1. تفسير فقر الدم وتصنيف الكريات (نقص الحديد مقابل نقص B12 / الفوليك)
  if (hgb && hgb.status === 'low') {
    const severe = hgb.value < 8.0;
    if (mcv && mcv.status === 'low') {
      const highRdw = rdw && rdw.status === 'high';
      findings.push({
        title: severe
          ? 'فقر دم شديد صغير الكريات (اشتباه قوي بنقص الحديد)'
          : 'فقر دم صغير الكريات (نقص الحديد أو سمة الثلاسيميا)',
        severity: 'alert',
        detail:
          `انخفاض الهيموغلوبين (${hgb.value} g/dL) مع انخفاض متوسط حجم الكرية MCV (${mcv.value} fL)` +
          (mch && mch.status === 'low' ? ` وانخفاض MCH (${mch.value} pg)` : '') +
          (highRdw
            ? ` وارتفاع RDW_CV (${rdw.value}%)، مما يرجّح بقوة فقر الدم بنقص الحديد.`
            : '، وهو نمط يوجّه عادةً نحو فقر الدم بنقص الحديد أو التمييز عن الثلاسيميا عبر فحص الفيريتين ومخزون الحديد.'),
      });
    } else if (mcv && mcv.status === 'high') {
      findings.push({
        title: 'فقر دم كبير الكريات (احتمال نقص فيتامين B12 أو حمض الفوليك)',
        severity: 'alert',
        detail: `انخفاض الهيموغلوبين (${hgb.value} g/dL) مع ارتفاع MCV (${mcv.value} fL) يشير غالباً إلى نقص فيتامين B12 أو الفوليك، ويُنصح بإجراء فحص مستوى B12 ومراجعة دكتور أمراض الدم.`,
      });
    } else {
      findings.push({
        title: severe ? 'انخفاض ملحوظ في نسبة الهيموغلوبين (فقر دم)' : 'فقر دم سوي الكريات (Normocytic Anemia)',
        severity: severe ? 'alert' : 'attention',
        detail: `نسبة الهيموغلوبين (${hgb.value} g/dL) أقل من المعدل المرجعي (${hgb.min}–${hgb.max}). يُنصح بمراجعة الدكتور غيث التميمي لتحديد السبب بدقة.`,
      });
    }
  } else if (mcv && mcv.status === 'low' && (!hgb || hgb.status === 'normal')) {
    findings.push({
      title: 'صِغَر حجم كريات الدم الحمراء رغم استقرار الهيموغلوبين',
      severity: 'attention',
      detail: `قيمة MCV منخفضة (${mcv.value} fL)، وقد تمثل نقصاً مبكراً في مخزون الحديد أو سمة ثلاسيميا، ويُفضل فحص الحديد والفيريتين.`,
    });
  } else if (mcv && mcv.status === 'high' && (!hgb || hgb.status === 'normal')) {
    findings.push({
      title: 'كِبَر حجم كريات الدم الحمراء (ارتفاع MCV)',
      severity: 'attention',
      detail: `قيمة MCV مرتفعة (${mcv.value} fL)، ويستحسن التحقق من مستوى فيتامين B12 وحمض الفوليك ووظائف الكبد والغدة الدرقية.`,
    });
  } else if (hgb && hgb.status === 'high') {
    findings.push({
      title: 'ارتفاع نسبة الهيموغلوبين أو كريات الدم الحمراء',
      severity: 'attention',
      detail: `الهيموغلوبين (${hgb.value} g/dL) أعلى من المعدل الطبيعي، وقد ينتج عن الجفاف، التدخين، أو احمرار الدم الأولي/الثانوي ويتطلب تقييم أخصائي أمراض الدم.`,
    });
  } else if (rbc && rbc.status === 'low' && !hgb) {
    findings.push({
      title: 'انخفاض عدد كريات الدم الحمراء',
      severity: 'attention',
      detail: `عدد الكريات الحمراء (${rbc.value}) أقل من الحد الطبيعي (${rbc.min}–${rbc.max}).`,
    });
  } else if (hct && hct.status === 'low' && !hgb) {
    findings.push({
      title: 'انخفاض مكداس الدم (HCT)',
      severity: 'attention',
      detail: `نسبة HCT (${hct.value}%) أقل من الحد الطبيعي، مما قد يرتبط بفقر الدم.`,
    });
  }

  // ملاحظة إضافية لتركيز الصبغة MCHC
  if (mchc && mchc.status === 'low' && !findings.some((f) => f.title.includes('نقص الحديد'))) {
    findings.push({
      title: 'نقص تلوّن الكريات الحمراء (انخفاض MCHC)',
      severity: 'attention',
      detail: `تركيز الهيموغلوبين الوسطي (${mchc.value} g/dL) منخفض، وهو مؤشر داعم لوجود نقص الحديد.`,
    });
  }

  // 2. تفسير كريات الدم البيضاء
  if (wbc) {
    if (wbc.status === 'high') {
      const bacterialHint = granPct && granPct.status === 'high';
      const viralHint = lymPct && lymPct.status === 'high';
      findings.push({
        title: 'ارتفاع كريات الدم البيضاء (Leukocytosis)',
        severity: wbc.value > 18 ? 'alert' : 'attention',
        detail:
          `عدد كريات الدم البيضاء (${wbc.value} ×10³/uL) مرتفع` +
          (bacterialHint
            ? ' مع ارتفاع نسبة الخلايا الحبيبية (GRAN%)، مما يرجّح استجابة لالتهاب بكتيري.'
            : viralHint
              ? ' مع ارتفاع الخلايا اللمفاوية (LYM%)، وقد يرافق عدوى فيروسية أو يتطلب مسحة دم.'
              : '، ويدل غالباً على وجود التهاب أو عدوى نشطة أو إجهاد بدني.'),
      });
    } else if (wbc.status === 'low') {
      findings.push({
        title: 'انخفاض كريات الدم البيضاء (Leukopenia)',
        severity: wbc.value < 2.5 ? 'alert' : 'attention',
        detail: `عدد كريات الدم البيضاء (${wbc.value} ×10³/uL) أقل من الطبيعي (${wbc.min}–${wbc.max})، وقد يحدث بعد عدوى فيروسية أو بسبب أدوية معينة أو حاجة لتقييم نخاع العظم.`,
      });
    }
  }

  // 3. تفسير الصفائح الدموية
  if (plt) {
    if (plt.status === 'low') {
      findings.push({
        title: plt.value < 50 ? 'انخفاض حاد في الصفائح الدموية' : 'انخفاض الصفائح الدموية (Thrombocytopenia)',
        severity: plt.value < 100 ? 'alert' : 'attention',
        detail: `عدد الصفائح (${plt.value} ×10³/uL) أقل من الطبيعي (${plt.min}–${plt.max}). يُنصح بمراجعة عيادة الدكتور غيث التميمي لتجنب مخاطر النزف ومعرفة السبب.`,
      });
    } else if (plt.status === 'high') {
      findings.push({
        title: 'ارتفاع الصفائح الدموية (Thrombocytosis)',
        severity: plt.value > 700 ? 'alert' : 'attention',
        detail: `عدد الصفائح (${plt.value} ×10³/uL) أعلى من المعدل المرجعي، وقد يكون تفاعلياً (بسبب نقص الحديد أو التهاب) أو يحتاج لمتابعة تخصصية في أمراض الدم.`,
      });
    }
  }

  const abnormalCount = evaluated.filter((e) => e.status !== 'normal').length;
  const normalCount = evaluated.length - abnormalCount;

  if (evaluated.length > 0 && findings.length === 0) {
    if (abnormalCount === 0) {
      findings.push({
        title: 'نتائج طبيعية ومطمئنة',
        severity: 'normal',
        detail: 'جميع المؤشرات المُدخلة تقع ضمن المدى المرجعي الطبيعي ولا تظهر علامات واضحة لفقر الدم أو اضطراب الخلايا.',
      });
    } else {
      findings.push({
        title: 'تغيرات طفيفة في بعض المؤشرات الفرعية',
        severity: 'attention',
        detail: 'يوجد تباين بسيط في بعض القيم الفرعية؛ يُنصح بمراجعة التفاصيل أدناه وعرض ورقة التحليل على الدكتور عند وجود أعراض.',
      });
    }
  }

  let overallStatus: 'normal' | 'attention' | 'alert' = 'normal';
  if (findings.some((f) => f.severity === 'alert')) overallStatus = 'alert';
  else if (findings.some((f) => f.severity === 'attention') || abnormalCount > 0) overallStatus = 'attention';

  return {
    evaluated,
    findings,
    normalCount,
    abnormalCount,
    overallStatus,
  };
}
