import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportAPI } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await reportAPI.list();
        setReports(data || []);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const downloadPDF = async (reportId, title) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `impact-report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('PDF download failed:', err);
      alert('PDF 下載失敗');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">影響力報告</h1>
            <p className="text-gray-600 mt-1">查看和下載您的社會影響力報告</p>
          </div>
          <Link to="/reports/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            生成新報告
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">尚無報告</p>
            <Link to="/reports/new" className="text-blue-600 hover:underline">
              生成您的第一份影響力報告
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
                  
                  <div className="space-y-2 text-sm">
                    {report.period_start && (
                      <p className="text-gray-600">
                        期間: {new Date(report.period_start).toLocaleDateString('zh-HK')} -
                        {report.period_end && new Date(report.period_end).toLocaleDateString('zh-HK')}
                      </p>
                    )}
                    
                    <div className="flex gap-4 mt-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">
                          {report.total_beneficiaries?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-gray-500">受益人數</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          ${report.total_spending?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-gray-500">總支出</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Link
                      to={`/reports/${report.id}`}
                      className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      查看詳情
                    </Link>
                    <button
                      className="flex-1 text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      onClick={() => downloadPDF(report.id, report.title)}
                    >
                      下載 PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
