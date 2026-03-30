
import { CottonReport } from '../types';

export const exportToCSV = (report: CottonReport) => {
  const headers = ["Bale ID", "SCI", "Mic", "Strength", "Length", "Uniformity", "Moisture", "Trash Area"];
  const rows = report.bales.map(b => [
    b.bale_id,
    b.metrics.sci,
    b.metrics.mic,
    b.metrics.str,
    b.metrics.sl2,
    b.metrics.ur,
    b.metrics.mst,
    b.metrics.trAr
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `CottonCore_Report_${report.report_id}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (report: CottonReport) => {
  const dataStr = JSON.stringify(report, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', `CottonCore_Report_${report.report_id}.json`);
  linkElement.click();
};
