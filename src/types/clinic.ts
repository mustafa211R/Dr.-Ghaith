export type TopTab = 'clinic' | 'visits' | 'cbc' | 'about';
export type BottomView = 'bookings' | null;

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  subtitle?: string;
  tag?: string;
  news?: string;
}

export interface Booking {
  id: string;
  queueNumber: number;
  bookingDate: string; // YYYY-MM-DD
  fullName: string;
  phone: string;
  condition: string;
  status: 'بانتظار المراجعة' | 'تم الفحص' | 'ملغي' | string;
  createdAt: string;
  synced?: boolean;
}

export interface DailyVisitEntry {
  date: string;
  count: number;
}

export interface VisitStats {
  totalVisits: number;
  todayVisits: number;
  today: string;
  dailyHistory: DailyVisitEntry[];
}

export type CbcCategory = 'wbc' | 'rbc' | 'plt';
export type CbcReferenceProfile = 'standard' | 'male' | 'female';
export type ParameterStatus = 'normal' | 'low' | 'high';

export interface CbcParameterDef {
  key: string;
  symbol: string;
  arName: string;
  unit: string;
  category: CbcCategory;
  min: number;
  max: number;
  maleMin?: number;
  maleMax?: number;
  femaleMin?: number;
  femaleMax?: number;
  step: string;
  placeholder: string;
  description: string;
  lowHint: string;
  highHint: string;
}

export interface CbcEvaluatedParam {
  def: CbcParameterDef;
  value: number;
  min: number;
  max: number;
  status: ParameterStatus;
  positionPct: number; // 0-100 visual bar position
  note: string;
}

export interface CbcClinicalFinding {
  title: string;
  severity: 'normal' | 'attention' | 'alert';
  detail: string;
}

export interface CbcAnalysisReport {
  evaluated: CbcEvaluatedParam[];
  findings: CbcClinicalFinding[];
  normalCount: number;
  abnormalCount: number;
  overallStatus: 'normal' | 'attention' | 'alert';
}
