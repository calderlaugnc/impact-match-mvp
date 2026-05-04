import { useEffect, useState } from 'react';
import { impactAPI } from '../services/api';

const categoryColors = {
  employee_benefit: 'bg-blue-500',
  procurement: 'bg-green-500',
  workshop: 'bg-purple-500',
  other: 'bg-gray-500'
};

const categoryLabels = {
  employee_benefit: '員工福利',
  procurement: '企業採購',
  workshop: '工作坊 / 活動',
  other: '其他'
};

export default function ImpactPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const [summary, adminSummary] = await Promise.allSettled([
          impactAPI.summary(),
          impactAPI.adminSummary().catch(() => null)
        ]);
        setData({
          overview: summary.status === 'fulfilled' ? summary.value : null,
          admin: adminSummary.status === 'fulfilled' ? adminSummary.value : null
        });
      } catch (err) {
        setError('無法載入影響力數據');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
  }

  if (error && !data?.overview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">
            重新嘗試
          </button>
        </div>
      </div>
    );
  }

  const overview = data?.overview || {};
  const admin = data?.admin;
  const maxCatCount = admin?.top_categories ? Math.max(...admin.top_categories.map(c => c.count), 1) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Impact Dashboard</h1>
          <p className="text-gray-600 mt-1">平台影響力數據總覽</p>
        </div>

        {/* Big Number Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl font-bold text-blue-600">
              {overview.social_enterprises || '-'}
            </div>
            <div className="text-sm text-gray-500 mt-1">社企夥伴</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl font-bold text-purple-600">
              {overview.products || '-'}
            </div>
            <div className="text-sm text-gray-500 mt-1">產品服務</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl font-bold text-green-600">
              {overview.total_beneficiaries?.toLocaleString() || '-'}
            </div>
            <div className="text-sm text-gray-500 mt-1">受惠人次</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl font-bold text-orange-600">
              ${overview.total_spending?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-500 mt-1">社會採購總額</div>
          </div>
        </div>

        {/* Category Distribution */}
        {admin?.top_categories && admin.top_categories.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">需求類別分佈</h2>
            <div className="space-y-3">
              {admin.top_categories.map((cat) => (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat.label}</span>
                    <span className="text-gray-500">{cat.count} 次</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${categoryColors[cat.category] || 'bg-gray-500'}`}
                      style={{ width: `${(cat.count / maxCatCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trend & Detail in a grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Match Trend */}
          {admin?.match_trend && admin.match_trend.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">30天配對趨勢</h2>
              <div className="space-y-1">
                {admin.match_trend.slice(-14).map((d) => (
                  <div key={d.date} className="flex items-center gap-2 text-sm">
                    <span className="w-20 text-gray-500">
                      {new Date(d.date).toLocaleDateString('zh-HK', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-400 h-4 rounded-full"
                        style={{ width: `${Math.min((d.count / Math.max(...admin.match_trend.map(t => t.count), 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-gray-600">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">平台統計</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">註冊企業用戶</span>
                <span className="font-bold">{overview.registered_companies || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">社企夥伴</span>
                <span className="font-bold">{overview.social_enterprises || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">產品服務數量</span>
                <span className="font-bold">{overview.products || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">完成報告</span>
                <span className="font-bold">{admin?.platform?.total_reports || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">配對總次數</span>
                <span className="font-bold">{admin?.platform?.total_matches || '-'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">平均每筆採購額</span>
                <span className="font-bold">
                  {overview.total_spending && admin?.platform?.total_reports
                    ? `HK$${Math.round(overview.total_spending / admin.platform.total_reports).toLocaleString()}`
                    : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
