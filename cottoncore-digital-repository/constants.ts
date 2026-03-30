
import { CottonReport, MetricDefinition } from './types';

export const METRIC_CONFIGS: MetricDefinition[] = [
  { key: 'sci', label: 'SCI', unit: '', color: '#3b82f6' },
  { key: 'mic', label: 'Micronaire', unit: 'mic', color: '#60a5fa' },
  { key: 'str', label: 'Strength', unit: 'g/tex', color: '#2563eb' },
  { key: 'sl2', label: 'Staple Length', unit: 'in', color: '#1d4ed8' },
  { key: 'ur', label: 'Uniformity', unit: '%', color: '#1e40af' },
  { key: 'sf', label: 'Short Fiber', unit: '%', color: '#ef4444' },
  { key: 'mst', label: 'Moisture', unit: '%', color: '#06b6d4' },
  { key: 'mat', label: 'Maturity', unit: 'ratio', color: '#10b981' },
  { key: 'elg', label: 'Elongation', unit: '%', color: '#8b5cf6' },
  { key: 'rd', label: 'Reflectance (Rd)', unit: '', color: '#f59e0b' },
  { key: 'bPlus', label: 'Yellowness (+b)', unit: '', color: '#fbbf24' },
  { key: 'trAr', label: 'Trash Area', unit: '%', color: '#78350f' },
  { key: 'trCnt', label: 'Trash Count', unit: 'cnt', color: '#451a03' },
  { key: 'amt', label: 'Amount', unit: 'g', color: '#64748b' },
  { key: 'cGrd', label: 'Color Grade', unit: '', color: '#334155' },
  { key: 'trGrd', label: 'Trash Grade', unit: '', color: '#0f172a' },
];

export const COTTON_TYPES = ['20s', '30s', '40s', '50s', '60s', '70s', '80s', '100s', '120s', '140s'];

export const COTTON_SUBTYPES = [
  'Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5', 
  'Type 6', 'Type 7', 'Type 8', 'Type 9', 'Type 10'
];

export const MOCK_REPORTS: CottonReport[] = [
  {
    report_id: "DEMO_BATCH_001",
    cotton_yarn_count: "40s",
    sub_type: "Type 1",
    created_at: "2024-11-20",
    bales: [
      {
        bale_id: "BALE-A1",
        photos: {
          ultra_zoom: ["https://images.unsplash.com/photo-1594818379496-da1e345b0ded?q=80&w=800"],
          normal: ["https://images.unsplash.com/photo-1594818379496-da1e345b0ded?q=80&w=800"],
          stretch: ["https://images.unsplash.com/photo-1558350315-8aa00e8e4590?q=80&w=800"]
        },
        metrics: {
          sci: 145, mst: 7.2, mic: 4.1, mat: 0.86, sl2: 1.19, ur: 83.1,
          sf: 6.5, str: 32.1, elg: 6.1, rd: 77.1, bPlus: 9.2, trCnt: 22,
          trAr: 0.31, amt: 150, cGrd: '31-1', trGrd: '2'
        }
      }
    ],
    statistics: {
      n: 1,
      average: { sci: 145, mic: 4.1, str: 32.1, sl2: 1.19, ur: 83.1, sf: 6.5, mst: 7.2, mat: 0.86, elg: 6.1, rd: 77.1, bPlus: 9.2, trCnt: 22, trAr: 0.31, amt: 150, cGrd: '31-1', trGrd: '2' },
      stdDev: { sci: 0, mic: 0, str: 0, sl2: 0, ur: 0, sf: 0, mst: 0, mat: 0, elg: 0, rd: 0, bPlus: 0, trCnt: 0, trAr: 0, amt: 0 },
      cvPercent: { sci: 0, mic: 0, str: 0 },
      q99: { sci: 145, mic: 4.1 },
      min: { sci: 145, mic: 4.1 },
      max: { sci: 145, mic: 4.1 }
    }
  }
];
