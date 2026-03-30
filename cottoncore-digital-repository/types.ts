
export interface BaleData {
  bale_id: string;
  photos: {
    ultra_zoom: string[];
    normal: string[];
    stretch: string[];
  };
  metrics: {
    sci: number;
    grade?: string;
    mst: number;
    mic: number;
    mat: number;
    sl2: number;
    ur: number;
    sf: number;
    str: number;
    elg: number;
    rd: number;
    bPlus: number;
    cGrd?: string;
    trCnt: number;
    trAr: number;
    trGrd?: string;
    amt: number;
  };
}

export interface ReportStatistics {
  n: number;
  average: Record<string, number | string>;
  stdDev: Record<string, number>;
  cvPercent: Record<string, number>;
  q99: Record<string, number>;
  min: Record<string, number>;
  max: Record<string, number>;
}

export interface CottonReport {
  report_id: string;
  created_at?: string;
  cotton_yarn_count: string; // e.g., 40s
  sub_type: string;          // e.g., Type 1
  bales: BaleData[];
  statistics: ReportStatistics;
}

export interface MetricDefinition {
  key: keyof BaleData['metrics'];
  label: string;
  unit: string;
  color: string;
}
