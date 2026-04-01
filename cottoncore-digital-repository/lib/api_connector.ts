
// import { CottonReport, BaleData } from '../types';

// const API_BASE_URL = 'http://backend:5000/api';
// const ASSET_BASE_URL = 'http://backend:5000/assets'; 

// export interface FetchResponse {
//   data: CottonReport[];
//   success: boolean;
//   error?: string;
// }

// /**
//  * Transforms local Windows paths to Web-accessible URLs
//  */
// const formatImageUrl = (path: string): string => {
//   if (!path) return '';
//   if (path.startsWith('http') || path.startsWith('data:')) return path;

//   try {
//     const datasetToken = 'dataset\\';
//     const lowerPath = path.toLowerCase();
//     const tokenIndex = lowerPath.indexOf(datasetToken);
    
//     let relativePath = '';
//     if (tokenIndex !== -1) {
//       relativePath = path.substring(tokenIndex + datasetToken.length);
//     } else {
//       const parts = path.split('\\');
//       relativePath = parts.slice(-4).join('/'); 
//     }

//     const webPath = relativePath.replace(/\\/g, '/');
//     const encodedPath = webPath.split('/')
//       .map(segment => encodeURIComponent(segment))
//       .join('/');

//     return `${ASSET_BASE_URL}/${encodedPath}`;
//   } catch (err) {
//     return path;
//   }
// };

// const resolvePhotos = (item: any, parentItem?: any) => {
//   const source = item.photos || item.images || item.gallery || item.attachments || {};
//   let normal: string[] = [];
//   let zoom: string[] = [];
//   let stretch: string[] = [];

//   const safeMap = (arr: any) => {
//     if (!arr) return [];
//     const list = Array.isArray(arr) ? arr : [arr];
//     return list.filter(p => typeof p === 'string' && p.length > 0).map(formatImageUrl);
//   };

//   if (Array.isArray(source)) {
//     normal = safeMap(source);
//   } else if (typeof source === 'object' && source !== null) {
//     normal = safeMap(source.normal || source.main);
//     zoom = safeMap(source.ultra_zoom || source.zoom || source.hd);
//     stretch = safeMap(source.stretch || source.wide || source.scale);
//   }

//   if (normal.length === 0) {
//     const fallback = item.image_url || item.photo || item.url || parentItem?.image_url;
//     if (fallback) normal = safeMap(fallback);
//   }

//   return {
//     ultra_zoom: zoom.length > 0 ? zoom : normal,
//     normal: normal,
//     stretch: stretch.length > 0 ? stretch : normal
//   };
// };

// const mapMetrics = (raw: any): any => {
//   if (!raw) return {};
//   return {
//     sci: raw.sci ?? raw.SCI ?? 0,
//     mic: raw.mic ?? raw.micronaire ?? raw.Mic ?? 0,
//     str: raw.str ?? raw.strength ?? raw.Str ?? 0,
//     sl2: raw.sl2 ?? raw.staple_length ?? raw.length ?? 0,
//     ur: raw.ur ?? raw.uniformity ?? raw.UR ?? 0,
//     sf: raw.sf ?? raw.short_fiber ?? raw.SF ?? 0,
//     mst: raw.mst ?? raw.moisture ?? raw.moist ?? 0,
//     mat: raw.mat ?? raw.maturity ?? raw.Mat ?? 0,
//     elg: raw.elg ?? raw.elongation ?? raw.Elg ?? 0,
//     rd: raw.rd ?? raw.reflectance ?? raw.Rd ?? 0,
//     bPlus: raw.bPlus ?? raw.yellowness ?? raw.plus_b ?? 0,
//     trAr: raw.trAr ?? raw.trash_area ?? raw.trash_pct ?? 0,
//     trCnt: raw.trCnt ?? raw.trash_count ?? raw.trash_num ?? 0,
//     amt: raw.amt ?? raw.amount ?? raw.weight ?? 0,
//     cGrd: raw.cGrd ?? raw.color_grade ?? raw.grade ?? 'N/A',
//     trGrd: raw.trGrd ?? raw.trash_grade ?? 'N/A',
//   };
// };

