import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { matchAPI, reportAPI, impactAPI } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ matches: 0, reports: 0 });
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [matches, reports] = await Promise.all([
          matchAPI.list(),
          reportAPI.list()
        ]);
        setStats({ matches: matches.length, reports: reports.length });
        setRecentMatches(matches.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">歡迎，{user?.company_name}</h1>
          <p className="text-gray-600 mt-1">這裡是您的影響力匹配儀表板</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">匹配次數</div>
            <div className="text-3xl font-bold text-blue-600">{stats.matches}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">報告數量</div>
            <div className="text-3xl font-bold text-green-600">{stats.reports}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">平台社企</div>
            <div className="text-3xl font-bold text-purple-600">5+</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">快速操作</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/match"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              開始新匹配
            </Link>
            <Link to="/reports"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              查看報告
            </Link>
            <Link to="/social-enterprises"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
              瀏覽社企
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin/social-enterprises"
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                管理後台
              </Link>
            )}
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">最近匹配</h2>
          {recentMatches.length === 0 ? (
            <p className="text-gray-500">尚無匹配記錄，開始您的第一次匹配吧！</p>
          ) : (
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <div key={match.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {match.request_data?.category === 'employee_benefit' ? '員工福利' :
                         match.request_data?.category === 'procurement' ? '企業採購' : '工作坊'}需求
                      </p>
                      <p className="text-sm text-gray-500">
                        預算: ${match.request_data?.budget_min?.toLocaleString()} - ${match.request_data?.budget_max?.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(match.created_at).toLocaleDateString('zh-HK')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