// export const fetchReports = async (count?: string, subtype?: string): Promise<FetchResponse> => {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

//   try {
//     const params = new URLSearchParams();
//     if (count && count !== 'All') params.append('cotton_yarn_count', count);
//     if (subtype && subtype !== 'All') params.append('sub_type', subtype);
    
//     const response = await fetch(`${API_BASE_URL}/reports?${params.toString()}`, {
//       headers: { 'Content-Type': 'application/json' },
//       signal: controller.signal
//     });
    
//     clearTimeout(timeoutId);
//     if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    
//     const rawData = await response.json();

//     const transformed = rawData.map((item: any) => {
//       const stats = item.statistics || {};
//       return {
//         ...item,
//         report_id: item.report_id || item._id?.toString() || 'BATCH-UNK',
//         cotton_yarn_count: item.cotton_yarn_count || item.count || 'N/A',
//         sub_type: item.sub_type || item.subtype || 'N/A',
//         bales: (item.bales || [{}]).map((b: any, idx: number) => ({
//           bale_id: b.bale_id || `${item.report_id}-B${idx + 1}`,
//           photos: resolvePhotos(b, item),
//           metrics: mapMetrics(b.metrics || b)
//         })),
//         statistics: {
//           n: stats.n || (item.bales?.length || 0),
//           average: mapMetrics(stats.average || item.averages),
//           stdDev: mapMetrics(stats.stdDev || item.std_dev),
//           cvPercent: mapMetrics(stats.cvPercent || item.cv_pct),
//           q99: mapMetrics(stats.q99 || {}),
//           min: mapMetrics(stats.min || {}),
//           max: mapMetrics(stats.max || {})
//         }
//       };
//     });

//     return { data: transformed, success: true };
//   } catch (error: any) {
//     clearTimeout(timeoutId);
//     console.warn('⚠️ [API Connection Failure]:', error.message);
//     return { 
//       data: [], 
//       success: false, 
//       error: error.name === 'AbortError' ? 'Connection Timeout' : error.message 
//     };
//   }
// };

// export const syncNewBatch = async (report: Partial<CottonReport>): Promise<boolean> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/reports`, {
//       method: 'POST',
//       body: JSON.stringify(report),
//       headers: { 'Content-Type': 'application/json' }
//     });
//     return response.ok;
//   } catch (error) {
//     return false;
//   }
// };
import { CottonReport, BaleData } from '../types';
const API_BASE_URL = "https://cotton-backend-byj5.onrender.com/api";
// const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';
const ASSET_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/assets` : 'http://localhost:5000/assets';

export interface FetchResponse {
  data: CottonReport[];
  success: boolean;
  error?: string;
}

/**
 * Transforms local Windows paths to Web-accessible URLs
 */
const formatImageUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  try {
    const datasetToken = 'dataset\\';
    const lowerPath = path.toLowerCase();
    const tokenIndex = lowerPath.indexOf(datasetToken);
    
    let relativePath = '';
    if (tokenIndex !== -1) {
      relativePath = path.substring(tokenIndex + datasetToken.length);
    } else {
      const parts = path.split('\\');
      relativePath = parts.slice(-4).join('/'); 
    }

    const webPath = relativePath.replace(/\\/g, '/');
    const encodedPath = webPath.split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');

    return `${ASSET_BASE_URL}/${encodedPath}`;
  } catch (err) {
    return path;
  }
};

const resolvePhotos = (item: any, parentItem?: any) => {
  const source = item.photos || item.images || item.gallery || item.attachments || {};
  let normal: string[] = [];
  let zoom: string[] = [];
  let stretch: string[] = [];

  const safeMap = (arr: any) => {
    if (!arr) return [];
    const list = Array.isArray(arr) ? arr : [arr];
    return list.filter(p => typeof p === 'string' && p.length > 0).map(formatImageUrl);
  };

  if (Array.isArray(source)) {
    normal = safeMap(source);
  } else if (typeof source === 'object' && source !== null) {
    normal = safeMap(source.normal || source.main);
    zoom = safeMap(source.ultra_zoom || source.zoom || source.hd);
    stretch = safeMap(source.stretch || source.wide || source.scale);
  }

  if (normal.length === 0) {
    const fallback = item.image_url || item.photo || item.url || parentItem?.image_url;
    if (fallback) normal = safeMap(fallback);
  }

  return {
    ultra_zoom: zoom.length > 0 ? zoom : normal,
    normal: normal,
    stretch: stretch.length > 0 ? stretch : normal
  };
};

const mapMetrics = (raw: any): any => {
  if (!raw) return {};
  return {
    sci: raw.sci ?? raw.SCI ?? 0,
    mic: raw.mic ?? raw.micronaire ?? raw.Mic ?? 0,
    str: raw.str ?? raw.strength ?? raw.Str ?? 0,
    sl2: raw.sl2 ?? raw.staple_length ?? raw.length ?? 0,
    ur: raw.ur ?? raw.uniformity ?? raw.UR ?? 0,
    sf: raw.sf ?? raw.short_fiber ?? raw.SF ?? 0,
    mst: raw.mst ?? raw.moisture ?? raw.moist ?? 0,
    mat: raw.mat ?? raw.maturity ?? raw.Mat ?? 0,
    elg: raw.elg ?? raw.elongation ?? raw.Elg ?? 0,
    rd: raw.rd ?? raw.reflectance ?? raw.Rd ?? 0,
    bPlus: raw.bPlus ?? raw.yellowness ?? raw.plus_b ?? 0,
    trAr: raw.trAr ?? raw.trash_area ?? raw.trash_pct ?? 0,
    trCnt: raw.trCnt ?? raw.trash_count ?? raw.trash_num ?? 0,
    amt: raw.amt ?? raw.amount ?? raw.weight ?? 0,
    cGrd: raw.cGrd ?? raw.color_grade ?? raw.grade ?? 'N/A',
    trGrd: raw.trGrd ?? raw.trash_grade ?? 'N/A',
  };
};

export const fetchReports = async (count?: string, subtype?: string): Promise<FetchResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

  try {
    const params = new URLSearchParams();
    if (count && count !== 'All') params.append('cotton_yarn_count', count);
    if (subtype && subtype !== 'All') params.append('sub_type', subtype);
    
    const response = await fetch(`${API_BASE_URL}/reports?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    
    const rawData = await response.json();

    const transformed = rawData.map((item: any) => {
      const stats = item.statistics || {};
      return {
        ...item,
        report_id: item.report_id || item._id?.toString() || 'BATCH-UNK',
        cotton_yarn_count: item.cotton_yarn_count || item.count || 'N/A',
        sub_type: item.sub_type || item.subtype || 'N/A',
        bales: (item.bales || [{}]).map((b: any, idx: number) => ({
          bale_id: b.bale_id || `${item.report_id}-B${idx + 1}`,
          photos: resolvePhotos(b, item),
          metrics: mapMetrics(b.metrics || b)
        })),
        statistics: {
          n: stats.n || (item.bales?.length || 0),
          average: mapMetrics(stats.average || item.averages),
          stdDev: mapMetrics(stats.stdDev || item.std_dev),
          cvPercent: mapMetrics(stats.cvPercent || item.cv_pct),
          q99: mapMetrics(stats.q99 || {}),
          min: mapMetrics(stats.min || {}),
          max: mapMetrics(stats.max || {})
        }
      };
    });

    return { data: transformed, success: true };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('⚠️ [API Connection Failure]:', error.message);
    return { 
      data: [], 
      success: false, 
      error: error.name === 'AbortError' ? 'Connection Timeout' : error.message 
    };
  }
};

export const syncNewBatch = async (report: Partial<CottonReport>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      body: JSON.stringify(report),
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};